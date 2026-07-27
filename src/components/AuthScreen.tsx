import React, { useState } from 'react';
import { User } from '../types';
import { INITIAL_USERS } from '../data/mockData';
import { Shield, Sparkles, UserCheck, ArrowRight, Lock, Key, Mail, User as UserIcon } from 'lucide-react';

interface AuthScreenProps {
  onLogin: (user: User) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [handle, setHandle] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [statusMessage, setStatusMessage] = useState('👑 VIP Focus Empire Member');
  const [selectedAvatar, setSelectedAvatar] = useState(
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'
  );

  const avatarOptions = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400'
  ];

  const handlePresetLogin = (user: User) => {
    onLogin(user);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp) {
      const newUser: User = {
        id: 'usr_' + Date.now(),
        name: name || 'Empire Member',
        handle: handle ? (handle.startsWith('@') ? handle : `@${handle}`) : `@empire_${Math.floor(Math.random() * 8999 + 1000)}`,
        email: email || 'member@focusempire.com',
        avatar: selectedAvatar,
        statusMessage: statusMessage || '👑 Private Member',
        status: 'online',
        role: 'VIP Member'
      };
      onLogin(newUser);
    } else {
      // Find existing or mock user
      const found = INITIAL_USERS.find(u => u.email?.toLowerCase() === email.toLowerCase() || u.handle.toLowerCase() === handle.toLowerCase());
      if (found) {
        onLogin(found);
      } else {
        // Log in with entered info
        onLogin({
          id: 'usr_registered_' + Date.now(),
          name: name || email.split('@')[0] || 'Empire User',
          handle: handle ? (handle.startsWith('@') ? handle : `@${handle}`) : `@user_${Math.floor(Math.random() * 8999 + 1000)}`,
          email: email || 'user@focusempire.com',
          avatar: selectedAvatar,
          statusMessage: statusMessage,
          status: 'online',
          role: 'VIP Member'
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center p-4 relative overflow-hidden select-none">
      {/* Background Gold Ambient Flares */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-yellow-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-amber-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Card */}
      <div className="w-full max-w-md bg-neutral-900/90 border border-yellow-500/40 rounded-2xl shadow-2xl shadow-black p-6 sm:p-8 backdrop-blur-xl relative z-10">
        {/* Header Branding */}
        <div className="text-center mb-6">
          <div className="mx-auto w-20 h-20 rounded-2xl p-1 bg-gradient-to-tr from-yellow-600 via-yellow-400 to-amber-700 shadow-xl shadow-yellow-500/20 mb-3 flex items-center justify-center">
            <div className="w-full h-full bg-black rounded-xl overflow-hidden flex items-center justify-center border border-yellow-500/30">
              <img
                src="/src/assets/images/focus_chat_logo_1785186428328.jpg"
                alt="FOCUS CHAT"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <span className="text-3xl font-black text-gold-gradient">F</span>
            </div>
          </div>

          <h2 className="text-2xl font-black tracking-wide text-gold-gradient font-sans">
            FOCUS CHAT
          </h2>
          <p className="text-xs text-yellow-500/80 font-bold uppercase tracking-widest mt-0.5">
            A PRIVATE MESSAGING APP BY FOCUS EMPIRE
          </p>
        </div>

        {/* Quick Demo Accounts Selection */}
        <div className="mb-6 p-3 bg-neutral-950 border border-yellow-600/30 rounded-xl">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-yellow-400 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
            <span>Quick Login Presets (Demo Accounts)</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {INITIAL_USERS.slice(0, 3).map((user) => (
              <button
                key={user.id}
                onClick={() => handlePresetLogin(user)}
                className="flex flex-col items-center p-2 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-yellow-500/60 hover:bg-neutral-800/80 transition group"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  referrerPolicy="no-referrer"
                  className="w-9 h-9 rounded-full object-cover border border-yellow-500/40 group-hover:scale-105 transition"
                />
                <span className="text-[11px] font-bold text-white truncate w-full text-center mt-1">
                  {user.name.split(' ')[0]}
                </span>
                <span className="text-[9px] text-yellow-400/80 truncate w-full text-center font-medium">
                  {user.role?.split(' ')[0]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex bg-neutral-950 p-1 rounded-xl border border-neutral-800 mb-5">
          <button
            type="button"
            onClick={() => setIsSignUp(false)}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
              !isSignUp
                ? 'bg-gradient-to-r from-yellow-600 to-amber-600 text-black shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setIsSignUp(true)}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
              isSignUp
                ? 'bg-gradient-to-r from-yellow-600 to-amber-600 text-black shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {isSignUp && (
            <div>
              <label className="block text-[11px] font-bold text-yellow-500/90 mb-1 uppercase tracking-wider">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required={isSignUp}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Boss Johnson"
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-yellow-500 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-neutral-600 outline-none transition"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold text-yellow-500/90 mb-1 uppercase tracking-wider">
              {isSignUp ? 'Username (@handle)' : 'Email / Username'}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
              <input
                type="text"
                required
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                placeholder={isSignUp ? '@empire_boss' : 'focusentertainment710@gmail.com'}
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-yellow-500 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-neutral-600 outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-yellow-500/90 mb-1 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-yellow-500 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-neutral-600 outline-none transition"
              />
            </div>
          </div>

          {isSignUp && (
            <>
              <div>
                <label className="block text-[11px] font-bold text-yellow-500/90 mb-1 uppercase tracking-wider">
                  Status / About Quote
                </label>
                <input
                  type="text"
                  value={statusMessage}
                  onChange={(e) => setStatusMessage(e.target.value)}
                  placeholder="👑 VIP Member @ Focus Empire"
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-yellow-500 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-600 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-yellow-500/90 mb-1 uppercase tracking-wider">
                  Choose Profile Picture
                </label>
                <div className="flex space-x-2 overflow-x-auto py-1">
                  {avatarOptions.map((url, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedAvatar(url)}
                      className={`relative w-10 h-10 rounded-full overflow-hidden border-2 flex-shrink-0 transition ${
                        selectedAvatar === url ? 'border-yellow-400 scale-105 ring-2 ring-yellow-500/50' : 'border-neutral-800 opacity-60'
                      }`}
                    >
                      <img src={url} alt="Avatar" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full mt-2 py-3 px-4 rounded-xl font-black text-black bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-600 hover:from-yellow-400 hover:to-amber-500 transition shadow-lg shadow-yellow-500/25 flex items-center justify-center space-x-2 text-xs uppercase tracking-wider active:scale-[0.98]"
          >
            <span>{isSignUp ? 'Create Empire Account' : 'Enter Focus Chat'}</span>
            <ArrowRight className="w-4 h-4 text-black" />
          </button>
        </form>

        {/* Footer info */}
        <div className="mt-5 text-center pt-3 border-t border-neutral-800/80 flex items-center justify-center space-x-2 text-[10px] text-neutral-500 font-medium">
          <Shield className="w-3 h-3 text-yellow-500" />
          <span>Encrypted Network • Powered by FOCUS EMPIRE</span>
        </div>
      </div>
    </div>
  );
};
