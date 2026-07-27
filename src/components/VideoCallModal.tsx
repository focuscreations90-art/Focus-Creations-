import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { PhoneOff, Mic, MicOff, Video, VideoOff, Volume2, VolumeX, Shield, Sparkles } from 'lucide-react';

interface VideoCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUser?: User;
  callType: 'audio' | 'video';
}

export const VideoCallModal: React.FC<VideoCallModalProps> = ({
  isOpen,
  onClose,
  targetUser,
  callType
}) => {
  const [seconds, setSeconds] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(callType === 'audio');
  const [isSpeakerOff, setIsSpeakerOff] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isOpen) {
      setSeconds(0);
      interval = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen || !targetUser) return null;

  const formatCallDuration = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainingSecs = sec % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col justify-between p-6 select-none animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center space-x-2 bg-neutral-900/80 border border-yellow-500/30 px-3 py-1.5 rounded-full text-xs text-yellow-400">
          <Shield className="w-3.5 h-3.5" />
          <span className="font-bold uppercase tracking-wider">
            FOCUS EMPIRE {callType.toUpperCase()} MESH
          </span>
        </div>
        <div className="text-xs font-mono text-neutral-400 bg-neutral-900/80 border border-neutral-800 px-3 py-1.5 rounded-full">
          {formatCallDuration(seconds)}
        </div>
      </div>

      {/* Main Caller Avatar Area */}
      <div className="flex-1 flex flex-col items-center justify-center text-center my-8 relative">
        <div className="relative mb-6">
          {/* Glowing Animated Gold Rings */}
          <div className="absolute inset-0 rounded-full bg-yellow-500/20 animate-ping pointer-events-none" />
          <div className="absolute -inset-4 rounded-full border border-yellow-500/30 animate-pulse pointer-events-none" />

          <img
            src={targetUser.avatar}
            alt={targetUser.name}
            referrerPolicy="no-referrer"
            className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-yellow-400 shadow-2xl shadow-yellow-500/30 relative z-10"
          />
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-white">{targetUser.name}</h2>
        <p className="text-xs text-yellow-400 font-bold tracking-wider uppercase mt-1">
          {targetUser.handle} • {targetUser.role || 'Empire Executive'}
        </p>

        <p className="text-xs text-emerald-400 font-medium flex items-center justify-center space-x-1.5 mt-3">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Encrypted High-Definition Voice Active</span>
        </p>
      </div>

      {/* Bottom Action Controls */}
      <div className="flex items-center justify-center space-x-4 max-w-sm mx-auto w-full z-10 pb-4">
        <button
          onClick={() => setIsMuted(!isMuted)}
          className={`p-4 rounded-full border transition ${
            isMuted
              ? 'bg-red-950 border-red-500/50 text-red-400'
              : 'bg-neutral-900 border-yellow-500/30 text-white hover:text-yellow-400'
          }`}
        >
          {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
        </button>

        <button
          onClick={() => setIsVideoOff(!isVideoOff)}
          className={`p-4 rounded-full border transition ${
            isVideoOff
              ? 'bg-neutral-900 border-neutral-700 text-neutral-500'
              : 'bg-neutral-900 border-yellow-500/30 text-white hover:text-yellow-400'
          }`}
        >
          {isVideoOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
        </button>

        <button
          onClick={() => setIsSpeakerOff(!isSpeakerOff)}
          className={`p-4 rounded-full border transition ${
            isSpeakerOff
              ? 'bg-neutral-900 border-neutral-700 text-neutral-500'
              : 'bg-neutral-900 border-yellow-500/30 text-white hover:text-yellow-400'
          }`}
        >
          {isSpeakerOff ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
        </button>

        {/* End Call Button */}
        <button
          onClick={onClose}
          className="p-4 rounded-full bg-gradient-to-r from-red-600 to-rose-700 text-white shadow-xl shadow-red-600/30 hover:brightness-110 active:scale-95 transition"
        >
          <PhoneOff className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
