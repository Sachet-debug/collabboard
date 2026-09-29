import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { fetchBoards, createBoard as createBoardApi } from "../api/boardApi";
import { Board } from "../types";
import BoardCard from "../components/BoardCard";
import CreateBoardModal from "../components/CreateBoardModal";

const Dashboard = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadBoards();
  }, []);

  const loadBoards = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await fetchBoards();
      setBoards(data);
    } catch (err) {
      setError("Couldn't load your boards. Try refreshing.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBoard = async (title: string, description: string) => {
    const { data } = await createBoardApi(title, description);
    setBoards((prev) => [data, ...prev]);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-semibold text-ink">CollabBoard</h1>
          <p className="text-sm text-ink/60 mt-0.5">Welcome back, {user?.name?.split(" ")[0]}</p>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm text-ink/60 hover:text-ink transition"
        >
          Log out
        </button>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-medium text-ink/70">Your boards</h2>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 rounded-md bg-accent text-white text-sm font-medium hover:bg-accentDark transition"
        >
          + New board
        </button>
      </div>

      {loading && <p className="text-sm text-ink/50">Loading boards...</p>}

      {!loading && error && (
        <div className="rounded-md border border-red-200 bg-red-50 text-red-700 text-sm p-4">
          {error}
        </div>
      )}

      {!loading && !error && boards.length === 0 && (
        <div className="rounded-lg border border-dashed border-line p-10 text-center">
          <p className="text-sm text-ink/60 mb-3">You don't have any boards yet.</p>
          <button
            onClick={() => setShowModal(true)}
            className="text-sm text-accent font-medium hover:underline"
          >
            Create your first board
          </button>
        </div>
      )}

      {!loading && !error && boards.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {boards.map((board) => (
            <BoardCard
              key={board._id}
              board={board}
              onClick={() => navigate(`/board/${board._id}`)}
            />
          ))}
        </div>
      )}

      {showModal && (
        <CreateBoardModal onClose={() => setShowModal(false)} onCreate={handleCreateBoard} />
      )}
    </div>
  );
};

export default Dashboard;
