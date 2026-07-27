import { User, Chat, Message, NotificationItem } from '../types';
import { INITIAL_CHATS, INITIAL_MESSAGES, INITIAL_USERS, CURRENT_USER } from '../data/mockData';

const STORAGE_KEYS = {
  CURRENT_USER: 'focus_chat_current_user',
  USERS: 'focus_chat_users',
  CHATS: 'focus_chat_chats',
  MESSAGES: 'focus_chat_messages',
  BLOCKED_USERS: 'focus_chat_blocked_users',
  NOTIFICATIONS: 'focus_chat_notifications',
  THEME: 'focus_chat_theme'
};

export function getStoredCurrentUser(): User {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load stored user', e);
  }
  return CURRENT_USER;
}

export function setStoredCurrentUser(user: User): void {
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
}

export function getStoredUsers(): User[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load stored users', e);
  }
  return INITIAL_USERS;
}

export function setStoredUsers(users: User[]): void {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
}

export function getStoredChats(): Chat[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CHATS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load stored chats', e);
  }
  return INITIAL_CHATS;
}

export function setStoredChats(chats: Chat[]): void {
  localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(chats));
}

export function getStoredMessages(): Record<string, Message[]> {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load stored messages', e);
  }
  return INITIAL_MESSAGES;
}

export function setStoredMessages(messages: Record<string, Message[]>): void {
  localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
}

export function getStoredBlockedUserIds(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BLOCKED_USERS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load stored blocked users', e);
  }
  return [];
}

export function setStoredBlockedUserIds(ids: string[]): void {
  localStorage.setItem(STORAGE_KEYS.BLOCKED_USERS, JSON.stringify(ids));
}

export function getStoredNotifications(): NotificationItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load notifications', e);
  }
  return [
    {
      id: 'notif_1',
      title: '👑 Focus Empire Board',
      body: 'Marcus Thorne updated security keys',
      timestamp: '10:42 AM',
      read: false,
      chatId: 'chat_group_board'
    }
  ];
}

export function setStoredNotifications(notifs: NotificationItem[]): void {
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
}
