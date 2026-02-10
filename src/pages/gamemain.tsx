import Navbar from '../components/navbar'
import ChatLog from '../components/chatlog'
import ChatInput from '../components/chatinput'
import { useChatStore } from '../store/useChatStore'
import { useState, useEffect, useRef } from 'react'
import EnemySidebar from '../components/sidebar'
import { useGameChat } from '../hooks/useGameChat'
import MiniGameModal from '../components/MiniGameModal'
import TypingGameModal from '../components/TypingGameModal'
import { getOpeningSummary } from '../services/gameService'
import { useChatStream } from '../hooks/useChatStream'
import GameLoader from '../components/GameLoader'; // Import GameLoader
import { useUserStore } from '../store/useUserStore' // useUserStore를 임포트

export default function GameMain() {
  // const userProfile = useUserStore((state) => state.userProfile); // 사용되지 않으므로 제거
  const { 
    messages, 
    isGMThinking, 
    sessionId, 
    addMessage, 
    updateMessageContent, 
    setGmthinking, 
    setLoadingGameSession,
    isLoadingGameSession, // Add this
    addSummaryMessage // Add addSummaryMessage
  } = useChatStore(); 
  const { processStream } = useChatStream();
  const { 
    handleSendMessage, 
    fetchCurrentSummary, // Add fetchCurrentSummary here
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
  const myName = useUserStore((state) => state.userProfile.name); // myName 가져오기

  const isOpeningFetched = useRef(false); // 오프닝 메시지를 한 번만 가져오기 위한 ref
  const [isTypingModalOpen, setIsTypingModalOpen] = useState(false);
  const [isTypingActive, setIsTypingActive] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0); // Add loading progress state

  const isAnyGameActive = isMiniGameActive || isTypingActive;

  // 초기 오프닝 메시지 로직
  useEffect(() => {
    if (sessionId && !isOpeningFetched.current && messages.length === 0) {
        isOpeningFetched.current = true; // 플래그 설정
        setLoadingGameSession(true); // Start game session loading
        setLoadingProgress(10); // Initial progress

        const fetchOpening = async () => {
            try {
                const summary = await getOpeningSummary(sessionId);
                setLoadingProgress(60); // Progress after fetching summary
                await new Promise(resolve => setTimeout(resolve, 50)); // Allow render to catch up
                
                // BGM Fade-out logic moved here
                if (window.bgm) {
                    const audio = window.bgm;
                    const fadeOut = setInterval(() => {
                        if (audio.volume > 0.05) {
                            audio.volume -= 0.05;
                        } else {
                            audio.pause();
                            audio.currentTime = 0;
                            clearInterval(fadeOut);
                            window.bgm = undefined;
                        }
                    }, 50);
                }
                
                // Simulate final progress fill and then hide loader
                setLoadingProgress(100); // Progress reaches 100%
                await new Promise(resolve => setTimeout(resolve, 50)); // Allow render to catch up
                const msgId = addMessage('GM', '', myName, 'narration'); // 빈 메시지 추가
                setLoadingGameSession(false); // 로딩 화면을 요약 출력 시작과 동시에 사라지게 함
                await processStream(summary, (accumulated: string) => {
                                updateMessageContent(msgId, accumulated);
                            });
                
            } catch (error) {                
                console.error("Failed to fetch opening summary:", error);
                addMessage('GM', '오프닝을 불러오는 데 실패했습니다.', myName, 'system'); // 에러 메시지는 일반 addMessage 사용
                setLoadingGameSession(false); // Hide loader on error
            } finally {
                // setGmthinking(false); // 이제 useGameChat에서 처리
            }
        };
        fetchOpening();
    }
  }, [sessionId, addMessage, updateMessageContent, setGmthinking, setLoadingGameSession, processStream, messages.length, myName, addSummaryMessage]); // Added setLoadingProgress to dependency array

  // Conditionally render GameLoader
  if (isLoadingGameSession) {
    return <GameLoader progress={loadingProgress} />; // Pass progress prop
  }

    return (
    <div className="drawer lg:drawer-open h-screen overflow-hidden">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
    
      <div className="drawer-content flex flex-col min-h-screen bg-base-200 text-base-content">
        <div className="sticky top-0 z-40 bg-base-100/80 backdrop-blur-md">
          <Navbar />
          <div className="flex items-center justify-between px-6 py-2 bg-base-300 border-b border-base-100">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isAnyGameActive ? 'bg-success animate-pulse' : 'bg-base-100'}`}></div>
                <span className="text-xs font-bold text-primary-content/80 uppercase tracking-wider">
                  {isAnyGameActive ? "Mini-Game Active" : "Mini-Game Ready"}
                </span>
              </div>

              <div className='flex gap-2'>
                {/* 1. 타자 연습 버튼 */}
                <button 
                  onClick={() => setIsTypingModalOpen(true)}
                  className="btn btn-xs sm:btn-sm px-4 rounded-full bg-base-200/90 border-base-300 text-base-content/90 font-bold hover:bg-base-200"
                >
                  타자 연습
                </button>

                {/* 2. 수수께끼 버튼 */}
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className={`btn btn-xs sm:btn-sm px-4 rounded-full transition-all ${
                    isMiniGameActive 
                    ? "btn-primary shadow-lg shadow-primary/30 text-primary-content"
                    : "bg-base-200 text-base-content/90 hover:bg-base-200 border-base-300"
                  }`}
                >
                  {isMiniGameActive ? "수수께끼 풀기" : "수수께끼 시작"}
                </button>
              </div>
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-hidden flex flex-col bg-base-400">
          <ChatLog messages={messages} isGMThinking={isGMThinking}/>
        </div>

        <div className='flex-none'>
          <ChatInput onSend={(text) => handleSendMessage(text)} onRefreshSummary={fetchCurrentSummary} />
        </div>
      </div>

      <div className='drawer-side z-[50] border-r border-base-300'>
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