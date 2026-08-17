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
    socket?.on(SOCKET_EVENTS.NEW_MESSAGE, onMessage);
    socket?.on(SOCKET_EVENTS.TYPING, onTyping);
    socket?.on(SOCKET_EVENTS.PRESENCE_UPDATE, onPresence);
    socket?.on(SOCKET_EVENTS.MESSAGE_READ, onRead);
    return () => {
      socket?.off(SOCKET_EVENTS.NEW_MESSAGE, onMessage);
      socket?.off(SOCKET_EVENTS.TYPING, onTyping);
      socket?.off(SOCKET_EVENTS.PRESENCE_UPDATE, onPresence);
      socket?.off(SOCKET_EVENTS.MESSAGE_READ, onRead);
    };
  }, [token, user?.id]);

  return { ...store, currentUser: user };
};
