import React from 'react';
import { Link } from 'react-router-dom';

export default function SimpleLanding() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-6">Welcome to TradeCanvas AI</h1>
        
        <div className="mb-8">
          <p className="text-lg text-center mb-4">
            Your intelligent trading platform for market analysis and decision making.
          </p>
          
          <div className="flex justify-center space-x-4">
            <Link 
              to="/dashboard" 
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Go to Dashboard
            </Link>
            
            <Link 
              to="/charts" 
              className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              View Charts
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="font-bold text-xl mb-2">Market Analysis</h3>
            <p>Get real-time market analysis and insights to make informed trading decisions.</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="font-bold text-xl mb-2">AI Powered</h3>
            <p>Leverage the power of artificial intelligence to identify trading opportunities.</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="font-bold text-xl mb-2">Portfolio Management</h3>
            <p>Track and manage your portfolio with advanced visualization tools.</p>
          </div>
        </div>
      </div>
      
      <footer className="mt-8 text-center text-gray-600">
        <p>© 2023 TradeCanvas AI. All rights reserved.</p>
      </footer>
    </div>
  );
}
