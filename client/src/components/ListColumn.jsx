// src/components/ListColumn.jsx
import React, { useState } from "react";
import CardItem from "./CardItem";
import axios from "axios";

export default function ListColumn({ list, cards, onCardUpdate, onListUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(list.title);
  const [originalTitle, setOriginalTitle] = useState(list.title);

  const handleSave = async () => {
    if (title.trim() === "" || title === originalTitle) {
      setTitle(originalTitle);
      setIsEditing(false);
      return;
    }

    try {
      const res = await axios.patch(`http://localhost:5050/api/lists/${list._id}`, {
        title,
      });

      setOriginalTitle(res.data.title);
      setIsEditing(false);
      onListUpdate(res.data);
    } catch (err) {
      console.error("Failed to update list title", err);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      setTitle(originalTitle);
      setIsEditing(false);
    }
  };

  const handleStartEditing = () => {
    setOriginalTitle(title); // snapshot title
    setIsEditing(true);
  };

  return (
    <div className="w-72 flex-shrink-0 bg-white rounded shadow p-4 border border-gray-200">
      {isEditing ? (
        <input
          type="text"
          className="w-full text-xl font-bold px-2 py-1 border border-blue-500 rounded focus:outline-none"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      ) : (
        <h2
          className="text-xl font-bold mb-4 cursor-pointer hover:underline"
          onClick={handleStartEditing}
        >
          {title}
        </h2>
      )}

      <div className="flex flex-col gap-3">
        {cards.map((card) => (
          <CardItem key={card._id} card={card} onUpdate={onCardUpdate} />
        ))}
      </div>
    </div>
  );
}

