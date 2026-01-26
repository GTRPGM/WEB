import { useUserStore } from '../store/useUserStore'
import Navbar from '../components/navbar'
import ChatLog from '../components/chatlog'
import ChatInput from '../components/chatinput'
import { useChatStore } from '../store/useChatStore'
import { useEffect, useRef, useState } from 'react'
import EnemySidebar from '../components/sidebar'
import { useAuthStore } from '../store/useAuthStore'
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function GameMain() {
  const userProfile = useUserStore((state) => state.userProfile);
  const { messages, addMessage, setGmthinking, updateMessageContent } = useChatStore();
  const isInitialFetched = useRef(false);

  const [attemptCount, setAttemptCount] = useState(1);
  const [isMiniGameActive, setMiniGameActive] = useState(false);

  const processStream = async (response: Response, msgId: string) => {
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let accumulated = "";
    if (!reader) return;

    setGmthinking(false);

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      accumulated += decoder.decode(value);
      updateMessageContent(msgId, accumulated);
    }
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const token = useAuthStore.getState().access_token;
    
    addMessage(userProfile.name, text);

    await new Promise(resolve => setTimeout(resolve, 200));
    setGmthinking(true);

    let gmMsgId = "";
    
    try {
      const isMiniGame = text.includes("미니게임");
      let url = "";
      let fetchOptions: RequestInit = {};
      const headers: HeadersInit = {
        'Authorization' : `Bearer ${token}`
      };

      if (isMiniGame) {
        url = `${BASE_URL}/minigame/riddle`;
        fetchOptions = { method: 'GET', headers };
        setMiniGameActive(true);
        setAttemptCount(1);
      }
      else if (isMiniGameActive) {
        url = `${BASE_URL}/minigame/answer`;
        headers['Content-Type'] = 'application/json';
        fetchOptions = {
          method: 'POST',
          headers,
          body: JSON.stringify({ 
            user_guess: text,
            current_attempt: attemptCount
          })
        };
      }
      else {
        console.log("분기: 일반 채팅(POST)");
      }

    const response = await fetch(url, fetchOptions);
    if (!response.ok) throw new Error(`Status: ${response.status}`);

    setGmthinking(false);
    gmMsgId = addMessage('GM','');

    if (isMiniGameActive && !isMiniGame) {
        const gameData = await response.json();
        const result = gameData.data;

        if (result.is_correct) {
          updateMessageContent(gmMsgId, `${result.message}`);
          setMiniGameActive(false);
          setAttemptCount(1);
        } else {
          updateMessageContent(gmMsgId, `${result.message}`);
          setAttemptCount(result.fail_count || attemptCount + 1);
        }
      } else {
          await processStream(response, gmMsgId);
        }
      } catch (error) {
        setGmthinking(false);
        updateMessageContent(gmMsgId, '연결에 실패했습니다. 다시 시도해 주세요.');
      } finally {
        setGmthinking(false);
      }
    };


  const fetchFirstGMMessage = async () => {
if (isInitialFetched.current || messages.length > 0) return;

    isInitialFetched.current = true;
    setGmthinking(true);
    const gmMsgId = addMessage('GM', '');
    
    try {
      const token = useAuthStore.getState().access_token;

      //수정 필요
      const response = await fetch(`${BASE_URL}/chat/generate`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ prompt: "게임 시작 오프닝을 들려줘" }),
      });
      await processStream(response, gmMsgId);
    } catch (e) {
      updateMessageContent(gmMsgId, "오프닝 로딩 실패");
    } finally {setGmthinking(false);}
  };

  useEffect(() => {
    if (messages.length === 0) {
      fetchFirstGMMessage();
    }
  }, []);

  return (
    <div className="drawer lg:drawer-open h-screen overflow-hidden">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
    
      <div className="drawer-content flex flex-col min-h-screen bg-white text-gray-800">

        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md"><Navbar /></div>
    
        <div className="flex-1 overflow-y-auto"><ChatLog messages={messages} /></div>

        <ChatInput onSend={handleSendMessage} />
      </div>

      <div className='drawer-side'>
        <label htmlFor='my-drawer' className='drawer-overlay'></label>
        <EnemySidebar />
      </div>
    </div>
  );
}