// /models/MealPlanner.js

import mongoose from 'mongoose';

const MealPlannerSchema = new mongoose.Schema({
  day: {
    type: String,
    required: true,
  },
  mealTime: {
    type: String,
    required: true,
  },
  menu: {
    type: String,
    required: true,
  },
});

const MealPlanner = mongoose.models.MealPlanner || mongoose.model('MealPlanner', MealPlannerSchema);

export default MealPlanner;
