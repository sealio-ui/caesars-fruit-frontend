import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Sales = () => {
  const [sales, setSales] = useState([]);

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
