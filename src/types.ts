export type MessageType = 'text' | 'photo' | 'video' | 'voice_note' | 'sticker';
export type MessageStatus = 'sent' | 'delivered' | 'read';
export type UserStatus = 'online' | 'offline' | 'busy' | 'away';

export interface User {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  statusMessage: string;
  status: UserStatus;
  lastSeen?: string;
  email?: string;
  phone?: string;
  role?: string;
  isBlocked?: boolean;
  isReported?: boolean;
}

export interface MessageReaction {
  emoji: string;
  userIds: string[];
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  type: MessageType;
  mediaUrl?: string;
  mediaName?: string;
  durationSeconds?: number;
  timestamp: string;
  status: MessageStatus;
  reactions?: MessageReaction[];
  replyToId?: string;
  replyToText?: string;
}

export interface Chat {
  id: string;
  name: string;
  isGroup: boolean;
  avatar: string;
  unreadCount: number;
  lastMessage?: string;
  lastMessageType?: MessageType;
  lastMessageTime: string;
  participantIds: string[];
  description?: string;
  createdBy?: string;
  isMuted?: boolean;
  isPinned?: boolean;
  customWallpaper?: string;
}

export interface Sticker {
  id: string;
  name: string;
  category: 'gold_luxury' | 'empire_badging' | 'expressive' | 'crypto_gold';
  url: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  timestamp: string;
  read: boolean;
  chatId?: string;
  avatar?: string;
}

export interface ReportModalData {
  targetId: string;
  targetName: string;
  targetType: 'user' | 'group' | 'message';
}

export type ActiveTab = 'chats' | 'contacts' | 'groups' | 'settings';
export type ThemeOption = 'gold_empire' | 'midnight_obsidian' | 'cyber_gold';
