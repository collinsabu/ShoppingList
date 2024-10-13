import { Schema, model, models } from 'mongoose';

const shoppingItemSchema = new Schema({
  item: { type: Schema.Types.ObjectId, ref: 'Item' },
  quantity: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
});

const shoppingListSchema = new Schema({
  month: { type: String, required: true },
  items: [shoppingItemSchema],
});

const ShoppingList = models.ShoppingList || model('ShoppingList', shoppingListSchema);
export default ShoppingList;
