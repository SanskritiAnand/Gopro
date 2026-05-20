import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/auth'
});

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Enter a valid email';
    if (!form.password) newErrors.password = 'Password is required';
    return newErrors;
  };

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
    setErrors((prev) => ({ ...prev, [event.target.name]: '' }));
    setFeedback('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validation = validate();
    if (Object.keys(validation).length) {
      setErrors(validation);
      return;
    }

    setLoading(true);
    setErrors({});
    setFeedback('');

    try {
      const response = await api.post('/login', form);
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('auth_user', JSON.stringify(response.data.user));
      setFeedback(response.data.message);
      setTimeout(() => navigate('/profile'), 600);
    } catch (error) {
      setFeedback(error.response?.data?.message || 'Unable to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fadeIn rounded-3xl border border-[#222222] bg-[#0f0f0f] p-8 shadow-card sm:p-10">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.3em] text-mutedText">Secure sign in</p>
        <h3 className="mt-3 text-3xl font-semibold text-white">Access your AuthKit workspace</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-white">Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="w-full rounded-2xl border border-[#222222] bg-[#121212] px-4 py-3 text-white outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            placeholder="name@domain.com"
          />
          {errors.email && <p className="mt-2 text-sm text-danger">{errors.email}</p>}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-white">Password</label>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            className="w-full rounded-2xl border border-[#222222] bg-[#121212] px-4 py-3 text-white outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            placeholder="Enter password"
          />
          {errors.password && <p className="mt-2 text-sm text-danger">{errors.password}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-3 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
              Signing in...
            </span>
          ) : (
            'Sign in'
          )}
        </button>
      </form>

      {feedback && (
        <div className="mt-6 rounded-3xl border border-[#222222] bg-[#0b0b0b] px-4 py-4 text-sm text-white">
          {feedback}
        </div>
      )}
    </div>
  );
}

export default Login;
