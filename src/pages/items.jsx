import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Items = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await axios.get('https://caesars-fruit-backend.vercel.app/api/item'); // adjust if route is different
      setItems(res.data);
    } catch (err) {
      console.error('Failed to fetch items', err);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Item List</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item) => (
          <div key={item._id} className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold">{item.name}</h2>
            <p className="text-sm">Type: {item.type}</p>
            <p className="text-sm">Stock: {item.quantityAvailable}</p>
            <p className="text-sm font-medium">
              Price:{' '}
              {new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
              }).format(item.price)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Items;
