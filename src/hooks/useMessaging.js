import { useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { useMessagingStore } from "../store/messagingStore";
import { socketManager } from "../utils/socketManager";
import { SOCKET_EVENTS } from "../constants/messagingConstants";

export const useMessaging = () => {
  const { token, user } = useAuthStore();
  const store = useMessagingStore();
  const handleNewMessage = store.handleNewMessage;
  const handleTypingIndicator = store.handleTypingIndicator;
  const handlePresenceUpdate = store.handlePresenceUpdate;
  const handleMessageRead = store.handleMessageRead;
  const handleRequestAccepted = store.handleRequestAccepted;
  const handleRequestDeclined = store.handleRequestDeclined;

  useEffect(() => {
    if (!user?.id) return undefined;
    const socket = socketManager.connect(token);
    const onMessage = ({ message }) => handleNewMessage(message, user.id);
    const onTyping = ({ threadId, userId, isTyping }) => handleTypingIndicator(threadId, userId, isTyping);
    const onPresence = ({ userId, isOnline }) => handlePresenceUpdate(userId, isOnline);
    const onRead = ({ threadId, messageId, userId, readAt }) => handleMessageRead(threadId, messageId, userId, readAt);
    const onRequestAccepted = ({ threadId }) => handleRequestAccepted(threadId);
    const onRequestDeclined = ({ threadId }) => handleRequestDeclined(threadId);
    socket?.on(SOCKET_EVENTS.NEW_MESSAGE, onMessage);
    socket?.on(SOCKET_EVENTS.TYPING, onTyping);
    socket?.on(SOCKET_EVENTS.PRESENCE_UPDATE, onPresence);
    socket?.on(SOCKET_EVENTS.MESSAGE_READ, onRead);
    socket?.on(SOCKET_EVENTS.REQUEST_ACCEPTED, onRequestAccepted);
    socket?.on(SOCKET_EVENTS.REQUEST_DECLINED, onRequestDeclined);
    return () => {
      socket?.off(SOCKET_EVENTS.NEW_MESSAGE, onMessage);
      socket?.off(SOCKET_EVENTS.TYPING, onTyping);
      socket?.off(SOCKET_EVENTS.PRESENCE_UPDATE, onPresence);
      socket?.off(SOCKET_EVENTS.MESSAGE_READ, onRead);
      socket?.off(SOCKET_EVENTS.REQUEST_ACCEPTED, onRequestAccepted);
      socket?.off(SOCKET_EVENTS.REQUEST_DECLINED, onRequestDeclined);
    };
  }, [
    token,
    user?.id,
    handleNewMessage,
    handleTypingIndicator,
    handlePresenceUpdate,
    handleMessageRead,
    handleRequestAccepted,
    handleRequestDeclined,
  ]);

  return { ...store, currentUser: user };
};
