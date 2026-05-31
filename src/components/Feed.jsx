import React, { useState, useEffect } from 'react';
import PostCard from './PostCard';

const API_URL = 'https://feed-er99.onrender.com/api/v1';

export default function Feed() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [posts, setPosts] = useState([
    {
      id: '1',
      author: 'Ministry of Finance',
      username: 'mof_gov',
      pageType: 'GOVT',
      isVerified: true,
      category: 'economics',
      content: 'Quarterly fiscal policy adjustments show a 4.2% stability upturn in trade liquidity metrics.',
      likes: 142,
      commentsDisabled: false
    },
    {
      id: '2',
      author: 'Apex Athletics',
      username: 'apex_sports',
      pageType: 'SPORTS_CLUB',
      isVerified: true,
      category: 'sports',
      content: 'Official Announcement: Match configurations for the summer tournament schedules are now officially set.',
      likes: 89,
      commentsDisabled: true
    }
  ]);
  const [loading, setLoading] = useState(false);

  const categories = ['all', 'sports', 'economics', 'entertainment', 'international affairs'];

  useEffect(() => {
    const token = localStorage.getItem('feed_token');
    if (!token) return;
    setLoading(true);
    fetch(`${API_URL}/posts`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setPosts(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="flex overflow-x-auto border-b border-slate-800 p-4 space-x-2 scrollbar-none">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`capitalize px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition ${
              activeCategory === cat ? 'bg-blue-700 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading && (
        <div className="p-6 text-center text-slate-500 text-sm animate-pulse">Loading feed...</div>
      )}

      <div className="divide-y divide-slate-800">
        {posts
          .filter(p => activeCategory === 'all' || p.category === activeCategory)
          .map(post => (
            <PostCard key={post.id} post={post} />
          ))}
      </div>
    </div>
  );
}
