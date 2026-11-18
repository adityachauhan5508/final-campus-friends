import React, { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../services/supabaseClient';
import Avatar from '../../components/Avatar';

// ── Tab definitions ────────────────────────────────────────────────────────────
const TABS = [
  { id: 'personal',  label: 'Personal Information', icon: '👤' },
  { id: 'picture',   label: 'Profile Picture',       icon: '🖼️' },
  { id: 'security',  label: 'Security',              icon: '🔒' },
  { id: 'notifications', label: 'Notifications',     icon: '🔔' },
  { id: 'privacy',   label: 'Privacy',               icon: '🛡️' },
  { id: 'account',   label: 'Account Management',    icon: '⚙️' },
];

// ── Reusable section card wrapper ─────────────────────────────────────────────
function SectionCard({ title, description, children }) {
  return (
    <div className="bg-white rounded-xl border border-campus-border shadow-xs p-6 mb-4">
      <h3 className="text-base font-bold text-campus-navy mb-1">{title}</h3>
      {description && <p className="text-sm text-campus-muted mb-5">{description}</p>}
      {children}
    </div>
  );
}

function FieldRow({ label, children }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 items-start mb-4">
      <label className="text-sm font-medium text-slate-600 sm:pt-2.5">{label}</label>
      <div className="sm:col-span-2">{children}</div>
    </div>
  );
}

function TextInput({ value, onChange, placeholder, type = 'text', readOnly = false }) {
  return (
    <input
      type={type}
      value={value ?? ''}
      onChange={onChange}
      placeholder={placeholder}
      readOnly={readOnly}
      className={`w-full px-3.5 py-2 rounded-lg border text-sm text-campus-text bg-white focus:outline-none focus:ring-2 focus:ring-campus-blue/20 focus:border-campus-blue transition-all ${
        readOnly ? 'bg-slate-50 text-campus-muted cursor-not-allowed border-slate-200' : 'border-campus-border'
      }`}
    />
  );
}

function Toggle({ checked, onChange, label }) {
  return (
    <label className="flex items-center justify-between cursor-pointer select-none">
      <span className="text-sm text-campus-text">{label}</span>
      <div
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors ${checked ? 'bg-campus-blue' : 'bg-slate-300'}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`}
        />
      </div>
    </label>
  );
}

function SaveButton({ onClick, loading, label = 'Save Changes' }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="px-5 py-2 rounded-lg bg-campus-blue hover:bg-blue-700 disabled:opacity-60 text-white font-semibold text-sm transition-colors shadow-xs flex items-center gap-2"
    >
      {loading && (
        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
        </svg>
      )}
      {loading ? 'Saving…' : label}
    </button>
  );
}

function StatusMessage({ type, message }) {
  if (!message) return null;
  return (
    <div className={`mt-3 p-2.5 rounded-lg text-sm ${
      type === 'success'
        ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
        : 'bg-red-50 border border-red-200 text-red-700'
    }`}>
      {message}
    </div>
  );
}

// ── PERSONAL INFORMATION TAB ───────────────────────────────────────────────────
function PersonalTab() {
  const { profile, updateProfile, user } = useAuth();
  const [form, setForm] = useState({
    full_name:     profile?.full_name     || '',
    phone:         profile?.phone         || '',
    student_id:    profile?.student_id    || '',
    department:    profile?.department    || '',
    course:        profile?.course        || '',
    academic_year: profile?.academic_year || '',
    date_of_birth: profile?.date_of_birth || '',
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus]   = useState({ type: '', message: '' });

  const set = (key) => (e) => setForm(prev => ({ ...prev, [key]: e.target.value }));

  const handleSave = async () => {
    setLoading(true);
    setStatus({ type: '', message: '' });
    const { error } = await updateProfile(form);
    setLoading(false);
    if (error) {
      setStatus({ type: 'error', message: error.message || 'Save failed. Try again.' });
    } else {
      setStatus({ type: 'success', message: 'Profile updated successfully.' });
    }
  };

  return (
    <SectionCard title="Personal Information" description="Update your personal details. Email address cannot be changed here.">
      <FieldRow label="Full name">
        <TextInput value={form.full_name} onChange={set('full_name')} placeholder="Aarav Sharma" />
      </FieldRow>
      <FieldRow label="Email address">
        <TextInput value={user?.email || profile?.email} readOnly />
        <p className="text-xs text-campus-muted mt-1">Email changes require identity verification via Security settings.</p>
      </FieldRow>
      <FieldRow label="Phone number">
        <TextInput value={form.phone} onChange={set('phone')} placeholder="+91 98765 43210" type="tel" />
      </FieldRow>
      <FieldRow label="Student ID">
        <TextInput value={form.student_id} onChange={set('student_id')} placeholder="BCA2023001" />
      </FieldRow>
      <FieldRow label="Department">
        <select
          value={form.department}
          onChange={set('department')}
          className="w-full px-3.5 py-2 rounded-lg border border-campus-border text-sm text-campus-text bg-white focus:outline-none focus:ring-2 focus:ring-campus-blue/20 focus:border-campus-blue transition-all"
        >
          <option value="">Select department</option>
          <option>BCA</option>
          <option>BBA</option>
          <option>B.Com</option>
          <option>B.Sc</option>
          <option>MBA</option>
          <option>MCA</option>
          <option>M.Sc</option>
        </select>
      </FieldRow>
      <FieldRow label="Course">
        <TextInput value={form.course} onChange={set('course')} placeholder="Bachelor of Computer Applications" />
      </FieldRow>
      <FieldRow label="Academic year">
        <select
          value={form.academic_year}
          onChange={set('academic_year')}
          className="w-full px-3.5 py-2 rounded-lg border border-campus-border text-sm text-campus-text bg-white focus:outline-none focus:ring-2 focus:ring-campus-blue/20 focus:border-campus-blue transition-all"
        >
          <option value="">Select year</option>
          <option>First Year</option>
          <option>Second Year</option>
          <option>Third Year</option>
          <option>Fourth Year</option>
          <option>Fifth Year</option>
        </select>
      </FieldRow>
      <FieldRow label="Date of birth">
        <TextInput value={form.date_of_birth} onChange={set('date_of_birth')} type="date" />
      </FieldRow>
      <div className="mt-2">
        <SaveButton onClick={handleSave} loading={loading} />
        <StatusMessage {...status} />
      </div>
    </SectionCard>
  );
}

// ── PROFILE PICTURE TAB ────────────────────────────────────────────────────────
function PictureTab() {
  const { profile, uploadProfilePicture, removeProfilePicture } = useAuth();
  const fileRef    = useRef(null);
  const [preview, setPreview] = useState(null);
  const [file, setFile]       = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus]   = useState({ type: '', message: '' });

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;

    // Client-side validation
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(f.type)) {
      setStatus({ type: 'error', message: 'Only JPEG, PNG, and WebP images are allowed.' });
      return;
    }
    if (f.size > 2 * 1024 * 1024) {
      setStatus({ type: 'error', message: 'Image must be under 2 MB.' });
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setStatus({ type: '', message: '' });
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setStatus({ type: '', message: '' });
    const { error } = await uploadProfilePicture(file);
    setLoading(false);
    if (error) {
      setStatus({ type: 'error', message: error.message || 'Upload failed.' });
    } else {
      setStatus({ type: 'success', message: 'Profile picture updated successfully.' });
      setPreview(null);
      setFile(null);
    }
  };

  const handleRemove = async () => {
    if (!window.confirm('Remove your profile picture? Your initials will be shown instead.')) return;
    setLoading(true);
    const { error } = await removeProfilePicture();
    setLoading(false);
    if (error) {
      setStatus({ type: 'error', message: error.message || 'Remove failed.' });
    } else {
      setStatus({ type: 'success', message: 'Profile picture removed.' });
    }
  };

  return (
    <SectionCard title="Profile Picture" description="Upload or change your profile picture. Supported: JPEG, PNG, WebP. Max size: 2 MB.">
      <div className="flex flex-col sm:flex-row items-start gap-6">
        {/* Current or preview avatar */}
        <div className="flex-shrink-0">
          {preview ? (
            <img src={preview} alt="Preview" className="w-24 h-24 rounded-full object-cover ring-4 ring-campus-blue-light shadow" />
          ) : (
            <Avatar profile={profile} size="xl" />
          )}
        </div>

        <div className="flex-1">
          {preview && (
            <p className="text-xs text-slate-500 mb-3">Preview — click <strong>Save Picture</strong> to apply.</p>
          )}

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => fileRef.current?.click()}
              className="px-4 py-2 rounded-lg border border-campus-border text-sm font-semibold text-campus-navy hover:bg-slate-50 transition-colors"
            >
              {profile?.profile_picture_url ? 'Change Picture' : 'Upload Picture'}
            </button>

            {preview && (
              <SaveButton onClick={handleUpload} loading={loading} label="Save Picture" />
            )}

            {profile?.profile_picture_url && !preview && (
              <button
                onClick={handleRemove}
                disabled={loading}
                className="px-4 py-2 rounded-lg border border-red-200 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors disabled:opacity-60"
              >
                Remove
              </button>
            )}
          </div>

          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="mt-3 text-xs text-campus-muted space-y-1">
            <p>• Allowed types: JPEG, PNG, WebP</p>
            <p>• Maximum file size: 2 MB</p>
            <p>• Stored securely in Supabase Storage under your user ID</p>
            <p>• You can only modify your own profile picture</p>
          </div>

          <StatusMessage {...status} />
        </div>
      </div>
    </SectionCard>
  );
}

// ── SECURITY TAB ──────────────────────────────────────────────────────────────
function SecurityTab() {
  const { user, profile } = useAuth();
  const [oldPw, setOldPw]     = useState('');
  const [newPw, setNewPw]     = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus]   = useState({ type: '', message: '' });

  const handleChangePassword = async () => {
    if (!newPw || newPw.length < 8) {
      setStatus({ type: 'error', message: 'New password must be at least 8 characters.' });
      return;
    }
    if (newPw !== confirmPw) {
      setStatus({ type: 'error', message: 'New passwords do not match.' });
      return;
    }
    setLoading(true);
    const { error } = supabase
      ? await supabase.auth.updateUser({ password: newPw })
      : { error: { message: 'Database connection not available.' } };
    setLoading(false);
    if (error) {
      setStatus({ type: 'error', message: error.message });
    } else {
      setStatus({ type: 'success', message: 'Password changed successfully.' });
      setOldPw(''); setNewPw(''); setConfirmPw('');
    }
  };

  return (
    <>
      <SectionCard title="Change Password" description="Use a strong, unique password for your Smart Campus account.">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Current password</label>
            <input type="password" value={oldPw} onChange={e => setOldPw(e.target.value)} placeholder="Enter current password"
              className="w-full px-3.5 py-2 rounded-lg border border-campus-border text-sm focus:outline-none focus:ring-2 focus:ring-campus-blue/20 focus:border-campus-blue transition-all" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">New password</label>
            <input type="password" value={newPw} onChange={e => setNewPw(e.target.value)} placeholder="Minimum 8 characters"
              className="w-full px-3.5 py-2 rounded-lg border border-campus-border text-sm focus:outline-none focus:ring-2 focus:ring-campus-blue/20 focus:border-campus-blue transition-all" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Confirm new password</label>
            <input type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} placeholder="Re-enter new password"
              className="w-full px-3.5 py-2 rounded-lg border border-campus-border text-sm focus:outline-none focus:ring-2 focus:ring-campus-blue/20 focus:border-campus-blue transition-all" />
          </div>
          <SaveButton onClick={handleChangePassword} loading={loading} label="Update Password" />
          <StatusMessage {...status} />
        </div>
      </SectionCard>

      <SectionCard title="Account Status">
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2.5 border-b border-campus-border">
            <div>
              <p className="text-sm font-medium text-campus-text">Email verification</p>
              <p className="text-xs text-campus-muted">{user?.email}</p>
            </div>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${user?.email_confirmed_at ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
              {user?.email_confirmed_at ? '✓ Verified' : 'Pending Verification'}
            </span>
          </div>
          <div className="flex items-center justify-between py-2.5 border-b border-campus-border">
            <div>
              <p className="text-sm font-medium text-campus-text">Account role</p>
              <p className="text-xs text-campus-muted">Roles are assigned by administrators only</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-campus-blue-light text-campus-blue capitalize">
              {profile?.role || 'student'}
            </span>
          </div>
          <div className="flex items-center justify-between py-2.5">
            <div>
              <p className="text-sm font-medium text-campus-text">Last login</p>
              <p className="text-xs text-campus-muted">Most recent sign-in session</p>
            </div>
            <span className="text-xs text-campus-muted">
              {profile?.last_login
                ? new Date(profile.last_login).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                : 'Now'}
            </span>
          </div>
        </div>
      </SectionCard>
    </>
  );
}

// ── NOTIFICATIONS TAB ─────────────────────────────────────────────────────────
function NotificationsTab() {
  const { profile, updateProfile } = useAuth();
  const prefs = profile?.notification_preferences || {
    email_notifications:   true,
    in_app_notifications:  true,
    campus_announcements:  true,
  };
  const [local, setLocal]     = useState(prefs);
  const [loading, setLoading] = useState(false);
  const [status, setStatus]   = useState({ type: '', message: '' });

  const toggle = (key) => (val) => setLocal(prev => ({ ...prev, [key]: val }));

  const handleSave = async () => {
    setLoading(true);
    const { error } = await updateProfile({ notification_preferences: local });
    setLoading(false);
    setStatus(error
      ? { type: 'error', message: error.message || 'Save failed.' }
      : { type: 'success', message: 'Notification preferences saved.' }
    );
  };

  return (
    <SectionCard title="Notification Preferences" description="Choose how Smart Campus communicates with you.">
      <div className="space-y-4">
        <Toggle
          label="Email notifications (answers, escalation updates)"
          checked={local.email_notifications}
          onChange={toggle('email_notifications')}
        />
        <Toggle
          label="In-app notifications"
          checked={local.in_app_notifications}
          onChange={toggle('in_app_notifications')}
        />
        <Toggle
          label="Campus announcements and circulars"
          checked={local.campus_announcements}
          onChange={toggle('campus_announcements')}
        />
      </div>
      <div className="mt-5">
        <SaveButton onClick={handleSave} loading={loading} />
        <StatusMessage {...status} />
      </div>
    </SectionCard>
  );
}

// ── PRIVACY TAB ───────────────────────────────────────────────────────────────
function PrivacyTab() {
  const { profile, updateProfile } = useAuth();
  const privacy = profile?.privacy_settings || { profile_visibility: 'private' };
  const [local, setLocal]     = useState(privacy);
  const [loading, setLoading] = useState(false);
  const [status, setStatus]   = useState({ type: '', message: '' });

  const handleSave = async () => {
    setLoading(true);
    const { error } = await updateProfile({ privacy_settings: local });
    setLoading(false);
    setStatus(error
      ? { type: 'error', message: error.message || 'Save failed.' }
      : { type: 'success', message: 'Privacy settings saved.' }
    );
  };

  const handleDownloadData = () => {
    const data = {
      profile,
      exported_at: new Date().toISOString(),
      note: 'Your Smart Campus Assistant personal data export',
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = 'my-campus-data.json'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <SectionCard title="Profile Visibility" description="Control who can see your profile information.">
        <div className="space-y-3 mb-5">
          {['private', 'staff_only', 'public'].map(opt => (
            <label key={opt} className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="visibility"
                value={opt}
                checked={local.profile_visibility === opt}
                onChange={() => setLocal(prev => ({ ...prev, profile_visibility: opt }))}
                className="w-4 h-4 text-campus-blue"
              />
              <div>
                <p className="text-sm font-medium text-campus-text capitalize">{opt.replace('_', ' ')}</p>
                <p className="text-xs text-campus-muted">
                  {opt === 'private' && 'Only you can see your profile details.'}
                  {opt === 'staff_only' && 'Staff members can see your profile when reviewing your questions.'}
                  {opt === 'public' && 'Other students can see your name and department.'}
                </p>
              </div>
            </label>
          ))}
        </div>
        <SaveButton onClick={handleSave} loading={loading} />
        <StatusMessage {...status} />
      </SectionCard>

      <SectionCard title="Your Data" description="Download or manage your personal data.">
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-campus-border">
            <div>
              <p className="text-sm font-medium text-campus-text">Download personal data</p>
              <p className="text-xs text-campus-muted">Export your profile and question history as JSON</p>
            </div>
            <button
              onClick={handleDownloadData}
              className="px-4 py-1.5 rounded-lg border border-campus-border text-sm font-semibold text-campus-navy hover:bg-white transition-colors"
            >
              Download
            </button>
          </div>
        </div>
      </SectionCard>
    </>
  );
}

// ── ACCOUNT MANAGEMENT TAB ────────────────────────────────────────────────────
function AccountTab({ onNavigate }) {
  const { signOut, user } = useAuth();
  const [deleteInput, setDeleteInput]   = useState('');
  const [showDelete, setShowDelete]     = useState(false);
  const [loading, setLoading]           = useState(false);
  const [status, setStatus]             = useState({ type: '', message: '' });

  const handleLogout = async () => {
    setLoading(true);
    await signOut();
    setLoading(false);
    onNavigate('home');
  };

  const handleDeleteRequest = async () => {
    if (deleteInput !== 'DELETE') {
      setStatus({ type: 'error', message: 'Type DELETE exactly to confirm.' });
      return;
    }
    setLoading(true);
    // In production this calls backend /api/auth/delete-account
    // For demo, just sign out
    await signOut();
    setLoading(false);
    setShowDelete(false);
    onNavigate('home');
  };

  return (
    <>
      <SectionCard title="Session">
        <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-campus-border">
          <div>
            <p className="text-sm font-medium text-campus-text">Current session</p>
            <p className="text-xs text-campus-muted">Signed in as {user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            disabled={loading}
            className="px-4 py-1.5 rounded-lg border border-campus-border text-sm font-semibold text-campus-navy hover:bg-white transition-colors"
          >
            Sign Out
          </button>
        </div>
      </SectionCard>

      <SectionCard title="Danger Zone">
        <div className="border border-red-200 rounded-xl p-4 bg-red-50/40">
          <h4 className="text-sm font-bold text-red-700 mb-1">Delete Account</h4>
          <p className="text-xs text-red-600 mb-3">
            Permanently delete your account and all associated data. This action cannot be undone.
            Your questions and escalation history will be anonymised.
          </p>
          {!showDelete ? (
            <button
              onClick={() => setShowDelete(true)}
              className="px-4 py-2 rounded-lg border border-red-300 text-sm font-semibold text-red-600 hover:bg-red-100 transition-colors"
            >
              Request Account Deletion
            </button>
          ) : (
            <div className="space-y-3">
              <p className="text-sm font-medium text-red-700">
                Type <strong>DELETE</strong> in the box below to confirm:
              </p>
              <input
                type="text"
                value={deleteInput}
                onChange={e => setDeleteInput(e.target.value)}
                placeholder="Type DELETE here"
                className="w-full px-3.5 py-2 rounded-lg border border-red-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-200"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleDeleteRequest}
                  disabled={loading || deleteInput !== 'DELETE'}
                  className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-sm font-semibold transition-colors"
                >
                  Confirm Delete
                </button>
                <button
                  onClick={() => { setShowDelete(false); setDeleteInput(''); setStatus({ type: '', message: '' }); }}
                  className="px-4 py-2 rounded-lg border border-campus-border text-sm font-semibold text-campus-muted hover:bg-white transition-colors"
                >
                  Cancel
                </button>
              </div>
              <StatusMessage {...status} />
            </div>
          )}
        </div>
      </SectionCard>
    </>
  );
}

// ── MAIN PAGE COMPONENT ───────────────────────────────────────────────────────
export default function AccountSettingsPage({ onNavigate }) {
  const { profile, isAuthenticated, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('personal');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-campus-bg">
        <div className="text-center">
          <svg className="w-10 h-10 animate-spin text-campus-blue mx-auto mb-3" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
          </svg>
          <p className="text-campus-muted text-sm">Loading account…</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-campus-bg">
        <div className="text-center p-8">
          <p className="text-campus-muted mb-4">You must be signed in to view account settings.</p>
          <button onClick={() => onNavigate('login')} className="px-5 py-2 rounded-lg bg-campus-blue text-white font-semibold text-sm">
            Sign In
          </button>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'personal':      return <PersonalTab />;
      case 'picture':       return <PictureTab />;
      case 'security':      return <SecurityTab />;
      case 'notifications': return <NotificationsTab />;
      case 'privacy':       return <PrivacyTab />;
      case 'account':       return <AccountTab onNavigate={onNavigate} />;
      default:              return <PersonalTab />;
    }
  };

  return (
    <div className="min-h-screen bg-campus-bg py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Page Header */}
        <div className="mb-6">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-1.5 text-sm text-campus-muted hover:text-campus-navy mb-4 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </button>
          <div className="flex items-center gap-4">
            <Avatar profile={profile} size="lg" />
            <div>
              <h1 className="text-2xl font-bold text-campus-navy">Account Settings</h1>
              <p className="text-campus-muted text-sm">{profile?.full_name} · {profile?.department || 'Smart Campus'}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Tabs */}
          <aside className="lg:w-56 flex-shrink-0">
            <nav className="bg-white rounded-xl border border-campus-border shadow-xs overflow-hidden">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-2.5 px-4 py-3 text-sm font-medium text-left transition-colors border-b border-campus-border last:border-b-0 ${
                    activeTab === tab.id
                      ? 'bg-campus-blue-light text-campus-blue font-semibold'
                      : 'text-campus-text hover:bg-slate-50'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <main className="flex-1 min-w-0">
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  );
}
