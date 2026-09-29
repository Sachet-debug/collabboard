import { useEffect } from "react";
import { socket } from "../socket";

// Joins the board's Socket.io "room" while this component is mounted, and
// calls onRemoteChange whenever ANY other client makes a change to this
// board (task created, moved, list created, etc). We keep this simple:
// rather than trying to precisely replay every possible event shape, any
// change just triggers the caller to silently re-fetch the board's current
// state from the API. Less "clever" than fine-grained patching, but far
// less error-prone — and for a board-sized dataset, refetching is cheap.
const BOARD_EVENTS = [
  "taskCreated",
  "taskUpdated",
  "taskMoved",
  "taskDeleted",
  "listCreated",
  "listUpdated",
];

export const useSocket = (boardId: string | undefined, onRemoteChange: () => void) => {
  useEffect(() => {
    if (!boardId) return;

    socket.emit("joinBoard", boardId);

    const handleChange = () => onRemoteChange();
    BOARD_EVENTS.forEach((event) => socket.on(event, handleChange));

    return () => {
      socket.emit("leaveBoard", boardId);
      BOARD_EVENTS.forEach((event) => socket.off(event, handleChange));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardId]);
};

// Helper for emitting a change after a local action succeeds, so other
// clients in the same board room get notified.
export const emitBoardChange = (
  event: (typeof BOARD_EVENTS)[number],
  boardId: string,
  payload: unknown
) => {
  socket.emit(event, { boardId, payload });
};
