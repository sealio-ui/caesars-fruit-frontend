// src/pages/Purchases.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';

const Purchases = () => {
  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    axios.get('https://caesars-fruit-backend.vercel.app/api/purchase')
      .then(res => setPurchases(res.data))
      .catch(err => console.error('Failed to load purchases:', err));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Purchases</h1>
      <div className="grid gap-4">
        {purchases.map(purchase => (
          <div key={purchase._id} className="border p-4 rounded-xl shadow-sm">
            <div><strong>Item:</strong> {purchase.item?.name || 'Unknown'}</div>
            <div><strong>Qty:</strong> {purchase.quantity}</div>
            <div><strong>Unit Price:</strong> {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(purchase.unitPrice)}</div>
            <div><strong>Total:</strong> {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(purchase.amount)}</div>
            <div><strong>Supplier:</strong> {purchase.supplier || '-'}</div>
            <div><strong>Description:</strong> {purchase.description || '-'}</div>
            <div><strong>Date:</strong> {new Date(purchase.date).toLocaleDateString('id-ID')}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Purchases;
