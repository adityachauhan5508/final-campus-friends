import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';

// ─── Auth Context ─────────────────────────────────────────────────────────────
const AuthContext = createContext(null);

// Demo user used when Supabase is not configured (hackathon offline mode)
const DEMO_USER = {
  id: 'demo-user-001',
  email: 'aarav.sharma@student.campus.edu',
  user_metadata: { full_name: 'Aarav Sharma' },
};

const DEMO_PROFILE = {
  id: 'demo-user-001',
  full_name: 'Aarav Sharma',
  email: 'aarav.sharma@student.campus.edu',
  phone: '+91 98765 43210',
  student_id: 'BCA2023001',
  department: 'BCA',
  course: 'Bachelor of Computer Applications',
  academic_year: 'Second Year',
  date_of_birth: '2003-08-15',
  profile_picture_url: null,
  profile_picture_path: null,
  role: 'student',
  notification_preferences: {
    email_notifications: true,
    in_app_notifications: true,
    campus_announcements: true,
  },
  privacy_settings: {
    profile_visibility: 'private',
  },
  created_at: '2023-07-01T00:00:00Z',
  last_login: new Date().toISOString(),
};

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // ── Demo mode (no Supabase) ───────────────────────────────────────────────
  const isDemoMode = !isSupabaseConfigured();

  // ── Derived flags ─────────────────────────────────────────────────────────
  const isAuthenticated = Boolean(user);
  const isStaff  = profile?.role === 'staff'  || profile?.role === 'admin';
  const isAdmin  = profile?.role === 'admin';

  // ── Fetch profile from Supabase ───────────────────────────────────────────
  const fetchProfile = useCallback(async (userId) => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.warn('Profile fetch error:', error.message);
        return;
      }
      setProfile(data);
    } catch (err) {
      console.error('fetchProfile error:', err);
    }
  }, []);

  // ── Bootstrap auth session on mount ──────────────────────────────────────
  useEffect(() => {
    if (isDemoMode) {
      // Check if user previously "logged in" in demo mode
      const demoLoggedIn = sessionStorage.getItem('sca_demo_auth') === 'true';
      if (demoLoggedIn) {
        setUser(DEMO_USER);
        setProfile(DEMO_PROFILE);
      }
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        fetchProfile(session.user.id);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          setUser(session.user);
          await fetchProfile(session.user.id);
        } else {
          setUser(null);
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [isDemoMode, fetchProfile]);

  // ── Sign In ───────────────────────────────────────────────────────────────
  const signIn = async ({ email, password }) => {
    setAuthError(null);
    if (isDemoMode) {
      // Demo login — accept any credentials
      setUser(DEMO_USER);
      setProfile({ ...DEMO_PROFILE, email, full_name: email.split('@')[0] });
      sessionStorage.setItem('sca_demo_auth', 'true');
      return { error: null };
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setAuthError(error.message); return { error }; }
    return { data, error: null };
  };

  // ── Sign Up ───────────────────────────────────────────────────────────────
  const signUp = async ({ email, password, fullName }) => {
    setAuthError(null);
    if (isDemoMode) {
      return { error: { message: 'Demo mode: sign up unavailable. Use the demo login.' } };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    if (error) { setAuthError(error.message); return { error }; }
    return { data, error: null };
  };

  // ── Google OAuth ──────────────────────────────────────────────────────────
  const signInWithGoogle = async () => {
    setAuthError(null);
    if (isDemoMode) {
      return { error: { message: 'Demo mode: Google sign-in unavailable.' } };
    }
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    });
    if (error) { setAuthError(error.message); return { error }; }
    return { error: null };
  };

  // ── Sign Out ──────────────────────────────────────────────────────────────
  const signOut = async () => {
    if (isDemoMode) {
      sessionStorage.removeItem('sca_demo_auth');
      setUser(null);
      setProfile(null);
      return;
    }
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  // ── Password Reset ────────────────────────────────────────────────────────
  const resetPassword = async (email) => {
    if (isDemoMode) return { error: { message: 'Demo mode: not supported.' } };
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}?page=reset-password`,
    });
    return { error };
  };

  // ── Update Profile Fields ─────────────────────────────────────────────────
  const updateProfile = async (fields) => {
    if (isDemoMode) {
      setProfile(prev => ({ ...prev, ...fields }));
      return { error: null };
    }
    if (!supabase || !user) return { error: { message: 'Not authenticated' } };

    const { data, error } = await supabase
      .from('profiles')
      .update({ ...fields, updated_at: new Date().toISOString() })
      .eq('id', user.id)
      .select()
      .single();

    if (!error && data) setProfile(data);
    return { error };
  };

  // ── Upload Profile Picture ────────────────────────────────────────────────
  const uploadProfilePicture = async (file) => {
    if (!user) return { error: { message: 'Not authenticated' } };

    // Client-side validation
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return { error: { message: 'Only JPEG, PNG, and WebP images are allowed.' } };
    }
    if (file.size > 2 * 1024 * 1024) {
      return { error: { message: 'Image must be under 2 MB.' } };
    }

    if (isDemoMode) {
      // Create a local object URL for demo preview
      const url = URL.createObjectURL(file);
      setProfile(prev => ({ ...prev, profile_picture_url: url, profile_picture_path: 'demo/avatar.jpg' }));
      return { url, error: null };
    }

    const ext = file.name.split('.').pop();
    const filePath = `avatars/${user.id}/avatar.${ext}`;

    // Remove old file first (ignore errors — it may not exist)
    await supabase.storage.from('avatars').remove([`avatars/${user.id}/avatar.jpg`, `avatars/${user.id}/avatar.png`, `avatars/${user.id}/avatar.webp`]);

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true, contentType: file.type });

    if (uploadError) return { error: uploadError };

    const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
    const publicUrl = urlData?.publicUrl;

    // Persist URL to profile
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ profile_picture_url: publicUrl, profile_picture_path: filePath, updated_at: new Date().toISOString() })
      .eq('id', user.id);

    if (!profileError) {
      setProfile(prev => ({ ...prev, profile_picture_url: publicUrl, profile_picture_path: filePath }));
    }

    return { url: publicUrl, error: profileError };
  };

  // ── Remove Profile Picture ────────────────────────────────────────────────
  const removeProfilePicture = async () => {
    if (!user) return { error: { message: 'Not authenticated' } };

    if (isDemoMode) {
      setProfile(prev => ({ ...prev, profile_picture_url: null, profile_picture_path: null }));
      return { error: null };
    }

    if (profile?.profile_picture_path) {
      await supabase.storage.from('avatars').remove([profile.profile_picture_path]);
    }

    const { error } = await supabase
      .from('profiles')
      .update({ profile_picture_url: null, profile_picture_path: null, updated_at: new Date().toISOString() })
      .eq('id', user.id);

    if (!error) {
      setProfile(prev => ({ ...prev, profile_picture_url: null, profile_picture_path: null }));
    }

    return { error };
  };

  const value = {
    user,
    profile,
    loading,
    authError,
    isAuthenticated,
    isStaff,
    isAdmin,
    isDemoMode,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    resetPassword,
    updateProfile,
    uploadProfilePicture,
    removeProfilePicture,
    refreshProfile: () => user && fetchProfile(user.id),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ── Hook ───────────────────────────────────────────────────────────────────────
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}

export default AuthContext;
