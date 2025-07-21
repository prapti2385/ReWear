const mongoose = require('mongoose');

const swapSchema = new mongoose.Schema({
    requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    responder: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    requestedItem: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
    // offeredItem is optional for points-based swaps
    offeredItem: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' }, 
    status: { 
        type: String, 
        enum: ['pending', 'accepted', 'rejected', 'completed', 'cancelled'], 
        default: 'pending' 
    },
    swapType: { 
        type: String, 
        enum: ['direct', 'points'], 
        required: true 
    },
    // pointsValue is only relevant for points-based swaps
    pointsValue: { type: Number, default: 0 } 
}, { timestamps: true });

const Swap = mongoose.model('Swap', swapSchema);

module.exports = Swap;