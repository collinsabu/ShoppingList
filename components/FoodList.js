'use client';
import { useState, useEffect } from 'react';
import { FaEdit } from 'react-icons/fa';
import { ClipLoader } from 'react-spinners';

const FoodList = () => {
  const [items, setItems] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [editedName, setEditedName] = useState('');
  const [editedPrice, setEditedPrice] = useState('');
  const [editedImageUrl, setEditedImageUrl] = useState('');

  const [quantity, setQuantity] = useState(1);

  // Fetch items on mount
  useEffect(() => {
    async function fetchItems() {
      setIsLoading(true);
      try {
        const res = await fetch('/api/items');
        if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
        const data = await res.json();
        setItems(data);
      } catch (error) {
        console.error('Error fetching items:', error);
        setError('Failed to fetch items');
      } finally {
        setIsLoading(false);
      }
    }
    fetchItems();
  }, []);

  const openEditModal = (item) => {
    setIsEditing(true);
    setEditItem(item);
    setEditedName(item.name);
    setEditedPrice(item.price);
    setEditedImageUrl(item.imageUrl);
  };

  const openAddToCartModal = (item) => {
    setIsAddingToCart(true);
    setSelectedItem(item);
  };

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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedItem),
      });
      if (res.ok) {
        const updatedData = await res.json();
        setItems((prevItems) =>
          prevItems.map((item) => (item._id === editItem._id ? updatedData : item))
        );
        setIsEditing(false);
      } else throw new Error('Failed to update item');
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    const formattedDate = new Date().toISOString();
    const totalPrice = selectedItem.price * quantity;
    const cartItem = {
      ...selectedItem,
      quantity: parseInt(quantity), // Ensure quantity is an integer
      totalPrice,
      date: formattedDate,
    };
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cartItem),
      });
      if (res.ok) {
        alert('Item added to cart!');
        setIsAddingToCart(false);
      } else throw new Error('Failed to add item to cart');
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#9E7BB3] p-6">
      <div className="container mx-auto text-center">
        <h2 className="text-xl font-bold text-white mb-6">Available Food Items</h2>
        {error && <p className="text-red-600">{error}</p>}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-40">
            <ClipLoader color="#ffffff" loading={isLoading} size={50} />
            <p className="text-white mt-4">Loading items...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
            {items.map((item) => (
              <div key={item._id} className="bg-white border border-purple-300 p-4 rounded-lg shadow-lg relative">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="h-40 w-full object-cover rounded-md mb-4 transition-transform duration-300 hover:scale-105 cursor-pointer"
                  onClick={() => openAddToCartModal(item)}
                />
                <button className="absolute top-2 right-2 text-purple-600 hover:text-purple-800" onClick={() => openEditModal(item)}>
                  <FaEdit size={18} />
                </button>
                <h3 className="text-lg font-bold text-purple-800 mb-1 text-left">{item.name}</h3>
                <p className="text-gray-700 text-left">£{item.price}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {isEditing && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4">Edit Item</h3>
            <form onSubmit={handleUpdate}>
              <div className="mb-4">
                <label className="block text-gray-700">Name:</label>
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Price:</label>
                <input
                  type="number"
                  value={editedPrice}
                  onChange={(e) => setEditedPrice(e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Image URL:</label>
                <input
                  type="text"
                  value={editedImageUrl}
                  onChange={(e) => setEditedImageUrl(e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>
              <div className="flex justify-end">
                <button type="button" onClick={() => setIsEditing(false)} className="mr-4 bg-gray-400 hover:bg-gray-500 text-white py-2 px-4 rounded">
                  Cancel
                </button>
                <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isAddingToCart && selectedItem && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4">Add to Cart</h3>
            <form onSubmit={handleAddToCart}>
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
              <div className="flex justify-end">
                <button type="button" onClick={() => setIsAddingToCart(false)} className="mr-4 bg-gray-400 hover:bg-gray-500 text-white py-2 px-4 rounded">
                  Cancel
                </button>
                <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded">
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
