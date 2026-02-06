import { useState } from "react";
import { useUserStore } from "../store/useUserStore";
import { useAuthStore } from "../store/useAuthStore";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../services/authService"; // logoutUser 임포트

export default function Navbar() {
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const userProfile = useUserStore((state) => state.userProfile);
  const logout = useAuthStore((state) => state.clearTokens);
  const clearUser = useUserStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = async () => { // 비동기 함수로 변경
    try {
      await logoutUser(); // 백엔드 로그아웃 API 호출
      alert('성공적으로 로그아웃되었습니다.');
    } catch (error: any) {
      console.error('백엔드 로그아웃 실패:', error);
      alert(error.response?.data?.message || '로그아웃에 실패했습니다. 다시 시도해주세요.');
    } finally {
      // API 호출 성공 여부와 관계없이 클라이언트 측 상태 정리 및 페이지 이동
      logout();
      if (clearUser) clearUser();
      navigate('/login', { replace: true });
    }
  }

  return (
    <div className="navbar w-full border-b border-gray-200 px-4 bg-white gap-2">
      <div className="flex-none lg:hidden">
        <label htmlFor="my-drawer" className="btn btn-square btn-ghost">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 18h16"/>
          </svg>
        </label>
      </div>
      <div className="flex-1 flex items-center">
        <span className="font-bold text-lg">TRPG</span>
      </div>

      <div className="relative">
        <button
          onClick={() => setIsStatusOpen(!isStatusOpen)}
          className={`btn border rounded-lg px-3 transition-colors ${
            isStatusOpen
              ? 'btn-primary border-primary'
              : 'border-gray-200 hover:bg-gray-100 text-gray-700'
          }`}
        >
          <span className={isStatusOpen ? 'text-white' : 'text-gray-700 font-bold'}>status</span>
        </button>

        {isStatusOpen && (
          <div className="absolute right-0 z-[101] card card-compact w-72 p-2 shadow-xl bg-white border border-gray-100 mt-1">
            <div className="card-body">
              <h3 className="text-sm font-bold text-gray-800 border-b pb-2 mb-2">캐릭터 상태</h3>
              
              <div className="flex items-center gap-1 mb-1">
                <span className="text-gray-800 font-bold">
                  [ {userProfile?.name} ]
                </span>

                <button
                    onClick = {handleLogout}
                    className="text-[9px] text-gray-400 hover:text-gray-600 hover:underline transition-colors"
                >로그아웃</button>
              </div>
            

              <div className="py-2 space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                   <span className="font-bold text-red-500">HP</span>
                   <span className="text-gray-600">80 / 100</span>
                  </div>
                  <progress className="progress progress-error w-full h-2" value="80" max="100"></progress>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-bold text-blue-500">MP</span>
                    <span className="text-gray-600">45 / 50</span>
                  </div>
                  <progress className="progress progress-info w-full h-2" value="45" max="100"></progress>
                </div>

                <div className="mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[11px] font-bold text-gray-400 uppercase">Inventory</span>
                    <span className="text-[10px] text-gray-400">{userProfile.inventory?.length || 0} / 20</span>
                  </div>

                  <table className="table table-xs w-full bg-white">
                    <thead>
                      <tr className="bg-gray-100 text-gray-500">
                        <th>이름</th>
                        <th className="text-center">수량</th>
                        <th>효과</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userProfile.inventory && userProfile.inventory.length > 0 ? (
                          userProfile.inventory.map((item) => (
                            <tr key={item.item_id} className="hover:bg-blue-50 cursor-pointer transition-colors border-b border-gray-50 last:border-0">
                                <td className="font-bold text-gray-700">{item.name}</td>
                                <td className="text-center font-mono text-gray-500">x{item.type}</td>
                                <td className="text-[10px] text-gray-400 truncate max-w-[80px]">
                                  {item.effect_value}
                                </td>
                            </tr>
                          ))
                        ) : (
                            <tr>
                              <td colSpan={3} className="text-center py-4 text-gray-300 italic">
                                인벤토리가 비어있습니다.
                              </td>
                            </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Link to="/edit-profile" className="text-xs text-gray-500 hover:underline ml-4">
        회원 정보 수정
      </Link>
    </div>
  );
}