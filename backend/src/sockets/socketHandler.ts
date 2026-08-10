import { Server, Socket } from "socket.io";

// This keeps real-time sync simple: clients join a "room" per board.
// Any client action (task moved, list created, etc.) is broadcast to
// everyone else in that room so their UI updates instantly.

const registerSocketHandlers = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log("Socket connected:", socket.id);

    // Client joins the board room when they open a board
    socket.on("joinBoard", (boardId: string) => {
      socket.join(boardId);
    });

    socket.on("leaveBoard", (boardId: string) => {
      socket.leave(boardId);
    });

    // Generic broadcast events — the frontend sends the action name + payload,
    // and everyone else in the room gets it. Keeps this file stack-agnostic
    // to whatever board/list/task events you add later.
    socket.on("taskMoved", ({ boardId, payload }) => {
      socket.to(boardId).emit("taskMoved", payload);
    });

    socket.on("taskCreated", ({ boardId, payload }) => {
      socket.to(boardId).emit("taskCreated", payload);
    });

    socket.on("taskUpdated", ({ boardId, payload }) => {
      socket.to(boardId).emit("taskUpdated", payload);
    });

    socket.on("taskDeleted", ({ boardId, payload }) => {
      socket.to(boardId).emit("taskDeleted", payload);
    });

    socket.on("listCreated", ({ boardId, payload }) => {
      socket.to(boardId).emit("listCreated", payload);
    });

    socket.on("listUpdated", ({ boardId, payload }) => {
      socket.to(boardId).emit("listUpdated", payload);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });
};

export default registerSocketHandlers;
