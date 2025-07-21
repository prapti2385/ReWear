const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User');
const Item = require('../models/Item');
const Swap = require('../models/Swap');

// @route   GET api/dashboard
// @desc    Get user profile, items, and swaps for their dashboard
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
    try {
        // Fetch user details (excluding password)
        const user = await User.findById(req.user.id).select('-password');
        
        // Fetch items owned by the user
        const userItems = await Item.find({ owner: req.user.id }).sort({ createdAt: -1 });
        
        // Fetch swaps where the user is either the requester or responder
        const userSwaps = await Swap.find({ 
            $or: [{ requester: req.user.id }, { responder: req.user.id }] 
        })
        .populate('requester', 'email')
        .populate('responder', 'email')
        .populate('requestedItem', 'title images')
        .populate('offeredItem', 'title images')
        .sort({ createdAt: -1 });

        res.json({ user, userItems, userSwaps });

    } catch (error) {
        console.error(error.message);
        // FIX: Send JSON response for errors
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
