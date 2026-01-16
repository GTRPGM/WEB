export default function Navbar() {
    return (
        <div className="navbar w-full border-b border-gray-200 px-4">
          <label htmlFor="my-drawer" className="btn btn-ghost btn-sm drawer-button mr-2 px-1">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth={1.5} 
              stroke="currentColor" 
              className="w-6 h-6"
            >
              <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" 
              />
            </svg>
          </label>
          <span className="font-bold text-lg">TRPG</span>
        </div>
    );
}