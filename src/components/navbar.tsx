import { useState } from "react";
import { useUserStore } from "../store/useUserStore";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import { logoutUser } from "../services/authService";
import { useChatStore } from "../store/useChatStore"; // resetAll 사용을 위해 추가
import { usePlayerStatus } from "../hooks/usePlayerStatus";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const userProfile = useUserStore((state) => state.userProfile);
  const clearTokens = useAuthStore((state) => state.clearTokens);
  const logoutUserStore = useUserStore((state) => state.logout);

  const { playerStatus, isLoadingPlayerStatus, playerStatusError } = usePlayerStatus();

  /**
   * 💡 로그아웃 핸들러
   * 물리적 새로고침을 통해 로딩바 멈춤 및 배경 유실 문제를 완전히 해결합니다.
   */
  const handleLogout = async () => {
    try {
      // 1. 서버에 로그아웃 알림 (실패해도 무관하도록 authService에서 처리됨)
      await logoutUser();
      alert('성공적으로 로그아웃되었습니다.');
    } catch (error) {
      console.warn('로그아웃 중 알림 실패');
    } finally {
      // 2. 💡 모든 클라이언트 상태 초기화
      clearTokens(); 
      if (logoutUserStore) logoutUserStore();
      useChatStore.getState().resetAll?.(); // 채팅 스토어 리셋

      // 3. 💡 중요: window.location.href를 통해 앱을 완전히 새로고침하며 로그인 페이지로 이동
      // 이 방식이 로딩바 0% 멈춤(ref 플래그 꼬임)을 해결하는 가장 확실한 방법입니다.
      window.location.href = '/login';
    }
  }

  return (
    <div className="navbar w-full border-b border-base-300 px-4 bg-base-100 gap-2">
      <div className="flex-none lg:hidden">
        <label htmlFor="my-drawer" className="btn btn-square btn-ghost">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 18h16"/>
          </svg>
        </label>
      </div>
      <div className="flex-1 flex items-center gap-2">
        <span className="font-bold text-lg tracking-tighter text-primary">TRPG ONLINE</span>
        <ThemeToggle />
      </div>

      <div className="relative">
        <button
          onClick={() => setIsStatusOpen(!isStatusOpen)}
          className={`btn btn-sm border rounded-lg px-4 transition-all ${
            isStatusOpen
              ? 'btn-primary border-primary shadow-md'
              : 'border-base-300 hover:bg-base-200 text-base-content'
          }`}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider">status</span>
        </button>

        {isStatusOpen && (
          <div className="absolute right-0 z-[101] card card-compact w-80 p-1 shadow-2xl bg-base-200 border border-base-300 mt-2 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="card-body">
              <div className="flex justify-between items-center border-b border-base-300 pb-2 mb-2">
                <h3 className="text-xs font-black uppercase tracking-widest text-base-content/50">Character Status</h3>
                <button
                    onClick={handleLogout}
                    className="text-[10px] font-bold text-error/70 hover:text-error hover:underline transition-colors uppercase"
                >Logout</button>
              </div>
              
              <div className="mb-4">
                <span className="text-lg font-black text-base-content tracking-tight">
                  {userProfile?.name || 'Adventurer'}
                </span>
              </div>
            
              {isLoadingPlayerStatus && (
                <div className="flex justify-center py-4">
                  <span className="loading loading-spinner loading-sm text-primary"></span>
                </div>
              )}
              {playerStatusError && <p className="text-center text-xs text-error font-bold">{playerStatusError}</p>}

              {playerStatus && (
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-[10px] font-bold mb-1">
                     <span className="text-error uppercase">Health Points</span>
                     <span className="text-base-content/90">{playerStatus.hp} / 100</span>
                    </div>
                    <progress className="progress progress-error w-full h-2 shadow-inner" value={playerStatus.hp} max={100}></progress>
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] font-bold mb-1">
                      <span className="text-warning uppercase">Gold Balance</span>
                      <span className="text-base-content/90">{playerStatus.gold?.toLocaleString()} G</span>
                    </div>
                    <progress className="progress progress-warning w-full h-2 shadow-inner" value={playerStatus.gold} max={1000}></progress>
                  </div>

                  <div className="mt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-black text-base-content/40 uppercase tracking-tighter">Inventory Storage</span>
                      <span className="badge badge-ghost badge-xs text-[9px] font-bold">{playerStatus.items?.length || 0} / 20</span>
                    </div>

                    <div className="max-h-40 overflow-y-auto rounded-xl border border-base-300 shadow-inner bg-base-100">
                        <table className="table table-xs w-full">
                          <thead>
                            <tr className="bg-base-300 text-base-content/60 text-[9px] uppercase">
                              <th>Name</th>
                              <th className="text-center">Qty</th>
                              <th>Effect</th>
                            </tr>
                          </thead>
                          <tbody>
                            {playerStatus.items && playerStatus.items.length > 0 ? (
                                playerStatus.items.map((item) => (
                                  <tr key={item.item_id} className="hover:bg-base-200 transition-colors border-b border-base-200 last:border-0">
                                      <td className="font-bold text-base-content text-[11px]">{item.name}</td>
                                      <td className="text-center font-mono text-base-content/60 text-[10px]">1</td>
                                      <td className="text-[9px] text-base-content/50 truncate max-w-[100px]">
                                        {item.description}
                                      </td>
                                  </tr>
                                ))
                              ) : (
                                  <tr>
                                    <td colSpan={3} className="text-center py-6 text-base-content/30 text-[10px] italic font-medium">
                                      Your pouch is empty.
                                    </td>
                                  </tr>
                            )}
                          </tbody>
                        </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <Link to="/edit-profile" className="btn btn-ghost btn-xs text-[10px] font-bold text-base-content/50 uppercase hover:text-primary">
        Profile
      </Link>
    </div>
  );
}