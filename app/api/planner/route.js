// /app/api/planner/route.js

import { connectDB } from '@/lib/db';
import MealPlanner from '@/models/MealPlanner';

// POST handler for adding or updating a meal to the planner
export async function POST(req) {
  const { day, mealTime, menu } = await req.json(); // Get the meal data from the request

  await connectDB(); // Connect to the database

  try {
    const meal = {
      day,
      mealTime,
      menu,
    };

    // Upsert the meal plan (create new or update if exists)
    const result = await MealPlanner.findOneAndUpdate(
      { day, mealTime }, // Find the meal by day and mealTime
      meal, // Update the menu for the meal time
      { upsert: true, new: true } // Create new if it doesn't exist (upsert)
    );

    return new Response(JSON.stringify(result), { status: 201 }); // Success response
  } catch (error) {
    console.error('Error adding/updating meal:', error);
    return new Response(JSON.stringify({ error: 'Failed to add or update meal' }), { status: 500 });
  }
}

// GET handler for fetching the weekly meal plan
export async function GET() {
  await connectDB(); // Connect to the database

  try {
    const meals = await MealPlanner.find({}); // Retrieve all meals from the database
    const planner = meals.reduce((acc, meal) => {
      if (!acc[meal.day]) {
        acc[meal.day] = {};
      }
      acc[meal.day][meal.mealTime] = meal.menu;
      return acc;
    }, {});

    return new Response(JSON.stringify(planner), { status: 200 }); // Success response
  } catch (error) {
    console.error('Error fetching meal planner:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch meal planner' }), { status: 500 });
  }
}

// DELETE handler for resetting the planner
export async function DELETE() {
  await connectDB(); // Connect to the database

  try {
    // Delete all meal plans
    await MealPlanner.deleteMany({});

    return new Response(JSON.stringify({ message: 'Meal planner reset successfully' }), { status: 200 });
  } catch (error) {
    console.error('Error resetting planner:', error);
    return new Response(JSON.stringify({ error: 'Failed to reset planner' }), { status: 500 });
  }
}
