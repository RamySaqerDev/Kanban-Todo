// src/components/ListColumn.jsx
import React, { useState } from "react";
import { useDrop } from "react-dnd";
import CardItem from "./CardItem";
import axios from "axios";

export default function ListColumn({ list, cards, onCardUpdate, onListTitleUpdate, onCardCreate }) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState(list.title);
  const [newCardTitle, setNewCardTitle] = useState("");
  const [newCardDescription, setNewCardDescription] = useState("");
  const [isAddingCard, setIsAddingCard] = useState(false);

  const [, drop] = useDrop({
    accept: "CARD",
    drop: (item) => {
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

  const handleAddCard = async() => {
    if (!newCardTitle.trim()) return;
    try{
      const res = await axios.post("http://localhost:5050/api/cards", {
        title: newCardTitle,
        description: newCardDescription,
        listId: list._id
      });
      onCardCreate(res.data);
      setNewCardTitle("");
      setNewCardDescription("");
      setIsAddingCard(false);
    } catch (err) {
      console.error("Failed to add card", err);
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
          .map((card) => (
            <CardItem key={card._id} card={card} onUpdate={onCardUpdate} />
          ))}
      </div>

      <div className="mt-4">
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

    </div>
  );
}
