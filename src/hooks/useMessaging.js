import { useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { useMessagingStore } from "../store/messagingStore";
import { socketManager } from "../utils/socketManager";
import { SOCKET_EVENTS } from "../constants/messagingConstants";

export const useMessaging = () => {
  const { token, user } = useAuthStore();
  const store = useMessagingStore();

  useEffect(() => {
    if (!token || !user?.id) return undefined;
    const socket = socketManager.connect(token);
    const onMessage = ({ message }) => store.handleNewMessage(message, user.id);
    const onTyping = ({ threadId, userId, isTyping }) => store.handleTypingIndicator(threadId, userId, isTyping);
    const onPresence = ({ userId, isOnline }) => store.handlePresenceUpdate(userId, isOnline);
    const onRead = ({ threadId, messageId, userId, readAt }) => store.handleMessageRead(threadId, messageId, userId, readAt);
    const onRequestAccepted = ({ threadId }) => store.handleRequestAccepted(threadId);
    const onRequestDeclined = ({ threadId }) => store.handleRequestDeclined(threadId);
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
  }, [token, user?.id]);

  return { ...store, currentUser: user };
};
