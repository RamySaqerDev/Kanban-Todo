// src/components/KanbanBoard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import ListColumn from "./ListColumn";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import AddListForm from "./AddListForm";

export default function KanbanBoard() {
  const [lists, setLists] = useState([]);
  const [cards, setCards] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [listsRes, cardsRes] = await Promise.all([
        axios.get("http://localhost:5050/api/lists"),
        axios.get("http://localhost:5050/api/cards"),
      ]);
      setLists(listsRes.data);
      setCards(cardsRes.data);
    } catch (error) {
      console.error("Failed to fetch board data", error);
    }
  };

const handleCardUpdate = async (cardId, updates) => {
  try {
    await axios.put(`http://localhost:5050/api/cards/${cardId}`, updates);
    
    // Ensure listId is updated in local state
    setCards((prev) =>
      prev.map((card) =>
        card._id === cardId ? { ...card, ...updates } : card
      )
    );
  } catch (err) {
    console.error("Failed to update card", err);
  }
};



  const handleListTitleUpdate = async (listId, updates) => {
    try {
      await axios.put(`http://localhost:5050/api/lists/${listId}`, updates);
      setLists((prev) =>
        prev.map((list) => (list._id === listId ? { ...list, ...updates } : list))
      );
    } catch (err) {
      console.error("Failed to update list title", err);
    }
  };

  const handleCardDelete = async (cardId) => {
    try {
      await axios.delete(`http://localhost:5050/api/cards/${cardId}`);
      setCards((prev) => prev.filter((card) => card._id !== cardId));
    } catch (err) {
      console.error("Failed to delete card", err);
    }
  };

  const handleCardCreate = (newCard) => {
    setCards((prev) => [...prev, newCard])
  }

  const handleAddList = async (title) => {
    try {
      const res = await axios.post("http://localhost:5050/api/lists", { title });
      setLists((prev) => [...prev, res.data]);
    } catch(err) {
      console.error("Failed to add list", err)
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-6">
        <AddListForm onAddList={handleAddList} />
      </div>
      <div className="flex overflow-x-auto gap-6 p-6 h-screen bg-gray-50">
        {lists.map((list) => {
          const listCards = cards.filter((card) => card.listId === list._id);
          return (
            <ListColumn
              key={list._id}
              list={list}
              cards={listCards}
              onCardUpdate={handleCardUpdate}
              onListTitleUpdate={handleListTitleUpdate}
              onCardCreate={handleCardCreate}
              onCardDelete={handleCardDelete}
            />
          );
        })}
      </div>
    </DndProvider>
  );
}
