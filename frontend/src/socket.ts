import { io, Socket } from "socket.io-client";

// One shared socket connection for the whole app, reused across components
// rather than reconnecting every time a component mounts.
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

export const socket: Socket = io(SOCKET_URL, {
  autoConnect: true,
});
