import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/auth'
});

function formatJoined(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const opts = { year: 'numeric', month: 'short' };
  return d.toLocaleDateString(undefined, opts);
}

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) return navigate('/login');

    api
      .get('/profile', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setProfile(res.data.user))
      .catch(() => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        navigate('/login');
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleSignOut = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-6">
      <div className="w-full max-w-[480px] bg-[#0a0a0a] border border-[#1f1f1f] rounded-lg p-8">
        {loading ? (
          <div className="min-h-[220px] flex items-center justify-center text-[#ededed]">Loading profile...</div>
        ) : (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="pulse" />
              <div className="text-[12px] font-medium text-[#22c55e]">Session active</div>
            </div>

            <div>
              <div className="text-[28px] font-extrabold heading text-[#ededed]">{profile?.name}</div>
              <div className="mt-2 text-[14px] text-[#888888]">{profile?.email}</div>
            </div>

            <div className="h-px bg-[#1a1a1a] my-6" />

            <div className="grid grid-cols-3 gap-2">
              <div className="bg-[#111111] border border-[#1f1f1f] rounded-md p-3 text-center">
                <div className="text-[11px] uppercase text-[#555555] tracking-wider">STATUS</div>
                <div className="mt-2 text-[14px] font-semibold text-[#ededed]">Verified ✓</div>
              </div>

              <div className="bg-[#111111] border border-[#1f1f1f] rounded-md p-3 text-center">
                <div className="text-[11px] uppercase text-[#555555] tracking-wider">AUTH</div>
                <div className="mt-2 text-[14px] font-semibold text-[#ededed]">JWT Token</div>
              </div>

              <div className="bg-[#111111] border border-[#1f1f1f] rounded-md p-3 text-center">
                <div className="text-[11px] uppercase text-[#555555] tracking-wider">JOINED</div>
                <div className="mt-2 text-[14px] font-semibold text-[#ededed]">{formatJoined(profile?.createdAt)}</div>
              </div>
            </div>

            <button
              onClick={handleSignOut}
              className="mt-6 w-full h-[36px] rounded-md border border-[#2a0000] text-[#ff4444] bg-transparent font-medium text-[13px] hover:bg-[#1a0000] hover:border-[#ff4444] transition"
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
