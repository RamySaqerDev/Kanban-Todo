// src/components/CardItem.jsx
import React, { useState } from "react";
import axios from "axios";

export default function CardItem({ card, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(card.title);
  const [originalTitle, setOriginalTitle] = useState(card.title);

  const handleSave = async () => {
    if (title.trim() === "" || title === originalTitle) {
      setIsEditing(false);
      setTitle(originalTitle); // reset to original
      return;
    }

    try {
      const res = await axios.patch(`http://localhost:5050/api/cards/${card._id}`, {
        title,
      });

      onUpdate(res.data);
      setOriginalTitle(res.data.title); // update baseline
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update card title", err);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSave();
    }
    if (e.key === "Escape") {
      setTitle(originalTitle); // revert
      setIsEditing(false);
    }
  };

  const handleStartEditing = () => {
    setOriginalTitle(title); // capture original value in case of cancel
    setIsEditing(true);
  };

  return (
    <div className="bg-white border rounded px-3 py-2 shadow-sm">
      {isEditing ? (
        <input
          type="text"
          className="w-full border border-blue-500 rounded px-2 py-1 text-sm focus:outline-none"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      ) : (
        <div
          onClick={handleStartEditing}
          className="text-sm cursor-pointer hover:underline"
        >
          {title}
        </div>
      )}
    </div>
  );
}
