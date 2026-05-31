import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Repeat2, CheckCircle2 } from 'lucide-react';

export default function PostCard({ post }) {
  const [liked, setLiked] = useState(false);

  return (
    <div className="p-4 hover:bg-slate-800/50 transition bg-slate-900 border-b border-slate-800">
      <div className="flex items-center space-x-2 flex-wrap gap-y-1">
        <span className="font-bold text-white hover:underline cursor-pointer">{post.author}</span>
        {post.isVerified && <CheckCircle2 size={16} className="text-blue-400 fill-blue-400" />}
        <span className="text-slate-500 text-sm">@{post.username}</span>
        <span className="bg-slate-800 text-xs px-2 py-0.5 rounded text-slate-400 uppercase font-mono">{post.category}</span>
      </div>

      <p className="mt-2 text-slate-200 leading-relaxed">{post.content}</p>

      <div className="flex justify-between items-center mt-4 max-w-md text-slate-500 text-sm">
        <button
          onClick={() => setLiked(!liked)}
          className={`flex items-center space-x-2 hover:text-red-500 transition ${liked ? 'text-red-500' : ''}`}
        >
          <Heart size={18} className={liked ? 'fill-red-500' : ''} />
          <span>{liked ? post.likes + 1 : post.likes}</span>
        </button>

        <button
          disabled={post.commentsDisabled}
          className={`flex items-center space-x-2 hover:text-blue-400 transition ${post.commentsDisabled ? 'opacity-40 cursor-not-allowed' : ''}`}
        >
          <MessageCircle size={18} />
          <span>{post.commentsDisabled ? 'Restricted' : '12'}</span>
        </button>

        <button className="flex items-center space-x-2 hover:text-green-500 transition">
          <Repeat2 size={18} />
        </button>

        <button className="flex items-center space-x-2 hover:text-blue-400 transition">
          <Share2 size={18} />
        </button>
      </div>
    </div>
  );
}
