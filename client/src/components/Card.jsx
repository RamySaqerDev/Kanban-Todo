import React, { useState } from "react";
import axios from "axios";

export default function Card({ card }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(card.title);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await axios.patch(`http://localhost:5050/api/cards/${card._id}`, {
        title: title.trim(),
      });
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating card title", err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setTitle(card.title); // Revert to original
    }
  };

  return (
    <div className="bg-white p-3 rounded shadow mb-2 hover:bg-gray-50">
      {isEditing ? (
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          disabled={loading}
          autoFocus
          className="border p-1 rounded w-full"
        />
      ) : (
        <div
          onClick={() => setIsEditing(true)}
          className="cursor-pointer font-medium"
        >
          {title}
        </div>
      )}
    </div>
  );
}
