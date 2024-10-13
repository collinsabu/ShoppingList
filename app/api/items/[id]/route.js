import { connectDB } from '@/lib/db'; // Ensure the path is correct
import Item from '@/models/Item'; // Adjust the path to your Item model
import { ObjectId } from 'mongodb'; // Import ObjectId from MongoDB

export async function PUT(request, { params }) {
  const { id } = params; // Extract the id from the request parameters
  const { name, price, imageUrl } = await request.json(); // Parse the incoming request body

  // Establish database connection
  await connectDB(); // Connect to the database

  try {
    // Update the item in the database
    const updatedItem = await Item.findByIdAndUpdate(
      id,
      { name, price, imageUrl },
      { new: true } // Return the updated document
    );

    if (!updatedItem) {
      return new Response(JSON.stringify({ message: 'Item not found' }), { status: 404 });
    }

    return new Response(JSON.stringify(updatedItem), { status: 200 });
  } catch (error) {
    console.error('Error updating item:', error);
    return new Response(JSON.stringify({ message: 'Failed to update item' }), { status: 500 });
  }
}
