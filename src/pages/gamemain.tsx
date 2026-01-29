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
  const { messages, isGMThinking } = useChatStore();
  const { 
    handleSendMessage, 
    handleAnswerSubmit, 
    isMiniGameActive, 
    startMiniGame,
    closeOnlyModal,
    handleNextGame,
    isModalOpen,
    isCorrect,
    score,
    finishGame,
    rankings,
    solvedCount,
    setIsModalOpen, 
    riddleText,
    gameFeedback 
  } = useGameChat();
  const isInitialFetched = useRef(false);

  useEffect(() => {
    if (!isInitialFetched.current && messages.length === 0) {
      isInitialFetched.current = true;
      setTimeout(() => {
        handleSendMessage("게임 시작 오프닝을 들려줘", "System");
      }, 100);
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
        

        <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
          <ChatLog messages={messages} isGMThinking={isGMThinking}/>
        </div>

        <div className='flex-none'>
          <ChatInput onSend={(text) => handleSendMessage(text, userProfile.name)} />
        </div>
      </div>

      <MiniGameModal
        isOpen={isModalOpen}
        onClose={closeOnlyModal}
        onStart={startMiniGame}
        onAnswer={handleAnswerSubmit}
        onNext={handleNextGame}
        onFinish={finishGame}
        rankings={rankings}
        isActive={isMiniGameActive}
        isCorrect={isCorrect}
        riddleText={riddleText}
        gameFeedback={gameFeedback}
        score={score}
        solvedCount={solvedCount}
      />

      <div className='drawer-side'>
        <label htmlFor='my-drawer' className='drawer-overlay'></label>
        <EnemySidebar />
      </div>
    </div>
  );
}