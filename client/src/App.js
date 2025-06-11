import React from 'react'
import "./App.css"
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import Register from './pages/Register/Register'
import Login from './pages/Login/Login'
import Chat from './pages/Chat/Chat'
import SetAvatar from './pages/SetAvatar/SetAvatar'
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path = "/register" element ={<Register/>}/>
        <Route path = "/login" element= {<Login/>}/>
        <Route path = "/" element= {<Chat/>}/>
        <Route path = "/setAvatar" element={<SetAvatar/>}/>
      </Routes>
    </Router>
  )
}
