import express from 'express';
import List from '../models/List.js';

const router = express.Router();

router.get('/', async (req, res) => {
    const lists = await List.find().sort('order');
    res.json(lists);
});

export default router;