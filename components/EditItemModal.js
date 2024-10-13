import React, { useState, useEffect } from "react";

const EditItemModal = ({ item, onClose, onSave }) => {
  const [updatedQuantity, setUpdatedQuantity] = useState(item.quantity);
  const [calculatedTotalPrice, setCalculatedTotalPrice] = useState(item.totalPrice);

  // Recalculate the total price whenever the quantity changes
  useEffect(() => {
    const newTotalPrice = item.price * updatedQuantity;
    setCalculatedTotalPrice(newTotalPrice);
  }, [updatedQuantity, item.price]);

  // Handle saving the updated quantity and recalculated total price
  const handleSave = async () => {
    const updatedItem = {
      ...item,
      quantity: updatedQuantity,
      totalPrice: calculatedTotalPrice,
    };

    try {
      const response = await fetch(`/api/cart/${item._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedItem),
      });

      const data = await response.json();
      onSave(data); // Update the item in the parent component
      onClose(); // Close the modal
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Edit Quantity</h2>
        <div className="space-y-4">
          {/* Only the quantity input field is editable */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Quantity</label>
            <input
              type="number"
              min="1"
              name="quantity"
              value={updatedQuantity}
              onChange={(e) => setUpdatedQuantity(parseInt(e.target.value, 10))}
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Display the recalculated total price */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Total Price</label>
            <input
              type="text"
              name="totalPrice"
              value={calculatedTotalPrice.toFixed(2)}
              readOnly
              className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditItemModal;
