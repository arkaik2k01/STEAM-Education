import './App.css';
import React from 'react';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TestPage from './test/pages/testPage';

function App() {
  return (
    //<div className="App">
      
    <BrowserRouter>
      <Routes>
        <Route path="/test" index element={<TestPage/>} />
      </Routes>
    </BrowserRouter>

    //</div>
  );
}

export default App;
