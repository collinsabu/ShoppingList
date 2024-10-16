"use client";
import React, { useEffect, useState } from "react";
import {
  AiFillEdit,
  AiFillDelete,
  AiOutlineCheckCircle,
  AiOutlineDownload,
} from "react-icons/ai";
import { motion } from "framer-motion";
import Image from "next/image";
import EditItemModal from "@/components/EditItemModal"; // Modal component for editing
import jsPDF from "jspdf"; // Library to handle PDF download
import ClipLoader from "react-spinners/ClipLoader"; // Import ClipLoader
import Navbar from "@/components/Navbar";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null); // Item to be edited
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch cart items from the backend (API)
  useEffect(() => {
    const fetchCartItems = async () => {
      setLoading(true); // Start loading
      try {
        const response = await fetch("/api/cart");
        const data = await response.json();
        setCartItems(data.cartItems);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchCartItems();
  }, []);

  // Calculate total price
  useEffect(() => {
    const total = cartItems.reduce((acc, item) => acc + item.totalPrice, 0);
    setCartTotal(total);
  }, [cartItems]);

  // Mark item as "shopped"
  const markAsShopped = (id) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item._id === id ? { ...item, isShopped: !item.isShopped } : item
      )
    );
  };

  // Delete item
  const deleteItem = async (id) => {
    try {
      await fetch(`/api/cart/${id}`, { method: "DELETE" });
      setCartItems(cartItems.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  // Open edit modal
  const openEditModal = (item) => {
    setCurrentItem(item);
    setIsEditModalOpen(true);
  };

  // Update item after edit
  const updateItem = (updatedItem) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item._id === updatedItem._id ? updatedItem : item
      )
    );
  };

  // Download functionality to save the cart as PDF
  const downloadCartAsPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("Shopping Cart Details", 10, 10);
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 10, 20);

    // Table Header
    const headers = ["Item", "Quantity", "Total Price"];
    const data = cartItems.map((item) => [
      String(item.name), // Ensure name is a string
      String(item.quantity), // Ensure quantity is a string
      `£${item.totalPrice.toFixed(2)}`, // Total price is already a formatted string
    ]);

    // Add a line below the headers
    const startY = 30;
    const headerHeight = 10;
    const rowHeight = 10;
    const columnWidths = [80, 30, 40];

    // Set the header style
    doc.setFont("helvetica", "bold");
    headers.forEach((header, index) => {
      doc.text(header, 10 + columnWidths.slice(0, index).reduce((a, b) => a + b, 0), startY);
    });

    // Draw a line below the headers
    doc.line(10, startY + headerHeight, 190, startY + headerHeight);

    // Reset font for the data rows
    doc.setFont("helvetica", "normal");

    // Add data to PDF
    data.forEach((row, rowIndex) => {
      row.forEach((cell, cellIndex) => {
        const x = 10 + columnWidths.slice(0, cellIndex).reduce((a, b) => a + b, 0);
        doc.text(String(cell), x, startY + (rowIndex + 1) * rowHeight + headerHeight);
      });
    });

    // Add the total price at the end
    const totalPositionY = startY + (data.length + 1) * rowHeight + headerHeight;
    doc.setFontSize(16);
    doc.text(`Cart Total: £${cartTotal.toFixed(2)}`, 10, totalPositionY);
    doc.line(10, totalPositionY - 3, 190, totalPositionY - 3); // Draw a line above the total

    // Save the PDF
    doc.save("cart.pdf");
  };

  return (
    <main>
      <Navbar />

      <div className="container mx-auto p-2 bg-[#9E7BB3] mt-14">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">Your Shopping Cart</h1>
          {/* Download Icon */}
          <AiOutlineDownload
            className="text-2xl cursor-pointer hover:text-gray-700"
            title="Download Cart"
            onClick={downloadCartAsPDF}
          />
        </div>

        {/* Loading state */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <ClipLoader color="#ffffff" loading={loading} size={50} />
          </div>
        ) : (
          <div className="cart-content space-y-2">
            {cartItems.length === 0 ? (
              <p className="text-center text-gray-500">Your cart is empty.</p>
            ) : (
              cartItems.map((item) => (
                <motion.div
                  key={item._id}
                  className={`flex items-center justify-between p-2 rounded-lg shadow-md transition-all duration-300 ${
                    item.isShopped ? "bg-red-200" : "bg-white"
                  }`}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  whileHover={{ scale: 1.02 }}
                >
                  {/* Small Image */}
                  <div className="w-12 h-12 flex-shrink-0">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      width={48}
                      height={48}
                      className="object-cover rounded-lg"
                    />
                  </div>

                  {/* Item Details */}
                  <div className="flex-1 mx-2">
                    <h2 className="text-sm font-semibold">{item.name}</h2>
                    <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                    <p className="text-xs text-gray-600">
                      Date: {new Date(item.date).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Total Price */}
                  <div className="text-sm font-bold">£{item.totalPrice.toFixed(2)}</div>

                  {/* Action Icons */}
                  <div className="flex space-x-2">
                    {/* Edit Icon */}
                    <AiFillEdit
                      className="text-blue-500 text-lg cursor-pointer hover:text-blue-700 transition-colors"
                      title="Edit"
                      onClick={() => openEditModal(item)}
                    />

                    {/* Delete Icon */}
                    <AiFillDelete
                      className="text-red-500 text-lg cursor-pointer hover:text-red-700 transition-colors"
                      title="Delete"
                      onClick={() => deleteItem(item._id)}
                    />

                    {/* Mark as Shopped */}
                    <AiOutlineCheckCircle
                      className={`text-lg cursor-pointer ${
                        item.isShopped ? "text-green-500" : "text-gray-400"
                      } hover:text-green-600 transition-colors`}
                      title="Mark as Shopped"
                      onClick={() => markAsShopped(item._id)}
                    />
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}

        {/* Total Price Display */}
        {cartItems.length > 0 && (
          <div className="mt-4 p-2 bg-purple-600 text-white rounded-lg text-center shadow-md">
            <h2 className="text-lg font-bold mt-2">Cart Total: £{cartTotal.toFixed(2)}</h2>
          </div>
        )}

        {/* Edit Item Modal */}
        {isEditModalOpen && (
          <EditItemModal
            item={currentItem}
            onClose={() => setIsEditModalOpen(false)}
            onSave={updateItem}
          />
        )}
      </div>
    </main>
  );
};


export default CartPage;