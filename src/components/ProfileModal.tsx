import React, { useState } from 'react';
import { User, Chat, Message } from '../types';
import { X, Shield, Phone, Video, Ban, ShieldAlert, Image as ImageIcon, MessageSquare } from 'lucide-react';

interface ProfileModalProps {
  user: User | null;
  chat?: Chat | null;
  messages?: Message[];
  onClose: () => void;
  onStartChat?: (user: User) => void;
  onStartCall: (type: 'audio' | 'video') => void;
  isBlocked: boolean;
  onToggleBlock: (userId: string) => void;
  onOpenReport: (targetId: string, targetName: string, targetType: 'user' | 'group') => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  user,
  chat,
  messages = [],
  onClose,
  onStartChat,
  onStartCall,
  isBlocked,
  onToggleBlock,
  onOpenReport
}) => {
  const [activeTab, setActiveTab] = useState<'info' | 'media'>('info');

  if (!user && !chat) return null;

  const title = chat?.isGroup ? chat.name : user?.name || 'User Profile';
  const avatar = chat?.isGroup ? chat.avatar : user?.avatar || '';
  const handle = user?.handle || (chat?.isGroup ? 'Group Channel' : '');
  const status = user?.statusMessage || chat?.description || '';

  // Extract shared photos/media from messages
  const mediaMessages = messages.filter(m => m.type === 'photo' || m.type === 'video');

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="bg-[#050505] border border-[#D4AF37]/30 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl shadow-black flex flex-col">
        {/* Top Header Card */}
        <div className="relative bg-gradient-to-b from-[#111111] via-[#080808] to-[#050505] p-6 text-center border-b border-[#D4AF37]/20">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-white/5 text-neutral-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>

          <img
            src={avatar}
            alt={title}
            referrerPolicy="no-referrer"
            className="w-24 h-24 rounded-full object-cover border-2 border-[#D4AF37] mx-auto shadow-2xl mb-3"
          />

          <h2 className="font-editorial text-2xl font-normal text-white">{title}</h2>
          <p className="text-xs text-[#D4AF37] font-mono tracking-wider uppercase mt-1">{handle}</p>
          {status && <p className="text-xs text-neutral-300 italic font-serif mt-2 px-4">"{status}"</p>}

          {/* Action Quick Buttons */}
          <div className="flex items-center justify-center space-x-3 mt-5">
            {user && onStartChat && (
              <button
                onClick={() => { onStartChat(user); onClose(); }}
                className="p-3 rounded-full bg-[#D4AF37] text-black hover:brightness-110 transition shadow-lg"
                title="Send Message"
              >
                <MessageSquare className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={() => { onStartCall('audio'); onClose(); }}
              className="p-3 rounded-full bg-[#111111] text-[#D4AF37] border border-[#D4AF37]/30 hover:border-[#D4AF37] transition"
              title="Voice Call"
            >
              <Phone className="w-4 h-4" />
            </button>

            <button
              onClick={() => { onStartCall('video'); onClose(); }}
              className="p-3 rounded-full bg-[#111111] text-[#D4AF37] border border-[#D4AF37]/30 hover:border-[#D4AF37] transition"
              title="Video Call"
            >
              <Video className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#D4AF37]/20 bg-[#0a0a0c]">
          <button
            onClick={() => setActiveTab('info')}
            className={`flex-1 py-3 text-xs font-semibold tracking-wider uppercase font-mono transition border-b-2 ${
              activeTab === 'info' ? 'border-[#D4AF37] text-[#D4AF37]' : 'border-transparent text-neutral-500'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('media')}
            className={`flex-1 py-3 text-xs font-semibold tracking-wider uppercase font-mono transition border-b-2 ${
              activeTab === 'media' ? 'border-[#D4AF37] text-[#D4AF37]' : 'border-transparent text-neutral-500'
            }`}
          >
            Shared Media ({mediaMessages.length})
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 max-h-64 overflow-y-auto">
          {activeTab === 'info' ? (
            <div className="space-y-3">
              {user?.role && (
                <div className="bg-[#111111] p-3.5 rounded-xl border border-white/5 flex items-center justify-between">
                  <span className="text-xs text-neutral-400 font-mono">EMPIRE RANK</span>
                  <span className="text-xs font-bold text-[#D4AF37]">{user.role}</span>
                </div>
              )}

              {user?.email && (
                <div className="bg-[#111111] p-3.5 rounded-xl border border-white/5 flex items-center justify-between">
                  <span className="text-xs text-neutral-400 font-mono">CONTACT EMAIL</span>
                  <span className="text-xs font-medium text-white">{user.email}</span>
                </div>
              )}

              {/* Block & Report Controls */}
              {user && (
                <div className="pt-3 border-t border-white/10 space-y-2">
                  <button
                    onClick={() => onToggleBlock(user.id)}
                    className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold border flex items-center justify-center space-x-2 transition ${
                      isBlocked
                        ? 'bg-[#111] border-neutral-700 text-neutral-300'
                        : 'bg-red-950/40 border-red-500/40 text-red-400 hover:bg-red-900/60'
                    }`}
                  >
                    <Ban className="w-3.5 h-3.5" />
                    <span>{isBlocked ? 'Unblock User' : 'Block User'}</span>
                  </button>

                  <button
                    onClick={() => {
                      onOpenReport(user.id, user.name, 'user');
                      onClose();
                    }}
                    className="w-full py-2.5 px-3 rounded-xl bg-[#111111] border border-white/10 text-neutral-400 hover:text-red-400 text-xs font-medium flex items-center justify-center space-x-2 transition"
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Report User to Moderation</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {mediaMessages.length === 0 ? (
                <p className="col-span-3 text-center text-xs text-neutral-500 py-6 font-editorial italic">No shared media</p>
              ) : (
                mediaMessages.map((m) => (
                  <div key={m.id} className="aspect-square bg-[#111111] rounded-lg overflow-hidden border border-white/10">
                    <img src={m.mediaUrl} alt="Media" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
