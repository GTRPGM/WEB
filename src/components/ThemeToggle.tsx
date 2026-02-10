import React, { useEffect, useState } from 'react';

const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState('mytheme'); // Default to mytheme

  useEffect(() => {
    // Read theme from localStorage or default to 'mytheme'
    const storedTheme = localStorage.getItem('theme') || 'mytheme';
    setTheme(storedTheme);
    document.documentElement.setAttribute('data-theme', storedTheme);
  }, []);

  const handleToggle = () => {
    const newTheme = theme === 'mytheme' ? 'cave' : 'mytheme';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <label className="swap swap-rotate ml-2">
      {/* this hidden checkbox controls the state */}
      <input type="checkbox" onChange={handleToggle} checked={theme === 'cave'} />

      {/* sun icon */}
      <svg className="swap-on fill-current w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM18.36,6.34a1,1,0,0,0-1.41-1.41l-.71.71a1,1,0,0,0,1.41,1.41ZM12,19a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM7.05,6.34a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41L7.05,4.93a1,1,0,0,0-1.41,1.41Zm8.9,0a1,1,0,0,0,0-1.41,1,1,0,0,0-1.41,0L13.59,6.34a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0ZM20,11H19a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-8,0V4a8,8,0,0,0-8,8,8,8,0,0,0,8,8h0A8,8,0,0,0,20,12,8,8,0,0,0,12,4Zm0,14A6,6,0,1,1,18,12,6,6,0,0,1,12,18Z"/>
      </svg>

      {/* moon icon */}
      <svg className="swap-off fill-current w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M21.64,13a1,1,0,0,0-1.05-.14,8,8,0,0,1-11.82-5.54,1,1,0,0,0-.79-.79,1,1,0,0,0-1.41.6,9,9,0,0,0,13.9,10.6,1,1,0,0,0,.6-.79A1,1,0,0,0,21.64,13Z"/>
      </svg>
    </label>
  );
};

export default ThemeToggle;
