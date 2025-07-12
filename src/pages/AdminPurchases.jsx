import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminPurchases = () => {
  const [purchases, setPurchases] = useState([]);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({ itemName: '', quantity: 1, price: 0 });

  const fetchPurchases = async () => {
    try {
      const res = await axios.get('https://caesars-fruit-backend.vercel.app/api/purchase');
      setPurchases(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://caesars-fruit-backend.vercel.app/api/purchase/${id}`);
      fetchPurchases();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://caesars-fruit-backend.vercel.app/api/purchase', form);
      setMessage('Purchase recorded ✅');
      setForm({ itemName: '', quantity: 1, price: 0 });
      fetchPurchases();
    } catch (err) {
      console.error(err);
      setMessage('Failed to add purchase ❌');
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Purchases</h1>
      <form onSubmit={handleSubmit} className="mb-6 space-y-2">
        <input
          type="text"
          placeholder="Item name"
          className="border p-2 w-full"
          value={form.itemName}
          onChange={(e) => setForm({ ...form, itemName: e.target.value })}
        />
        <input
          type="number"
          placeholder="Quantity"
          className="border p-2 w-full"
          value={form.quantity}
          onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
        />
        <input
          type="number"
          placeholder="Price"
          className="border p-2 w-full"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
        />
        <button className="bg-green-600 text-white px-4 py-2 rounded">Add Purchase</button>
        {message && <p className="text-blue-600 text-sm">{message}</p>}
      </form>

      <h2 className="text-lg font-semibold mb-2">Purchase History</h2>
      <ul className="space-y-2">
        {purchases.map((p) => (
          <li key={p._id} className="bg-white p-3 rounded shadow relative">
            <p>
              {p.item?.name || p.itemName} × {p.quantity} →{' '}
              {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(p.totalPrice)}
            </p>
            <button onClick={() => handleDelete(p._id)} className="absolute top-2 right-2 text-red-500 text-sm">✕</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminPurchases;
