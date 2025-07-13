import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Items = ({ isAdmin }) => {
  const [items, setItems] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await axios.get('https://caesars-fruit-backend.vercel.app/api/item');
      setItems(res.data);
    } catch (err) {
      console.error('Failed to fetch items', err);
    }
  };

  const handleInputChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = field === 'price' || field === 'quantityAvailable' ? Number(value) : value;
    setItems(updated);
  };

  const saveItemChanges = async (item) => {
    try {
      await axios.put(`https://caesars-fruit-backend.vercel.app/api/item/${item._id}`, {
        name: item.name,
        price: item.price,
        type: item.type,
        quantityAvailable: item.quantityAvailable
      });
      setMessage('✅ Item updated');
      setEditIndex(null);
      fetchItems();
    } catch (err) {
      console.error('Failed to update item', err);
      setMessage('❌ Update failed');
    }
  };

  const addPurchase = async (itemId, quantity) => {
    try {
      await axios.post('https://caesars-fruit-backend.vercel.app/api/purchase', {
        itemId,
        quantity
      });
      setMessage('✅ Stock increased');
      fetchItems();
    } catch (err) {
      console.error('Failed to add purchase', err);
      setMessage('❌ Purchase failed');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Item List</h1>

      {message && <p className="text-blue-600 text-sm mb-4">{message}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item, index) => (
          <div key={item._id} className="bg-white p-4 rounded shadow">
            {editIndex === index ? (
              <>
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                  className="border p-1 mb-2 w-full"
                />
                <input
                  type="number"
                  value={item.price}
                  onChange={(e) => handleInputChange(index, 'price', e.target.value)}
                  className="border p-1 mb-2 w-full"
                />
                <input
                  type="number"
                  value={item.quantityAvailable}
                  onChange={(e) => handleInputChange(index, 'quantityAvailable', e.target.value)}
                  className="border p-1 mb-2 w-full"
                />
                <button
                  className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                  onClick={() => saveItemChanges(item)}
                >
                  💾 Save
                </button>
                <button
                  className="bg-gray-300 px-2 py-1 rounded"
                  onClick={() => setEditIndex(null)}
                >
                  ❌ Cancel
                </button>
              </>
            ) : (
              <>
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

                {isAdmin && (
                  <div className="mt-2 space-y-2">
                    <button
                      className="bg-yellow-500 text-white px-3 py-1 rounded"
                      onClick={() => setEditIndex(index)}
                    >
                      ✏️ Edit
                    </button>

                    <div className="mt-2 flex items-center gap-2">
                      <input
                        type="number"
                        placeholder="Qty to add"
                        className="border p-1 w-20"
                        onChange={(e) => handleInputChange(index, 'addQty', e.target.value)}
                      />
                      <button
                        className="bg-blue-600 text-white px-2 py-1 rounded"
                        onClick={() => addPurchase(item._id, item.addQty || 0)}
                      >
                        ➕ Add Stock
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Items;
