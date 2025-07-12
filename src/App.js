import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Items from './pages/items';
import Sales from './pages/sales';
import Purchases from './pages/purchases';

function App() {
  const [income, setIncome] = useState(0);
  const [spent, setSpent] = useState(0);
  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem('isAdmin') === 'true');

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const [salesRes, purchasesRes] = await Promise.all([
          axios.get('https://caesars-fruit-backend.vercel.app/api/sales'),
          axios.get('https://caesars-fruit-backend.vercel.app/api/purchase'),
        ]);

        const today = new Date().toISOString().split('T')[0];

        const todayIncome = salesRes.data
          .filter((s) => s.date?.startsWith(today))
          .reduce((sum, s) => sum + (s.totalPrice || 0), 0);

        const todaySpent = purchasesRes.data
          .filter((p) => p.date?.startsWith(today))
          .reduce((sum, p) => sum + (p.totalPrice || 0), 0);

        setIncome(todayIncome);
        setSpent(todaySpent);
      } catch (err) {
        console.error('Failed to fetch dashboard metrics', err);
      }
    };

    fetchMetrics();
  }, []);

  const handleLogin = (username, password) => {
    if (username === 'admin' && password === 'admin123') {
      setIsAdmin(true);
      localStorage.setItem('isAdmin', 'true');
    } else {
      alert('Incorrect credentials');
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('isAdmin');
  };

  const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
      e.preventDefault();
      if (username === 'admin' && password === 'admin123') {
        handleLogin(username, password);
        navigate('/');
      } else {
        alert('Invalid username or password');
      }
    };

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-80">
          <h2 className="text-xl font-bold mb-4 text-center">Admin Login</h2>
          <input
            type="text"
            placeholder="Username"
            className="border p-2 w-full mb-3"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="border p-2 w-full mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="bg-green-600 text-white w-full py-2 rounded" type="submit">
            Login
          </button>
        </form>
      </div>
    );
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {/* Top Navigation */}
        <nav className="bg-green-700 text-white px-6 py-3 flex space-x-6 shadow-md">
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/items" className="hover:underline">Items</Link>
          <Link to="/sales" className="hover:underline">Sales</Link>
          <Link to="/purchases" className="hover:underline">Purchases</Link>
          {isAdmin ? (
            <button onClick={handleLogout} className="ml-auto hover:underline">Logout</button>
          ) : (
            <Link to="/login" className="ml-auto hover:underline">Admin Login</Link>
          )}
        </nav>

        <main className="p-6">
          <Routes>
            <Route
              path="/"
              element={
                <div>
                  <h1 className="text-3xl font-bold text-center text-green-700 mb-6">
                    Caesar's Fruit Accounting
                  </h1>

                  {/* Dashboard Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                    <div className="bg-white shadow p-4 rounded text-center border-t-4 border-green-500">
                      <p className="text-gray-500">Income Today</p>
                      <p className="text-xl font-bold text-green-600">
                        {income.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
                      </p>
                    </div>
                    <div className="bg-white shadow p-4 rounded text-center border-t-4 border-red-500">
                      <p className="text-gray-500">Spent Today</p>
                      <p className="text-xl font-bold text-red-600">
                        {spent.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
                      </p>
                    </div>
                    <div className="bg-white shadow p-4 rounded text-center border-t-4 border-blue-500">
                      <p className="text-gray-500">Earnings Today</p>
                      <p className="text-xl font-bold text-blue-600">
                        {(income - spent).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
                      </p>
                    </div>
                  </div>

                  {/* Navigation Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    <Link
                      to="/items"
                      className="bg-white hover:bg-green-100 p-6 shadow rounded-lg text-center border border-green-300"
                    >
                      🍎 Manage Items
                    </Link>
                    <Link
                      to="/sales"
                      className="bg-white hover:bg-green-100 p-6 shadow rounded-lg text-center border border-green-300"
                    >
                      💰 View Sales
                    </Link>
                    <Link
                      to="/purchases"
                      className="bg-white hover:bg-green-100 p-6 shadow rounded-lg text-center border border-green-300"
                    >
                      📦 View Purchases
                    </Link>
                  </div>
                </div>
              }
            />
            <Route path="/items" element={<Items isAdmin={isAdmin} />} />
            <Route path="/sales" element={<Sales isAdmin={isAdmin} />} />
            <Route path="/purchases" element={<Purchases isAdmin={isAdmin} />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
