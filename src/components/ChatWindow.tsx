import React, { useState, useRef, useEffect } from 'react';
import { User, Chat, Message, MessageType, Sticker } from '../types';
import { GOLD_STICKERS, POPULAR_EMOJIS } from '../data/mockData';
import {
  startAudioRecording,
  stopAudioRecording,
  cancelAudioRecording,
  formatTime,
  generateWaveformHeights
} from '../utils/audio';
import {
  Send, Camera, Mic, Smile, Paperclip, Phone, Video, Search, Info,
  Play, Pause, Volume2, Check, CheckCheck, X, Image as ImageIcon,
  Sparkles, Trash2, CornerDownRight, Shield, AlertTriangle
} from 'lucide-react';

interface ChatWindowProps {
  currentUser: User;
  chat: Chat | null;
  messages: Message[];
  users: User[];
  onSendMessage: (
    content: string,
    type: MessageType,
    mediaUrl?: string,
    mediaName?: string,
    durationSeconds?: number,
    replyToId?: string
  ) => void;
  onAddReaction: (messageId: string, emoji: string) => void;
  onStartCall: (type: 'audio' | 'video') => void;
  onOpenProfile: () => void;
  onOpenCamera: () => void;
  onOpenReport: (targetId: string, targetName: string, targetType: 'user' | 'group') => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  currentUser,
  chat,
  messages,
  users,
  onSendMessage,
  onAddReaction,
  onStartCall,
  onOpenProfile,
  onOpenCamera,
  onOpenReport
}) => {
  const [inputText, setInputText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [pickerTab, setPickerTab] = useState<'emojis' | 'stickers'>('emojis');
  const [replyingToMessage, setReplyingToMessage] = useState<Message | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);

  // Audio Voice Recorder State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const recordingTimerRef = useRef<any>(null);

  // Playing Voice Note State
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!chat) {
    return (
      <div className="flex-1 bg-black flex flex-col items-center justify-center p-8 text-center select-none">
        <div className="w-20 h-20 rounded-2xl bg-neutral-900 border border-yellow-500/30 flex items-center justify-center shadow-2xl shadow-yellow-500/10 mb-4">
          <Shield className="w-10 h-10 text-yellow-400" />
        </div>
        <h2 className="text-xl font-black text-gold-gradient">FOCUS CHAT NETWORK</h2>
        <p className="text-xs text-neutral-400 max-w-sm mt-1">
          Select a chat from the sidebar or start a new conversation with Empire members.
        </p>
      </div>
    );
  }

  // Filter messages if search is active
  const displayedMessages = showSearch && searchQuery.trim()
    ? messages.filter(m => m.content.toLowerCase().includes(searchQuery.toLowerCase()))
    : messages;

  // Handle Voice Recording
  const handleStartVoiceRecord = async () => {
    try {
      await startAudioRecording();
      setIsRecording(true);
      setRecordingSeconds(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    } catch (err) {
      alert('Microphone permission denied or unavailable');
    }
  };

  const handleStopAndSendVoiceRecord = async () => {
    clearInterval(recordingTimerRef.current);
    try {
      const result = await stopAudioRecording();
      setIsRecording(false);
      onSendMessage(
        'Voice note',
        'voice_note',
        result.audioUrl,
        'voice_note.webm',
        result.durationSeconds
      );
    } catch (err) {
      console.error('Failed to save audio recording', err);
      setIsRecording(false);
    }
  };

  const handleCancelVoiceRecord = () => {
    clearInterval(recordingTimerRef.current);
    cancelAudioRecording();
    setIsRecording(false);
  };

  // Handle Play/Pause Voice Note
  const handleTogglePlayAudio = (msg: Message) => {
    if (!msg.mediaUrl) return;

    if (playingAudioId === msg.id) {
      audioRef.current?.pause();
      setPlayingAudioId(null);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      audioRef.current = new Audio(msg.mediaUrl);
      audioRef.current.play();
      setPlayingAudioId(msg.id);
      audioRef.current.onended = () => {
        setPlayingAudioId(null);
      };
    }
  };

  // Handle Submit Text Message
  const handleSendText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    onSendMessage(
      inputText.trim(),
      'text',
      undefined,
      undefined,
      undefined,
      replyingToMessage?.id
    );

    setInputText('');
    setReplyingToMessage(null);
    setShowEmojiPicker(false);
  };

  // Handle File Upload Attachment
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isVideo = file.type.startsWith('video');
    const isImage = file.type.startsWith('image');
    const type: MessageType = isVideo ? 'video' : 'photo';

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        onSendMessage(
          file.name,
          type,
          event.target.result as string,
          file.name
        );
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex-1 bg-editorial-radial flex flex-col h-full relative overflow-hidden select-none">
      {/* Chat Top Header Bar */}
      <div className="px-6 py-4 bg-[#050505]/90 backdrop-blur-md border-b border-[#D4AF37]/15 flex items-center justify-between z-20 shadow-xl">
        <div onClick={onOpenProfile} className="flex items-center space-x-3.5 cursor-pointer group">
          <div className="relative">
            <div className="w-10 h-10 rounded-full border border-[#D4AF37] p-0.5 bg-[#111]">
              <img
                src={chat.avatar}
                alt={chat.name}
                referrerPolicy="no-referrer"
                className="w-full h-full rounded-full object-cover group-hover:scale-105 transition"
              />
            </div>
            {chat.isGroup && (
              <span className="absolute -bottom-1 -right-1 bg-[#D4AF37] text-black text-[9px] font-mono font-bold px-1 rounded-full border border-black">
                GRP
              </span>
            )}
          </div>

          <div>
            <h3 className="font-editorial text-xl font-normal text-white group-hover:text-[#D4AF37] transition flex items-center space-x-1">
              <span>{chat.name}</span>
            </h3>
            <p className="text-[10px] text-[#D4AF37] font-mono tracking-widest uppercase opacity-80 mt-0.5">
              {chat.isGroup
                ? `${chat.participantIds.length} MEMBERS • IMPERIAL BOARD`
                : 'SECURE ENCRYPTION ACTIVE'}
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className={`p-2 rounded-full border transition ${
              showSearch ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37]' : 'bg-[#111] border-white/10 text-neutral-400 hover:text-white'
            }`}
            title="Search Chat"
          >
            <Search className="w-4 h-4" />
          </button>

          <button
            onClick={() => onStartCall('audio')}
            className="p-2 rounded-full bg-[#111] border border-white/10 text-neutral-400 hover:text-[#D4AF37] hover:border-[#D4AF37]/50 transition"
            title="Voice Call"
          >
            <Phone className="w-4 h-4" />
          </button>

          <button
            onClick={() => onStartCall('video')}
            className="p-2 rounded-full bg-[#111] border border-white/10 text-neutral-400 hover:text-[#D4AF37] hover:border-[#D4AF37]/50 transition"
            title="Video Call"
          >
            <Video className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenProfile}
            className="p-2 rounded-full bg-[#111] border border-white/10 text-neutral-400 hover:text-[#D4AF37] transition"
            title="Profile Details"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* In-chat Search Bar Overlay */}
      {showSearch && (
        <div className="bg-[#111111] border-b border-[#D4AF37]/30 p-2.5 px-6 flex items-center space-x-3 z-10 animate-in slide-in-from-top duration-150">
          <Search className="w-4 h-4 text-[#D4AF37]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search messages..."
            className="flex-1 bg-transparent text-xs text-white outline-none placeholder-neutral-500 font-sans"
            autoFocus
          />
          <button onClick={() => { setShowSearch(false); setSearchQuery(''); }} className="text-neutral-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Messages Stream Viewport */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-5 bg-editorial-radial">
        {displayedMessages.length === 0 ? (
          <div className="text-center text-xs text-neutral-500 py-16 font-editorial italic text-base">
            No messages yet. Send a greeting to begin correspondence.
          </div>
        ) : (
          displayedMessages.map((msg) => {
            const isMe = msg.senderId === currentUser.id;

            return (
              <div
                key={msg.id}
                className={`flex items-end space-x-2.5 group ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                {!isMe && (
                  <img
                    src={msg.senderAvatar}
                    alt={msg.senderName}
                    referrerPolicy="no-referrer"
                    className="w-7 h-7 rounded-full object-cover border border-[#D4AF37]/30 mb-1"
                  />
                )}

                <div className={`max-w-[80%] sm:max-w-[65%] p-4 relative shadow-2xl ${
                  isMe
                    ? 'bg-[#D4AF37] text-black font-medium rounded-2xl rounded-br-none'
                    : 'bg-[#111111] text-neutral-100 border border-white/10 rounded-2xl rounded-bl-none'
                }`}>
                  {/* Sender Name in Group Chat */}
                  {!isMe && chat.isGroup && (
                    <p className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider mb-1 font-mono">
                      {msg.senderName}
                    </p>
                  )}

                  {/* Reply Reference Preview */}
                  {msg.replyToText && (
                    <div className={`p-2 rounded mb-2 text-[11px] border-l-2 ${
                      isMe ? 'bg-black/20 border-black text-black font-medium' : 'bg-[#050505] border-[#D4AF37] text-neutral-300'
                    }`}>
                      <p className="truncate">{msg.replyToText}</p>
                    </div>
                  )}

                  {/* Message Content according to type */}
                  {msg.type === 'text' && (
                    <p className="text-sm leading-relaxed whitespace-pre-wrap break-words font-sans">
                      {msg.content}
                    </p>
                  )}

                  {msg.type === 'photo' && msg.mediaUrl && (
                    <div className="space-y-1">
                      <img
                        src={msg.mediaUrl}
                        alt="Photo"
                        referrerPolicy="no-referrer"
                        onClick={() => setExpandedImage(msg.mediaUrl!)}
                        className="rounded-xl max-h-60 w-full object-cover cursor-pointer hover:opacity-95 transition border border-black/20"
                      />
                      {msg.content && msg.content !== msg.mediaName && (
                        <p className="text-xs mt-1">{msg.content}</p>
                      )}
                    </div>
                  )}

                  {msg.type === 'video' && msg.mediaUrl && (
                    <div className="space-y-1">
                      <video
                        src={msg.mediaUrl}
                        controls
                        className="rounded-xl max-h-60 w-full object-cover"
                      />
                    </div>
                  )}

                  {msg.type === 'voice_note' && (
                    <div className="flex items-center space-x-3 min-w-[200px] py-1">
                      <button
                        onClick={() => handleTogglePlayAudio(msg)}
                        className={`p-2.5 rounded-full shadow-lg transition ${
                          isMe ? 'bg-black text-[#D4AF37]' : 'bg-[#D4AF37] text-black'
                        }`}
                      >
                        {playingAudioId === msg.id ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </button>

                      {/* Waveform Bars Visualizer */}
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center space-x-0.5 h-6">
                          {generateWaveformHeights(20).map((h, idx) => (
                            <span
                              key={idx}
                              style={{ height: `${h}%` }}
                              className={`w-1 rounded-full transition-all ${
                                isMe ? 'bg-black/70' : 'bg-[#D4AF37]'
                              }`}
                            />
                          ))}
                        </div>
                        <p className={`text-[10px] font-mono font-bold ${isMe ? 'text-black/80' : 'text-[#D4AF37]'}`}>
                          VOICE NOTE ({formatTime(msg.durationSeconds || 12)})
                        </p>
                      </div>
                    </div>
                  )}

                  {msg.type === 'sticker' && (
                    <div className="text-5xl py-2 text-center">
                      {msg.content}
                    </div>
                  )}

                  {/* Message Timestamp & Status Checks */}
                  <div className={`flex items-center justify-end space-x-1 text-[10px] font-mono mt-2 opacity-60 ${
                    isMe ? 'text-black font-semibold' : 'text-neutral-400'
                  }`}>
                    <span>{msg.timestamp}</span>
                    {isMe && (
                      <CheckCheck className="w-3.5 h-3.5 text-black" />
                    )}
                  </div>

                  {/* Message Reactions Badge Overlay */}
                  {msg.reactions && msg.reactions.length > 0 && (
                    <div className="absolute -bottom-2.5 right-3 flex space-x-1 bg-[#050505] border border-[#D4AF37]/40 rounded-full px-2 py-0.5 text-[10px] shadow-xl">
                      {msg.reactions.map((r, idx) => (
                        <span key={idx} className="flex items-center space-x-0.5">
                          <span>{r.emoji}</span>
                          <span className="text-[#D4AF37] font-mono font-bold">{r.userIds.length}</span>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Hover Quick Reaction Buttons */}
                  <div className="hidden group-hover:flex absolute -top-3 right-2 bg-[#111111] border border-[#D4AF37]/40 rounded-full px-2 py-0.5 space-x-1.5 shadow-2xl z-10">
                    {['👑', '🔥', '💎', '❤️', '👍'].map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => onAddReaction(msg.id, emoji)}
                        className="hover:scale-125 transition text-xs"
                      >
                        {emoji}
                      </button>
                    ))}
                    <button
                      onClick={() => setReplyingToMessage(msg)}
                      className="text-neutral-400 hover:text-[#D4AF37] text-xs pl-1 border-l border-neutral-700"
                      title="Reply"
                    >
                      <CornerDownRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Reply Banner */}
      {replyingToMessage && (
        <div className="bg-[#111111] border-t border-[#D4AF37]/30 p-2.5 px-6 flex items-center justify-between text-xs text-neutral-300">
          <div className="flex items-center space-x-2 truncate">
            <CornerDownRight className="w-3.5 h-3.5 text-[#D4AF37] flex-shrink-0" />
            <span className="text-[#D4AF37] font-semibold">Replying to {replyingToMessage.senderName}:</span>
            <span className="truncate max-w-xs text-neutral-400">{replyingToMessage.content}</span>
          </div>
          <button onClick={() => setReplyingToMessage(null)} className="text-neutral-500 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Voice Recorder Active Bar */}
      {isRecording && (
        <div className="bg-[#111111] border-t border-[#D4AF37]/50 p-3 px-6 flex items-center justify-between z-20 animate-in slide-in-from-bottom duration-150">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
            <span className="text-xs font-mono font-bold text-red-400">
              Recording Voice... {formatTime(recordingSeconds)}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCancelVoiceRecord}
              className="px-3 py-1.5 rounded-full bg-neutral-800 text-neutral-400 hover:text-white text-xs font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleStopAndSendVoiceRecord}
              className="px-4 py-1.5 rounded-full bg-[#D4AF37] text-black font-extrabold text-xs uppercase flex items-center space-x-1 shadow-lg"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Voice</span>
            </button>
          </div>
        </div>
      )}

      {/* Emoji & Sticker Drawer */}
      {showEmojiPicker && (
        <div className="bg-[#050505] border-t border-[#D4AF37]/40 p-3.5 z-20 max-h-56 overflow-y-auto animate-in slide-in-from-bottom duration-150">
          <div className="flex items-center space-x-4 border-b border-white/10 pb-2 mb-3">
            <button
              onClick={() => setPickerTab('emojis')}
              className={`text-xs font-bold pb-1 transition ${
                pickerTab === 'emojis' ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]' : 'text-neutral-500'
              }`}
            >
              Emojis
            </button>
            <button
              onClick={() => setPickerTab('stickers')}
              className={`text-xs font-bold pb-1 transition ${
                pickerTab === 'stickers' ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]' : 'text-neutral-500'
              }`}
            >
              👑 Imperial Gold Stickers
            </button>
          </div>

          {pickerTab === 'emojis' ? (
            <div className="grid grid-cols-8 gap-2 text-xl text-center">
              {POPULAR_EMOJIS.map((emoji, idx) => (
                <button
                  key={idx}
                  onClick={() => setInputText(prev => prev + emoji)}
                  className="hover:scale-125 transition p-1"
                >
                  {emoji}
                </button>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-2">
              {GOLD_STICKERS.map((stk) => (
                <button
                  key={stk.id}
                  onClick={() => {
                    onSendMessage(stk.url, 'sticker');
                    setShowEmojiPicker(false);
                  }}
                  className="p-2 rounded-xl bg-[#111111] border border-white/10 hover:border-[#D4AF37] text-2xl flex flex-col items-center justify-center space-y-1 transition"
                >
                  <span>{stk.url}</span>
                  <span className="text-[9px] text-[#D4AF37] font-mono font-bold truncate w-full text-center">
                    {stk.name}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Primary Editorial Pill Composition Toolbar */}
      {!isRecording && (
        <div className="p-4 px-6 md:px-10 bg-[#050505] border-t border-[#D4AF37]/15">
          <form
            onSubmit={handleSendText}
            className="bg-[#111111] border border-[#D4AF37] rounded-full px-4 py-1.5 flex items-center space-x-2 shadow-2xl shadow-[#D4AF37]/5"
          >
            {/* Media Attachment */}
            <label className="p-2 rounded-full text-neutral-400 hover:text-[#D4AF37] cursor-pointer transition">
              <Paperclip className="w-4 h-4" />
              <input type="file" onChange={handleFileChange} className="hidden" accept="image/*,video/*" />
            </label>

            {/* Camera Capture */}
            <button
              type="button"
              onClick={onOpenCamera}
              className="p-2 rounded-full text-neutral-400 hover:text-[#D4AF37] transition"
              title="Camera Photo Capture"
            >
              <Camera className="w-4 h-4" />
            </button>

            {/* Input Field */}
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Compose message..."
              className="flex-1 bg-transparent border-none text-sm text-white placeholder-neutral-500 outline-none px-2 py-2 font-sans"
            />

            {/* Emoji Toggle */}
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className={`p-2 rounded-full transition ${
                showEmojiPicker ? 'text-[#D4AF37]' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Smile className="w-4 h-4" />
            </button>

            {/* Voice Record Button or Send Button */}
            {inputText.trim() ? (
              <button
                type="submit"
                className="w-10 h-10 rounded-full bg-[#D4AF37] text-black flex items-center justify-center font-bold shadow-lg hover:brightness-110 active:scale-95 transition flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleStartVoiceRecord}
                className="p-2 rounded-full text-[#D4AF37] hover:scale-110 transition"
                title="Record Voice Note"
              >
                <Mic className="w-4 h-4" />
              </button>
            )}
          </form>
        </div>
      )}

      {/* Image Zoom Lightbox Modal */}
      {expandedImage && (
        <div
          onClick={() => setExpandedImage(null)}
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 cursor-zoom-out"
        >
          <img src={expandedImage} alt="Expanded" className="max-w-full max-h-full object-contain rounded-lg" />
          <button className="absolute top-4 right-4 text-white p-2">
            <X className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  );
};
