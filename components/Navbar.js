"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AiOutlineShoppingCart } from "react-icons/ai"; // Import shopping cart icon
import { motion, AnimatePresence } from "framer-motion"; // Import Framer Motion
import SignOut from "@/components/SignOut"; // Import the SignOut component (ensure it's correct)

const Navbar = () => {
  const [cartItemCount, setCartItemCount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Fetch total cart items from the database
    const fetchCartItemCount = async () => {
      try {
        const response = await fetch("/api/cart-count"); // API route to get total cart count
        const data = await response.json();
        setCartItemCount(data.totalItems);
      } catch (error) {
        console.error("Error fetching cart item count:", error);
      }
    };

    fetchCartItemCount();
  }, []);

  return (
    <nav className="bg-purple-600 p-4 text-white fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Left section: Logo and title */}
        <div className="flex items-center">
          <Link href="/" className="text-xl font-bold">
            Shopping App
          </Link>

          {/* Shopping Cart Icon with item count */}
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

        {/* Mobile menu icon */}
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

        {/* Right section: Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }} // Starting state
              animate={{ opacity: 1, y: 0 }} // Animate to this state
              exit={{ opacity: 0, y: -20 }} // Exit state
              transition={{ duration: 0.3 }} // Animation duration
              className=" flex flex-col absolute top-16 right-4 bg-purple-600 p-4 rounded-lg shadow-lg space-y-4 z-10" // Adjusted space-y to space-y-4 for more margin
            >
              <Link href="/" className="hover:text-purple-300 transition-colors text-center ">
                Home
              </Link>
              <Link href="/add-item" className="hover:text-purple-300 transition-colors text-center">
                Add Item
              </Link>
              <SignOut /> {/* Add the SignOut button here */}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
