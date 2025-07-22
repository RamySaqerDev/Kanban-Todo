// src/components/ListColumn.jsx
import React, { useState } from "react";
import { useDrop } from "react-dnd";
import CardItem from "./CardItem";

export default function ListColumn({ list, cards, onCardUpdate, onListTitleUpdate }) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState(list.title);

  // Drop handler for the list (when dropping into an empty column)
  const [, drop] = useDrop({
    accept: "CARD",
    drop: (draggedItem, monitor) => {
      if (!cards.length) {
        if (draggedItem.listId !== list._id || draggedItem.order !== 0) {
          onCardUpdate(draggedItem._id, {
            listId: list._id,
            order: 0,
          });
        }
      }
    },
  });

  // Move card to new position or column
  const moveCard = ({ dragged, target, position }) => {
    const sortedCards = [...cards].sort((a, b) => a.order - b.order);

    const filtered = sortedCards.filter((c) => c._id !== dragged._id);

    const newCard = {
      ...dragged,
      listId: list._id,
    };

    filtered.splice(position, 0, newCard);

    filtered.forEach((c, i) => {
      if (c.order !== i || c.listId !== list._id) {
        onCardUpdate(c._id, { order: i, listId: list._id });
      }
    });
  };

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
          .sort((a, b) => a.order - b.order)
          .map((card, index) => (
            <CardItem
              key={card._id}
              card={card}
              index={index}
              listId={list._id}
              onUpdate={onCardUpdate}
              moveCard={moveCard}
            />
          ))}
      </div>
    </div>
  );
}
