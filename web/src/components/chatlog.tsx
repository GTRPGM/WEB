import { useRef, useEffect } from "react";

interface Message {
    role: string;
    name: string;
    content: string;
    time: string;
    color: string;
}

interface ChatLogProps {
    messages: Message[];
}

export default function ChatLog({messages}: ChatLogProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth'});
        }
    }, [messages]);

    return (
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          
            {/* GM */}
            <div className="flex items-start gap-3 hover:bg-gray-50 p-1 rounded-lg transition-colors group">
               <div className="w-10 h-10 rounded bg-blue-500 text-white flex items-center justify-center font-bold shrink-0">
                  GM
               </div>
                <div>
                   <div className="flex items-center gap-2">
                        <span className="font-bold text-blue-600">GM</span>
                        <span className="text-xs text-gray-400">오후 12:45</span>
                   </div>
                    <p className="mt-1 leading-relaxed">안녕하세요.</p>
                </div>
            </div>

            {/* player */}
            <div className="flex items-start gap-3 hover:bg-gray-50 p-1 rounded-lg transition-colors group">
                <div className="w-10 h-10 rounded bg-gray-500 text-white flex items-center justify-center font-bold shrink-0">
                    P
                </div>
                <div>
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900">player</span>
                        <span className="text-xs text-gray-400">오후 12:46</span>
                    </div>
                    <p className="mt-1 leading-relaxed">You underestimate my power!</p>
                </div>
            </div>

            {messages.map((msg, index) => (
                <div key={index} className="flex items-start gap-3 hover:bg-gray-50 p-1 rounded-lg transition-colors group">
                    <div className={`w-10 h-10 rounded ${msg.color || 'bg-gray-500'} text-white flex items-center justify-center font-bold shrink-0`}>
                        {msg.name ? msg.name[0].toUpperCase() : 'P'}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-900">{msg.name}</span>
                            <span className="text-xs text-gray-400">{msg.time}</span>
                        </div>
                        <p className="mt-1 leading-relaxed text-gray-800">{msg.content}</p>
                    </div>
                </div>
            ))}

            <div ref={scrollRef}/>

        </div>
    );
}