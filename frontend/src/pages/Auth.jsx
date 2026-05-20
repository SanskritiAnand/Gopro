import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation, Link } from 'react-router-dom';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/auth'
});

function Field({ label, children, error }) {
  return (
    <div>
      <label className="block mb-1 text-[12px] font-medium text-[#aaaaaa] tracking-[0.01em]">{label}</label>
      {children}
      {error && (
        <div className="mt-2 flex items-center text-[12px] text-[#ff4444]">
          <span className="mr-2">⚠</span>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

export default function Auth({ initial = 'login' }) {
  const navigate = useNavigate();
  const location = useLocation();
  const queryMode = location.pathname.includes('register') ? 'register' : 'login';
  const [mode, setMode] = useState(initial || queryMode);

  useEffect(() => setMode(initial || queryMode), [initial, queryMode]);

  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (mode === 'register') {
      if (!form.name.trim()) e.name = 'Full name is required';
      if (!form.confirmPassword) e.confirmPassword = 'Confirm your password';
      if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords must match';
    }
    if (!form.email.trim()) e.email = 'Email address is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Password must be 6+ characters';
    return e;
  };

  const handleChange = (e) => {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
    setErrors((s) => ({ ...s, [e.target.name]: '' }));
    setStatus('');
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const v = validate();
    if (Object.keys(v).length) return setErrors(v);
    setLoading(true);
    setErrors({});
    setStatus('');

    try {
      if (mode === 'login') {
        const res = await api.post('/login', { email: form.email, password: form.password });
        localStorage.setItem('auth_token', res.data.token);
        localStorage.setItem('auth_user', JSON.stringify(res.data.user));
        setStatus("You're in. Taking you to your profile...");
        setTimeout(() => navigate('/profile'), 900);
      } else {
        await api.post('/register', {
          name: form.name,
          email: form.email,
          password: form.password,
          confirmPassword: form.confirmPassword
        });
        setStatus('Account created. You can now sign in.');
        setForm({ name: '', email: '', password: '', confirmPassword: '' });
        setTimeout(() => setMode('login'), 900);
      }
    } catch (err) {
      setStatus(err.response?.data?.message || 'Server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-full max-w-[400px] bg-[#0a0a0a] border border-[#1f1f1f] rounded-lg p-8 shadow-none">
        {/* Top logo row */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-white flex items-center justify-center text-black font-semibold text-[11px]">AK</div>
          <div className="text-[14px] font-medium text-[#ededed]">AuthKit</div>
        </div>

        {/* Heading block */}
        <div className="mt-6">
          <h1 className="heading text-[22px] font-bold text-[#ededed] leading-[1.2]">{mode === 'login' ? 'Welcome back.' : 'Create your account.'}</h1>
          <p className="mt-1 text-[14px] text-[#888888]">{mode === 'login' ? 'Sign in to continue to your workspace.' : 'Join AuthKit and get started in seconds.'}</p>
        </div>

        {/* Tab switcher */}
        <div className="mt-5">
          <div className="flex gap-2 bg-[#111111] border border-[#1f1f1f] rounded-md p-1">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 h-8 text-[13px] rounded-md ${mode === 'login' ? 'bg-white text-black font-medium' : 'text-[#666666] font-normal'}`}
              style={{ transition: 'all 0.15s ease' }}
            >
              Sign in
            </button>
            <button
              onClick={() => setMode('register')}
              className={`flex-1 h-8 text-[13px] rounded-md ${mode === 'register' ? 'bg-white text-black font-medium' : 'text-[#666666] font-normal'}`}
              style={{ transition: 'all 0.15s ease' }}
            >
              Create account
            </button>
          </div>
        </div>

        {/* Form */}
        <form className="mt-5" onSubmit={handleSubmit}>
          <div className="space-y-3">
            {mode === 'register' && (
              <Field label="Full name" error={errors.name}>
                <input
                  name="name"
                  placeholder="Alex Johnson"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full h-10 bg-[#0d0d0d] border border-[#1f1f1f] rounded-md px-3 text-[14px] text-[#ededed] placeholder-[#444444] focus:border-[#333333] focus:shadow-[0_0_0_3px_rgba(255,255,255,0.04)] transition"
                />
              </Field>
            )}

            <Field label="Email address" error={errors.email}>
              <input
                name="email"
                type="email"
                placeholder="you@company.com"
                value={form.email}
                onChange={handleChange}
                className="w-full h-10 bg-[#0d0d0d] border border-[#1f1f1f] rounded-md px-3 text-[14px] text-[#ededed] placeholder-[#444444] focus:border-[#333333] focus:shadow-[0_0_0_3px_rgba(255,255,255,0.04)] transition"
              />
            </Field>

            <Field label="Password" error={errors.password}>
              <input
                name="password"
                type="password"
                placeholder="········"
                value={form.password}
                onChange={handleChange}
                className="w-full h-10 bg-[#0d0d0d] border border-[#1f1f1f] rounded-md px-3 text-[14px] text-[#ededed] placeholder-[#444444] focus:border-[#333333] focus:shadow-[0_0_0_3px_rgba(255,255,255,0.04)] transition"
              />
            </Field>

            {mode === 'register' && (
              <Field label="Confirm password" error={errors.confirmPassword}>
                <input
                  name="confirmPassword"
                  type="password"
                  placeholder="········"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="w-full h-10 bg-[#0d0d0d] border border-[#1f1f1f] rounded-md px-3 text-[14px] text-[#ededed] placeholder-[#444444] focus:border-[#333333] focus:shadow-[0_0_0_3px_rgba(255,255,255,0.04)] transition"
                />
              </Field>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full h-10 bg-white text-black rounded-md text-[14px] font-semibold hover:bg-[#ececec] transform active:scale-95 transition disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin" />
                {mode === 'login' ? 'Signing in...' : 'Creating...'}
              </>
            ) : (
              <>{mode === 'login' ? 'Continue →' : 'Create account →'}</>
            )}
          </button>
        </form>

        {/* Divider + footer */}
        <div className="mt-5">
          <div className="h-px bg-[#1a1a1a] w-full" />
          <p className="mt-4 text-[13px] text-[#555555] text-center">
            {mode === 'login' ? (
              <>
                Don't have an account? <button onClick={() => setMode('register')} className="text-[#ededed] underline hover:no-underline ml-1">Create one</button>
              </>
            ) : (
              <>
                Already have an account? <button onClick={() => setMode('login')} className="text-[#ededed] underline hover:no-underline ml-1">Sign in</button>
              </>
            )}
          </p>
        </div>

        {status && (
          <div className="mt-4 text-[13px] text-[#ededed] text-center">{status}</div>
        )}
      </div>
    </div>
  );
}
