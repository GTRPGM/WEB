import { useState } from "react";

interface ChatInputProps {
    onSend: (text: string) => void;
    onRefreshSummary: () => void; // Add onRefreshSummary prop
}

export default function ChatInput({onSend, onRefreshSummary}: ChatInputProps) {
    const [text, setText] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (text.trim()!==''){
            onSend(text);
            setText('');
        }
    }
    return (
        <form onSubmit={handleSubmit} className="p-4 border-t border-base-300/30 bg-base-100">
          <div className="flex items-center gap-2 max-w-4xl mx-auto">
            
            {/* 요약 새로고침 버튼 */}
            <button type="button" onClick={onRefreshSummary} className="btn btn-ghost btn-circle btn-sm text-base-content/70">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
              </svg>
            </button>
            
            {/* 실제 입력창 */}
            <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="input input-bordered flex-1 bg-base-300 text-base-100 focus:bg-base-300/90 focus:outline-none border-none"
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