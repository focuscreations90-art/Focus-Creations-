/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { User, Chat, Message, ActiveTab, ThemeOption, NotificationItem, ReportModalData } from './types';
import {
  getStoredCurrentUser,
  setStoredCurrentUser,
  getStoredUsers,
  setStoredUsers,
  getStoredChats,
  setStoredChats,
  getStoredMessages,
  setStoredMessages,
  getStoredBlockedUserIds,
  setStoredBlockedUserIds,
  getStoredNotifications,
  setStoredNotifications
} from './utils/storage';
import { GoldHeader } from './components/GoldHeader';
import { AuthScreen } from './components/AuthScreen';
import { Sidebar } from './components/Sidebar';
import { ChatWindow } from './components/ChatWindow';
import { CameraCaptureModal } from './components/CameraCaptureModal';
import { VideoCallModal } from './components/VideoCallModal';
import { ReportModal } from './components/ReportModal';
import { CreateGroupModal } from './components/CreateGroupModal';
import { ProfileModal } from './components/ProfileModal';

export default function App() {
  // Authentication State
  const [currentUser, setCurrentUser] = useState<User>(getStoredCurrentUser());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  // Core Data Collections
  const [users, setUsers] = useState<User[]>(getStoredUsers());
  const [chats, setChats] = useState<Chat[]>(getStoredChats());
  const [messages, setMessages] = useState<Record<string, Message[]>>(getStoredMessages());
  const [blockedUserIds, setBlockedUserIds] = useState<string[]>(getStoredBlockedUserIds());
  const [notifications, setNotifications] = useState<NotificationItem[]>(getStoredNotifications());

  // UI Navigation & View Modes
  const [activeChatId, setActiveChatId] = useState<string | null>('chat_group_board');
  const [activeTab, setActiveTab] = useState<ActiveTab>('chats');
  const [currentTheme, setCurrentTheme] = useState<ThemeOption>('gold_empire');
  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(false);

  // Modals & Overlays State
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);
  const [callType, setCallType] = useState<'audio' | 'video'>('audio');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileModalUser, setProfileModalUser] = useState<User | null>(null);
  const [profileModalChat, setProfileModalChat] = useState<Chat | null>(null);
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [reportModalData, setReportModalData] = useState<ReportModalData | null>(null);

  // Persist Changes
  useEffect(() => {
    setStoredCurrentUser(currentUser);
  }, [currentUser]);

  useEffect(() => {
    setStoredUsers(users);
  }, [users]);

  useEffect(() => {
    setStoredChats(chats);
  }, [chats]);

  useEffect(() => {
    setStoredMessages(messages);
  }, [messages]);

  useEffect(() => {
    setStoredBlockedUserIds(blockedUserIds);
  }, [blockedUserIds]);

  useEffect(() => {
    setStoredNotifications(notifications);
  }, [notifications]);

  // Auth Handlers
  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    // Add user to users list if missing
    if (!users.some(u => u.id === user.id)) {
      setUsers(prev => [user, ...prev]);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  // Chat Selection
  const handleSelectChat = (chatId: string) => {
    setActiveChatId(chatId);
    // Mark chat unread count as 0
    setChats(prev => prev.map(c => c.id === chatId ? { ...c, unreadCount: 0 } : c));
  };

  // Start Direct Chat with Contact
  const handleStartDirectChat = (targetUser: User) => {
    const existing = chats.find(c => !c.isGroup && c.participantIds.includes(targetUser.id));
    if (existing) {
      setActiveChatId(existing.id);
      setActiveTab('chats');
    } else {
      const newChat: Chat = {
        id: 'chat_direct_' + Date.now(),
        name: targetUser.name,
        isGroup: false,
        avatar: targetUser.avatar,
        unreadCount: 0,
        lastMessage: 'Conversation initialized',
        lastMessageType: 'text',
        lastMessageTime: 'Just now',
        participantIds: [currentUser.id, targetUser.id]
      };
      setChats(prev => [newChat, ...prev]);
      setMessages(prev => ({ ...prev, [newChat.id]: [] }));
      setActiveChatId(newChat.id);
      setActiveTab('chats');
    }
  };

  // Send Message Handler
  const handleSendMessage = (
    content: string,
    type: Message['type'],
    mediaUrl?: string,
    mediaName?: string,
    durationSeconds?: number,
    replyToId?: string
  ) => {
    if (!activeChatId) return;

    let replyToText: string | undefined;
    if (replyToId) {
      const chatMsgs = messages[activeChatId] || [];
      const replyMsg = chatMsgs.find(m => m.id === replyToId);
      if (replyMsg) replyToText = `${replyMsg.senderName}: ${replyMsg.content}`;
    }

    const newMsg: Message = {
      id: 'msg_' + Date.now(),
      chatId: activeChatId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      content,
      type,
      mediaUrl,
      mediaName,
      durationSeconds,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
      replyToId,
      replyToText
    };

    // Update messages
    setMessages(prev => ({
      ...prev,
      [activeChatId]: [...(prev[activeChatId] || []), newMsg]
    }));

    // Update chat preview
    setChats(prev => prev.map(c => {
      if (c.id === activeChatId) {
        return {
          ...c,
          lastMessage: type === 'voice_note' ? '🎙️ Voice note' : type === 'photo' ? '📷 Photo' : content,
          lastMessageType: type,
          lastMessageTime: 'Just now'
        };
      }
      return c;
    }));

    // Trigger auto reply simulation for 1-on-1 direct chats
    const currentChat = chats.find(c => c.id === activeChatId);
    if (currentChat && !currentChat.isGroup) {
      const otherId = currentChat.participantIds.find(id => id !== currentUser.id);
      const otherUser = users.find(u => u.id === otherId);
      if (otherUser) {
        setTimeout(() => {
          const autoReplyMsg: Message = {
            id: 'msg_reply_' + Date.now(),
            chatId: activeChatId,
            senderId: otherUser.id,
            senderName: otherUser.name,
            senderAvatar: otherUser.avatar,
            content: `Received on Focus Chat mesh! Let's handle this immediately 👑`,
            type: 'text',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'read'
          };

          setMessages(prev => ({
            ...prev,
            [activeChatId]: [...(prev[activeChatId] || []), autoReplyMsg]
          }));

          // Send push notification toast
          const newNotif: NotificationItem = {
            id: 'notif_' + Date.now(),
            title: `💬 ${otherUser.name}`,
            body: autoReplyMsg.content,
            timestamp: autoReplyMsg.timestamp,
            read: false,
            chatId: activeChatId
          };
          setNotifications(prev => [newNotif, ...prev]);
        }, 1500);
      }
    }
  };

  // Add Emoji Reaction to Message
  const handleAddReaction = (messageId: string, emoji: string) => {
    if (!activeChatId) return;

    setMessages(prev => {
      const chatMsgs = prev[activeChatId] || [];
      const updated = chatMsgs.map(m => {
        if (m.id === messageId) {
          const reactions = m.reactions || [];
          const existingReaction = reactions.find(r => r.emoji === emoji);
          let newReactions;

          if (existingReaction) {
            if (existingReaction.userIds.includes(currentUser.id)) {
              newReactions = reactions.map(r =>
                r.emoji === emoji
                  ? { ...r, userIds: r.userIds.filter(id => id !== currentUser.id) }
                  : r
              ).filter(r => r.userIds.length > 0);
            } else {
              newReactions = reactions.map(r =>
                r.emoji === emoji
                  ? { ...r, userIds: [...r.userIds, currentUser.id] }
                  : r
              );
            }
          } else {
            newReactions = [...reactions, { emoji, userIds: [currentUser.id] }];
          }

          return { ...m, reactions: newReactions };
        }
        return m;
      });

      return { ...prev, [activeChatId]: updated };
    });
  };

  // Handle Create Group
  const handleCreateGroup = (newGroup: Chat) => {
    setChats(prev => [newGroup, ...prev]);
    setMessages(prev => ({ ...prev, [newGroup.id]: [] }));
    setActiveChatId(newGroup.id);
    setActiveTab('chats');
  };

  // Profile Edit
  const handleUpdateProfile = (updated: Partial<User>) => {
    const newUserData = { ...currentUser, ...updated };
    setCurrentUser(newUserData);
    setUsers(prev => prev.map(u => u.id === currentUser.id ? newUserData : u));
  };

  // Toggle Block User
  const handleToggleBlockUser = (userId: string) => {
    if (blockedUserIds.includes(userId)) {
      setBlockedUserIds(prev => prev.filter(id => id !== userId));
    } else {
      setBlockedUserIds(prev => [...prev, userId]);
    }
  };

  // Report User/Group
  const handleReportSubmit = (data: ReportModalData, reason: string, comment: string) => {
    console.log('Report submitted', data, reason, comment);
  };

  // Toggle Pin Chat
  const handleTogglePinChat = (chatId: string) => {
    setChats(prev => prev.map(c => c.id === chatId ? { ...c, isPinned: !c.isPinned } : c));
  };

  // Toggle Mute Chat
  const handleToggleMuteChat = (chatId: string) => {
    setChats(prev => prev.map(c => c.id === chatId ? { ...c, isMuted: !c.isMuted } : c));
  };

  // Delete Chat
  const handleDeleteChat = (chatId: string) => {
    setChats(prev => prev.filter(c => c.id !== chatId));
    if (activeChatId === chatId) {
      setActiveChatId(null);
    }
  };

  // Notification actions
  const handleMarkNotifRead = (notifId: string) => {
    setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, read: true } : n));
  };

  const handleClearNotifications = () => {
    setNotifications([]);
  };

  // Find Active Chat object
  const activeChat = chats.find(c => c.id === activeChatId) || null;
  const activeChatMessages = activeChatId ? (messages[activeChatId] || []) : [];

  // Determine Call Target User
  const callTargetUser = activeChat && !activeChat.isGroup
    ? users.find(u => u.id === activeChat.participantIds.find(id => id !== currentUser.id))
    : users.find(u => u.id === 'usr_sarah');

  if (!isAuthenticated) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  return (
    <div className="h-screen w-screen bg-black text-white flex flex-col overflow-hidden font-sans select-none">
      {/* Top Header Navigation */}
      <GoldHeader
        currentUser={currentUser}
        notifications={notifications}
        onMarkNotificationRead={handleMarkNotifRead}
        onClearNotifications={handleClearNotifications}
        onSelectNotifChat={handleSelectChat}
        isMobileFrame={isMobileFrame}
        onToggleMobileFrame={() => setIsMobileFrame(!isMobileFrame)}
        onLogout={handleLogout}
        onOpenProfile={() => {
          setProfileModalUser(currentUser);
          setProfileModalChat(null);
          setShowProfileModal(true);
        }}
      />

      {/* Main Container Layout */}
      <div className="flex-1 flex justify-center overflow-hidden relative bg-neutral-950">
        <div className={`flex w-full h-full transition-all duration-300 ${
          isMobileFrame
            ? 'max-w-[420px] my-2 border-2 border-yellow-500/40 rounded-3xl overflow-hidden shadow-2xl shadow-yellow-500/20'
            : 'max-w-full'
        }`}>
          {/* Left Sidebar */}
          <div className={`${
            activeChatId && isMobileFrame ? 'hidden md:flex' : 'flex'
          } w-full md:w-80 lg:w-96 flex-shrink-0 h-full`}>
            <Sidebar
              currentUser={currentUser}
              chats={chats}
              users={users}
              activeChatId={activeChatId}
              activeTab={activeTab}
              onChangeTab={setActiveTab}
              onSelectChat={handleSelectChat}
              onStartDirectChat={handleStartDirectChat}
              onCreateGroupClick={() => setShowCreateGroupModal(true)}
              onUpdateProfile={handleUpdateProfile}
              blockedUserIds={blockedUserIds}
              onUnblockUser={handleToggleBlockUser}
              onTogglePinChat={handleTogglePinChat}
              onToggleMuteChat={handleToggleMuteChat}
              onDeleteChat={handleDeleteChat}
              currentTheme={currentTheme}
              onChangeTheme={setCurrentTheme}
              onOpenUserProfile={(u) => {
                setProfileModalUser(u);
                setProfileModalChat(null);
                setShowProfileModal(true);
              }}
            />
          </div>

          {/* Right Main Chat Window */}
          <div className={`${
            !activeChatId && isMobileFrame ? 'hidden md:flex' : 'flex'
            } flex-1 h-full min-w-0`}>
            <ChatWindow
              currentUser={currentUser}
              chat={activeChat}
              messages={activeChatMessages}
              users={users}
              onSendMessage={handleSendMessage}
              onAddReaction={handleAddReaction}
              onStartCall={(type) => {
                setCallType(type);
                setShowCallModal(true);
              }}
              onOpenProfile={() => {
                if (activeChat) {
                  if (activeChat.isGroup) {
                    setProfileModalChat(activeChat);
                    setProfileModalUser(null);
                  } else {
                    const otherId = activeChat.participantIds.find(id => id !== currentUser.id);
                    const otherUser = users.find(u => u.id === otherId);
                    setProfileModalUser(otherUser || null);
                    setProfileModalChat(null);
                  }
                  setShowProfileModal(true);
                }
              }}
              onOpenCamera={() => setShowCameraModal(true)}
              onOpenReport={(targetId, targetName, targetType) => {
                setReportModalData({ targetId, targetName, targetType });
              }}
            />
          </div>
        </div>
      </div>

      {/* Camera Capture Modal */}
      <CameraCaptureModal
        isOpen={showCameraModal}
        onClose={() => setShowCameraModal(false)}
        onCapture={(dataUrl, name) => {
          handleSendMessage('Captured photo', 'photo', dataUrl, name);
        }}
      />

      {/* Video / Audio Call Simulation Modal */}
      <VideoCallModal
        isOpen={showCallModal}
        onClose={() => setShowCallModal(false)}
        targetUser={callTargetUser}
        callType={callType}
      />

      {/* User / Group Profile Details Modal */}
      <ProfileModal
        user={profileModalUser}
        chat={profileModalChat}
        messages={activeChatMessages}
        onClose={() => setShowProfileModal(false)}
        onStartChat={handleStartDirectChat}
        onStartCall={(type) => {
          setCallType(type);
          setShowCallModal(true);
        }}
        isBlocked={profileModalUser ? blockedUserIds.includes(profileModalUser.id) : false}
        onToggleBlock={handleToggleBlockUser}
        onOpenReport={(targetId, targetName, targetType) => {
          setReportModalData({ targetId, targetName, targetType });
        }}
      />

      {/* Create Group Modal */}
      <CreateGroupModal
        isOpen={showCreateGroupModal}
        onClose={() => setShowCreateGroupModal(false)}
        currentUser={currentUser}
        users={users}
        onCreateGroup={handleCreateGroup}
      />

      {/* Report Modal */}
      <ReportModal
        data={reportModalData}
        onClose={() => setReportModalData(null)}
        onSubmitReport={handleReportSubmit}
      />
    </div>
  );
}
