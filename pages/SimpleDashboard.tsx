import React from 'react';
import { Link } from 'react-router-dom';

export default function SimpleDashboard() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold">TradeCanvas AI</h1>
              </div>
              <nav className="ml-6 flex space-x-8">
                <Link to="/" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
                  Home
                </Link>
                <Link to="/dashboard" className="inline-flex items-center px-1 pt-1 border-b-2 border-indigo-500 text-sm font-medium text-gray-900">
                  Dashboard
                </Link>
                <Link to="/charts" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
                  Charts
                </Link>
              </nav>
            </div>
            <div className="flex items-center">
              <button className="ml-3 bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium">
                Profile
              </button>
            </div>
          </div>
        </div>
      </header>

      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg p-4 h-96 flex flex-col items-center justify-center">
              <h2 className="text-2xl font-bold text-gray-700 mb-4">Welcome to Your Dashboard</h2>
              <p className="text-gray-500 mb-8 text-center max-w-md">
                This is a simplified dashboard view. The full dashboard with all components is still being set up.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
                <div className="bg-white p-4 rounded-md shadow">
                  <h3 className="font-bold text-xl mb-2">Market Overview</h3>
                  <p className="text-gray-600">View the latest market trends and indicators.</p>
                </div>
                <div className="bg-white p-4 rounded-md shadow">
                  <h3 className="font-bold text-xl mb-2">Portfolio</h3>
                  <p className="text-gray-600">Track your investments and performance.</p>
                </div>
                <div className="bg-white p-4 rounded-md shadow">
                  <h3 className="font-bold text-xl mb-2">AI Insights</h3>
                  <p className="text-gray-600">Get AI-powered trading recommendations.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
