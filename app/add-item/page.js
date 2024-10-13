'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Use next/navigation instead of next/router in Next.js 13+
import { motion } from 'framer-motion';
import Navbar from "@/components/Navbar";

const AddItemForm = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [imageUrl, setImageUrl] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Construct the new item
    const newItem = {
      name,
      price,
      imageUrl,
    };

    try {
      // Send the POST request to the API to save the item
      const res = await fetch('/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newItem),
      });

      if (res.ok) {
        // Reset form fields after successful submission
        setName('');
        setPrice(0);
        setImageUrl('');
        
        // Navigate back to the homepage to see the updated food list
        router.push('/');
      } else {
        console.error('Failed to add item');
      }
    } catch (error) {
      console.error('Error:', error);
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
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-md mt-16">
          <h2 className="text-3xl font-bold mb-4 text-purple-700">Add New Item</h2>
          
          <div className="mb-4">
            <label className="block text-gray-700">Item Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 p-2 border w-full rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Price</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="mt-1 p-2 border w-full rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Image URL</label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="mt-1 p-2 border w-full rounded-md"
              required
            />
          </div>

          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200">
            Add Item
          </button>
        </form>
      </motion.div>
    </>
  );
};

export default AddItemForm;
