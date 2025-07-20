import React, { useState } from "react";
import { useDrop } from "react-dnd";
import CardItem from "./CardItem";


export default function ListColumn({ list, cards, onCardUpdate, onListTitleUpdate }) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState(list.title);

  const [, drop] = useDrop({
    accept: "CARD",
    drop: (item) => {
      console.log("Dropped card", item._id, "onto list", list._id);

      if (item.listId !== list._id) {
        onCardUpdate(item._id, { listId: list._id });
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
        {cards.map((card) => (
          <CardItem key={card._id} card={card} onUpdate={onCardUpdate} />
        ))}
      </div>
    </div>
  );
}
