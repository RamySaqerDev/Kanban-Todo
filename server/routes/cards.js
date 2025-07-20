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
