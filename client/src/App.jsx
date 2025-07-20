import React from "react";
import KanbanBoard from "./components/KanbanBoard";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <KanbanBoard />
    </DndProvider>
  );
}

export default App; // ✅ This is correct


