
'use client'; // Required for client-side interactivity

import { useState, useEffect } from 'react';
import {Sun, Moon} from 'lucide-react';

export const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light'
    //typeof window !== 'undefined' ? (localStorage.getItem('theme') as 'light' | 'dark') || 'light' : 'light'
  );

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <div 
      className='flex justify-start items-center space-x-2 p-3 hover:bg-blue-200 hover:text-blue-800 bg-teal-800 text-sm rounded'
    >
      <button
        id='theme'
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      >
        {theme==='dark' ? <Moon strokeWidth={1}/> : <Sun strokeWidth={1} />}
      </button>
      <label htmlFor='theme' className='cursor-pointer' >
        {theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      </label>
    </div>
  )
    
}

// export default ThemeToggle;
