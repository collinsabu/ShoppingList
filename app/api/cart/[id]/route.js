import { connectDB } from '@/lib/db'; // Database connection utility
import Cart from '@/models/Cart'; // Cart model

// DELETE: Remove an item from the cart
export async function DELETE(req, { params }) {
  await connectDB();

  try {
    const { id } = params;
    await Cart.findByIdAndDelete(id);
    return new Response(JSON.stringify({ message: "Item deleted successfully" }), { status: 200 });
  } catch (error) {
    console.error('Error deleting item:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete item' }), { status: 500 });
  }
}


// PUT: Update an item in the cart
export async function PUT(req, { params }) {
  await connectDB();
  const { id } = params;
  const { quantity, totalPrice } = await req.json();

  try {
    const updatedItem = await Cart.findByIdAndUpdate(
      id,
      { quantity, totalPrice },
      { new: true }
    );
    return new Response(JSON.stringify(updatedItem), { status: 200 });
  } catch (error) {
    console.error('Error updating item:', error);
    return new Response(JSON.stringify({ error: 'Failed to update item' }), { status: 500 });
  }
}

