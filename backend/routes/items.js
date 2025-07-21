const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Item = require('../models/Item');

// This route is for any authenticated user to create an item.
// It only uses authMiddleware, NOT adminMiddleware.
router.post('/', authMiddleware, async (req, res) => {
    try {
        const newItem = new Item({
            ...req.body,
            owner: req.user.id
        });
        const item = await newItem.save();
        res.status(201).json(item);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

// This route gets all available items and is public.
router.get('/', async (req, res) => {
    try {
        const items = await Item.find({ status: 'available' })
            .populate('owner', 'email')
            .sort({ createdAt: -1 });
        res.json(items);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

// This route gets a single item and is public.
router.get('/:id', async (req, res) => {
    try {
        const item = await Item.findById(req.params.id).populate('owner', 'email');
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.json(item);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
