// src/components/CardItem.jsx
import React, { useState } from "react";
import { useDrag } from "react-dnd";

export default function CardItem({ card, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(card.title);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "CARD",
    item: {
      _id: card._id,
      listId: card.listId,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const handleBlur = () => {
    setIsEditing(false);
    if (title !== card.title) {
      onUpdate(card._id, { title });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleBlur();
    } else if (e.key === "Escape") {
      setTitle(card.title);
      setIsEditing(false);
    }
  };

  return (
    <div
      ref={drag}
      className={`p-3 bg-white border rounded shadow-sm cursor-move ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      {isEditing ? (
        <input
          className="w-full border px-2 py-1 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      ) : (
        <div onClick={() => setIsEditing(true)} className="cursor-text font-medium">
          {card.title}
        </div>
      )}
      {card.description && (
        <div className="text-sm text-gray-600 mt-1 whitespace-pre-wrap">
          {card.description}
        </div>
      )}
    </div>
  );
}
