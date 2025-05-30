import React from 'react';
import NutriOracleCore from './pages/Dashboard';

function App() {
  return (
    <div className="min-h-screen bg-white text-black">
      <header className="p-4 text-2xl font-bold">🌿 NutriOracle</header>
      <main className="p-4">
        <NutriOracleCore />
      </main>
    </div>
  );
}

export default App;
