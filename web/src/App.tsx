import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './components/navbar'
import ChatLog from './components/chatlog'
import ChatInput from './components/chatinput'
import Sidebar from './components/sidebar'

function App() {
  return (
    <div className="drawer">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      
      <div className="drawer-content flex flex-col min-h-screen bg-white text-gray-800">
        
        <Navbar />
        <ChatLog />
        <ChatInput />

      </div>

      <Sidebar />
      
    </div>
  );
}

export default App;
