import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './components/navbar'
import ChatLog from './components/chatlog'
import ChatInput from './components/chatinput'

interface Message {
  role: string;
  name: string;
  content: string;
  time: string;
  color: string;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    const newMessage: Message = {
      role: 'player',
      name: 'player',
      content: text,
      time: new Date().toLocaleTimeString([], {hour:'2-digit', minute: '2-digit'}),
      color: 'bg-gray-500'
    };

    setMessages((prev) => [...prev, newMessage]);
  };

  return (
    <div className="drawer h-screen overflow-hidden">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      
      <div className="drawer-content flex flex-col min-h-screen bg-white text-gray-800">

        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md"><Navbar /></div>
    
        <div className="flex-1 overflow-y-auto"><ChatLog messages={messages} /></div>

        <ChatInput onSend={handleSendMessage} />

      </div>
    </div>
  );
}

export default App;
