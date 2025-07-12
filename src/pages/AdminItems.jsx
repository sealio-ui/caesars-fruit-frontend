import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminItems = () => {
  const [items, setItems] = useState([]);

  const fetchItems = async () => {
    try {
      const res = await axios.get('https://caesars-fruit-backend.vercel.app/api/item');
      setItems(res.data);
    } catch (err) {
      console.error('Failed to fetch items', err);
    }
  };

  const deleteItem = async (id) => {
    try {
      await axios.delete(`https://caesars-fruit-backend.vercel.app/api/item/${id}`);
      fetchItems();
    } catch (err) {
      console.error('Failed to delete item', err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Items</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item) => (
          <div key={item._id} className="bg-white p-4 rounded shadow relative">
            <h2 className="text-lg font-semibold">{item.name}</h2>
            <p className="text-sm">Type: {item.type}</p>
            <p className="text-sm">Stock: {item.quantityAvailable}</p>
            <p className="text-sm font-medium">
              Price: {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.price)}
            </p>
            <button
              onClick={() => deleteItem(item._id)}
              className="absolute top-2 right-2 text-red-500 text-sm"
            >✕</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminItems;
