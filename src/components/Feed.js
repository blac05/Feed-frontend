import React, { useState } from 'react';
import PostCard from './PostCard';

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
      commentsDisabled: true // Demonstration of owner comment restrictions
    }
  ]);

  const categories = ['all', 'sports', 'economics', 'entertainment', 'international affairs'];

  return (
    <div>
      {/* Category Navigation Bar */}
      <div className="flex overflow-x-auto border-b border-slate-800 p-4 space-x-2 scrollbar-none">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`capitalize px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition ${
              activeCategory === cat ? 'bg-feedBlue text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Feed Stream */}
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