import { connectDB } from '@/lib/db';
import Item from '@/models/Item';

export async function GET(req) {
  try {
    await connectDB();
    const items = await Item.find();
    return new Response(JSON.stringify(items), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching items in API: ", error);
    return new Response(JSON.stringify({ error: 'Failed to fetch items' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
}


export async function POST(req) {
  try {
    await connectDB();
    const { name, price, imageUrl } = await req.json();
    const newItem = new Item({ name, price, imageUrl });
    await newItem.save();
    return new Response(JSON.stringify(newItem), { status: 201 });
  } catch (error) {
    console.error('Error creating item:', error);
    return new Response('Failed to create item', { status: 500 });
  }
}
