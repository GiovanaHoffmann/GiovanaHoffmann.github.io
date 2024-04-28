import React from 'react';
import './App.css';
import FormWrapper from './components/form';
import logo from './logo.png';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} alt="Logo" className="App-logo" />
        <h1>Nobel Prize Winners</h1>
        <img src={logo} alt="Logo" className="App-logo" />
      </header>
      <FormWrapper />
    </div>
  );
}

export default App;
