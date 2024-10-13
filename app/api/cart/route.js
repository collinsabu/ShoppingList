import { connectDB } from '@/lib/db';
import Cart from '@/models/Cart';

// POST handler for adding an item to the cart
export async function POST(req) {
  const { name, price, quantity, totalPrice, date, imageUrl } = await req.json();

  await connectDB(); // Connect to the database

  try {
    const cartItem = {
      name,
      price,
      quantity,
      totalPrice,
      date,
      imageUrl, // Save image URL to the database
    };

    // Save the cart item to the database
    const result = await Cart.create(cartItem);

    return new Response(JSON.stringify(result), { status: 201 }); // Success response
  } catch (error) {
    console.error('Error adding item to cart:', error);
    return new Response(JSON.stringify({ error: 'Failed to add item to cart' }), { status: 500 });
  }
}

// GET handler for fetching all cart items
export async function GET() {
  await connectDB(); // Connect to the database

  try {
    const cartItems = await Cart.find({}); // Retrieve all cart items from the database
    return new Response(JSON.stringify({ cartItems }), { status: 200 }); // Success response
  } catch (error) {
    console.error('Error fetching cart items:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch cart items' }), { status: 500 });
  }
}
