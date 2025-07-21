// backend/routes/swaps.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Swap = require('../models/Swap');
const Item = require('../models/Item');
const User = require('../models/User');

// @route   POST api/swaps
// @desc    Create a new direct swap request
// @access  Private
router.post('/', authMiddleware, async (req, res) => {
    console.log('[SWAP DEBUG] Received POST request to /api/swaps');
    const { requestedItemId, offeredItemId, swapType, pointsValue } = req.body;
    const requesterId = req.user.id;
    console.log('[SWAP DEBUG] Request body:', req.body);

    try {
        console.log('[SWAP DEBUG] 1. Finding requested item...');
        const requestedItem = await Item.findById(requestedItemId);
        if (!requestedItem) {
            console.log('[SWAP DEBUG] ERROR: Requested item not found.');
            return res.status(404).json({ message: 'Requested item not found.' });
        }
        console.log('[SWAP DEBUG] 2. Found requested item. Checking owner...');

        if (requestedItem.owner.toString() === requesterId) {
            console.log('[SWAP DEBUG] ERROR: User is trying to swap for their own item.');
            return res.status(400).json({ message: 'You cannot swap for your own item.' });
        }
        console.log('[SWAP DEBUG] 3. Owner check passed. Checking for existing swaps...');

        const existingSwap = await Swap.findOne({
            requester: requesterId,
            requestedItem: requestedItemId,
            status: 'pending'
        });

        if (existingSwap) {
            console.log('[SWAP DEBUG] ERROR: Pending swap already exists.');
            return res.status(400).json({ message: 'You already have a pending swap request for this item.' });
        }
        console.log('[SWAP DEBUG] 4. No existing swap found. Creating new swap object...');

        const newSwap = new Swap({
            requester: requesterId,
            responder: requestedItem.owner,
            requestedItem: requestedItemId,
            offeredItem: offeredItemId,
            swapType,
            pointsValue
        });
        console.log('[SWAP DEBUG] 5. New swap object created. Attempting to save to database...');

        await newSwap.save();
        console.log('[SWAP DEBUG] 6. Swap saved successfully. Sending response.');

        res.status(201).json(newSwap);

    } catch (error) {
        console.error('[SWAP DEBUG] CATCH BLOCK ERROR:', error.message);
        res.status(500).json({ message: 'Server Error' });
    }
});


// @route   PUT api/swaps/:id/accept
// @desc    Accept a swap request
// @access  Private
router.put('/:id/accept', authMiddleware, async (req, res) => {
    console.log(`[ACCEPT DEBUG] Received PUT request to /api/swaps/${req.params.id}/accept`);
    try {
        console.log('[ACCEPT DEBUG] 1. Finding swap request by ID...');
        const swap = await Swap.findById(req.params.id);

        if (!swap) {
            console.log('[ACCEPT DEBUG] ERROR: Swap request not found.');
            return res.status(404).json({ message: 'Swap request not found.' });
        }
        console.log('[ACCEPT DEBUG] 2. Swap found. Checking authorization...');

        if (swap.responder.toString() !== req.user.id) {
            console.log('[ACCEPT DEBUG] ERROR: User is not authorized to accept this swap.');
            return res.status(403).json({ message: 'Not authorized to accept this swap.' });
        }
        console.log('[ACCEPT DEBUG] 3. Authorization check passed. Checking swap status...');
        
        if (swap.status !== 'pending') {
            console.log(`[ACCEPT DEBUG] ERROR: Swap status is already '${swap.status}'.`);
            return res.status(400).json({ message: `Cannot accept a swap that is already ${swap.status}.` });
        }
        console.log('[ACCEPT DEBUG] 4. Swap status is "pending". Updating swap status to "accepted"...');
        
        swap.status = 'accepted';
        
        console.log('[ACCEPT DEBUG] 5. Updating status of items involved in the swap...');
        await Item.updateMany(
            { _id: { $in: [swap.requestedItem, swap.offeredItem] } },
            { $set: { status: 'swapped' } }
        );
        console.log('[ACCEPT DEBUG] 6. Items updated. Saving the swap document...');
        
        await swap.save();
        console.log('[ACCEPT DEBUG] 7. Swap saved successfully. Sending response.');
        
        res.json(swap);

    } catch (error) {
        console.error('[ACCEPT DEBUG] CATCH BLOCK ERROR:', error.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   PUT api/swaps/:id/reject
// @desc    Reject a swap request
// @access  Private
router.put('/:id/reject', authMiddleware, async (req, res) => {
    try {
        const swap = await Swap.findById(req.params.id);
        if (!swap) {
            return res.status(404).json({ message: 'Swap request not found.' });
        }
        if (swap.responder.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to reject this swap.' });
        }
        if (swap.status !== 'pending') {
            return res.status(400).json({ message: `Cannot reject a swap that is already ${swap.status}.` });
        }
        swap.status = 'rejected';
        await swap.save();
        res.json(swap);
    } catch (error) {
        console.error('Error rejecting swap:', error.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   POST api/swaps/redeem
// @desc    Redeem an item using points
// @access  Private
router.post('/redeem', authMiddleware, async (req, res) => {
    const { itemId } = req.body;
    const requesterId = req.user.id;
    try {
        const itemToRedeem = await Item.findById(itemId);
        if (!itemToRedeem) {
            return res.status(404).json({ message: 'Item not found.' });
        }
        if (itemToRedeem.status !== 'available') {
            return res.status(400).json({ message: 'This item is no longer available.' });
        }
        if (itemToRedeem.owner.toString() === requesterId) {
            return res.status(400).json({ message: 'You cannot redeem your own item with points.' });
        }
        const requester = await User.findById(requesterId);
        const owner = await User.findById(itemToRedeem.owner);
        if (requester.points < itemToRedeem.pointsValue) {
            return res.status(400).json({ message: 'You do not have enough points to redeem this item.' });
        }
        requester.points -= itemToRedeem.pointsValue;
        owner.points += itemToRedeem.pointsValue;
        itemToRedeem.status = 'swapped';
        await requester.save();
        await owner.save();
        await itemToRedeem.save();
        const pointSwap = new Swap({
            requester: requesterId,
            responder: owner._id,
            requestedItem: itemId,
            swapType: 'points',
            pointsValue: itemToRedeem.pointsValue,
            status: 'completed'
        });
        await pointSwap.save();
        res.json({ message: 'Item redeemed successfully!' });
    } catch (error) {
        console.error('Error redeeming item with points:', error.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;