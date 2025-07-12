import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Sales = ({ isAdmin }) => {
  const [sales, setSales] = useState([]);
  const [message, setMessage] = useState('');

  const fetchSales = async () => {
    try {
      const res = await axios.get('https://caesars-fruit-backend.vercel.app/api/sales');
      setSales(res.data);
    } catch (err) {
      console.error('Error fetching sales:', err);
    }
  };

  const addSale = async (itemName, quantity) => {
    try {
      await axios.post('https://caesars-fruit-backend.vercel.app/api/sales', { itemName, quantity });
      setMessage(`✅ Sale added: ${quantity}x ${itemName}`);
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
          <div className="flex flex-wrap gap-2">
            {['Apel', 'Jeruk', 'Pisang', 'Cornucopia'].map((item) => (
              <button
                key={item}
                onClick={() => addSale(item, 1)}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                +1 {item}
              </button>
            ))}
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
              <strong>{sale.bundleName || sale.item?.name || 'Unknown Item'}</strong> × {sale.quantity} →{' '}
              {new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
              }).format(sale.totalPrice)}
            </div>
            {sale.components?.length > 0 && (
              <ul className="list-disc list-inside ml-4 text-sm text-gray-700 mt-1">
                {sale.components.map((c, index) => (
                  <li key={index}>
                    {c.quantity}x {c.name}
                  </li>
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
