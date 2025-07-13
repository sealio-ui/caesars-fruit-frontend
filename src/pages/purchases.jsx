import { useEffect, useState } from 'react';
import axios from 'axios';

const Purchases = ({ isAdmin }) => {
  const [purchases, setPurchases] = useState([]);
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    itemId: '',
    quantity: 1,
    unitPrice: '',
    supplier: '',
    description: ''
  });
  const [message, setMessage] = useState('');

  const fetchPurchases = async () => {
    try {
      const res = await axios.get('https://caesars-fruit-backend.vercel.app/api/purchase');
      setPurchases(res.data);
    } catch (err) {
      console.error('Failed to load purchases:', err);
    }
  };

  const fetchItems = async () => {
    try {
      const res = await axios.get('https://caesars-fruit-backend.vercel.app/api/item');
      setItems(res.data);
    } catch (err) {
      console.error('Failed to load items:', err);
    }
  };

  useEffect(() => {
    fetchPurchases();
    if (isAdmin) fetchItems();
  }, []);

  const handleInputChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const submitPurchase = async () => {
    const { itemId, quantity, unitPrice, supplier, description } = form;

    if (!itemId || !quantity || !unitPrice) {
      setMessage('❌ Item, quantity, and unit price are required');
      return;
    }

    try {
      await axios.post('https://caesars-fruit-backend.vercel.app/api/purchase', {
        item: itemId,
        quantity: Number(quantity),
        unitPrice: Number(unitPrice),
        supplier,
        description
      });

      setMessage('✅ Purchase added');
      setForm({ itemId: '', quantity: 1, unitPrice: '', supplier: '', description: '' });
      fetchPurchases();
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || '❌ Failed to add purchase');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Purchases</h1>

      {isAdmin && (
        <div className="mb-6 p-4 border rounded-lg bg-gray-50">
          <h2 className="font-semibold text-lg mb-2">➕ Add Purchase</h2>
          <div className="flex flex-col gap-2">
            <select
              value={form.itemId}
              onChange={(e) => handleInputChange('itemId', e.target.value)}
              className="border p-2 rounded"
            >
              <option value="">Select Item</option>
              {items.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.name} ({item.type}) - {new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                  }).format(item.price)}
                </option>
              ))}
            </select>

            <input
              type="number"
              min="1"
              value={form.quantity}
              onChange={(e) => handleInputChange('quantity', e.target.value)}
              className="border p-2 rounded"
              placeholder="Quantity"
            />

            <input
              type="number"
              min="1"
              value={form.unitPrice}
              onChange={(e) => handleInputChange('unitPrice', e.target.value)}
              className="border p-2 rounded"
              placeholder="Unit Price (IDR)"
            />

            <input
              type="text"
              value={form.supplier}
              onChange={(e) => handleInputChange('supplier', e.target.value)}
              className="border p-2 rounded"
              placeholder="Supplier (optional)"
            />

            <input
              type="text"
              value={form.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="border p-2 rounded"
              placeholder="Description (optional)"
            />

            <button
              onClick={submitPurchase}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              ✅ Submit Purchase
            </button>

            {message && <p className="text-sm text-blue-600 mt-2">{message}</p>}
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {purchases.map((purchase) => (
          <div key={purchase._id} className="border p-4 rounded-xl shadow-sm bg-white">
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
