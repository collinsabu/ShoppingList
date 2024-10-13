import { connectDB } from '@/lib/db';
import ShoppingList from '@/models/ShoppingList';

export async function GET(req) {
  await connectDB();
  const month = new Date().toLocaleString('en-US', { month: 'long' });
  const list = await ShoppingList.findOne({ month }).populate('items.item');
  return new Response(JSON.stringify(list), { status: 200 });
}

export async function POST(req) {
  await connectDB();
  const { itemId, quantity, month } = await req.json();
  const item = await Item.findById(itemId);

  const list = await ShoppingList.findOneAndUpdate(
    { month },
    { $push: { items: { item: itemId, quantity, totalPrice: item.price * quantity } } },
    { new: true, upsert: true }
  );
  
  return new Response(JSON.stringify(list), { status: 201 });
}
