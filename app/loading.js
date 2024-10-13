"use client";
import React from "react";
import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="flex justify-center items-center h-screen bg-white">
      <motion.div
        className="loading-spinner border-t-4 border-purple-600 rounded-full w-16 h-16"
        animate={{ rotate: 360 }} // Rotates the circle
        transition={{
          repeat: Infinity, // Makes it spin continuously
          duration: 1, // Adjust the speed of the spin
          ease: "linear", // Smooth linear spin
        }}
      ></motion.div>
    </div>
  );
}
