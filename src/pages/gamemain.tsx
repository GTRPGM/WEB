import { useUserStore } from '../store/useUserStore'
import Navbar from '../components/navbar'
import ChatLog from '../components/chatlog'
import ChatInput from '../components/chatinput'
import { useChatStore } from '../store/useChatStore'
import { useEffect, useRef, useState } from 'react'
import EnemySidebar from '../components/sidebar'
import { useGameChat } from '../hooks/useGameChat'
import MiniGameModal from '../components/MiniGameModal'
import TypingGameModal from '../components/TypingGameModal'

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
  const [isTypingModalOpen, setIsTypingModalOpen] = useState(false);
  const [isTypingActive, setIsTypingActive] = useState(false);

  const isAnyGameActive = isMiniGameActive || isTypingActive;

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
        <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md">
          <Navbar />
          <div className="flex items-center justify-between px-6 py-2 bg-slate-50 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isAnyGameActive ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`}></div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {isAnyGameActive ? "Mini-Game Active" : "Mini-Game Ready"}
                </span>
              </div>

              <div className='flex gap-2'>
                {/* 1. 타자 연습 버튼 */}
                <button 
                  onClick={() => setIsTypingModalOpen(true)}
                  className="btn btn-xs sm:btn-sm px-4 rounded-full btn-outline border-slate-300 text-slate-600 font-bold hover:bg-slate-100"
                >
                  타자 연습
                </button>

                {/* 2. 수수께끼 버튼 */}
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className={`btn btn-xs sm:btn-sm px-4 rounded-full transition-all ${
                    isMiniGameActive 
                    ? "btn-primary shadow-lg shadow-primary/30 text-white"
                    : "btn-outline btn-ghost border-slate-300 text-slate-600"
                  }`}
                >
                  {isMiniGameActive ? "수수께끼 풀기" : "수수께끼 시작"}
                </button>
              </div>
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
          <ChatLog messages={messages} isGMThinking={isGMThinking}/>
        </div>

        <div className='flex-none'>
          <ChatInput onSend={(text) => handleSendMessage(text, userProfile.name)} />
        </div>
      </div>

      <div className='drawer-side z-[50]'>
        <label htmlFor='my-drawer' className='drawer-overlay'></label>
        <EnemySidebar />
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

      <TypingGameModal 
        isOpen={isTypingModalOpen} 
        onClose={() => setIsTypingModalOpen(false)}
        onStatusChange={(open) => setIsTypingActive(open)}
      />
    </div>
  );
}