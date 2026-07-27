import { User, Chat, Message, Sticker } from '../types';

export const CURRENT_USER: User = {
  id: 'usr_me',
  name: 'Empire Boss',
  handle: '@empire_boss',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
  statusMessage: '👑 Building the FOCUS EMPIRE | Private Access Only',
  status: 'online',
  email: 'focusentertainment710@gmail.com',
  phone: '+1 (555) 019-2831',
  role: 'Empire Founder & CEO'
};

export const INITIAL_USERS: User[] = [
  CURRENT_USER,
  {
    id: 'usr_sarah',
    name: 'Sarah Vance',
    handle: '@sarah_creative',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400',
    statusMessage: '✨ Creative Director @ Focus Empire',
    status: 'online',
    lastSeen: 'Just now',
    email: 'sarah.vance@focusempire.com',
    role: 'Creative Director'
  },
  {
    id: 'usr_marcus',
    name: 'Marcus Thorne',
    handle: '@marcus_tech',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    statusMessage: '⚡ Lead Systems Architect | Encrypted Communications',
    status: 'online',
    lastSeen: '2m ago',
    email: 'marcus.t@focusempire.com',
    role: 'Head of Tech'
  },
  {
    id: 'usr_elena',
    name: 'Elena Rostova',
    handle: '@elena_vip',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=400',
    statusMessage: '💎 International Relations & VIP Growth',
    status: 'away',
    lastSeen: '15m ago',
    email: 'elena@focusempire.com',
    role: 'VIP Executive'
  },
  {
    id: 'usr_alex',
    name: 'Alex Rivera',
    handle: '@alex_prod',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
    statusMessage: '🚀 Media Production & Global Streaming',
    status: 'offline',
    lastSeen: '1h ago',
    email: 'alex.r@focusempire.com',
    role: 'Production Lead'
  }
];

export const INITIAL_CHATS: Chat[] = [
  {
    id: 'chat_group_board',
    name: '👑 FOCUS EMPIRE Executive Board',
    isGroup: true,
    avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=400',
    unreadCount: 2,
    lastMessage: 'Marcus: New encryption keys updated across all channels.',
    lastMessageType: 'text',
    lastMessageTime: '10:42 AM',
    participantIds: ['usr_me', 'usr_sarah', 'usr_marcus', 'usr_elena', 'usr_alex'],
    description: 'Top secret executive board channel for FOCUS EMPIRE leadership.',
    createdBy: 'usr_me',
    isPinned: true
  },
  {
    id: 'chat_sarah',
    name: 'Sarah Vance',
    isGroup: false,
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400',
    unreadCount: 0,
    lastMessage: 'Here are the new Black & Gold UI concepts for the main launch!',
    lastMessageType: 'photo',
    lastMessageTime: '10:35 AM',
    participantIds: ['usr_me', 'usr_sarah'],
    isPinned: true
  },
  {
    id: 'chat_marcus',
    name: 'Marcus Thorne',
    isGroup: false,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    unreadCount: 1,
    lastMessage: '🎙️ Audio message (0:14)',
    lastMessageType: 'voice_note',
    lastMessageTime: '09:18 AM',
    participantIds: ['usr_me', 'usr_marcus']
  },
  {
    id: 'chat_group_vip',
    name: '🏆 VIP Gold Club London',
    isGroup: true,
    avatar: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&q=80&w=400',
    unreadCount: 0,
    lastMessage: 'Elena: Private lounge reservations confirmed for Friday night.',
    lastMessageType: 'text',
    lastMessageTime: 'Yesterday',
    participantIds: ['usr_me', 'usr_elena', 'usr_sarah'],
    description: 'Exclusive networking group for VIP Focus Empire partners.'
  },
  {
    id: 'chat_elena',
    name: 'Elena Rostova',
    isGroup: false,
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=400',
    unreadCount: 0,
    lastMessage: 'Sent you the signed agreement documents.',
    lastMessageType: 'text',
    lastMessageTime: 'Yesterday',
    participantIds: ['usr_me', 'usr_elena']
  }
];

export const INITIAL_MESSAGES: Record<string, Message[]> = {
  chat_group_board: [
    {
      id: 'msg_b1',
      chatId: 'chat_group_board',
      senderId: 'usr_sarah',
      senderName: 'Sarah Vance',
      senderAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400',
      content: 'Good morning team! Everything is set for today’s app showcase.',
      type: 'text',
      timestamp: '10:20 AM',
      status: 'read'
    },
    {
      id: 'msg_b2',
      chatId: 'chat_group_board',
      senderId: 'usr_me',
      senderName: 'Empire Boss',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
      content: 'Excellent work Sarah. Make sure the Black & Gold aesthetic remains unmatched.',
      type: 'text',
      timestamp: '10:25 AM',
      status: 'read',
      reactions: [{ emoji: '👑', userIds: ['usr_sarah', 'usr_marcus'] }, { emoji: '🔥', userIds: ['usr_elena'] }]
    },
    {
      id: 'msg_b3',
      chatId: 'chat_group_board',
      senderId: 'usr_marcus',
      senderName: 'Marcus Thorne',
      senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
      content: 'New encryption keys updated across all channels. High security protocol active.',
      type: 'text',
      timestamp: '10:42 AM',
      status: 'read',
      reactions: [{ emoji: '⚡', userIds: ['usr_me'] }]
    }
  ],

  chat_sarah: [
    {
      id: 'msg_s1',
      chatId: 'chat_sarah',
      senderId: 'usr_sarah',
      senderName: 'Sarah Vance',
      senderAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400',
      content: 'Hey Boss! Here is the custom design showcase for FOCUS CHAT.',
      type: 'text',
      timestamp: '10:30 AM',
      status: 'read'
    },
    {
      id: 'msg_s2',
      chatId: 'chat_sarah',
      senderId: 'usr_sarah',
      senderName: 'Sarah Vance',
      senderAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400',
      content: 'Here are the new Black & Gold UI concepts for the main launch!',
      type: 'photo',
      mediaUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1000',
      mediaName: 'focus_chat_gold_concept.jpg',
      timestamp: '10:35 AM',
      status: 'read',
      reactions: [{ emoji: '🔥', userIds: ['usr_me'] }]
    }
  ],

  chat_marcus: [
    {
      id: 'msg_m1',
      chatId: 'chat_marcus',
      senderId: 'usr_marcus',
      senderName: 'Marcus Thorne',
      senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
      content: 'Boss, listen to this quick audio update regarding server readiness.',
      type: 'text',
      timestamp: '09:15 AM',
      status: 'read'
    },
    {
      id: 'msg_m2',
      chatId: 'chat_marcus',
      senderId: 'usr_marcus',
      senderName: 'Marcus Thorne',
      senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
      content: 'Voice note update',
      type: 'voice_note',
      mediaUrl: 'https://actions.google.com/sounds/v1/ambiences/rain_heavy.ogg', // Sample audio file for preview
      durationSeconds: 14,
      timestamp: '09:18 AM',
      status: 'delivered'
    }
  ],

  chat_group_vip: [
    {
      id: 'msg_v1',
      chatId: 'chat_group_vip',
      senderId: 'usr_elena',
      senderName: 'Elena Rostova',
      senderAvatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=400',
      content: 'Private lounge reservations confirmed for Friday night.',
      type: 'text',
      timestamp: 'Yesterday',
      status: 'read'
    }
  ],

  chat_elena: [
    {
      id: 'msg_e1',
      chatId: 'chat_elena',
      senderId: 'usr_elena',
      senderName: 'Elena Rostova',
      senderAvatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=400',
      content: 'Sent you the signed agreement documents.',
      type: 'text',
      timestamp: 'Yesterday',
      status: 'read'
    }
  ]
};

export const GOLD_STICKERS: Sticker[] = [
  {
    id: 'stk_1',
    name: 'Empire Crown',
    category: 'gold_luxury',
    url: '👑'
  },
  {
    id: 'stk_2',
    name: 'Gold Diamond',
    category: 'gold_luxury',
    url: '💎'
  },
  {
    id: 'stk_3',
    name: 'Gold Lion',
    category: 'empire_badging',
    url: '🦁'
  },
  {
    id: 'stk_4',
    name: 'Top Dollar',
    category: 'crypto_gold',
    url: '💰'
  },
  {
    id: 'stk_5',
    name: 'Pure Fire',
    category: 'expressive',
    url: '🔥'
  },
  {
    id: 'stk_6',
    name: 'VIP Star',
    category: 'gold_luxury',
    url: '⭐'
  },
  {
    id: 'stk_7',
    name: 'Champagne Toast',
    category: 'gold_luxury',
    url: '🥂'
  },
  {
    id: 'stk_8',
    name: 'Lightning Deal',
    category: 'expressive',
    url: '⚡'
  }
];

export const POPULAR_EMOJIS = [
  '👑', '🔥', '💎', '💰', '👍', '❤️', '😂', '🦁', '⭐', '⚡', '🎉', '🥂',
  '😎', '🚀', '💯', '🙏', '🔒', '💼', '🏆', '👀', '✨', '🤝', '🎯', '📍'
];
