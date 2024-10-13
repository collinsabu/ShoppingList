// pages/404.js
"use client"; // Ensure this is a client component

import React from "react";
import { motion } from "framer-motion";

const NotFound = () => {
  // Animation variants
  const variants = {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <motion.div
        className="text-center"
        initial="initial"
        animate="animate"
        exit="exit"
        variants={variants}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-6xl font-bold text-purple-500">404</h1>
        <p className="mt-4 text-2xl">Oops! Page Not Found</p>
        <p className="mt-2 text-gray-600">
          The page you are looking for might have been removed,
          had its name changed, or is temporarily unavailable.
        </p>
        <motion.a
          href="/"
          className="mt-6 inline-block px-4 py-2 text-white bg-purple-600 rounded-lg hover:bg-blue-700 transition"
          whileHover={{ scale: 1.05 }}
        >
          Go Home
        </motion.a>
      </motion.div>
    </div>
  );
};

export default NotFound;
