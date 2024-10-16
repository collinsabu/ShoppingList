import { NextResponse } from 'next/server';
import MealPlanner from '@/models/MealPlanner';
import mongoose from 'mongoose';

// Connect to MongoDB
async function connectToDB() {
  if (mongoose.connection.readyState !== 1) {
    try {
      await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('MongoDB connection error:', error);
      throw new Error('Database connection error');
    }
  }
}

// PUT request for editing a meal
export async function PUT(req, { params }) {
  const { mealTime } = params;
  const { day, newMeal } = await req.json();

  try {
    await connectToDB();

    const updatedMeal = await MealPlanner.findOneAndUpdate(
      { day, mealTime },
      { menu: newMeal },
      { new: true } // Return the updated document
    );

    if (!updatedMeal) {
      return NextResponse.json({ message: 'Meal not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Meal updated successfully', updatedMeal });
  } catch (error) {
    console.error('Error updating meal:', error);
    return NextResponse.json({ message: 'Error updating meal' }, { status: 500 });
  }
}

// DELETE request for deleting a meal
export async function DELETE(req, { params }) {
  const { mealTime } = params;
  const { day } = await req.json();

  try {
    await connectToDB();

    const deletedMeal = await MealPlanner.findOneAndDelete({ day, mealTime });

    if (!deletedMeal) {
      return NextResponse.json({ message: 'Meal not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Meal deleted successfully' });
  } catch (error) {
    console.error('Error deleting meal:', error);
    return NextResponse.json({ message: 'Error deleting meal' }, { status: 500 });
  }
}
