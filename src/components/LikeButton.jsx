// Шаг ③. Кнопка лайка.
//
// Получает props: id, initialLikes.
// Клик ставит лайк (+1), повторный клик снимает (−1). Иконка: ♡ — лайка нет, ♥ — лайк поставлен.
// В макете нажатая кнопка яркая: найдите в DevTools, какой атрибут кнопки за это отвечает, и ставьте его сами.
// Потом используйте LikeButton в MemeCard вместо обычной кнопки.

import { useState } from 'react';
import { API_URL } from '../api.js';

export default function LikeButton({
    id,
    initialLikes,
    initialLiked = false,
    onLikesChange,
}) {
    const [likes, setLikes] = useState(initialLikes);
    const [liked, setLiked] = useState(initialLiked);
    const [pending, setPending] = useState(false);

    function toggle() {
        const nextLiked = !liked;
        const nextLikes = nextLiked ? likes + 1 : likes - 1;
        setLiked(nextLiked);
        setLikes(nextLikes);
        onLikesChange?.({ id, likes: nextLikes, liked: nextLiked });
        setPending(true);

        fetch(`${API_URL}/api/memes/${id}/like`, { method: nextLiked ? 'POST' : 'DELETE', credentials: 'include' })
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then((data) => {
                setLikes(data.likes);
                setLiked(data.liked);
                onLikesChange?.({ id, likes: data.likes, liked: data.liked });
            })
            .catch(() => {
                setLiked(liked);
                setLikes(likes);
                onLikesChange?.({ id, likes, liked });
            })
            .finally(() => setPending(false));
    }

    return (
        <button className="like" onClick={toggle} aria-pressed={liked} disabled={pending}>
            {liked ? '♥' : '♡'} {likes}
        </button>
    );
}
