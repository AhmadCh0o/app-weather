// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes,  } from 'react-router-dom';
import Main from './components/Main';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/main" element={<Main />} />
      </Routes>
  </Router>
  );
}

export default App;
