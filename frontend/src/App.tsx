import React from 'react';

function App() {
  return (
    <div style={{ textAlign: 'center', padding: '50px', fontFamily: 'Arial' }}>
      <h1 style={{ fontSize: '48px', color: '#2563eb' }}>🏪 Store Rating System</h1>
      <p style={{ fontSize: '18px', color: '#666' }}>Frontend is working!</p>
      <div style={{ marginTop: '20px', padding: '20px', background: '#f0f0f0', borderRadius: '10px', maxWidth: '400px', margin: '20px auto' }}>
        <p><strong>Backend:</strong> ✅ http://localhost:5000</p>
        <p><strong>Login:</strong> jane123@example.com</p>
        <p><strong>Password:</strong> TestPassword123!</p>
      </div>
      <div style={{ marginTop: '20px' }}>
        <button style={{ background: '#2563eb', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', margin: '5px' }}>Login</button>
        <button style={{ background: '#16a34a', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', margin: '5px' }}>Register</button>
        <button style={{ background: '#ea580c', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', margin: '5px' }}>View Stores</button>
      </div>
    </div>
  );
}

export default App;