import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

// ─── Shared University Auth Layout Wrapper ────────────────────────────────────
function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-campus-navy via-[#1a3560] to-[#0f2240] flex items-center justify-center p-4">
      {/* Decorative gradient glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-campus-blue/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-blue-400/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-campus-blue shadow-lg mb-4">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L1 7l11 5 9-4.09V17h2V7L12 2zm0 13.5l-7-3.18V17l7 3.5 7-3.5v-4.68l-7 3.18z"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Smart Campus</h1>
          <p className="text-blue-300 text-sm mt-1">Aarambhathon 2.0 Official Query Assistant</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-xl font-bold text-campus-navy mb-1">{title}</h2>
          {subtitle && <p className="text-campus-muted text-sm mb-6">{subtitle}</p>}
          {children}
        </div>

        <p className="text-center text-blue-400/60 text-xs mt-6">
          Smart Campus Assistant · Aarambhathon 2.0
        </p>
      </div>
    </div>
  );
}

// ─── Form Helpers ─────────────────────────────────────────────────────────────
function InputField({ label, type = 'text', value, onChange, placeholder, error, autoComplete, required }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600 mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-campus-text bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
          error ? 'border-red-400 focus:ring-red-200' : 'border-campus-border focus:ring-campus-blue/20 focus:border-campus-blue'
        }`}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

function SubmitButton({ loading, label, loadingLabel = 'Please wait…' }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full py-2.5 px-4 rounded-lg bg-campus-blue hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-sm transition-colors shadow-sm flex items-center justify-center gap-2"
    >
      {loading && (
        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
        </svg>
      )}
      {loading ? loadingLabel : label}
    </button>
  );
}

function GoogleButton({ onClick, loading, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="w-full py-2.5 px-4 rounded-lg border border-campus-border hover:bg-slate-50 disabled:opacity-60 text-campus-text font-semibold text-sm transition-colors flex items-center justify-center gap-2.5"
    >
      <svg className="w-4 h-4" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
      {label}
    </button>
  );
}

// ─── LOGIN PAGE ───────────────────────────────────────────────────────────────
export function LoginPage({ onNavigate }) {
  const { signIn, signInWithGoogle } = useAuth();
  const [email, setEmail]             = useState('');
  const [password, setPassword]       = useState('');
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!email) errs.email = 'Email address is required.';
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Please enter a valid email address.';
    if (!password) errs.password = 'Password is required.';
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validate()) return;
    setLoading(true);
    const { error: authError } = await signIn({ email, password });
    setLoading(false);
    if (authError) {
      setError(authError.message || 'Invalid email or password. Please check your credentials.');
    } else {
      onNavigate('home');
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    const { error: authError } = await signInWithGoogle();
    setLoading(false);
    if (authError) setError(authError.message);
  };

  return (
    <AuthLayout title="Student Sign In" subtitle="Sign in to access the Smart Campus Assistant">
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <InputField
          label="College / Registered Email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="your.email@campus.edu"
          error={fieldErrors.email}
          autoComplete="email"
          required
        />
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-600">Password</label>
            <button
              type="button"
              onClick={() => onNavigate('forgot-password')}
              className="text-xs text-campus-blue hover:underline"
            >
              Forgot password?
            </button>
          </div>
          <InputField
            label=""
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Enter your password"
            error={fieldErrors.password}
            autoComplete="current-password"
            required
          />
        </div>

        <SubmitButton loading={loading} label="Sign In" loadingLabel="Signing in…" />
      </form>

      <div className="relative my-5">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-campus-border" />
        </div>
        <div className="relative flex justify-center">
          <span className="px-2 bg-white text-xs text-campus-muted">or continue with</span>
        </div>
      </div>

      <GoogleButton onClick={handleGoogle} loading={loading} label="Continue with Google" />

      <p className="text-center text-sm text-campus-muted mt-6">
        Don't have an account yet?{' '}
        <button onClick={() => onNavigate('signup')} className="text-campus-blue font-semibold hover:underline">
          Create Account
        </button>
      </p>
    </AuthLayout>
  );
}

// ─── SIGNUP (CREATE ACCOUNT) PAGE ─────────────────────────────────────────────
export function SignupPage({ onNavigate }) {
  const { signUp, signInWithGoogle } = useAuth();
  const [fullName, setFullName]       = useState('');
  const [email, setEmail]             = useState('');
  const [password, setPassword]       = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState('');
  const [success, setSuccess]         = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const getPasswordStrength = (pw) => {
    if (!pw) return { score: 0, label: '', color: '' };
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    const map = [
      { label: 'Too short', color: 'bg-red-400' },
      { label: 'Weak', color: 'bg-red-400' },
      { label: 'Fair', color: 'bg-amber-400' },
      { label: 'Good', color: 'bg-blue-400' },
      { label: 'Strong', color: 'bg-emerald-500' },
    ];
    return { score, ...map[score] };
  };

  const strength = getPasswordStrength(password);

  const validate = () => {
    const errs = {};
    if (!fullName.trim()) errs.fullName = 'Full name is required.';
    if (!email) errs.email = 'Email address is required.';
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Please enter a valid email address.';
    if (!password) errs.password = 'Password is required.';
    else if (password.length < 8) errs.password = 'Password must be at least 8 characters long.';
    if (password !== confirmPassword) errs.confirmPassword = 'Passwords do not match.';
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validate()) return;

    setLoading(true);
    const res = await signUp({ email, password, fullName });
    setLoading(false);

    if (res.error) {
      setError(res.error.message || 'Registration failed. Please check your details and try again.');
    } else if (res.sessionActive) {
      // Instant login (email confirmation disabled in Supabase)
      onNavigate('home');
    } else {
      // Email confirmation required by Supabase
      setSuccess(true);
    }
  };

  if (success) {
    return (
      <AuthLayout title="Account Created" subtitle="Verification email sent">
        <div className="text-center py-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-campus-text text-sm font-medium mb-2">
            We sent a verification link to:
          </p>
          <p className="text-campus-navy font-bold text-sm bg-slate-100 py-1.5 px-3 rounded-lg inline-block mb-3">
            {email}
          </p>
          <p className="text-campus-muted text-xs mb-6 max-w-xs mx-auto">
            Please click the link in your email to verify your student account, then sign in below.
          </p>
          <button
            onClick={() => onNavigate('login')}
            className="w-full py-2.5 px-4 rounded-lg bg-campus-blue hover:bg-blue-700 text-white font-semibold text-sm transition-colors shadow-sm"
          >
            Go to Sign In
          </button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Create Account" subtitle="Register for your Smart Campus student account">
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <InputField
          label="Full name"
          value={fullName}
          onChange={e => setFullName(e.target.value)}
          placeholder="e.g. Aarav Sharma"
          error={fieldErrors.fullName}
          autoComplete="name"
          required
        />
        <InputField
          label="College / Personal Email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="e.g. aarav@student.campus.edu"
          error={fieldErrors.email}
          autoComplete="email"
          required
        />

        {/* Password input with strength bar */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Minimum 8 characters"
            autoComplete="new-password"
            className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-campus-text bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
              fieldErrors.password ? 'border-red-400 focus:ring-red-200' : 'border-campus-border focus:ring-campus-blue/20 focus:border-campus-blue'
            }`}
          />
          {password && (
            <div className="mt-2">
              <div className="flex gap-1 mb-1">
                {[1, 2, 3, 4].map(i => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-all ${
                      i <= strength.score ? strength.color : 'bg-slate-200'
                    }`}
                  />
                ))}
              </div>
              <p className="text-[11px] text-slate-500">Strength: {strength.label}</p>
            </div>
          )}
          {fieldErrors.password && <p className="text-red-500 text-xs mt-1">{fieldErrors.password}</p>}
        </div>

        <InputField
          label="Confirm password"
          type="password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          placeholder="Re-enter your password"
          error={fieldErrors.confirmPassword}
          autoComplete="new-password"
          required
        />

        <p className="text-xs text-slate-400">
          Account registrations are granted the <strong>Student</strong> role. Staff and Admin accounts are assigned separately by university administration.
        </p>

        <SubmitButton loading={loading} label="Create Account" loadingLabel="Creating account…" />
      </form>

      <div className="relative my-5">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-campus-border" />
        </div>
        <div className="relative flex justify-center">
          <span className="px-2 bg-white text-xs text-campus-muted">or</span>
        </div>
      </div>

      <GoogleButton onClick={() => signInWithGoogle()} loading={loading} label="Sign up with Google" />

      <p className="text-center text-sm text-campus-muted mt-5">
        Already have an account?{' '}
        <button onClick={() => onNavigate('login')} className="text-campus-blue font-semibold hover:underline">
          Sign In
        </button>
      </p>
    </AuthLayout>
  );
}

// ─── FORGOT PASSWORD PAGE ─────────────────────────────────────────────────────
export function ForgotPasswordPage({ onNavigate }) {
  const { resetPassword } = useAuth();
  const [email, setEmail]     = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [sent, setSent]       = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) { setError('Please enter your email address.'); return; }
    setLoading(true);
    setError('');
    const { error: authError } = await resetPassword(email);
    setLoading(false);
    if (authError) {
      setError(authError.message || 'Failed to send reset email.');
    } else {
      setSent(true);
    }
  };

  return (
    <AuthLayout title="Reset Password" subtitle="We'll email you a link to reset your password">
      {sent ? (
        <div className="text-center py-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-campus-text text-sm mb-6">
            If <strong>{email}</strong> is registered, you will receive a password reset link shortly.
          </p>
          <button
            onClick={() => onNavigate('login')}
            className="w-full py-2.5 px-4 rounded-lg bg-campus-blue hover:bg-blue-700 text-white font-semibold text-sm transition-colors"
          >
            Back to Sign In
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">{error}</div>
          )}
          <InputField
            label="Email address"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="your.email@campus.edu"
            autoComplete="email"
            required
          />
          <SubmitButton loading={loading} label="Send Reset Link" loadingLabel="Sending…" />
          <button
            type="button"
            onClick={() => onNavigate('login')}
            className="w-full text-center text-sm text-campus-muted hover:text-campus-navy transition-colors"
          >
            ← Back to Sign In
          </button>
        </form>
      )}
    </AuthLayout>
  );
}
