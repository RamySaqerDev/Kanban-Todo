import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import cardsRoutes from './routes/cards.js';
import listsRoutes from './routes/lists.js';

dotenv.config();

const app = express ();
app.use(cors()); // fully open for development

app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI);

// Routes
app.use('/api/cards', cardsRoutes);
app.use('/api/lists', listsRoutes);
app.get('/test', (req, res) => {
  res.json({ message: "API is reachable." });
});


const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

