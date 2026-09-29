import { Board } from "../types";

interface Props {
  board: Board;
  onClick: () => void;
}

const BoardCard = ({ board, onClick }: Props) => {
  return (
    <button
      onClick={onClick}
      className="text-left rounded-lg border border-line bg-white p-5 hover:border-accent hover:shadow-sm transition group"
    >
      <h3 className="font-medium text-ink group-hover:text-accent transition truncate">
        {board.title}
      </h3>
      {board.description && (
        <p className="text-sm text-ink/60 mt-1 line-clamp-2">{board.description}</p>
      )}
      <div className="flex items-center gap-1 mt-4">
        {board.members.slice(0, 4).map((m, i) => (
          <div
            key={i}
            className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-medium text-white border-2 border-white -ml-2 first:ml-0"
            style={{ backgroundColor: m.user.avatarColor || "#3D5A80" }}
            title={m.user.name}
          >
            {m.user.name?.[0]?.toUpperCase() || "?"}
          </div>
        ))}
        {board.members.length > 4 && (
          <span className="text-xs text-ink/50 ml-1">+{board.members.length - 4}</span>
        )}
      </div>
    </button>
  );
};

export default BoardCard;
