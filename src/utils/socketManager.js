import { io } from "socket.io-client";
import { API_BASE_URL } from "./apiPaths";

let socket = null;

export const socketManager = {
  connect(token) {
    if (!token) return null;
    if (socket?.connected) return socket;
    if (socket) socket.disconnect();
    socket = io(API_BASE_URL, {
      auth: { token },
      withCredentials: true,
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 500,
      reconnectionDelayMax: 5000,
    });
    return socket;
  },
  disconnect() {
    socket?.disconnect();
    socket = null;
  },
  emit(event, payload, callback) {
    socket?.emit(event, payload, callback);
  },
  on(event, handler) {
    socket?.on(event, handler);
  },
  off(event, handler) {
    socket?.off(event, handler);
  },
  isConnected() {
    return Boolean(socket?.connected);
  },
};
