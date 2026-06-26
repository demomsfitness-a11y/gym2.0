import React, { useState } from 'react';
import { Lock, ShieldAlert, Key } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export default function AdminLoginModal({ isOpen, onClose, onLoginSuccess }: AdminLoginModalProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'manav20' && password === '2020') {
      onLoginSuccess();
      setError('');
      setUsername('');
      setPassword('');
      onClose();
    } else {
      setError('Invalid admin credentials. Please verify username/password.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans">
      <div className="bg-zinc-900 border border-zinc-800 max-w-sm w-full rounded-xl p-6 relative animate-scale-up text-white">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white"
        >
          ✕
        </button>

        <div className="text-center mb-6">
          <div className="h-12 w-12 bg-red-650/20 border border-red-600 text-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <Lock className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-black uppercase tracking-wider">Admin Terminal</h3>
          <p className="text-zinc-500 text-xs mt-0.5">Authorized MS Fitness coordinators only.</p>
        </div>

        {error && (
          <div className="bg-red-950/25 border border-red-900 text-red-500 text-[11px] p-3 rounded font-bold uppercase mb-4 flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. manav20"
              className="w-full bg-zinc-950 border border-zinc-800 focus:border-red-600 text-white px-3 py-2.5 rounded text-xs outline-none transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">Security Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••"
              className="w-full bg-zinc-950 border border-zinc-800 focus:border-red-600 text-white px-3 py-2.5 rounded text-xs outline-none transition-all"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-3 rounded uppercase tracking-widest flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-lg shadow-red-600/10"
          >
            <Key className="h-4 w-4" /> Authenticate
          </button>
        </form>
      </div>
    </div>
  );
}
