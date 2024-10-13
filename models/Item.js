import { Schema, model, models } from 'mongoose';

const itemSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  imageUrl: { type: String, required: true },
});

const Item = models.Item || model('Item', itemSchema);
export default Item;
