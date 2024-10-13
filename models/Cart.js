import mongoose from 'mongoose';

const CartSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  imageUrl: {
    type: String,
    required: true, // Ensure image URL is saved for each cart item
  },
  isShopped: {
    type: Boolean,
    default: false, // New field to mark if an item is shopped
  },
});

const Cart = mongoose.models.Cart || mongoose.model('Cart', CartSchema);

export default Cart;
