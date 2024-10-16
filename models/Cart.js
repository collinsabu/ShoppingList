// File: models/Cart.js

import mongoose from 'mongoose';

// Define the Cart schema
const cartSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  date: { 
    type: Date, 
    required: true, 
  },
  imageUrl: { type: String, required: true },
});

// Export the Cart model
export default mongoose.models.Cart || mongoose.model('Cart', cartSchema);
