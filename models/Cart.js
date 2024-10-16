// File: models/Cart.js

import mongoose from 'mongoose';

// Helper function to parse date in "DD/MM/YYYY" format
const parseDate = (dateString) => {
  const [day, month, year] = dateString.split('/');
  return new Date(`${year}-${month}-${day}`);
};

// Define the Cart schema
const cartSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  date: { 
    type: Date, 
    required: true,
    // Custom setter to parse the date before saving
    set: (value) => (typeof value === 'string' ? parseDate(value) : value),
  },
  imageUrl: { type: String, required: true },
});

// Export the Cart model
export default mongoose.models.Cart || mongoose.model('Cart', cartSchema);
