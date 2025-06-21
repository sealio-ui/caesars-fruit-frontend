import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Sales = () => {
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [sales, setSales] = useState([]);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://caesars-fruit-backend.vercel.app/api/sales', { itemName, quantity });
      setMessage('Sale recorded ✅');
      setItemName('');
      setQuantity(1);
      fetchSales();
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || 'Sale failed ❌');
    }
  };

  const fetchSales = async () => {
    try {
      const res = await axios.get('https://caesars-fruit-backend.vercel.app/api/sales');
      setSales(res.data);
    } catch (err) {
      console.error('Error fetching sales:', err);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Sales</h1>

      <form onSubmit={handleSubmit} className="mb-6 space-y-2">
        <input
          type="text"
          placeholder="Item name (e.g. Apel, Cornucopia)"
          className="border p-2 w-full"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
        />
        <input
          type="number"
          min="1"
          className="border p-2 w-full"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
        />
        <button className="bg-green-500 text-white px-4 py-2 rounded" type="submit">
          Submit Sale
        </button>
        {message && <p className="text-sm text-blue-600">{message}</p>}
      </form>

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

            {sale.components && sale.components.length > 0 && (
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
