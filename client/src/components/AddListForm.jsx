import React, { useState } from "react";

export default function AddListForm({ onAddList }) {
  const [title, setTitle] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim()) return;
    await onAddList(title);
    setTitle("");
    setIsAdding(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
    if (e.key === "Escape") {
      setIsAdding(false);
      setTitle("");
    }
  };

  return (
    <div className="min-w-[18rem]">
      {isAdding ? (
        <div className="bg-white p-3 rounded shadow border">
          <input
            className="w-full px-2 py-1 border rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="New list title"
            autoFocus
          />
          <div className="flex gap-2 mt-2">
            <button onClick={handleSubmit} className="bg-blue-500 text-white px-3 py-1 rounded text-sm">
              Add List
            </button>
            <button onClick={() => setIsAdding(false)} className="text-gray-500 text-sm">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="text-blue-500 hover:underline text-sm"
        >
          + Add List
        </button>
      )}
    </div>
  );
}
