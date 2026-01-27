import { useUserStore } from '../store/useUserStore'
import Navbar from '../components/navbar'
import ChatLog from '../components/chatlog'
import ChatInput from '../components/chatinput'
import { useChatStore } from '../store/useChatStore'
import { useEffect, useRef } from 'react'
import EnemySidebar from '../components/sidebar'
import { useGameChat } from '../hooks/useGameChat'
import MiniGameModal from '../components/MiniGameModal'

export default function GameMain() {
  const userProfile = useUserStore((state) => state.userProfile);
  const { messages } = useChatStore();
  const { handleSendMessage, isMiniGameActive, startMiniGame, isModalOpen, setIsModalOpen, riddleText, gameFeedback } = useGameChat();
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

        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md"><Navbar />
          <div className="flex items-center justify-between px-6 py-2 bg-slate-50">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isMiniGameActive ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`}></div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {isMiniGameActive ? "Mini-Game Active" : "Mini-Game Ready"}
                </span>
              </div>

              <button 
                onClick={() => setIsModalOpen(true)}
                className={`btn btn-xs sm:btn-sm px-4 rounded-full transition-all ${
                  isMiniGameActive 
                  ? "btn-primary shadow-lg shadow-primary/30"
                  : "btn-outline btn-ghost border-slate-300"
                }`}
              >
                {isMiniGameActive ? "수수께끼 풀기" : "미니게임 시작"}
              </button>
          </div>

          
        </div>
        

        <div className="flex-1 overflow-y-auto"><ChatLog messages={messages} /></div>

        <ChatInput onSend={(text) => handleSendMessage(text, userProfile.name)} />
      </div>

      <MiniGameModal
        isOpen={isModalOpen}
        isActive={isMiniGameActive}
        riddleText={riddleText}
        gameFeedback={gameFeedback}
        onClose={() => setIsModalOpen(false)}
        onStart={() => startMiniGame(userProfile.name)}
        onAnswer={(ans: string) => handleSendMessage(ans, userProfile.name)}
      />

      <div className='drawer-side'>
        <label htmlFor='my-drawer' className='drawer-overlay'></label>
        <EnemySidebar />
      </div>
    </div>
  );
}