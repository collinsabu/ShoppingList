"use client";

import { useState } from "react";
import axios from "axios";
import Navbar from "@/components/Navbar";
import { motion } from 'framer-motion';

export default function MealPlannerForm() {
  const [newMeal, setNewMeal] = useState({ day: "", mealTime: "", menu: "" });
  const [showNotification, setShowNotification] = useState(false); // State to control the pop-up

  // Predefined options for days of the week and meal times
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const mealTimes = ["Breakfast", "Lunch", "Dinner"];

  // Handle input changes
  const handleChange = (e) => {
    setNewMeal({
      ...newMeal,
      [e.target.name]: e.target.value,
    });
  };

  // Add or update a meal
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/planner", newMeal);
      setNewMeal({ day: "", mealTime: "", menu: "" }); // Reset form

      // Show the notification for a few seconds
      setShowNotification(true);
      setTimeout(() => {
        setShowNotification(false);
      }, 3000); // Hide the notification after 3 seconds

    } catch (error) {
      console.error("Error adding meal:", error);
    }
  };

  return (
    <>
      <Navbar />
      <motion.div
        className="flex flex-col items-center p-4 bg-gradient-to-b from-purple-600 to-purple-300 min-h-screen"
        initial={{ y: -100, opacity: 0 }} // Initial state for slide-in effect
        animate={{ y: 0, opacity: 1 }} // Animate to final state
        transition={{ duration: 0.5 }} // Duration of the animation
      >
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 mt-10"
        >
          <h1 className="text-xl font-bold mb-6 text-center text-purple-600">
            Weekly Meal Planner
          </h1>
          <div className="mb-4">
            <label
              className="block text-purple-700 text-sm font-bold mb-2"
              htmlFor="day"
            >
              Day
            </label>
            <select
              name="day"
              value={newMeal.day}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            >
              <option value="" disabled>
                Select a day
              </option>
              {daysOfWeek.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label
              className="block text-purple-700 text-sm font-bold mb-2"
              htmlFor="mealTime"
            >
              Meal Time
            </label>
            <select
              name="mealTime"
              value={newMeal.mealTime}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            >
              <option value="" disabled>
                Select a meal time
              </option>
              {mealTimes.map((mealTime) => (
                <option key={mealTime} value={mealTime}>
                  {mealTime}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label
              className="block text-purple-700 text-sm font-bold mb-2"
              htmlFor="menu"
            >
              Menu
            </label>
            <input
              type="text"
              name="menu"
              value={newMeal.menu}
              onChange={handleChange}
              placeholder="e.g. Pancakes"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Add Meal
            </button>
          </div>
        </form>

        {/* Pop-up notification */}
        {showNotification && (
          <motion.div
            className="fixed top-5 right-5 bg-green-500 text-white font-bold py-2 px-4 rounded shadow-lg"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            Your meal has been added!
          </motion.div>
        )}
      </motion.div>
    </>
  );
}
