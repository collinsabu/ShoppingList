'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion'; // Added AnimatePresence for conditional rendering animations
import { AiFillEdit, AiFillDelete } from 'react-icons/ai'; // Importing the edit and delete icons
import Navbar from "@/components/Navbar";

export default function MealPlannerListPage() {
  const [planner, setPlanner] = useState({});
  const [editingMeal, setEditingMeal] = useState({ day: '', mealTime: '', newMeal: '' });
  const [showEditPopup, setShowEditPopup] = useState(false); // To control the visibility of the popup

  // Fetch the meal planner
  useEffect(() => {
    async function fetchPlanner() {
      try {
        const response = await axios.get('/api/planner');
        setPlanner(response.data);
      } catch (error) {
        console.error('Error fetching planner:', error);
      }
    }

    fetchPlanner();
  }, []);

  // Handle meal edit
  const handleEditMeal = async (day, mealTime) => {
    if (editingMeal.newMeal.trim()) {
      const updatedPlanner = { ...planner };
      updatedPlanner[day][mealTime] = editingMeal.newMeal;

      try {
        await axios.put(`/api/planner/${mealTime}`, { day, newMeal: editingMeal.newMeal });
        setPlanner(updatedPlanner);
        setShowEditPopup(false); // Hide popup on save
        setEditingMeal({ day: '', mealTime: '', newMeal: '' }); // Clear the edit form
      } catch (error) {
        console.error('Error updating meal:', error);
      }
    }
  };

  // Handle meal delete
  const handleDeleteMeal = async (day, mealTime) => {
    const updatedPlanner = { ...planner };
    delete updatedPlanner[day][mealTime];

    try {
      await axios.delete(`/api/planner/${mealTime}`, { data: { day } });
      setPlanner(updatedPlanner);
    } catch (error) {
      console.error('Error deleting meal:', error);
    }
  };

  // Reset the planner
  const handleReset = async () => {
    try {
      await axios.delete('/api/planner');
      setPlanner({});
    } catch (error) {
      console.error('Error resetting planner:', error);
    }
  };

  // Handle opening the edit popup
  const openEditPopup = (day, mealTime) => {
    setEditingMeal({ day, mealTime, newMeal: planner[day][mealTime] });
    setShowEditPopup(true); // Show the popup
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
        <div className="container mx-auto py-10 mb-10">
          <h2 className="text-2xl font-bold text-white mb-4 mt-10">Planner</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.keys(planner).map((day) => (
              <div key={day} className="p-4 bg-white shadow rounded-lg">
                <h3 className="text-lg font-bold text-purple-600">{day}</h3>
                <ul className="list-disc ml-4 mt-2">
                  {Object.keys(planner[day]).map((mealTime) => (
                    <li key={mealTime} className="flex justify-between items-center">
                      <div>
                        <strong>{mealTime}:</strong> {planner[day][mealTime]}
                      </div>
                      <div className="flex space-x-2">
                        <AiFillEdit
                          className="text-blue-500 cursor-pointer"
                          onClick={() => openEditPopup(day, mealTime)} // Open the edit popup
                        />
                        <AiFillDelete
                          className="text-red-500 cursor-pointer"
                          onClick={() => handleDeleteMeal(day, mealTime)}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <button
            onClick={handleReset}
            className="mt-6 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Reset Planner
          </button>
        </div>

        {/* Edit Popup */}
        <AnimatePresence>
          {showEditPopup && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
              initial={{ y: '-100%', opacity: 0 }} // Initial animation: slide from top
              animate={{ y: '0', opacity: 1 }} // Slide down to the center
              exit={{ y: '-100%', opacity: 0 }} // Slide back up on exit
              transition={{ duration: 0.5 }}
            >
              <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-auto">
                <h4 className="text-lg text-purple-600 font-bold mb-2">
                  Editing {editingMeal.mealTime} on {editingMeal.day}
                </h4>
                <input
                  type="text"
                  className="p-2 border border-gray-300 rounded w-full"
                  value={editingMeal.newMeal}
                  onChange={(e) => setEditingMeal({ ...editingMeal, newMeal: e.target.value })}
                />
                <div className="flex justify-end mt-4">
                  <button
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mr-2"
                    onClick={() => handleEditMeal(editingMeal.day, editingMeal.mealTime)}
                  >
                    Save
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                    onClick={() => setShowEditPopup(false)} // Close the popup
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
