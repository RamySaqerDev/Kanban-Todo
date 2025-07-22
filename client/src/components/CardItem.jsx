import React, { useState, useRef } from "react";
import { useDrag, useDrop } from "react-dnd";

export default function CardItem({ card, index, listId, onUpdate, moveCard }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(card.title);
  const ref = useRef(null);

  const [{ isDragging }, drag] = useDrag({
    type: "CARD",
    item: {
      ...card,
      index,
      listId,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: "CARD",
    hover(draggedItem, monitor) {
      if (!ref.current || draggedItem._id === card._id) return;

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      const isAfter = hoverClientY > hoverMiddleY;

      moveCard({
        dragged: draggedItem,
        target: {
          _id: card._id,
          index,
          listId,
        },
        position: isAfter ? index + 1 : index,
      });

      // Update the dragged item’s data
      draggedItem.index = index;
      draggedItem.listId = listId;
    },
  });

  drag(drop(ref));

  const handleBlur = () => {
    setIsEditing(false);
    if (title !== card.title) {
      onUpdate(card._id, { title });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleBlur();
    if (e.key === "Escape") {
      setTitle(card.title);
      setIsEditing(false);
    }
  };

  return (
    <div
      ref={ref}
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
        <div onClick={() => setIsEditing(true)} className="cursor-text">
          {card.title}
        </div>
      )}
    </div>
  );
}
