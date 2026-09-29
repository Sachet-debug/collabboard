import { useState, FormEvent } from "react";

interface Props {
  onClose: () => void;
  onCreate: (title: string, description: string) => Promise<void>;
}

const CreateBoardModal = ({ onClose, onCreate }: Props) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Board title is required.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await onCreate(title.trim(), description.trim());
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create board.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-ink/40 flex items-center justify-center px-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-lg">
        <h2 className="text-lg font-semibold text-ink mb-4">Create a new board</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink/80 mb-1">Title</label>
            <input
              type="text"
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
              placeholder="e.g. Placement Prep"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink/80 mb-1">
              Description <span className="text-ink/40">(optional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent resize-none"
              placeholder="What's this board for?"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-ink/70 hover:text-ink transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-md bg-accent text-white text-sm font-medium hover:bg-accentDark transition disabled:opacity-60"
            >
              {loading ? "Creating..." : "Create board"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBoardModal;
