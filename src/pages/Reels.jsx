import React, { useState, useRef } from 'react';
import { useInfiniteQuery } from 'react-query';
import { motion } from 'framer-motion';

// Fake API fetch function
const fetchReels = ({ pageParam = 1 }) =>
  new Promise((resolve) => {
    setTimeout(() => {
      const reels = Array.from({ length: 10 }, (_, i) => ({
        id: `reel-${pageParam}-${i}`,
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', // placeholder video
        musicUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        title: `Reel ${pageParam}-${i}`,
      }));
      resolve({
        reels,
        nextPage: pageParam < 5 ? pageParam + 1 : undefined, // limit pages for demo
      });
    }, 1000);
  });

function Loading() {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <style jsx>{`
        .loading-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
        }
        .spinner {
          width: 50px;
          height: 50px;
          border: 5px solid #ccc;
          border-top-color: #333;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

function Reel({ reel }) {
  const audioRef = useRef(null);
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [liked, setLiked] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const [showShareSave, setShowShareSave] = useState(false);

  const toggleSound = () => {
    if (audioRef.current) {
      if (soundOn) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setSoundOn(!soundOn);
    }
  };

  const handleLike = () => {
    setLiked(!liked);
  };

  const toggleShareSave = () => {
    setShowShareSave(!showShareSave);
  };

  return (
    <div className="reel">
      <video
        src={reel.videoUrl}
        controls={false}
        autoPlay
        muted
        ref={videoRef}
        style={{ width: '100%', height: 'auto' }}
      />
      
      {/* Like Button with animation */}
      <div className="like-button" onClick={handleLike}>
        <motion.div
          animate={{ scale: liked ? 1.2 : 1 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          {liked ? '❤️' : '🤍'}
        </motion.div>
      </div>
      
      {/* Sound toggle */}
      <div className="sound-control" onClick={toggleSound}>
        {soundOn ? '🔊' : '🔇'}
      </div>

      {/* Hidden audio for background music */}
      <audio ref={audioRef} src={reel.musicUrl} />

      {/* Share & Save Buttons */}
      <div className="actions">
        <button className="action-btn" onClick={toggleShareSave}>🔖</button>
        <button className="action-btn" onClick={toggleShareSave}>🚀</button>
      </div>

      {/* Share / Save overlay */}
      {showShareSave && (
        <div className="share-save-overlay" onClick={toggleShareSave}>
          <div className="popup">
            <h3>Share & Save</h3>
            <button onClick={() => alert('Saved!')}>Save Reel</button>
            <button onClick={() => alert('Shared!')}>Share Reel</button>
          </div>
        </div>
      )}

      <style jsx>{`
        .reel {
          position: relative;
          margin: 20px 0;
          background: #000;
        }
        .like-button {
          position: absolute;
          top: 10px;
          left: 10px;
          font-size: 32px;
          cursor: pointer;
        }
        .sound-control {
          position: absolute;
          bottom: 10px;
          right: 10px;
          font-size: 24px;
          cursor: pointer;
          background: rgba(255,255,255,0.7);
          padding: 4px 8px;
          border-radius: 8px;
        }
        .actions {
          position: absolute;
          top: 10px;
          right: 10px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .action-btn {
          background: rgba(0,0,0,0.5);
          border: none;
          color: white;
          padding: 8px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 20px;
        }
        .share-save-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.6);
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .popup {
          background: white;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
        }
        @media (max-width: 600px) {
          .like-button {
            font-size: 24px;
          }
        }
      `}</style>
    </div>
  );
}

function ReelFeed() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery('reels', fetchReels, {
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  const handleScroll = (e) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div
      style={{ height: '100vh', overflowY: 'auto' }}
      onScroll={handleScroll}
    >
      {/* Filter Header */}
      <div className="filter-header">
        <button>Trending</button>
        <button>Recent</button>
        <button>Popular</button>
      </div>

      {/* List of Reels */}
      {data.pages.flatMap((page) =>
        page.reels.map((reel) => <Reel key={reel.id} reel={reel} />)
      )}

      {isFetchingNextPage && (
        <div style={{ textAlign: 'center', padding: '20px' }}>Loading more...</div>
      )}

      <style jsx>{`
        .filter-header {
          position: sticky;
          top: 0;
          background: #fff;
          display: flex;
          gap: 10px;
          padding: 10px;
          z-index: 10;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .filter-header button {
          padding: 8px 16px;
          border: none;
          background: #eee;
          border-radius: 20px;
          cursor: pointer;
        }
        /* Add hover effects or active styles as needed */
      `}</style>
    </div>
  );
}

export default function App() {
  return (
    <div>
      <ReelFeed />
    </div>
  );
}