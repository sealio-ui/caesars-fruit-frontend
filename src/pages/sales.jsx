import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Sales = ({ isAdmin }) => {
  const [sales, setSales] = useState([]);
  const [message, setMessage] = useState('');
  const [newSaleItems, setNewSaleItems] = useState([{ itemName: '', quantity: 1 }]);

  const fetchSales = async () => {
    try {
      const res = await axios.get('https://caesars-fruit-backend.vercel.app/api/sales');
      setSales(res.data);
    } catch (err) {
      console.error('Error fetching sales:', err);
    }
  };

  const handleAddItemField = () => {
    setNewSaleItems([...newSaleItems, { itemName: '', quantity: 1 }]);
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...newSaleItems];
    updatedItems[index][field] = field === 'quantity' ? Number(value) : value;
    setNewSaleItems(updatedItems);
  };

  const handleSubmitSale = async () => {
    try {
      await axios.post('https://caesars-fruit-backend.vercel.app/api/sales', {
        items: newSaleItems
      });
      setMessage('✅ Sale submitted successfully');
      setNewSaleItems([{ itemName: '', quantity: 1 }]);
      fetchSales();
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || '❌ Sale failed');
    }
  };

  const clearSales = async () => {
    const confirmed = window.confirm('Are you sure you want to clear all sales history?');
    if (!confirmed) return;

    try {
      await axios.delete('https://caesars-fruit-backend.vercel.app/api/sales');
      setMessage('🧹 Sales history cleared');
      fetchSales();
    } catch (err) {
      console.error(err);
      setMessage('❌ Failed to clear sales');
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Sales</h1>

      {isAdmin && (
        <div className="mb-6 space-y-4">
          <h2 className="font-semibold text-lg">Add Sale</h2>
          {newSaleItems.map((item, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Item Name"
                value={item.itemName}
                onChange={(e) => handleItemChange(index, 'itemName', e.target.value)}
                className="border p-2 rounded w-1/2"
              />
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                className="border p-2 rounded w-1/4"
              />
            </div>
          ))}

          <div className="flex gap-2">
            <button onClick={handleAddItemField} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">
              ➕ Add Another Item
            </button>
            <button onClick={handleSubmitSale} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              ✅ Submit Sale
            </button>
          </div>

          <button
            onClick={clearSales}
            className="bg-red-500 text-white px-4 py-2 rounded mt-2 hover:bg-red-600"
          >
            🧹 Clear Sales History
          </button>

          {message && <p className="text-blue-600 text-sm mt-2">{message}</p>}
        </div>
      )}

      <h2 className="text-lg font-semibold mb-2">Recent Sales</h2>
      <ul className="space-y-2">
        {sales.map((sale) => (
          <li key={sale._id} className="bg-white p-3 shadow rounded">
            <div>
              <strong>{sale.bundleName || 'Items Sold'}</strong> × {sale.quantity || '-'} →{' '}
              {new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
              }).format(sale.totalPrice)}
            </div>
            {sale.components?.length > 0 && (
              <ul className="list-disc list-inside ml-4 text-sm text-gray-700 mt-1">
                {sale.components.map((c, index) => (
                  <li key={index}>{c.quantity}x {c.name}</li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sales;
