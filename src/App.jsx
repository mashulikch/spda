import { useState } from 'react';
import Feed from './components/Feed.jsx';

export default function App() {
  const [theme, setTheme] = useState(() =>
    document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light',
  );

  function toggleTheme() {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    document.documentElement.dataset.theme = nextTheme;
    setTheme(nextTheme);
  }

  return (
    <>
      <header className="header">
        <h1>Лента мемов</h1>
        <div className="toolbar">
          <button
            type="button"
            onClick={toggleTheme}
            aria-pressed={theme === 'dark'}
          >
            {theme === 'light' ? '🌙 Тёмная' : '☀️ Светлая'}
          </button>
        </div>
      </header>
      <main className="page">
        <Feed />
      </main>
    </>
  );
}
