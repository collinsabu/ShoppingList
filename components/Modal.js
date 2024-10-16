import React from 'react';

const Modal = ({ isOpen, onClose, item, onAddToCart }) => {
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const quantity = e.target.quantity.value;
    const totalPrice = item.price * quantity;
    const formattedDate = new Date().toLocaleDateString('en-GB');

    // Ensure `imageUrl` is passed when adding to the cart
    onAddToCart({ 
      ...item, 
      quantity, 
      totalPrice, 
      date: formattedDate, 
      imageUrl: item.imageUrl // Include imageUrl in the payload
    });
    onClose(); // Close modal after adding to cart
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-11/12 max-w-md">
        <h2 className="text-lg font-bold mb-4">{item.name}</h2>
        <img src={item.imageUrl} alt={item.name} className="h-40 w-full object-cover mb-4" />
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="quantity" className="block text-gray-700">Quantity:</label>
            <input
              type="number"
              name="quantity"
              min="1"
              defaultValue="1"
              className="border rounded w-full p-2"
            />
          </div>
          <button type="submit" className="bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition-all">
            Add to Cart
          </button>
          <button
            type="button"
            onClick={onClose}
            className="ml-2 text-gray-700 underline hover:text-gray-900"
          >
            Close
          </button>
        </form>
      </div>
    </div>
  );
};

export default Modal;