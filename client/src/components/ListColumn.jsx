import React, { useRef, useState } from "react";
import { useDrop, useDrag } from "react-dnd";
import CardItem from "./CardItem";

export default function ListColumn({
  list,
  cards,
  onCardUpdate,
  onListTitleUpdate,
  onCardCreate,
  onCardDelete,
  moveList,
  onListDelete,
}) {
  const ref = useRef(null);

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState(list.title);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState("");
  const [newCardDescription, setNewCardDescription] = useState("");

  // Drag source (this list)
  const [{ isDragging }, drag] = useDrag({
    type: "LIST",
    item: { _id: list._id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // Drop target (another list hovers over this)
  const [, drop] = useDrop({
    accept: ["LIST", "CARD"],
    drop: (item, monitor) => {
      if (monitor.getItemType() === "CARD") {
        // Card dropped onto list column
        if (item.listId !== list._id) {
          onCardUpdate(item._id, { listId: list._id });
        }
      }
    },
    hover(draggedItem, monitor) {
      if (monitor.getItemType() === "LIST" && draggedItem._id !== list._id) {
        moveList(draggedItem._id, list._id);
        draggedItem._id = list._id; // prevent flickering
      }
    },
  });

  drag(drop(ref)); // Combine drag and drop on the same element

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

  const handleAddCard = async () => {
    if (!newCardTitle.trim()) return;

    await onCardCreate({
      title: newCardTitle.trim(),
      description: newCardDescription.trim(),
      listId: list._id,
    });

    setNewCardTitle("");
    setNewCardDescription("");
    setIsAddingCard(false);
  };

  const handleAddKeyDown = (e) => {
    if ((e.key === "Enter" && (e.ctrlKey || e.metaKey))) {
      e.preventDefault();
      handleAddCard();
    }
    if (e.key === "Escape") {
      setNewCardTitle("");
      setNewCardDescription("");
      setIsAddingCard(false);
    }
  };

  return (
  <div
    ref={ref}
    className={`w-72 flex-shrink-0 bg-white rounded shadow p-4 border border-gray-200 transition-opacity duration-200 ${
      isDragging ? "opacity-50" : ""
    }`}
  >
    {/* List title and delete button */}
    <div className="flex justify-between items-center mb-4">
      {isEditingTitle ? (
        <input
          className="text-xl font-bold w-full border px-2 py-1 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleTitleBlur}
          onKeyDown={handleTitleKeyDown}
          autoFocus
        />
      ) : (
        <h2
          className="text-xl font-bold cursor-text"
          onClick={() => setIsEditingTitle(true)}
        >
          {list.title}
        </h2>
      )}
      <button
        className="text-red-500 text-sm ml-2"
        onClick={() => {
          // eslint-disable-next-line no-restricted-globals
          if (confirm("Are you sure you want to delete this list?")) {
            onListDelete(list._id);
          }
        }}
      >
        ✕
      </button>
    </div>

    {/* List of cards */}
    <div className="flex flex-col gap-3 mb-4">
      {cards
        .sort((a, b) => a.order - b.order)
        .map((card) => (
          <CardItem
            key={card._id}
            card={card}
            onUpdate={onCardUpdate}
            onDelete={onCardDelete}
          />
        ))}
    </div>

    {/* Add new card form */}
    {isAddingCard ? (
      <div className="flex flex-col gap-2">
        <input
          className="w-full border px-2 py-1 rounded"
          value={newCardTitle}
          onChange={(e) => setNewCardTitle(e.target.value)}
          placeholder="Card title"
          autoFocus
        />
        <textarea
          className="w-full border px-2 py-1 rounded"
          value={newCardDescription}
          onChange={(e) => setNewCardDescription(e.target.value)}
          placeholder="Card description"
          rows={3}
        />
        <div className="flex gap-2">
          <button
            onClick={handleAddCard}
            className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
          >
            Add
          </button>
          <button
            onClick={() => setIsAddingCard(false)}
            className="text-gray-500 text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    ) : (
      <button
        onClick={() => setIsAddingCard(true)}
        className="text-blue-500 hover:underline mt-2 text-sm"
      >
        + Add Card
      </button>
    )}
  </div>
);
}
