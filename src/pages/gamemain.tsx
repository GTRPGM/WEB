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
import { typingService } from '../services/typingService' 
import { useChatStream } from '../hooks/useChatStream'
import GameLoader from '../components/GameLoader'
import { useUserStore } from '../store/useUserStore'

export default function GameMain() {
  const { 
    messages, isGMThinking, sessionId, addMessage, 
    updateMessageContent, setLoadingGameSession,
    isLoadingGameSession, addTypingSentences 
  } = useChatStore(); 

  const { processStream } = useChatStream();
  const { 
    handleSendMessage, fetchCurrentSummary, handleAnswerSubmit,
    isMiniGameActive, startMiniGame, closeOnlyModal, handleNextGame,
    isModalOpen, isCorrect, score, finishGame, rankings, solvedCount,
    setIsModalOpen, riddleText, gameFeedback 
  } = useGameChat();

  const myName = useUserStore((state) => state.userProfile.name);
  const isOpeningFetched = useRef(false);
  const [isTypingModalOpen, setIsTypingModalOpen] = useState(false);
  const [isTypingActive, setIsTypingActive] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const isAnyGameActive = isMiniGameActive || isTypingActive;

  useEffect(() => {
    if (sessionId && !isOpeningFetched.current && messages.length === 0) {
        isOpeningFetched.current = true;
        setLoadingGameSession(true);
        setLoadingProgress(10);

        const initGame = async () => {
            try {
                // 1. 타자 문장 미리 확보하여 스토어 저장
                const tipRequests = [
                    typingService.fetchTypingTexts(),
                    typingService.fetchTypingTexts(),
                    typingService.fetchTypingTexts()
                ];
                
                const results = await Promise.all(tipRequests);
                results.forEach(sentences => {
                    if (sentences.length > 0) addTypingSentences(sentences);
                });
                setLoadingProgress(40);

                // 2. 오프닝 요약 로드
                const summary = await getOpeningSummary(sessionId);
                setLoadingProgress(80); 
                
                if (window.bgm) {
                    const audio = window.bgm;
                    const fadeOut = setInterval(() => {
                        if (audio.volume > 0.05) audio.volume -= 0.05;
                        else {
                            audio.pause(); audio.currentTime = 0;
                            clearInterval(fadeOut); window.bgm = undefined;
                        }
                    }, 50);
                }
                
                setLoadingProgress(100);
                await new Promise(r => setTimeout(r, 500));
                
                const msgId = addMessage('GM', '', myName, 'narration');
                setLoadingGameSession(false);

                await processStream(summary, (accumulated: string) => {
                    updateMessageContent(msgId, accumulated);
                });
                
            } catch (error) {
                console.error(error);
                setLoadingGameSession(false);
            }
        };
        initGame();
    }
  }, [sessionId, addMessage, updateMessageContent, setLoadingGameSession, processStream, messages.length, myName, addTypingSentences]);

  if (isLoadingGameSession) {
    const sentences = useChatStore.getState().typingSentences;
    return <GameLoader progress={loadingProgress} data={{ phrases: ["데이터 동기화 중..."], tips: sentences }} />;
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
                <button onClick={() => setIsTypingModalOpen(true)} className="btn btn-xs sm:btn-sm px-4 rounded-full bg-base-200/90 border-base-300 text-base-content/90 font-bold hover:bg-base-200">타자 연습</button>
                <button onClick={() => setIsModalOpen(true)} className={`btn btn-xs sm:btn-sm px-4 rounded-full transition-all ${isMiniGameActive ? "btn-primary shadow-lg shadow-primary/30 text-primary-content" : "bg-base-200 text-base-content/90 hover:bg-base-200 border-base-300"}`}>
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
      <MiniGameModal isOpen={isModalOpen} onClose={closeOnlyModal} onStart={startMiniGame} onAnswer={handleAnswerSubmit} onNext={handleNextGame} onFinish={finishGame} rankings={rankings} isActive={isMiniGameActive} isCorrect={isCorrect} riddleText={riddleText} gameFeedback={gameFeedback} score={score} solvedCount={solvedCount} />
      <TypingGameModal isOpen={isTypingModalOpen} onClose={() => setIsTypingModalOpen(false)} onStatusChange={(open) => setIsTypingActive(open)} />
    </div>
  );
}