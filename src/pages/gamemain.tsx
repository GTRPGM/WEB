import { useUserStore } from '../store/useUserStore'
import Navbar from '../components/navbar'
import ChatLog from '../components/chatlog'
import ChatInput from '../components/chatinput'
import { useChatStore } from '../store/useChatStore'
import { useEffect, useRef } from 'react'
import EnemySidebar from '../components/sidebar'
import { useGameChat } from '../hooks/useGameChat'

export default function GameMain() {
  const userProfile = useUserStore((state) => state.userProfile);
  const { messages } = useChatStore();
  const { handleSendMessage} = useGameChat();
  const isInitialFetched = useRef(false);

  useEffect(() => {
    if (!isInitialFetched.current && messages.length === 0) {
      isInitialFetched.current = true;
      handleSendMessage("게임 시작 오프닝을 들려줘", "System");
    }
  }, [handleSendMessage, messages.length]);

  return (
    <div className="drawer lg:drawer-open h-screen overflow-hidden">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
    
      <div className="drawer-content flex flex-col min-h-screen bg-white text-gray-800">

        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md"><Navbar /></div>
    
        <div className="flex-1 overflow-y-auto"><ChatLog messages={messages} /></div>

        <ChatInput onSend={(text) => handleSendMessage(text, userProfile.name)} />
      </div>

      <div className='drawer-side'>
        <label htmlFor='my-drawer' className='drawer-overlay'></label>
        <EnemySidebar />
      </div>
    </div>
  );
}