'use client';
import { useState, useEffect } from 'react';
import { FaEdit } from 'react-icons/fa'; // For the edit icon
import { ClipLoader } from 'react-spinners'; // Importing ClipLoader

const FoodList = () => {
  const [items, setItems] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editItem, setEditItem] = useState(null); // Stores the item being edited
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [error, setError] = useState(null); // State to handle any error
  const [isLoading, setIsLoading] = useState(true); // Loading state

  // State for form inputs during editing
  const [editedName, setEditedName] = useState('');
  const [editedPrice, setEditedPrice] = useState('');
  const [editedImageUrl, setEditedImageUrl] = useState('');

  // State for add to cart form inputs
  const [quantity, setQuantity] = useState(1);

  // Fetch items on mount
  useEffect(() => {
    async function fetchItems() {
      setIsLoading(true); // Start loading
      try {
        const res = await fetch('/api/items');

        // Log the raw response for debugging
        console.log('Raw response:', res);

        // Check if the response is ok
        if (!res.ok) {
          throw new Error(`Failed to fetch: ${res.status}`);
        }

        // Log the content type for debugging
        const contentType = res.headers.get('content-type');
        console.log('Content type:', contentType);

        // Check if response is valid JSON
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Invalid content type, expected JSON');
        }

        const data = await res.json();
        console.log('Fetched items:', data); // Log fetched items for debugging
        setItems(data);
      } catch (error) {
        console.error('Error fetching items:', error);
        setError('Failed to fetch items');
      } finally {
        setIsLoading(false); // Stop loading
      }
    }
    fetchItems();
  }, []);

  // Function to handle opening the edit modal
  const openEditModal = (item) => {
    setIsEditing(true);
    setEditItem(item);
    setEditedName(item.name);
    setEditedPrice(item.price);
    setEditedImageUrl(item.imageUrl);
  };

  // Function to handle opening the add to cart modal
  const openAddToCartModal = (item) => {
    setIsAddingToCart(true);
    setSelectedItem(item);
  };

  // Function to handle updating the item
  const handleUpdate = async (e) => {
    e.preventDefault();

    const updatedItem = {
      name: editedName,
      price: editedPrice,
      imageUrl: editedImageUrl,
    };

    try {
      const res = await fetch(`/api/items/${editItem._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedItem),
      });

      if (res.ok) {
        const updatedData = await res.json();

        // Update the UI to reflect the changes
        setItems((prevItems) =>
          prevItems.map((item) =>
            item._id === editItem._id ? updatedData : item
          )
        );

        // Close modal
        setIsEditing(false);
      } else {
        throw new Error('Failed to update item');
      }
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();

    const formattedDate = new Date().toLocaleDateString('en-GB');
    const totalPrice = selectedItem.price * quantity;

    const cartItem = {
      ...selectedItem,
      quantity,
      totalPrice,
      date: formattedDate,
    };

    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cartItem),
      });

      if (res.ok) {
        alert("Item added to cart!");
        setIsAddingToCart(false);
      } else {
        throw new Error('Failed to add item to cart');
      }
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#9E7BB3] p-6">
      <div className="container mx-auto text-center">
        {/* Heading */}
        <h2 className="text-xl font-bold text-white mb-6">Available Food Items</h2>

        {/* Display error message if exists */}
        {error && <p className="text-red-600">{error}</p>}

        {/* Loading Animation */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-40">
            <ClipLoader color="#ffffff" loading={isLoading} size={50} />
            <p className="text-white mt-4">Loading items...</p>
          </div>
        ) : (
          // Grid for food items
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
            {items.map((item, index) => (
              <div
                key={item._id}
                className="bg-white border border-purple-300 p-4 rounded-lg shadow-lg relative"
              >
                {/* Image */}
                <img 
                  src={item.imageUrl} 
                  alt={item.name} 
                  className="h-40 w-full object-cover rounded-md mb-4 transition-transform duration-300 hover:scale-105 cursor-pointer" 
                  onClick={() => openAddToCartModal(item)} // Show modal on image click
                />
                
                {/* Edit Icon */}
                <button 
                  className="absolute top-2 right-2 text-purple-600 hover:text-purple-800"
                  onClick={() => openEditModal(item)}
                >
                  <FaEdit size={18} />
                </button>

                {/* Item Name */}
                <h3 className="text-lg font-bold text-purple-800 mb-1 text-left">{item.name}</h3>
                
                {/* Item Price */}
                <p className="text-gray-700 text-left">£{item.price}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal for editing */}
      {isEditing && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4">Edit Item</h3>
            <form onSubmit={handleUpdate}>
              {/* Edit Item Name */}
              <div className="mb-4">
                <label className="block text-gray-700">Name:</label>
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>

              {/* Edit Item Price */}
              <div className="mb-4">
                <label className="block text-gray-700">Price:</label>
                <input
                  type="number"
                  value={editedPrice}
                  onChange={(e) => setEditedPrice(e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>

              {/* Edit Image URL */}
              <div className="mb-4">
                <label className="block text-gray-700">Image URL:</label>
                <input
                  type="text"
                  value={editedImageUrl}
                  onChange={(e) => setEditedImageUrl(e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="mr-4 bg-gray-400 hover:bg-gray-500 text-white py-2 px-4 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for adding to cart */}
      {isAddingToCart && selectedItem && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4">Add to Cart</h3>
            <form onSubmit={handleAddToCart}>
              {/* Quantity Input */}
              <div className="mb-4">
                <label className="block text-gray-700">Quantity:</label>
                <input
                  type="number"
                  value={quantity}
                  min="1"
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsAddingToCart(false)}
                  className="mr-4 bg-gray-400 hover:bg-gray-500 text-white py-2 px-4 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded"
                >
                  Add to Cart
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodList;
