import React from 'react';

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          🚀 Store Rating System
        </h1>
        <p className="text-gray-600 mb-4">
          Welcome to the Store Rating System!
        </p>
        <div className="space-y-2">
          <p className="text-sm text-gray-500">
            Backend: <span className="text-green-600">✅ Running on port 5000</span>
          </p>
          <p className="text-sm text-gray-500">
            Frontend: <span className="text-green-600">✅ Running on port 3000</span>
          </p>
        </div>
        <div className="mt-6 p-4 bg-gray-100 rounded-lg inline-block">
          <p className="text-sm font-medium text-gray-700">Test Login:</p>
          <p className="text-sm text-gray-600">Email: jane123@example.com</p>
          <p className="text-sm text-gray-600">Password: TestPassword123!</p>
        </div>
      </div>
    </div>
  );
}

export default App;