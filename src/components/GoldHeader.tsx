import React, { useState } from 'react';
import { User, NotificationItem } from '../types';
import { Shield, Bell, Smartphone, Monitor, LogOut, Check, Trash2, X } from 'lucide-react';

interface GoldHeaderProps {
  currentUser: User;
  notifications: NotificationItem[];
  onMarkNotificationRead: (id: string) => void;
  onClearNotifications: () => void;
  onSelectNotifChat: (chatId: string) => void;
  isMobileFrame: boolean;
  onToggleMobileFrame: () => void;
  onLogout: () => void;
  onOpenProfile: () => void;
}

export const GoldHeader: React.FC<GoldHeaderProps> = ({
  currentUser,
  notifications,
  onMarkNotificationRead,
  onClearNotifications,
  onSelectNotifChat,
  isMobileFrame,
  onToggleMobileFrame,
  onLogout,
  onOpenProfile
}) => {
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="bg-[#050505] border-b border-[#D4AF37]/20 px-5 py-3 flex items-center justify-between text-white relative z-30 shadow-2xl shadow-black/90">
      {/* Brand & Logo */}
      <div className="flex items-center space-x-3.5">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#D4AF37] via-[#C5A028] to-[#996515] flex items-center justify-center font-bold text-black text-sm tracking-wider shadow-md shadow-[#D4AF37]/10 flex-shrink-0">
          FC
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-editorial italic text-xl md:text-2xl tracking-wide text-[#D4AF37] leading-none">
              Focus Empire
            </h1>
            <span className="bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded tracking-widest uppercase">
              PRO
            </span>
          </div>
          <p className="text-[10px] tracking-widest text-neutral-400 font-mono uppercase mt-0.5">
            FOCUS CHAT NETWORK
          </p>
        </div>
      </div>

      {/* Middle Status / Features Tag */}
      <div className="hidden md:flex items-center space-x-2 bg-[#111111] border border-[#D4AF37]/20 px-3.5 py-1.5 rounded-full text-xs">
        <Shield className="w-3.5 h-3.5 text-[#D4AF37]" />
        <span className="text-neutral-300 font-sans text-[11px] tracking-wide">Secure Encryption Active</span>
        <span className="w-2 h-2 rounded-full bg-[#D4AF37] shadow-[0_0_8px_#D4AF37] animate-pulse"></span>
      </div>

      {/* Right Action Controls */}
      <div className="flex items-center space-x-2">
        {/* Device Frame View Toggle */}
        <button
          onClick={onToggleMobileFrame}
          title={isMobileFrame ? "Switch to Desktop Wide View" : "Switch to Mobile App View"}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-[#111111] border border-[#D4AF37]/20 text-neutral-300 hover:text-[#D4AF37] hover:border-[#D4AF37]/50 transition text-xs font-medium"
        >
          {isMobileFrame ? <Monitor className="w-3.5 h-3.5 text-[#D4AF37]" /> : <Smartphone className="w-3.5 h-3.5 text-[#D4AF37]" />}
          <span className="hidden sm:inline font-mono text-[11px] uppercase tracking-wider">{isMobileFrame ? "Desktop View" : "Mobile View"}</span>
        </button>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifDropdown(!showNotifDropdown)}
            className="p-2 rounded-full bg-[#111111] border border-[#D4AF37]/20 text-neutral-300 hover:text-[#D4AF37] hover:border-[#D4AF37]/50 transition relative"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4 text-[#D4AF37]" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#D4AF37] text-black text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifDropdown && (
            <div className="absolute right-0 mt-2 w-80 bg-[#111111] border border-[#D4AF37]/40 rounded-xl shadow-2xl shadow-black p-3.5 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
                <div className="flex items-center space-x-1.5">
                  <Bell className="w-4 h-4 text-[#D4AF37]" />
                  <span className="font-editorial italic text-base text-[#D4AF37]">Notifications</span>
                </div>
                {notifications.length > 0 && (
                  <button
                    onClick={onClearNotifications}
                    className="text-neutral-400 hover:text-red-400 text-xs flex items-center space-x-1 transition"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Clear</span>
                  </button>
                )}
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-center text-xs text-neutral-500 py-4">No recent notifications</p>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        if (notif.chatId) onSelectNotifChat(notif.chatId);
                        onMarkNotificationRead(notif.id);
                        setShowNotifDropdown(false);
                      }}
                      className={`p-2.5 rounded-lg border text-xs cursor-pointer transition flex items-start space-x-2.5 ${
                        notif.read
                          ? 'bg-[#050505] border-neutral-800 text-neutral-400'
                          : 'bg-[#D4AF37]/10 border-[#D4AF37]/30 text-white font-medium'
                      }`}
                    >
                      <div className="w-2 h-2 rounded-full bg-[#D4AF37] mt-1.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-[#D4AF37] truncate">{notif.title}</p>
                          <span className="text-[10px] text-neutral-500 font-mono">{notif.timestamp}</span>
                        </div>
                        <p className="text-neutral-300 text-[11px] truncate mt-0.5">{notif.body}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Current User Pill */}
        <button
          onClick={onOpenProfile}
          className="flex items-center space-x-2.5 pl-1.5 pr-3 py-1 bg-[#111111] border border-[#D4AF37]/30 hover:border-[#D4AF37] rounded-full transition text-left"
        >
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            referrerPolicy="no-referrer"
            className="w-7 h-7 rounded-full object-cover border border-[#D4AF37]"
          />
          <div className="hidden sm:block text-left">
            <p className="text-xs font-bold text-white leading-tight truncate max-w-[100px]">{currentUser.name}</p>
            <p className="text-[10px] text-[#D4AF37] font-mono leading-none mt-0.5">{currentUser.handle}</p>
          </div>
        </button>

        {/* Logout / Switch Account */}
        <button
          onClick={onLogout}
          title="Sign Out / Switch Account"
          className="p-2 rounded-full bg-[#111111] border border-[#D4AF37]/20 text-neutral-400 hover:text-red-400 hover:border-red-500/50 transition"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
