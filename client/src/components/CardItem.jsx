// src/components/CardItem.jsx
import React, { useState } from "react";

export default function CardItem({ card, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description);

  const handleSave = () => {
    const updatedCard = { ...card, title, description };
    onUpdate(updatedCard);
    setEditing(false);
  };

  return (
    <div className="bg-gray-100 p-3 rounded border border-gray-300 shadow-sm hover:shadow transition">
      {editing ? (
        <div className="flex flex-col gap-2">
          <input
            className="border rounded px-2 py-1 text-sm"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="border rounded px-2 py-1 text-sm"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button
            className="bg-blue-500 text-white text-sm px-3 py-1 rounded hover:bg-blue-600 self-start"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      ) : (
        <div onClick={() => setEditing(true)} className="cursor-pointer">
          <h4 className="text-sm font-semibold">{card.title}</h4>
          <p className="text-xs text-gray-600 mt-1">{card.description}</p>
        </div>
      )}
    </div>
  );
}
