import React, { useState } from 'react';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup, signOut, User } from 'firebase/auth';
import { Dumbbell, User as UserIcon, Menu, X, LogOut, ShieldAlert } from 'lucide-react';

interface HeaderProps {
  user: User | null;
  isAdminLoggedIn: boolean;
  onNavigate: (page: string) => void;
  onOpenAdminLogin: () => void;
  onAdminLogout: () => void;
}

export default function Header({
  user,
  isAdminLoggedIn,
  onNavigate,
  onOpenAdminLogin,
  onAdminLogout,
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Auth error:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      onNavigate('home');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header id="app-header" className="sticky top-0 z-50 bg-[#050505]/80 text-white border-b border-white/5 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => onNavigate('home')}>
            <div className="p-2 bg-red-600 rounded-lg flex items-center justify-center mr-2 shadow-lg shadow-red-600/25">
              <Dumbbell className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight font-display">
              MS <span className="text-red-600 font-extrabold">FITNESS</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6 text-xs font-semibold uppercase tracking-wider">
            <button onClick={() => onNavigate('home')} className="hover:text-red-500 transition-colors cursor-pointer">Home</button>
            <button onClick={() => onNavigate('about')} className="hover:text-red-500 transition-colors cursor-pointer">About</button>
            <button onClick={() => onNavigate('plans')} className="hover:text-red-500 transition-colors cursor-pointer">Memberships</button>
            <button onClick={() => onNavigate('classes')} className="hover:text-red-500 transition-colors cursor-pointer">Timetable</button>
            <button onClick={() => onNavigate('trainers')} className="hover:text-red-500 transition-colors cursor-pointer">Trainers</button>
            <button onClick={() => onNavigate('gallery')} className="hover:text-red-500 transition-colors cursor-pointer">Gallery</button>
            <button onClick={() => onNavigate('bmi')} className="hover:text-red-500 transition-colors cursor-pointer">BMI Calc</button>
            <button onClick={() => onNavigate('blog')} className="hover:text-red-500 transition-colors cursor-pointer">Blog</button>
            <button onClick={() => onNavigate('contact')} className="hover:text-red-500 transition-colors cursor-pointer">Contact</button>
          </nav>

          {/* Portal Controls / Logins */}
          <div className="hidden md:flex items-center space-x-4">
            {isAdminLoggedIn ? (
              <div className="flex items-center space-x-2">
                <span className="bg-red-950/50 border border-red-800 text-red-500 text-xs px-3 py-1.5 rounded-full font-mono flex items-center gap-1">
                  <ShieldAlert className="h-3 w-3" /> Admin Mode
                </span>
                <button
                  onClick={() => onNavigate('admin')}
                  className="bg-zinc-800 hover:bg-zinc-700 text-white text-xs px-3 py-1.5 rounded font-medium"
                >
                  Admin Panel
                </button>
                <button
                  onClick={onAdminLogout}
                  className="p-1.5 bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white rounded transition-colors"
                  title="Logout Admin"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAdminLogin}
                className="text-zinc-400 hover:text-white text-xs font-mono tracking-tight"
              >
                Admin Panel Login
              </button>
            )}

            {user ? (
              <div className="flex items-center space-x-3 border-l border-white/10 pl-4">
                <button
                  onClick={() => onNavigate('user-panel')}
                  className="flex items-center space-x-2 bg-zinc-900 border border-white/5 hover:border-red-600 px-3 py-1.5 rounded-md text-sm transition-all cursor-pointer"
                >
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName || 'User'} className="h-6 w-6 rounded-full" referrerPolicy="no-referrer" />
                  ) : (
                    <UserIcon className="h-4 w-4 text-zinc-400" />
                  )}
                  <span className="font-medium text-xs max-w-[100px] truncate">{user.displayName || user.email}</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="p-1.5 bg-zinc-900 text-zinc-400 hover:bg-red-600 hover:text-white rounded border border-white/5 transition-colors cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleGoogleLogin}
                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-md text-xs font-bold tracking-wider uppercase transition-colors flex items-center gap-2 cursor-pointer shadow-lg shadow-red-600/10 hover:shadow-red-600/20"
              >
                <UserIcon className="h-4 w-4" /> Login
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-3">
            {isAdminLoggedIn && (
              <button
                onClick={() => onNavigate('admin')}
                className="bg-red-600 text-white px-2 py-1.5 rounded text-xs"
              >
                Admin
              </button>
            )}
            {user && (
              <button
                onClick={() => onNavigate('user-panel')}
                className="bg-zinc-900 border border-zinc-700 p-1 rounded"
              >
                <UserIcon className="h-4 w-4 text-red-500" />
              </button>
            )}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-zinc-950 border-b border-zinc-800 px-4 py-3 space-y-2 animate-fade-in">
          <button
            onClick={() => { onNavigate('home'); setIsMenuOpen(false); }}
            className="block w-full text-left py-2 hover:bg-zinc-900 rounded px-2"
          >
            Home
          </button>
          <button
            onClick={() => { onNavigate('about'); setIsMenuOpen(false); }}
            className="block w-full text-left py-2 hover:bg-zinc-900 rounded px-2"
          >
            About
          </button>
          <button
            onClick={() => { onNavigate('plans'); setIsMenuOpen(false); }}
            className="block w-full text-left py-2 hover:bg-zinc-900 rounded px-2"
          >
            Memberships
          </button>
          <button
            onClick={() => { onNavigate('classes'); setIsMenuOpen(false); }}
            className="block w-full text-left py-2 hover:bg-zinc-900 rounded px-2"
          >
            Timetable
          </button>
          <button
            onClick={() => { onNavigate('trainers'); setIsMenuOpen(false); }}
            className="block w-full text-left py-2 hover:bg-zinc-900 rounded px-2"
          >
            Trainers
          </button>
          <button
            onClick={() => { onNavigate('gallery'); setIsMenuOpen(false); }}
            className="block w-full text-left py-2 hover:bg-zinc-900 rounded px-2"
          >
            Gallery
          </button>
          <button
            onClick={() => { onNavigate('bmi'); setIsMenuOpen(false); }}
            className="block w-full text-left py-2 hover:bg-zinc-900 rounded px-2"
          >
            BMI Calc
          </button>
          <button
            onClick={() => { onNavigate('blog'); setIsMenuOpen(false); }}
            className="block w-full text-left py-2 hover:bg-zinc-900 rounded px-2"
          >
            Blog
          </button>
          <button
            onClick={() => { onNavigate('contact'); setIsMenuOpen(false); }}
            className="block w-full text-left py-2 hover:bg-zinc-900 rounded px-2"
          >
            Contact
          </button>

          <div className="pt-4 border-t border-zinc-800 space-y-2">
            {!isAdminLoggedIn && (
              <button
                onClick={() => { onOpenAdminLogin(); setIsMenuOpen(false); }}
                className="block w-full text-left py-2 text-xs text-zinc-400 font-mono"
              >
                Admin Panel Login
              </button>
            )}

            {user ? (
              <div className="space-y-2">
                <button
                  onClick={() => { onNavigate('user-panel'); setIsMenuOpen(false); }}
                  className="w-full text-center bg-zinc-900 py-2.5 rounded text-sm text-white border border-zinc-800 hover:border-red-600 block"
                >
                  User Dashboard
                </button>
                <button
                  onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                  className="w-full text-center bg-red-600 text-white py-2.5 rounded text-sm font-semibold flex items-center justify-center gap-2"
                >
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => { handleGoogleLogin(); setIsMenuOpen(false); }}
                className="w-full text-center bg-red-600 text-white py-2.5 rounded text-sm font-semibold flex items-center justify-center gap-2"
              >
                <UserIcon className="h-4 w-4" /> Login
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
