import express from 'express';
import Card from '../models/Card.js';

const router = express.Router();

router.get('/', async (req, res) => {
    const cards = await Card.find().sort('order');
    res.json(cards);
});

router.put('/:id', async (req, res) => {
    const updated = await Card.findByIdAndUpdate(req.params.id, req.body, { new: true});
    res.json(updated);
});

export default router;
