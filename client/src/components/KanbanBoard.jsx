// src/components/KanbanBoard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import ListColumn from "./ListColumn";

export default function KanbanBoard() {
  const [lists, setLists] = useState([]);
  const [cards, setCards] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [listsRes, cardsRes] = await Promise.all([
          axios.get("http://localhost:5050/api/lists"),
          axios.get("http://localhost:5050/api/cards"),
        ]);
        setLists(listsRes.data);
        setCards(cardsRes.data);
      } catch (err) {
        console.error("Failed to fetch board data", err);
      }
    };

    fetchData();
  }, []);

    const handleCardUpdate = (updatedCard) => {
        setCards((prevCards) =>
            prevCards.map((card) => (card._id === updatedCard._id ? updatedCard : card))
        );
    };

  return (
    <div className="flex overflow-x-auto gap-6 p-6 h-screen bg-gray-50">
      {lists.map((list) => {
        const listCards = cards.filter((card) => card.listId === list._id);
        return (
          <ListColumn
            key={list._id}
            list={list}
            cards={listCards}
            onCardUpdate={handleCardUpdate}
          />
        );
      })}
    </div>
  );
}
