import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Items from './pages/items';
import Sales from './pages/sales';
import Purchases from './pages/purchases';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {/* Top Navigation */}
        <nav className="bg-green-700 text-white px-6 py-3 flex space-x-6 shadow-md">
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/items" className="hover:underline">Items</Link>
          <Link to="/sales" className="hover:underline">Sales</Link>
          <Link to="/purchases" className="hover:underline">Purchases</Link>
        </nav>

        <main className="p-6">
          <Routes>
            {/* Dashboard Home Page */}
            <Route
              path="/"
              element={
                <div>
                  <h1 className="text-3xl font-bold text-center text-green-700 mb-6">
                    Caesar's Fruit Accounting
                  </h1>
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
            <Route path="/items" element={<Items />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/purchases" element={<Purchases />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
