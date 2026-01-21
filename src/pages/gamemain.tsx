import { useUserStore } from '../store/useUserStore'
import Navbar from '../components/navbar'
import ChatLog from '../components/chatlog'
import ChatInput from '../components/chatinput'
import { useChatStore } from '../store/useChatStore'
import { api } from "../apiinterceptor";

export default function GameMain() {
  const userProfile = useUserStore((state) => state.userProfile);
  const { messages, addMessage, setGmthinking } = useChatStore();

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;
    
    addMessage(userProfile.name, text);

   /* const newMessage: Message = {
      id: `player-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      sender: userProfile.name,
      content: text,
      time: new Date().toLocaleTimeString([], {hour:'2-digit', minute: '2-digit'}),
      color: 'bg-gray-500'
    }; */

    setGmthinking(true);
    
    /* await new Promise(resolve => setTimeout(resolve, 2000));
    add Message('GM', '서버 대신 대답하는 임시 메세지입니다!');
    setGmthinking(false); return; */

    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const res = await api.post('/chat/generate', { prompt: text });


      if (res.data?.data?.content) {addMessage('GM', res.data.data.content);}
    } catch (error) {
      console.error("통신 실패: ", error);
      addMessage('GM', '다시 시도해주세요.');
    } finally {
      setGmthinking(false);
    }
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