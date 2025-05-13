import React from 'react';
import CommandBox from './components/CommandBox';
import './App.css';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>מערכת חשבוניות</h1>
      </header>
      <main className="app-main">
        <CommandBox />
      </main>
    </div>
  );
}

export default App;
