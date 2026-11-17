-- ====================================================================
-- SMART CAMPUS ASSISTANT - SUPABASE POSTGRESQL SCHEMA (Aarambhathon 2.0)
-- Production Database Schema, Relationships, Indexes, and RLS Policies
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. CUSTOM TYPES
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('student', 'staff', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE query_status AS ENUM ('ANSWERED', 'ESCALATED', 'RESOLVED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE action_type AS ENUM ('FORM', 'PORTAL', 'OFFICE', 'MAP');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ====================================================================
-- 3. PROFILES TABLE (Linked with Supabase Auth users)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT,
    role user_role NOT NULL DEFAULT 'student',
    student_id TEXT,
    department TEXT,
    semester TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for role-based lookups
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- ====================================================================
-- 4. CAMPUS BUILDINGS TABLE (6 Mapped Offline Buildings - PPT Slide 14)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.campus_buildings (
    id TEXT PRIMARY KEY,
    number INT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL,
    short_description TEXT NOT NULL,
    full_description TEXT NOT NULL,
    venues JSONB NOT NULL DEFAULT '[]'::jsonb,
    offices JSONB NOT NULL DEFAULT '[]'::jsonb,
    timings TEXT NOT NULL,
    svg_layout JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ====================================================================
-- 5. CAMPUS DOCUMENTS TABLE (33 Official Campus Records - PPT Slide 6 & 9)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.campus_documents (
    id TEXT PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    category TEXT NOT NULL, -- 'Examinations', 'Fees', 'Hostel', 'Academics', 'Directory'
    source_type TEXT NOT NULL, -- 'Official Ordinance', 'Circular', 'Hostel Bylaws', etc.
    upload_date DATE NOT NULL DEFAULT CURRENT_DATE,
    clause TEXT NOT NULL,
    page_number TEXT,
    building_id TEXT REFERENCES public.campus_buildings(id) ON DELETE SET NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    summary TEXT NOT NULL,
    content TEXT NOT NULL,
    keywords TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_documents_category ON public.campus_documents(category);
CREATE INDEX IF NOT EXISTS idx_documents_active ON public.campus_documents(is_active);

-- Full-text search index on documents
CREATE INDEX IF NOT EXISTS idx_documents_fts ON public.campus_documents 
USING gin(to_tsvector('english', title || ' ' || summary || ' ' || content));

-- ====================================================================
-- 6. DOCUMENT CHUNKS TABLE (For Semantic & Keyword Ingestion)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.document_chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id TEXT NOT NULL REFERENCES public.campus_documents(id) ON DELETE CASCADE,
    chunk_index INT NOT NULL,
    chunk_text TEXT NOT NULL,
    clause_reference TEXT,
    token_count INT DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_chunks_doc_id ON public.document_chunks(document_id);

-- ====================================================================
-- 7. ACTION REGISTRY TABLE (The 4 Action Types - PPT Slide 8)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.action_registry (
    id TEXT PRIMARY KEY,
    action_type action_type NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    action_text TEXT NOT NULL,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ====================================================================
-- 8. QUESTIONS TABLE (Student Inquiries)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.questions (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    student_name TEXT,
    query_text TEXT NOT NULL,
    category TEXT,
    status query_status NOT NULL DEFAULT 'ANSWERED',
    confidence_score INT NOT NULL,
    matched_doc_id TEXT REFERENCES public.campus_documents(id) ON DELETE SET NULL,
    is_above_floor BOOLEAN NOT NULL DEFAULT true,
    escalation_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_questions_user_id ON public.questions(user_id);
CREATE INDEX IF NOT EXISTS idx_questions_status ON public.questions(status);
CREATE INDEX IF NOT EXISTS idx_questions_created ON public.questions(created_at DESC);

-- ====================================================================
-- 9. ANSWERS TABLE (Verified Citations and Actions)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id TEXT NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
    answer_text TEXT NOT NULL,
    confidence_score INT NOT NULL,
    doc_code TEXT,
    doc_title TEXT,
    clause TEXT,
    page_number TEXT,
    excerpt TEXT,
    action_id TEXT REFERENCES public.action_registry(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_answers_question ON public.answers(question_id);

-- ====================================================================
-- 10. ESCALATIONS TABLE (Staff Inbox & Answer-Once Pipeline - PPT Slide 12-13)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.escalations (
    id TEXT PRIMARY KEY,
    question_id TEXT REFERENCES public.questions(id) ON DELETE SET NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    student_name TEXT,
    query_text TEXT NOT NULL,
    category TEXT,
    confidence_score INT NOT NULL,
    retrieved_weak_matches JSONB DEFAULT '[]'::jsonb,
    escalation_reason TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'RESOLVED')),
    official_response TEXT,
    resolved_by TEXT,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_escalations_status ON public.escalations(status);
CREATE INDEX IF NOT EXISTS idx_escalations_created ON public.escalations(created_at DESC);

-- ====================================================================
-- 11. ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campus_buildings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campus_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.action_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.escalations ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is staff/admin
CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role IN ('staff', 'admin')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 11.1 PROFILES POLICIES
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id OR public.is_staff());

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

-- 11.2 CAMPUS BUILDINGS POLICIES (Publicly readable)
CREATE POLICY "Campus buildings are viewable by everyone" 
ON public.campus_buildings FOR SELECT 
TO authenticated, anon 
USING (true);

CREATE POLICY "Only staff can modify campus buildings" 
ON public.campus_buildings FOR ALL 
USING (public.is_staff());

-- 11.3 CAMPUS DOCUMENTS POLICIES (Active docs viewable, staff can manage)
CREATE POLICY "Active campus documents are viewable by everyone" 
ON public.campus_documents FOR SELECT 
TO authenticated, anon 
USING (is_active = true OR public.is_staff());

CREATE POLICY "Only staff can insert or modify campus documents" 
ON public.campus_documents FOR ALL 
USING (public.is_staff());

-- 11.4 DOCUMENT CHUNKS POLICIES
CREATE POLICY "Chunks are viewable by authenticated users and anon" 
ON public.document_chunks FOR SELECT 
TO authenticated, anon 
USING (true);

-- 11.5 ACTION REGISTRY POLICIES (Publicly readable)
CREATE POLICY "Actions are viewable by everyone" 
ON public.action_registry FOR SELECT 
TO authenticated, anon 
USING (true);

-- 11.6 QUESTIONS POLICIES (Strict student privacy - prompt requirement)
CREATE POLICY "Students can view only their own questions" 
ON public.questions FOR SELECT 
USING (auth.uid() = user_id OR user_id IS NULL OR public.is_staff());

CREATE POLICY "Students can insert questions" 
ON public.questions FOR INSERT 
WITH CHECK (auth.uid() = user_id OR user_id IS NULL OR public.is_staff());

-- 11.7 ANSWERS POLICIES
CREATE POLICY "Answers viewable by question owner or staff" 
ON public.answers FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.questions 
        WHERE questions.id = answers.question_id 
        AND (questions.user_id = auth.uid() OR questions.user_id IS NULL OR public.is_staff())
    )
);

-- 11.8 ESCALATIONS POLICIES (Protected Staff Inbox - prompt requirement)
CREATE POLICY "Only staff can view escalations" 
ON public.escalations FOR SELECT 
USING (public.is_staff());

CREATE POLICY "System and staff can insert escalations" 
ON public.escalations FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Only staff can update and resolve escalations" 
ON public.escalations FOR UPDATE 
USING (public.is_staff());

-- ====================================================================
-- 12. AUTOMATIC PROFILE CREATION TRIGGER ON AUTH SIGNUP
-- ====================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (
        new.id,
        new.email,
        COALESCE(new.raw_user_meta_data->>'full_name', 'Student User'),
        COALESCE((new.raw_user_meta_data->>'role')::user_role, 'student')
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
