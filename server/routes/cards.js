import express from "express";
import Card from "../models/Card.js";

const router = express.Router();

// GET /api/cards
router.get("/", async (req, res) => {
  try {
    const cards = await Card.find();
    res.json(cards);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch cards" });
  }
});

// PUT /api/cards/:id
router.put("/:id", async (req, res) => {
  try {
    const updatedCard = await Card.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedCard) return res.status(404).json({ message: "Card not found" });
    res.json(updatedCard);
  } catch (error) {
    console.error("Error updating card:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/cards
router.post("/", async (req, res) => {
  try {
    const { title, description, listId } = req.body;
    const cardCount = await Card.countDocuments({ listId });
    const newCard = new Card({
      title,
      description,
      listId,
      order: cardCount,
    });
    const saved = await newCard.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: "Failed to create card" });
  }
});

// DELETE /api/cards/:id
router.delete("/:id", async (req, res) => {
  try {
    const deletedCard = await Card.findByIdAndDelete(req.params.id);
    if (!deletedCard) {
      return res.status(404).json({ message: "Card not found" });
    }
    res.status(200).json({ message: "Card deleted" });
  } catch (error) {
    console.error("Error deleting card:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// PATCH /api/cards/:id
router.patch("/:id", async (req, res) => {
  try {
    const updated = await Card.findByIdAndUpdate(
      req.params.id,
      { title: req.body.title },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Update failed." });
  }
});

export default router;
