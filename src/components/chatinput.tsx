import { useState } from "react";

interface ChatInputProps {
    onSend: (text: string) => void;
}

export default function ChatInput({onSend}: ChatInputProps) {
    const [text, setText] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (text.trim()!==''){
            onSend(text);
            setText('');
        }
    }
    return (
        <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center gap-2 max-w-4xl mx-auto">
            
            {/* 추가 기능 */}
            <button className="btn btn-ghost btn-circle btn-sm text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </button>
            
            {/* 실제 입력창 */}
            <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="input input-bordered flex-1 bg-gray-100 focus:bg-white focus:outline-none border-none"
                placeholder="메세지를 입력하세요..."
            />

            {/* 전송 버튼 */}
            <button type="submit" className="btn btn-primary btn-sm h-10 px-4">
               전송
            </button>
          </div>
        </form>
    );
}