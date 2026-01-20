import { useState } from "react";
import { useUserStore } from "../store/useUserStore";

export default function Navbar() {
  const [isStatusOpen, setIsStatusOpen] = useState(false);

  const userProfile = useUserStore((state) => state.userProfile);

    return (
        <div className="navbar w-full border-b border-gray-200 px-4">
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
                    <span className="text=[11px] text-gray-800 font-bold">
                      [ {userProfile?.name} ]
                    </span>
                  </div>
                

                  <div className="py-2 space-y-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                       <span className="font-bold text-red-500">HP</span>
                       <span className="text-gray-600">80 / 100</span> {/*수정필요*/}
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

                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
    );
}