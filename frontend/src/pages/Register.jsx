import { useState } from 'react';
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/auth'
});

function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Enter a valid email';
    if (!form.password) newErrors.password = 'Password is required';
    else if (form.password.length < 6) newErrors.password = 'Password must be 6+ characters';
    if (!form.confirmPassword) newErrors.confirmPassword = 'Confirm your password';
    else if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Passwords must match';
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
      const response = await api.post('/register', form);
      setFeedback(response.data.message);
      setForm({ name: '', email: '', password: '', confirmPassword: '' });
    } catch (error) {
      setFeedback(error.response?.data?.message || 'Unable to register');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fadeIn rounded-3xl border border-[#222222] bg-[#0f0f0f] p-8 shadow-card sm:p-10">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.3em] text-mutedText">Create your account</p>
        <h3 className="mt-3 text-3xl font-semibold text-white">Start your secure session</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-white">Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full rounded-2xl border border-[#222222] bg-[#121212] px-4 py-3 text-white outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            placeholder="Your full name"
          />
          {errors.name && <p className="mt-2 text-sm text-danger">{errors.name}</p>}
        </div>

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

        <div>
          <label className="mb-2 block text-sm font-medium text-white">Confirm Password</label>
          <input
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full rounded-2xl border border-[#222222] bg-[#121212] px-4 py-3 text-white outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            placeholder="Repeat password"
          />
          {errors.confirmPassword && <p className="mt-2 text-sm text-danger">{errors.confirmPassword}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-3 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
              Registering...
            </span>
          ) : (
            'Create account'
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

export default Register;
