import React, { useState } from 'react';
import { User, Chat } from '../types';
import { Users, X, Shield, Plus, Check } from 'lucide-react';

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  users: User[];
  onCreateGroup: (newGroup: Chat) => void;
}

export const CreateGroupModal: React.FC<CreateGroupModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  users,
  onCreateGroup
}) => {
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(
    'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&q=80&w=400'
  );
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([currentUser.id]);

  if (!isOpen) return null;

  const groupAvatarOptions = [
    'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=400'
  ];

  const otherUsers = users.filter(u => u.id !== currentUser.id);

  const toggleUserSelection = (userId: string) => {
    if (selectedUserIds.includes(userId)) {
      setSelectedUserIds(selectedUserIds.filter(id => id !== userId));
    } else {
      setSelectedUserIds([...selectedUserIds, userId]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim()) return;

    const newGroup: Chat = {
      id: 'chat_group_' + Date.now(),
      name: groupName,
      isGroup: true,
      avatar: selectedAvatar,
      unreadCount: 0,
      lastMessage: `${currentUser.name} created the group "${groupName}"`,
      lastMessageType: 'text',
      lastMessageTime: 'Just now',
      participantIds: selectedUserIds,
      description: description || 'Empire Group Channel',
      createdBy: currentUser.id
    };

    onCreateGroup(newGroup);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="bg-neutral-900 border border-yellow-500/40 rounded-2xl w-full max-w-md p-5 shadow-2xl shadow-yellow-500/20">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-neutral-800">
          <div className="flex items-center space-x-2 text-yellow-400 font-bold text-sm">
            <Shield className="w-5 h-5 text-yellow-400" />
            <span>Create Empire Group</span>
          </div>
          <button onClick={onClose} className="p-1 rounded text-neutral-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold uppercase text-yellow-500/90 mb-1">
              Group Channel Name
            </label>
            <input
              type="text"
              required
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="e.g. 🏆 Empire VIP Board"
              className="w-full bg-neutral-950 border border-neutral-800 focus:border-yellow-500 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-600 outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-yellow-500/90 mb-1">
              Group Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Executive discussions & strategic ops"
              className="w-full bg-neutral-950 border border-neutral-800 focus:border-yellow-500 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-600 outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-yellow-500/90 mb-1">
              Choose Group Avatar
            </label>
            <div className="flex space-x-2">
              {groupAvatarOptions.map((url, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedAvatar(url)}
                  className={`w-10 h-10 rounded-full overflow-hidden border-2 transition ${
                    selectedAvatar === url ? 'border-yellow-400 scale-105' : 'border-neutral-800 opacity-60'
                  }`}
                >
                  <img src={url} alt="Group Avatar" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-yellow-500/90 mb-1.5">
              Add Group Members ({selectedUserIds.length - 1} selected)
            </label>
            <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
              {otherUsers.map((u) => {
                const isSelected = selectedUserIds.includes(u.id);
                return (
                  <div
                    key={u.id}
                    onClick={() => toggleUserSelection(u.id)}
                    className={`p-2 rounded-xl border flex items-center justify-between cursor-pointer text-xs transition ${
                      isSelected
                        ? 'bg-yellow-500/15 border-yellow-500 text-white'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <img src={u.avatar} alt={u.name} referrerPolicy="no-referrer" className="w-7 h-7 rounded-full object-cover" />
                      <div>
                        <p className="font-bold text-xs">{u.name}</p>
                        <p className="text-[10px] text-yellow-400/80">{u.handle}</p>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                      isSelected ? 'bg-yellow-400 border-yellow-400 text-black' : 'border-neutral-700'
                    }`}>
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-white text-xs font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-600 text-black font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-yellow-500/20"
            >
              Create Group
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
