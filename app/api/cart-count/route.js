// /app/api/cart-count/route.js
import { connectDB } from '@/lib/db';
import Cart from '@/models/Cart';

export async function GET(req) {
  await connectDB();

  try {
    // Aggregate to sum up the total quantities for all items in the cart
    const totalItems = await Cart.aggregate([
      {
        $group: {
          _id: null,
          totalQuantity: { $sum: "$quantity" }, // Sum all item quantities
        },
      },
    ]);

    const count = totalItems[0]?.totalQuantity || 0; // Default to 0 if no items found

    console.log('Total items in cart:', count); // For debugging

    // Add headers to prevent caching
    return new Response(JSON.stringify({ totalItems: count }), {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Surrogate-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('Error fetching cart count:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch cart count' }), {
      status: 500,
    });
  }
}
