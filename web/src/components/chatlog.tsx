export default function ChatLog() {
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
                    <p className="mt-1 leading-relaxed">It's over Anakin, I have the high ground.</p>
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

        </div>
    );
}