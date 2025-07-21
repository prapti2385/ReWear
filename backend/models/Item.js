// backend/models/Item.js
const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  size: { type: String, required: true },
  condition: { 
    type: String, 
    required: true,
    enum: ['New with tags', 'Used - Like New', 'Used - Good', 'Used - Fair']
  },
  // --- ADD THIS FIELD ---
  pointsValue: {
    type: Number,
    required: [true, 'Please enter a point value for the item.'],
    min: [0, 'Points cannot be negative.']
  },
  tags: [String],
  images: {
    type: [String],
    default: []
  },
  owner: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },
  status: { 
    type: String, 
    enum: ['available', 'swapped', 'pending_approval', 'rejected'], 
    default: 'pending_approval' 
  },
}, { timestamps: true });

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;