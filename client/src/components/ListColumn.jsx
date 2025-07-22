// src/components/ListColumn.jsx
import React, { useState } from "react";
import { useDrop } from "react-dnd";
import CardItem from "./CardItem";

export default function ListColumn({ list, cards, onCardUpdate, onListTitleUpdate }) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState(list.title);

  const [, drop] = useDrop({
    accept: "CARD",
    drop: (draggedCard) => {
      const isSameList = draggedCard.listId === list._id;

      // Determine new order (naively place at end of list)
      const maxOrder = cards.reduce((max, c) => Math.max(max, c.order || 0), 0);
      const newOrder = maxOrder + 1;

      if (!isSameList) {
        onCardUpdate(draggedCard._id, {
          listId: list._id,
          order: newOrder,
        });
      }
    },
  });

  const handleTitleBlur = () => {
    setIsEditingTitle(false);
    if (title !== list.title) {
      onListTitleUpdate(list._id, { title });
    }
  };

  const handleTitleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleTitleBlur();
    } else if (e.key === "Escape") {
      setTitle(list.title);
      setIsEditingTitle(false);
    }
  };

  return (
    <div
      ref={drop}
      className="w-72 flex-shrink-0 bg-white rounded shadow p-4 border border-gray-200"
    >
      {isEditingTitle ? (
        <input
          className="text-xl font-bold w-full border px-2 py-1 rounded mb-4"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleTitleBlur}
          onKeyDown={handleTitleKeyDown}
          autoFocus
        />
      ) : (
        <h2
          className="text-xl font-bold mb-4 cursor-text"
          onClick={() => setIsEditingTitle(true)}
        >
          {list.title}
        </h2>
      )}
      <div className="flex flex-col gap-3">
        {cards
          .sort((a, b) => (a.order || 0) - (b.order || 0))
          .map((card) => (
            <CardItem key={card._id} card={card} onUpdate={onCardUpdate} />
          ))}
      </div>
    </div>
  );
}
