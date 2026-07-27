import React, { useState } from 'react';
import { User, Chat, ActiveTab, ThemeOption } from '../types';
import { MessageSquare, Users, Shield, Settings, Search, Plus, Pin, Volume2, VolumeX, Trash2, CheckCircle2, UserX, Moon, Sun, Bell, Lock } from 'lucide-react';

interface SidebarProps {
  currentUser: User;
  chats: Chat[];
  users: User[];
  activeChatId: string | null;
  activeTab: ActiveTab;
  onChangeTab: (tab: ActiveTab) => void;
  onSelectChat: (chatId: string) => void;
  onStartDirectChat: (user: User) => void;
  onCreateGroupClick: () => void;
  onUpdateProfile: (updated: Partial<User>) => void;
  blockedUserIds: string[];
  onUnblockUser: (userId: string) => void;
  onTogglePinChat: (chatId: string) => void;
  onToggleMuteChat: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
  currentTheme: ThemeOption;
  onChangeTheme: (theme: ThemeOption) => void;
  onOpenUserProfile: (user: User) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentUser,
  chats,
  users,
  activeChatId,
  activeTab,
  onChangeTab,
  onSelectChat,
  onStartDirectChat,
  onCreateGroupClick,
  onUpdateProfile,
  blockedUserIds,
  onUnblockUser,
  onTogglePinChat,
  onToggleMuteChat,
  onDeleteChat,
  currentTheme,
  onChangeTheme,
  onOpenUserProfile
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingName, setEditingName] = useState(currentUser.name);
  const [editingHandle, setEditingHandle] = useState(currentUser.handle);
  const [editingStatus, setEditingStatus] = useState(currentUser.statusMessage);
  const [editingAvatar, setEditingAvatar] = useState(currentUser.avatar);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Filter chats by query
  const filteredChats = chats.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.lastMessage?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter contacts
  const otherUsers = users.filter(u => u.id !== currentUser.id);
  const filteredContacts = otherUsers.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.handle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter group chats
  const groupChats = chats.filter(c => c.isGroup);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      name: editingName,
      handle: editingHandle,
      statusMessage: editingStatus,
      avatar: editingAvatar
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <aside className="w-full md:w-80 lg:w-96 bg-[#050505] border-r border-[#D4AF37]/20 flex flex-col h-full select-none flex-shrink-0">
      {/* Top Search & Editorial Title Header */}
      <div className="p-5 border-b border-[#D4AF37]/20 space-y-4 bg-gradient-to-b from-[#0a0a0d] to-[#050505]">
        <div className="flex items-center justify-between">
          <h2 className="font-editorial italic font-normal text-2xl text-[#D4AF37] tracking-wide">
            Focus Empire
          </h2>
          <span className="text-[10px] font-mono tracking-widest text-[#D4AF37]/70 uppercase">
            CHANNELS
          </span>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations..."
            className="w-full bg-white/5 border border-[#D4AF37]/15 focus:border-[#D4AF37]/60 rounded px-3 py-2 pl-9 text-xs text-white placeholder-neutral-500 outline-none transition"
          />
        </div>

        {/* Online Contacts Bar / Stories */}
        {activeTab === 'chats' && (
          <div className="flex items-center space-x-3 overflow-x-auto py-1 no-scrollbar">
            {otherUsers.map((u) => (
              <button
                key={u.id}
                onClick={() => onStartDirectChat(u)}
                className="flex flex-col items-center flex-shrink-0 group relative"
              >
                <div className="relative p-0.5 rounded-full border border-[#D4AF37] bg-[#111] group-hover:scale-105 transition">
                  <img
                    src={u.avatar}
                    alt={u.name}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  {u.status === 'online' && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#D4AF37] border-2 border-[#050505] rounded-full" />
                  )}
                </div>
                <span className="text-[10px] text-neutral-400 group-hover:text-[#D4AF37] truncate w-12 text-center mt-1 font-sans">
                  {u.name.split(' ')[0]}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Primary Tab Navigation */}
      <div className="flex items-center justify-around border-b border-[#D4AF37]/20 bg-[#0a0a0c] p-1.5">
        <button
          onClick={() => onChangeTab('chats')}
          className={`flex-1 flex items-center justify-center space-x-1.5 py-2 rounded text-xs font-medium transition ${
            activeTab === 'chats'
              ? 'bg-[#D4AF37]/15 text-[#D4AF37] border-b-2 border-[#D4AF37] font-semibold'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Chats</span>
        </button>

        <button
          onClick={() => onChangeTab('contacts')}
          className={`flex-1 flex items-center justify-center space-x-1.5 py-2 rounded text-xs font-medium transition ${
            activeTab === 'contacts'
              ? 'bg-[#D4AF37]/15 text-[#D4AF37] border-b-2 border-[#D4AF37] font-semibold'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Contacts</span>
        </button>

        <button
          onClick={() => onChangeTab('groups')}
          className={`flex-1 flex items-center justify-center space-x-1.5 py-2 rounded text-xs font-medium transition ${
            activeTab === 'groups'
              ? 'bg-[#D4AF37]/15 text-[#D4AF37] border-b-2 border-[#D4AF37] font-semibold'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Groups</span>
        </button>

        <button
          onClick={() => onChangeTab('settings')}
          className={`flex-1 flex items-center justify-center space-x-1.5 py-2 rounded text-xs font-medium transition ${
            activeTab === 'settings'
              ? 'bg-[#D4AF37]/15 text-[#D4AF37] border-b-2 border-[#D4AF37] font-semibold'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Settings</span>
        </button>
      </div>

      {/* Tab Content Body */}
      <div className="flex-1 overflow-y-auto">
        {/* CHATS TAB */}
        {activeTab === 'chats' && (
          <div className="divide-y divide-white/5">
            {filteredChats.length === 0 ? (
              <p className="text-center text-xs text-neutral-500 py-8 italic font-editorial">No conversations found</p>
            ) : (
              filteredChats.map((chat) => {
                const isActive = activeChatId === chat.id;
                return (
                  <div
                    key={chat.id}
                    onClick={() => onSelectChat(chat.id)}
                    className={`p-4 cursor-pointer transition flex items-start space-x-3.5 group relative ${
                      isActive
                        ? 'bg-[#D4AF37]/10 border-l-[3px] border-[#D4AF37]'
                        : 'hover:bg-white/5 opacity-80 hover:opacity-100'
                    }`}
                  >
                    {/* Chat Avatar */}
                    <div className="relative flex-shrink-0">
                      <img
                        src={chat.avatar}
                        alt={chat.name}
                        referrerPolicy="no-referrer"
                        className={`w-11 h-11 rounded-full object-cover border ${
                          isActive ? 'border-[#D4AF37]' : 'border-white/20'
                        } bg-[#111]`}
                      />
                      {chat.isGroup && (
                        <span className="absolute -bottom-1 -right-1 bg-[#D4AF37] text-black text-[9px] font-mono font-bold px-1 rounded border border-black">
                          GRP
                        </span>
                      )}
                    </div>

                    {/* Chat Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <div className="flex items-center space-x-1 truncate">
                          {chat.isPinned && <Pin className="w-3 h-3 text-[#D4AF37] fill-[#D4AF37] flex-shrink-0" />}
                          <h3 className={`text-sm font-semibold truncate ${isActive ? 'text-white' : 'text-neutral-200'}`}>
                            {chat.name}
                          </h3>
                        </div>
                        <span className="text-[10px] text-neutral-500 font-mono flex-shrink-0 ml-1">
                          {chat.lastMessageTime}
                        </span>
                      </div>

                      <div className="flex items-center justify-between mt-1">
                        <p className={`text-xs truncate pr-2 ${isActive ? 'text-[#D4AF37]' : 'text-neutral-400'}`}>
                          {chat.lastMessageType === 'voice_note' ? '🎙️ Voice note' :
                           chat.lastMessageType === 'photo' ? '📷 Photo attachment' :
                           chat.lastMessageType === 'sticker' ? '👑 Sticker' :
                           chat.lastMessage}
                        </p>
                        {chat.unreadCount > 0 && (
                          <span className="bg-[#D4AF37] text-black font-extrabold text-[10px] w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 shadow">
                            {chat.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quick Context Actions on hover */}
                    <div className="hidden group-hover:flex absolute right-2 top-2 bg-[#111111] border border-[#D4AF37]/30 rounded p-1 space-x-1 shadow-xl z-10">
                      <button
                        onClick={(e) => { e.stopPropagation(); onTogglePinChat(chat.id); }}
                        title={chat.isPinned ? "Unpin" : "Pin"}
                        className="p-1 hover:text-[#D4AF37] text-neutral-400 text-xs"
                      >
                        <Pin className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); onToggleMuteChat(chat.id); }}
                        title={chat.isMuted ? "Unmute" : "Mute"}
                        className="p-1 hover:text-[#D4AF37] text-neutral-400 text-xs"
                      >
                        {chat.isMuted ? <VolumeX className="w-3 h-3 text-red-400" /> : <Volume2 className="w-3 h-3" />}
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); onDeleteChat(chat.id); }}
                        title="Delete Chat"
                        className="p-1 hover:text-red-400 text-neutral-400 text-xs"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* CONTACTS TAB */}
        {activeTab === 'contacts' && (
          <div className="p-3 space-y-2">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-yellow-500/80 mb-2">
              Empire Network Contacts ({filteredContacts.length})
            </h4>
            {filteredContacts.map((contact) => {
              const isBlocked = blockedUserIds.includes(contact.id);
              return (
                <div
                  key={contact.id}
                  className="p-2.5 rounded-xl bg-neutral-900/80 border border-neutral-800 flex items-center justify-between hover:border-yellow-600/40 transition"
                >
                  <div
                    onClick={() => onOpenUserProfile(contact)}
                    className="flex items-center space-x-2.5 cursor-pointer flex-1 min-w-0"
                  >
                    <div className="relative">
                      <img
                        src={contact.avatar}
                        alt={contact.name}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-full object-cover border border-yellow-500/30"
                      />
                      <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-black ${
                        contact.status === 'online' ? 'bg-emerald-500' : 'bg-neutral-600'
                      }`} />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-white truncate">{contact.name}</h4>
                      <p className="text-[10px] text-yellow-400/80 truncate">{contact.handle}</p>
                      <p className="text-[10px] text-neutral-400 truncate">{contact.statusMessage}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1.5 ml-2">
                    {isBlocked ? (
                      <button
                        onClick={() => onUnblockUser(contact.id)}
                        className="px-2 py-1 rounded bg-red-950 border border-red-500/40 text-[10px] font-bold text-red-400 hover:bg-red-900 transition"
                      >
                        Unblock
                      </button>
                    ) : (
                      <button
                        onClick={() => onStartDirectChat(contact)}
                        className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-yellow-600 to-amber-600 text-black text-xs font-bold hover:from-yellow-500 hover:to-amber-500 transition shadow-sm"
                      >
                        Message
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* GROUPS TAB */}
        {activeTab === 'groups' && (
          <div className="p-3 space-y-3">
            <button
              onClick={onCreateGroupClick}
              className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-yellow-600 via-amber-500 to-yellow-600 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg shadow-yellow-500/20 hover:brightness-110 transition active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Empire Group</span>
            </button>

            <div className="space-y-2 pt-2">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-yellow-500/80 mb-2">
                Active Group Channels ({groupChats.length})
              </h4>
              {groupChats.map((group) => (
                <div
                  key={group.id}
                  onClick={() => onSelectChat(group.id)}
                  className="p-3 rounded-xl bg-neutral-900/80 border border-neutral-800 hover:border-yellow-500/50 cursor-pointer transition flex items-center space-x-3"
                >
                  <img
                    src={group.avatar}
                    alt={group.name}
                    referrerPolicy="no-referrer"
                    className="w-11 h-11 rounded-full object-cover border border-yellow-500/40"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-white truncate">{group.name}</h4>
                    <p className="text-[10px] text-neutral-400 truncate">{group.description}</p>
                    <span className="text-[9px] text-yellow-400/90 font-bold uppercase tracking-wider">
                      {group.participantIds.length} Members
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="p-4 space-y-5">
            {/* Edit Profile Form */}
            <form onSubmit={handleSaveProfile} className="space-y-3 bg-neutral-900/80 border border-yellow-600/30 p-3.5 rounded-2xl">
              <div className="flex items-center space-x-3 pb-2 border-b border-neutral-800">
                <img
                  src={editingAvatar}
                  alt="Profile"
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-full object-cover border-2 border-yellow-400"
                />
                <div>
                  <h3 className="text-xs font-bold text-white">{currentUser.name}</h3>
                  <p className="text-[10px] text-yellow-400">{currentUser.handle}</p>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-yellow-500/90 mb-1">
                  Display Name
                </label>
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-yellow-500 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-yellow-500/90 mb-1">
                  Handle (@username)
                </label>
                <input
                  type="text"
                  value={editingHandle}
                  onChange={(e) => setEditingHandle(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-yellow-500 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-yellow-500/90 mb-1">
                  About / Status Quote
                </label>
                <input
                  type="text"
                  value={editingStatus}
                  onChange={(e) => setEditingStatus(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-yellow-500 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-yellow-500/90 mb-1">
                  Avatar Image URL
                </label>
                <input
                  type="text"
                  value={editingAvatar}
                  onChange={(e) => setEditingAvatar(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-yellow-500 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-gradient-to-r from-yellow-600 to-amber-600 text-black text-xs font-extrabold rounded-lg hover:from-yellow-500 hover:to-amber-500 transition shadow-md flex items-center justify-center space-x-1"
              >
                {savedSuccess ? <CheckCircle2 className="w-4 h-4 text-emerald-950" /> : null}
                <span>{savedSuccess ? 'Profile Saved!' : 'Save Changes'}</span>
              </button>
            </form>

            {/* Theme Settings */}
            <div className="bg-neutral-900/80 border border-neutral-800 p-3.5 rounded-2xl space-y-2">
              <h4 className="text-[11px] font-bold text-yellow-400 flex items-center space-x-1.5">
                <Moon className="w-3.5 h-3.5 text-yellow-400" />
                <span>App Theme Presets</span>
              </h4>
              <div className="grid grid-cols-3 gap-2 pt-1">
                <button
                  onClick={() => onChangeTheme('gold_empire')}
                  className={`p-2 rounded-lg text-[10px] font-bold border text-center transition ${
                    currentTheme === 'gold_empire'
                      ? 'border-yellow-400 bg-yellow-500/20 text-yellow-300'
                      : 'border-neutral-800 text-neutral-400'
                  }`}
                >
                  Gold Empire
                </button>
                <button
                  onClick={() => onChangeTheme('midnight_obsidian')}
                  className={`p-2 rounded-lg text-[10px] font-bold border text-center transition ${
                    currentTheme === 'midnight_obsidian'
                      ? 'border-yellow-400 bg-yellow-500/20 text-yellow-300'
                      : 'border-neutral-800 text-neutral-400'
                  }`}
                >
                  Obsidian
                </button>
                <button
                  onClick={() => onChangeTheme('cyber_gold')}
                  className={`p-2 rounded-lg text-[10px] font-bold border text-center transition ${
                    currentTheme === 'cyber_gold'
                      ? 'border-yellow-400 bg-yellow-500/20 text-yellow-300'
                      : 'border-neutral-800 text-neutral-400'
                  }`}
                >
                  Cyber Gold
                </button>
              </div>
            </div>

            {/* Privacy & Blocked Users */}
            <div className="bg-neutral-900/80 border border-neutral-800 p-3.5 rounded-2xl space-y-2">
              <h4 className="text-[11px] font-bold text-yellow-400 flex items-center space-x-1.5">
                <Lock className="w-3.5 h-3.5 text-yellow-400" />
                <span>Privacy & Security</span>
              </h4>

              <div className="flex items-center justify-between py-1 border-b border-neutral-800 text-xs">
                <span className="text-neutral-300">Push Notifications</span>
                <button
                  onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                  className={`w-9 h-5 rounded-full flex items-center p-0.5 transition ${
                    notificationsEnabled ? 'bg-yellow-500 justify-end' : 'bg-neutral-800 justify-start'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-black shadow-md" />
                </button>
              </div>

              <div className="pt-1">
                <p className="text-[10px] text-neutral-400 font-medium mb-1">
                  Blocked Accounts ({blockedUserIds.length}):
                </p>
                {blockedUserIds.length === 0 ? (
                  <p className="text-[10px] text-neutral-600 italic">No blocked users</p>
                ) : (
                  blockedUserIds.map((id) => {
                    const u = users.find(x => x.id === id);
                    return (
                      <div key={id} className="flex items-center justify-between text-xs py-1">
                        <span className="text-neutral-300 font-medium">{u ? u.name : id}</span>
                        <button
                          onClick={() => onUnblockUser(id)}
                          className="text-[10px] text-red-400 hover:underline"
                        >
                          Unblock
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Empire Version Info */}
            <div className="text-center text-[10px] text-neutral-500 py-2">
              <p className="font-bold text-yellow-500/70">FOCUS CHAT v2.5.0</p>
              <p>© FOCUS EMPIRE. All rights reserved.</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
