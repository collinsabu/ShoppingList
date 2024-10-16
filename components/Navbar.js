// components/Navbar.js
"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";
import SignOut from "@/components/SignOut";

const Navbar = () => {
  const [cartItemCount, setCartItemCount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const fetchCartItemCount = async () => {
      try {
        const response = await fetch("/api/cart-count", {
          headers: { 'Cache-Control': 'no-store' } // Prevent client-side caching
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Fetched cart count:", data.totalItems); // Log the response data for debugging
        setCartItemCount(data.totalItems); // Ensure the key `totalItems` is correct
      } catch (error) {
        console.error("Error fetching cart item count:", error);
      }
    };

    // Initial fetch on mount
    fetchCartItemCount();

    // Poll for cart item count every 5 seconds
    const interval = setInterval(fetchCartItemCount, 5000);

    // Cleanup interval when the component unmounts
    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="bg-purple-600 p-4 text-white fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="text-xl font-bold">
            Shopping App
          </Link>
          <div className="relative ml-4">
            <Link
              href="/cart"
              className="hover:text-purple-300 transition-colors flex items-center"
            >
              <AiOutlineShoppingCart className="text-2xl" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-2 text-xs">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        <div className="hidden md:flex space-x-4">
          <Link href="/" className="hover:text-purple-300 transition-colors">
            Home
          </Link>
          <Link href="/add-item" className="hover:text-purple-300 transition-colors">
            Add Item
          </Link>
          <Link href="/mealplanner" className="hover:text-purple-300 transition-colors">
            Meal Planner
          </Link>
          <Link href="/mealmenu" className="hover:text-purple-300 transition-colors">
            Meal Menu
          </Link>
          <Link href="/cart" className="hover:text-purple-300 transition-colors">
            Cart Items
          </Link>
          <SignOut />
        </div>

        <button
          className="block md:hidden text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col text-center absolute top-16 right-4 bg-purple-600 p-4 rounded-lg shadow-lg space-y-4 z-10"
            >
              <Link href="/" className="hover:text-purple-300 transition-colors text-center ">
                Home
              </Link>
              <Link href="/add-item" className="hover:text-purple-300 transition-colors text-center">
                Add Item
              </Link>
              <Link href="/mealplaner" className="hover:text-purple-300 transition-colors text-center">
                Meal Planner
              </Link>
              <Link href="/mealmenu" className="hover:text-purple-300 transition-colors text-center">
                Meal Menu
              </Link>
              <Link href="/cart" className="hover:text-purple-300 transition-colors text-center">
                Cart Items
              </Link>
              <SignOut />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
