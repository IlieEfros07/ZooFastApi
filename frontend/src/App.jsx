import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/home'
import './App.css'
import Zoos from './pages/Zoos';
import Animals from './pages/Animals';
function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/zoos" element={<Zoos />}/>
        <Route path="/animals" element={<Animals />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App
