import './App.css'
import Login from './login'
import Signup from './signup'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} /> 
        <Route path="/signup" element={<Signup />} /> 
       
      </Routes>
    </BrowserRouter>
  )
}

export default App
