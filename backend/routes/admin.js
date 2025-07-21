const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const Item = require('../models/Item');

// Apply auth and admin middleware to all routes in this file
router.use(authMiddleware, adminMiddleware);

// @route   GET api/admin/items
// @desc    Get all items pending approval
// @access  Admin
router.get('/items', async (req, res) => {
    try {
        const pendingItems = await Item.find({ status: 'pending_approval' })
            .populate('owner', 'email')
            .sort({ createdAt: 1 }); // Oldest first
        res.json(pendingItems);
    } catch (error) {
        console.error(error.message);
        // FIX: Send JSON response for errors
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   PUT api/admin/items/:id/approve
// @desc    Approve an item
// @access  Admin
router.put('/items/:id/approve', async (req, res) => {
    try {
        const item = await Item.findByIdAndUpdate(
            req.params.id, 
            { status: 'available' }, 
            { new: true }
        );
        if (!item) return res.status(404).json({ message: 'Item not found' });
        res.json(item);
    } catch (error) {
        console.error(error.message);
        // FIX: Send JSON response for errors
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   PUT api/admin/items/:id/reject
// @desc    Reject an item
// @access  Admin
router.put('/items/:id/reject', async (req, res) => {
    try {
        const item = await Item.findByIdAndUpdate(
            req.params.id, 
            { status: 'rejected' }, 
            { new: true }
        );
        if (!item) return res.status(404).json({ message: 'Item not found' });
        res.json(item);
    } catch (error) {
        console.error(error.message);
        // FIX: Send JSON response for errors
        res.status(500).json({ message: 'Server Error' });
    }
});


// @route   DELETE api/admin/items/:id
// @desc    Delete an item (hard delete)
// @access  Admin
router.delete('/items/:id', async (req, res) => {
    try {
        const item = await Item.findByIdAndDelete(req.params.id);
        if (!item) return res.status(404).json({ message: 'Item not found' });
        res.json({ message: 'Item removed successfully' });
    } catch (error) {
        console.error(error.message);
        // FIX: Send JSON response for errors
        res.status(500).json({ message: 'Server Error' });
    }
});


module.exports = router;
