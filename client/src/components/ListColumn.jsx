// src/components/ListColumn.jsx
import React from "react";
import CardItem from "./CardItem";

export default function ListColumn({ list, cards, onCardUpdate }) {
  return (
    <div className="w-72 flex-shrink-0 bg-white rounded shadow p-4 border border-gray-200">
      <h2 className="text-xl font-bold mb-4">{list.title}</h2>
      <div className="flex flex-col gap-3">
        {cards.map((card) => (
          <CardItem key={card._id} card={card} onUpdate={onCardUpdate} />
        ))}
      </div>
    </div>
  );
}
