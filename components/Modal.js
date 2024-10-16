import React from 'react';

const Modal = ({ isOpen, onClose, item, onAddToCart }) => {
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const date = new Date().toISOString(); // Ensuring consistent date format
    onAddToCart({ ...item, date });
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-bold mb-4">Add to Cart</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Quantity:</label>
            <input type="number" min="1" className="w-full border border-gray-300 p-2 rounded" />
          </div>
          <div className="flex justify-end">
            <button type="button" onClick={onClose} className="mr-4 bg-gray-400 hover:bg-gray-500 text-white py-2 px-4 rounded">
              Cancel
            </button>
            <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded">
              Add to Cart
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
