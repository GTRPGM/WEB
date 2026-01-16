export default function Sidebar() {
    return (
        <div className="drawer-side">
        <label htmlFor="my-drawer" className="drawer-overlay"></label>
        <ul className="menu p-4 w-64 min-h-full bg-gray-900 text-white">
          <li className="menu-title text-gray-400">menu</li>
          <li><a>로그</a></li>
          <li><a>공지사항</a></li>
        </ul>
      </div>
    );
}