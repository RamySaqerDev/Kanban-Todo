// src/components/CardItem.jsx
import React, { useRef, useState } from "react";
import { useDrag, useDrop } from "react-dnd";

export default function CardItem({ card, index, moveCard, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(card.title);
  const ref = useRef(null);

  const [{ handlerId }, drop] = useDrop({
    accept: "CARD",
    collect: (monitor) => ({
      handlerId: monitor.getHandlerId(),
    }),
    hover(item, monitor) {
      if (!ref.current) return;

      const dragIndex = item.index;
      const hoverIndex = index;

      // Do nothing if it's hovering over itself
      if (dragIndex === hoverIndex) return;

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Get vertical mouse position
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half the item's height
      if (
        (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) ||
        (dragIndex > hoverIndex && hoverClientY > hoverMiddleY)
      ) {
        return;
      }

      // Trigger card move
      moveCard(dragIndex, hoverIndex);
      item.index = hoverIndex; // Mutate the index for efficiency
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: "CARD",
    item: () => ({
      _id: card._id,
      listId: card.listId,
      index,
    }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref)); // Combine drag and drop refs

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
      ref={ref}
      data-handler-id={handlerId}
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
