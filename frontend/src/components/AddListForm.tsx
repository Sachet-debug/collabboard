import { useState, FormEvent } from "react";

interface Props {
  onAdd: (title: string) => Promise<void>;
}

const AddListForm = ({ onAdd }: Props) => {
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);
    try {
      await onAdd(title.trim());
      setTitle("");
      setAdding(false);
    } finally {
      setSubmitting(false);
    }
  };

  if (!adding) {
    return (
      <button
        onClick={() => setAdding(true)}
        className="w-72 shrink-0 h-11 rounded-lg border border-dashed border-line text-sm text-ink/50 hover:text-ink hover:border-ink/30 transition"
      >
        + Add another list
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-72 shrink-0 bg-canvas rounded-lg border border-line p-3 space-y-2 h-fit"
    >
      <input
        autoFocus
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            setAdding(false);
            setTitle("");
          }
        }}
        placeholder="List title"
        className="w-full rounded-md border border-line bg-white px-2.5 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
      />
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={submitting}
          className="text-xs font-medium bg-accent text-white px-3 py-1.5 rounded-md hover:bg-accentDark transition disabled:opacity-60"
        >
          {submitting ? "Adding..." : "Add list"}
        </button>
        <button
          type="button"
          onClick={() => {
            setAdding(false);
            setTitle("");
          }}
          className="text-xs font-medium text-ink/50 hover:text-ink px-2"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AddListForm;
