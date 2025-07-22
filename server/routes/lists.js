import express from 'express';
import List from '../models/List.js';

const router = express.Router();

router.get('/', async (req, res) => {
    const lists = await List.find().sort('order');
    res.json(lists);
});

// POST /api/lists
router.post("/", async (req, res) => {
    try {
        const { title } = req.body;
        const newList = new List({ title });
        await newList.save();
        res.status(201).json(newList);
    } catch (err) {
        res.status(500).json({ error: "Failed to create list" });
    }
});

// PUT /api/lists/:id
router.put("/:id", async (req, res) => {
  try {
    const updated = await List.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "List not found" });
    res.json(updated);
  } catch (err) {
    console.error("Error updating list:", err);
    res.status(500).json({ error: "Failed to update list" });
  }
});

export default router;