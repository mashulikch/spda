// Шаг ②. Лента.
//
// Компонент получает props.memes — массив мемов из data/memes.js.
// Покажите карточку MemeCard для каждого мема. Во что обёрнута лента — смотрите в макете.
// Потом покажите в App.jsx всю ленту вместо одной карточки.
// Загляните в Console: React подскажет, если чего-то не хватает.


import { useEffect, useState } from 'react';
import { API_URL } from '../api.js';
import MemeCard from './MemeCard.jsx';

export default function Feed() {
  const [memes, setMemes] = useState([]);
  const [status, setStatus] = useState('loading');
  const [sortBy, setSortBy] = useState('order');
  const [loadAttempt, setLoadAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadMemes() {
      setStatus('loading');
      const apiBase = API_URL?.replace(/\/+$/, '');
      if (!apiBase) {
        setStatus('error');
        return;
      }

      try {
        const response = await fetch(`${apiBase}/api/memes`, {
          credentials: 'include',
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error('Сервер вернул данные в неожиданном формате');
        }

        setMemes(
          data.map((meme) => ({
            ...meme,
            likes: meme.likes ?? 0,
            // Порядок популярных мемов определяется на момент загрузки.
            sortLikes: meme.likes ?? 0,
            liked: meme.liked ?? false,
          })),
        );
        setStatus('ready');
      } catch (error) {
        if (error.name !== 'AbortError') {
          setStatus('error');
        }
      }
    }

    loadMemes();
    return () => controller.abort();
  }, [loadAttempt]);

  function retryLoad() {
    setStatus('loading');
    setLoadAttempt((attempt) => attempt + 1);
  }

  function updateLikes({ id, likes, liked }) {
    setMemes((currentMemes) =>
      currentMemes.map((meme) =>
        meme.id === id ? { ...meme, likes, liked } : meme,
      ),
    );
  }

  if (status === 'loading') {
    return <p className="status">Загружаем мемы…</p>;
  }

  if (status === 'error') {
    return (
      <div className="status">
        Не получилось загрузить ленту.
        <br />
        <button type="button" onClick={retryLoad}>Повторить</button>
      </div>
    );
  }

  if (memes.length === 0) {
    return <p className="status">Мемов пока нет</p>;
  }

  const sortedMemes =
    sortBy === 'popular'
      ? [...memes].sort((a, b) => b.sortLikes - a.sortLikes)
      : memes;

  return (
    <>
      <div className="toolbar sort-toolbar">
        <label htmlFor="meme-sort">Показать:</label>
        <select
          id="meme-sort"
          value={sortBy}
          onChange={(event) => setSortBy(event.target.value)}
        >
          <option value="order">по порядку</option>
          <option value="popular">популярные</option>
        </select>
      </div>

      <div className="feed">
        {sortedMemes.map((meme) => (
          <MemeCard
            key={meme.id}
            {...meme}
            onLikesChange={updateLikes}
          />
        ))}
      </div>
    </>
  );
}
