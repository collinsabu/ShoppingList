// /app/api/cart-count/route.js
import { connectDB } from '@/lib/db';
import Cart from '@/models/Cart';

export async function GET(req) {
  await connectDB(); // Connect to your MongoDB

  try {
    const totalItems = await Cart.aggregate([
      {
        $group: {
          _id: null,
          totalQuantity: { $sum: "$quantity" }, // Sum the quantities
        },
      },
    ]);

    const count = totalItems[0]?.totalQuantity || 0;

    return new Response(JSON.stringify({ totalItems: count }), {
      status: 200,
    });
  } catch (error) {
    console.error('Error fetching cart count:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch cart count' }), {
      status: 500,
    });
  }
}
