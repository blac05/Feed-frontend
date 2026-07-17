import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

// ── Static data ────────────────────────────────────────────────────────────────

const WORDS = ["creators", "storytellers", "entrepreneurs", "dreamers", "communities"];

const FEATURES = [
  { icon: "📸", title: "Stories & Reels", desc: "Vertical video that captivates. Go viral in seconds.", color: "#EC4899" },
  { icon: "🔴", title: "Go Live", desc: "Broadcast to thousands. Earn coin gifts in real time.", color: "#EF4444" },
  { icon: "🎙️", title: "Audio Spaces", desc: "Host live audio rooms. Think out loud with the world.", color: "#7C3AED" },
  { icon: "📰", title: "Headlines", desc: "Reddit-style community news ranked by real votes.", color: "#F59E0B" },
  { icon: "🛍️", title: "Marketplace", desc: "Sell products directly to the people who love you.", color: "#10B981" },
  { icon: "💎", title: "Subscriptions", desc: "Monetize your audience with exclusive monthly tiers.", color: "#2563EB" },
];

const ROW1 = [
  { icon: "🔴", title: "alexj is LIVE", sub: "234 watching now", color: "#EF4444" },
  { icon: "❤️", title: "1.2K likes on your post", sub: "Trending in #Tech", color: "#EC4899" },
  { icon: "👤", title: "Sarah K. followed you", sub: "Creator · 45K followers", color: "#7C3AED" },
  { icon: "🏆", title: "You're trending!", sub: "#1 in Technology", color: "#F59E0B" },
  { icon: "🎙️", title: "AI Talks Space", sub: "156 listening now", color: "#2563EB" },
  { icon: "💬", title: "New message from Mike", sub: '"Let\'s collab 🔥"', color: "#0EA5E9" },
  { icon: "📸", title: "Your story", sub: "892 views · 12h left", color: "#8B5CF6" },
  { icon: "🪙", title: "150 coins received", sub: "From live stream gifts", color: "#F59E0B" },
];

const ROW2 = [
  { icon: "💰", title: "New subscriber!", sub: "Fan tier · ₦500/mo", color: "#10B981" },
  { icon: "🎬", title: "Reel went viral", sub: "23K views in 2 hours", color: "#EC4899" },
  { icon: "💎", title: "Gold award received", sub: "On your top headline", color: "#F59E0B" },
  { icon: "📊", title: "Engagement up 12%", sub: "Compared to last week", color: "#2563EB" },
  { icon: "🔔", title: "5 new comments", sub: "On your latest headline", color: "#7C3AED" },
  { icon: "⭐", title: "Account verified!", sub: "Creator badge unlocked", color: "#0EA5E9" },
  { icon: "🛍️", title: "Product sold! ₦2,500", sub: "via Feed Marketplace", color: "#10B981" },
  { icon: "🤝", title: "Wholesome award", sub: "Community loved it", color: "#F472B6" },
];

// ── Global CSS injected once ───────────────────────────────────────────────────

const GLOBAL_CSS = `
  @keyframes orbPulse1 {
    0%,100% { transform: translate(0,0) scale(1); }
    33%      { transform: translate(40px,-30px) scale(1.06); }
    66%      { transform: translate(-20px,40px) scale(0.96); }
  }
  @keyframes orbPulse2 {
    0%,100% { transform: translate(0,0) scale(1); }
    33%      { transform: translate(-50px,20px) scale(0.94); }
    66%      { transform: translate(30px,-50px) scale(1.05); }
  }
  @keyframes orbPulse3 {
    0%,100% { transform: translate(0,0) scale(1); }
    50%      { transform: translate(25px,35px) scale(1.08); }
  }
  @keyframes shimmerText {
    0%   { background-position: -300% center; }
    100% { background-position:  300% center; }
  }
  @keyframes cursorBlink {
    0%,100% { opacity: 1; }
    50%      { opacity: 0; }
  }
  @keyframes slideUp {
    from { opacity:0; transform:translateY(32px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes scaleIn {
    from { opacity:0; transform:scale(0.92); }
    to   { opacity:1; transform:scale(1); }
  }
  @keyframes scrollLeft {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
  @keyframes scrollRight {
    from { transform: translateX(-50%); }
    to   { transform: translateX(0); }
  }
  @keyframes liveDot {
    0%,100% { opacity:1; }
    50%      { opacity:0.35; }
  }
  @keyframes floatPhone {
    0%,100% { transform: translateY(0px); }
    50%      { transform: translateY(-12px); }
  }
  @keyframes gradMove {
    0%,100% { background-position: 0% 50%; }
    50%      { background-position: 100% 50%; }
  }
  @keyframes heartPop {
    0%   { transform: scale(1); }
    40%  { transform: scale(1.45); }
    100% { transform: scale(1); }
  }

  /* hover helpers (JS inline styles can't do :hover) */
  .feed-btn-primary:hover  { filter:brightness(1.12); transform:translateY(-2px); box-shadow:0 16px 48px rgba(37,99,235,.55) !important; }
  .feed-btn-ghost:hover    { background:rgba(255,255,255,.08) !important; transform:translateY(-2px); border-color:rgba(255,255,255,.2) !important; }
  .feed-feat-card:hover    { transform:translateY(-7px) !important; border-color:rgba(255,255,255,.13) !important; background:rgba(255,255,255,.04) !important; }
  .feed-stat-box:hover     { transform:translateY(-4px) !important; border-color:rgba(99,102,241,.35) !important; }
  .feed-notif-chip:hover   { transform:scale(1.04) translateY(-2px) !important; }
  .feed-footer-link:hover  { color:#94A3B8 !important; }

  @media(max-width:820px) {
    .feed-hero-grid   { grid-template-columns:1fr !important; text-align:center; }
    .feed-hero-ctas   { justify-content:center !important; }
    .feed-hero-proof  { justify-content:center !important; }
    .feed-phone-col   { display:none !important; }
    .feed-feat-grid   { grid-template-columns:1fr 1fr !important; }
    .feed-stats-grid  { grid-template-columns:1fr 1fr !important; }
  }
  @media(max-width:500px) {
    .feed-feat-grid  { grid-template-columns:1fr !important; }
  }
`;

// ── Sub-components ─────────────────────────────────────────────────────────────

function NotifChip({ icon, title, sub, color }) {
  return (
    <div
      className="feed-notif-chip"
      style={{
        display: "inline-flex", alignItems: "center", gap: 10,
        background: "rgba(10,14,28,.88)", backdropFilter: "blur(12px)",
        border: `1px solid ${color}28`, borderLeft: `3px solid ${color}`,
        borderRadius: 16, padding: "10px 16px",
        marginRight: 10, minWidth: 196, flexShrink: 0,
        transition: "transform .2s, box-shadow .2s",
        boxShadow: `0 4px 20px rgba(0,0,0,.3), 0 0 12px ${color}10`,
        cursor: "default",
      }}
    >
      <div style={{
        width: 34, height: 34, borderRadius: 10,
        background: `${color}18`, display: "flex",
        alignItems: "center", justifyContent: "center",
        fontSize: 15, flexShrink: 0,
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#E2E8F0", whiteSpace: "nowrap" }}>{title}</div>
        <div style={{ fontSize: 11, color: "#64748B", marginTop: 2, whiteSpace: "nowrap" }}>{sub}</div>
      </div>
    </div>
  );
}

function Marquee({ items, reverse = false, speed = 38 }) {
  const doubled = [...items, ...items];
  return (
    <div style={{
      overflow: "hidden", width: "100%",
      maskImage: "linear-gradient(90deg,transparent,black 8%,black 92%,transparent)",
      WebkitMaskImage: "linear-gradient(90deg,transparent,black 8%,black 92%,transparent)",
    }}>
      <div style={{
        display: "flex", width: "max-content",
        animation: `${reverse ? "scrollRight" : "scrollLeft"} ${speed}s linear infinite`,
      }}>
        {doubled.map((item, i) => <NotifChip key={i} {...item} />)}
      </div>
    </div>
  );
}

function PhoneMockup() {
  const [liked, setLiked] = useState({});
  const [activeHeart, setActiveHeart] = useState(null);

  useEffect(() => {
    let i = 0;
    const iv = setInterval(() => {
      const idx = i % 3;
      setActiveHeart(idx);
      setLiked(p => ({ ...p, [idx]: true }));
      setTimeout(() => setActiveHeart(null), 700);
      i++;
    }, 2400);
    return () => clearInterval(iv);
  }, []);

  const posts = [
    { user: "sarah_k", avatar: "👩🏻", content: "Just launched my new product! 🎉 Check the link →", likes: "1.2K", color: "#EC4899" },
    { user: "alexj_tech", avatar: "🧑🏾", content: "Why Feed is the only platform creators need 🧵", likes: "892", color: "#2563EB" },
    { user: "mikechen", avatar: "👨🏽", content: "Morning routine that changed everything ✨", likes: "567", color: "#7C3AED" },
  ];

  return (
    <div style={{ animation: "floatPhone 6s ease-in-out infinite", flexShrink: 0 }}>
      <div style={{
        width: 238, height: 486, background: "#090D1A",
        borderRadius: 40, border: "2px solid rgba(255,255,255,.09)",
        position: "relative", overflow: "hidden",
        boxShadow: "0 0 0 1px rgba(255,255,255,.03), 0 32px 80px rgba(0,0,0,.65), 0 0 80px rgba(37,99,235,.14)",
      }}>
        {/* Dynamic island */}
        <div style={{
          position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
          width: 90, height: 26, background: "#090D1A",
          borderRadius: "0 0 18px 18px", zIndex: 10,
          border: "1px solid rgba(255,255,255,.05)", borderTop: "none",
        }} />

        {/* Status bar */}
        <div style={{ padding: "32px 16px 6px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: "#94A3B8" }}>9:41</span>
          <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
            {[12, 9, 6].map((w, i) => (
              <div key={i} style={{ height: 8, width: w, background: i === 0 ? "#22C55E" : "#334155", borderRadius: 2 }} />
            ))}
            <div style={{ width: 18, height: 9, borderRadius: 3, border: "1px solid #334155", display: "flex", alignItems: "center", padding: "0 2px" }}>
              <div style={{ width: 12, height: 5, background: "#22C55E", borderRadius: 2 }} />
            </div>
          </div>
        </div>

        {/* App bar */}
        <div style={{ padding: "4px 14px 8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 16, fontWeight: 900, background: "linear-gradient(90deg,#60A5FA,#A78BFA)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Feed</span>
          <div style={{ width: 26, height: 26, borderRadius: "50%", background: "rgba(255,255,255,.06)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 12 }}>🔔</span>
          </div>
        </div>

        {/* Stories */}
        <div style={{ padding: "2px 12px 8px", display: "flex", gap: 8, overflowX: "hidden" }}>
          {[
            ["🧑🏾", "linear-gradient(135deg,#2563EB,#7C3AED)"],
            ["👩🏻", "linear-gradient(135deg,#EC4899,#7C3AED)"],
            ["🧑🏽", "linear-gradient(135deg,#F59E0B,#EF4444)"],
            ["👨🏿", "linear-gradient(135deg,#10B981,#2563EB)"],
            ["👩🏼", "linear-gradient(135deg,#F472B6,#EC4899)"],
          ].map(([emoji, grad], i) => (
            <div key={i} style={{ flexShrink: 0 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: grad, padding: 2 }}>
                <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: "#090D1A", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>
                  {emoji}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ height: 1, background: "rgba(255,255,255,.05)" }} />

        {/* Posts */}
        {posts.map((post, i) => (
          <div key={i} style={{ padding: "8px 12px", borderBottom: "1px solid rgba(255,255,255,.04)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
              <div style={{ width: 26, height: 26, borderRadius: "50%", background: `${post.color}22`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>
                {post.avatar}
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                  <span style={{ fontSize: 10, fontWeight: 800, color: "#E2E8F0" }}>@{post.user}</span>
                  <span style={{ fontSize: 8, color: post.color }}>✓</span>
                </div>
              </div>
              <span style={{ marginLeft: "auto", fontSize: 9, color: "#334155" }}>2m</span>
            </div>
            <p style={{ fontSize: 10, color: "#94A3B8", lineHeight: 1.45, marginBottom: 6 }}>{post.content}</p>
            <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
              <button
                onClick={() => setLiked(p => ({ ...p, [i]: !p[i] }))}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  fontSize: 11, color: liked[i] ? "#EC4899" : "#475569",
                  display: "flex", alignItems: "center", gap: 3, padding: 0,
                  animation: activeHeart === i ? "heartPop .35s ease" : "none",
                }}
              >
                {liked[i] ? "❤️" : "🤍"}
                <span style={{ color: liked[i] ? "#EC4899" : "#475569", fontWeight: 600 }}>{post.likes}</span>
              </button>
              <span style={{ fontSize: 11, color: "#334155" }}>💬</span>
              <span style={{ fontSize: 11, color: "#334155" }}>↩️</span>
              <span style={{ marginLeft: "auto", fontSize: 11, color: "#334155" }}>🔖</span>
            </div>
          </div>
        ))}

        {/* Bottom nav */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 52,
          background: "rgba(9,13,26,.96)", backdropFilter: "blur(10px)",
          borderTop: "1px solid rgba(255,255,255,.06)",
          display: "flex", alignItems: "center", justifyContent: "space-around", padding: "0 8px 4px",
        }}>
          {[["🏠", true], ["🔍", false], ["➕", false], ["📱", false], ["👤", false]].map(([icon, active], i) => (
            <div key={i} style={{ fontSize: 17, opacity: active ? 1 : 0.35, cursor: "pointer", transition: "opacity .2s" }}>
              {icon}
            </div>
          ))}
        </div>

        {/* Screen edge glow */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 90, background: "linear-gradient(to top,rgba(37,99,235,.07),transparent)", pointerEvents: "none" }} />
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function Landing() {
  const navigate = useNavigate();

  const [wordIdx, setWordIdx]     = useState(0);
  const [charIdx, setCharIdx]     = useState(8);
  const [deleting, setDeleting]   = useState(false);
  const [displayWord, setDisplay] = useState("creators");
  const [mousePos, setMouse]      = useState({ x: 0, y: 0 });
  const [counts, setCounts]       = useState({ posts: 0, creators: 0, countries: 0, uptime: 0 });
  const [statsVis, setStatsVis]   = useState(false);
  const [featVis, setFeatVis]     = useState(false);
  const [ctaVis, setCtaVis]       = useState(false);

  const statsRef = useRef(null);
  const featRef  = useRef(null);
  const ctaRef   = useRef(null);

  // Typewriter
  useEffect(() => {
    const word  = WORDS[wordIdx];
    const delay = deleting ? 55 : 105;
    const t = setTimeout(() => {
      if (!deleting) {
        if (charIdx < word.length) {
          setDisplay(word.slice(0, charIdx + 1));
          setCharIdx(c => c + 1);
        } else {
          setTimeout(() => setDeleting(true), 2800);
        }
      } else {
        if (charIdx > 0) {
          setDisplay(word.slice(0, charIdx - 1));
          setCharIdx(c => c - 1);
        } else {
          setDeleting(false);
          setWordIdx(i => (i + 1) % WORDS.length);
        }
      }
    }, delay);
    return () => clearTimeout(t);
  }, [charIdx, deleting, wordIdx]);

  // Mouse parallax
  useEffect(() => {
    const h = (e) => setMouse({
      x: (e.clientX / window.innerWidth  - 0.5) * 38,
      y: (e.clientY / window.innerHeight - 0.5) * 24,
    });
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, []);

  // Stats counter (easeOutCubic)
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !statsVis) {
        setStatsVis(true);
        let f = 0;
        const iv = setInterval(() => {
          f++;
          const p = 1 - Math.pow(1 - f / 80, 3);
          setCounts({
            posts:     +(2   * p).toFixed(1),
            creators:  Math.floor(500 * p),
            countries: Math.floor(190 * p),
            uptime:    +(99.9 * p).toFixed(1),
          });
          if (f >= 80) clearInterval(iv);
        }, 16);
      }
    }, { threshold: 0.3 });
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, [statsVis]);

  // Reveal observers
  useEffect(() => {
    const make = (ref, fn) => {
      const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) fn(true); }, { threshold: 0.1 });
      if (ref.current) o.observe(ref.current);
      return () => o.disconnect();
    };
    const c1 = make(featRef, setFeatVis);
    const c2 = make(ctaRef,  setCtaVis);
    return () => { c1(); c2(); };
  }, []);

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div style={{ background: "#050810", color: "#F1F5F9", minHeight: "100vh", fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif", overflowX: "hidden" }}>
      <style>{GLOBAL_CSS}</style>

      {/* ── BACKGROUND ORBS ─────────────────────────────────────────────── */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
        <div style={{
          position: "absolute", width: 820, height: 820, borderRadius: "50%",
          background: "radial-gradient(circle,rgba(37,99,235,.2) 0%,transparent 70%)",
          top: "-22%", left: "-16%",
          animation: "orbPulse1 20s ease-in-out infinite",
          transform: `translate(${mousePos.x * .35}px,${mousePos.y * .35}px)`,
          transition: "transform .4s ease",
        }} />
        <div style={{
          position: "absolute", width: 660, height: 660, borderRadius: "50%",
          background: "radial-gradient(circle,rgba(124,58,237,.16) 0%,transparent 70%)",
          top: "28%", right: "-14%",
          animation: "orbPulse2 26s ease-in-out infinite 4s",
          transform: `translate(${-mousePos.x * .25}px,${mousePos.y * .25}px)`,
          transition: "transform .4s ease",
        }} />
        <div style={{
          position: "absolute", width: 560, height: 560, borderRadius: "50%",
          background: "radial-gradient(circle,rgba(14,165,233,.13) 0%,transparent 70%)",
          bottom: "-8%", left: "33%",
          animation: "orbPulse3 18s ease-in-out infinite 8s",
        }} />
        {/* Grid */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(rgba(255,255,255,.016) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.016) 1px,transparent 1px)",
          backgroundSize: "60px 60px",
        }} />
      </div>

      {/* ── NAV ─────────────────────────────────────────────────────────── */}
      <nav style={{
        position: "relative", zIndex: 10,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "18px 40px",
        borderBottom: "1px solid rgba(255,255,255,.04)",
        backdropFilter: "blur(20px)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 13,
            background: "linear-gradient(135deg,#2563EB,#7C3AED)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 18px rgba(37,99,235,.42)",
          }}>
            <span style={{ fontSize: 20, fontWeight: 900, color: "white" }}>F</span>
          </div>
          <span style={{
            fontSize: 23, fontWeight: 900, letterSpacing: "-0.5px",
            background: "linear-gradient(90deg,#93C5FD,#C4B5FD,#F9A8D4,#93C5FD)",
            backgroundSize: "200% auto",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            animation: "shimmerText 5s linear infinite",
          }}>
            Feed
          </span>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button
            className="feed-btn-ghost"
            onClick={() => navigate("/login")}
            style={{
              background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)",
              color: "#CBD5E1", padding: "9px 22px", borderRadius: 100,
              cursor: "pointer", fontSize: 14, fontWeight: 600, transition: "all .2s",
            }}
          >
            Log In
          </button>
          <button
            className="feed-btn-primary"
            onClick={() => navigate("/register")}
            style={{
              background: "linear-gradient(135deg,#2563EB,#7C3AED)",
              color: "white", padding: "9px 24px", borderRadius: 100,
              cursor: "pointer", fontSize: 14, fontWeight: 700,
              border: "none", transition: "all .25s",
              boxShadow: "0 4px 24px rgba(37,99,235,.38)",
            }}
          >
            Get Started →
          </button>
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────────────────────────────── */}
      <section style={{ position: "relative", zIndex: 1, padding: "64px 40px 40px", animation: "slideUp .8s ease forwards" }}>
        <div
          className="feed-hero-grid"
          style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 52, alignItems: "center", maxWidth: 1080, margin: "0 auto" }}
        >
          {/* Left — copy */}
          <div>
            {/* Eyebrow */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "rgba(37,99,235,.08)", border: "1px solid rgba(37,99,235,.26)",
              borderRadius: 100, padding: "6px 16px", marginBottom: 28,
              fontSize: 12, color: "#93C5FD", fontWeight: 700, letterSpacing: ".4px",
            }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22C55E", display: "inline-block", animation: "liveDot 2s ease infinite" }} />
              New · Audio Spaces, Headlines & Marketplace live
            </div>

            {/* Headline */}
            <h1 style={{ fontSize: "clamp(40px,6vw,82px)", fontWeight: 900, lineHeight: 1.04, letterSpacing: "-2.5px", color: "#F8FAFC", marginBottom: 10 }}>
              Your platform.<br />
              Your{" "}
              <span style={{
                background: "linear-gradient(135deg,#60A5FA 0%,#A78BFA 45%,#F472B6 100%)",
                backgroundSize: "200% auto",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                animation: "gradMove 4s ease infinite",
              }}>
                {displayWord}
              </span>
              <span style={{ color: "#60A5FA", WebkitTextFillColor: "#60A5FA", animation: "cursorBlink 1s step-end infinite" }}>|</span>
            </h1>

            {/* Body */}
            <p style={{ fontSize: "clamp(15px,2vw,18px)", color: "#94A3B8", lineHeight: 1.72, maxWidth: 500, marginBottom: 36 }}>
              Stories, live streams, audio spaces, headlines, a marketplace, and subscriptions —
              everything creators need to connect, grow, and earn.
            </p>

            {/* CTAs */}
            <div className="feed-hero-ctas" style={{ display: "flex", gap: 12, marginBottom: 40, flexWrap: "wrap" }}>
              <button
                className="feed-btn-primary"
                onClick={() => navigate("/register")}
                style={{
                  background: "linear-gradient(135deg,#2563EB,#7C3AED)",
                  color: "white", padding: "15px 38px", borderRadius: 100,
                  cursor: "pointer", fontSize: 16, fontWeight: 700,
                  border: "none", transition: "all .25s",
                  boxShadow: "0 8px 32px rgba(37,99,235,.42)", letterSpacing: "-.3px",
                }}
              >
                Start creating — it's free
              </button>
              <button
                className="feed-btn-ghost"
                onClick={() => navigate("/login")}
                style={{
                  background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.1)",
                  color: "#94A3B8", padding: "15px 36px", borderRadius: 100,
                  cursor: "pointer", fontSize: 16, fontWeight: 600, transition: "all .25s",
                }}
              >
                Sign in →
              </button>
            </div>

            {/* Social proof */}
            <div className="feed-hero-proof" style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
              <div style={{ display: "flex" }}>
                {["🧑🏾","👩🏻","🧑🏽","👨🏿","👩🏼"].map((e, i) => (
                  <div key={i} style={{
                    width: 34, height: 34, borderRadius: "50%",
                    background: `hsl(${i * 55 + 200},62%,34%)`,
                    border: "2.5px solid #050810",
                    marginLeft: i === 0 ? 0 : -10,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 15, position: "relative", zIndex: 5 - i,
                  }}>
                    {e}
                  </div>
                ))}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#CBD5E1" }}>500,000+ creators</div>
                <div style={{ fontSize: 12, color: "#475569" }}>already building on Feed</div>
              </div>
              <div style={{ width: 1, height: 30, background: "rgba(255,255,255,.07)" }} />
              <div style={{ display: "flex", gap: 1 }}>
                {[1,2,3,4,5].map(s => <span key={s} style={{ fontSize: 14, color: "#F59E0B" }}>★</span>)}
              </div>
            </div>
          </div>

          {/* Right — phone */}
          <div className="feed-phone-col">
            <PhoneMockup />
          </div>
        </div>
      </section>

      {/* ── NOTIFICATION MARQUEE ────────────────────────────────────────── */}
      <div style={{ position: "relative", zIndex: 1, padding: "16px 0 28px" }}>
        <div style={{ marginBottom: 10 }}><Marquee items={ROW1} speed={40} /></div>
        <Marquee items={ROW2} reverse speed={52} />
      </div>

      {/* ── STATS ───────────────────────────────────────────────────────── */}
      <section ref={statsRef} style={{
        position: "relative", zIndex: 1, padding: "56px 40px",
        borderTop: "1px solid rgba(255,255,255,.04)",
        borderBottom: "1px solid rgba(255,255,255,.04)",
      }}>
        <p style={{ textAlign: "center", fontSize: 12, fontWeight: 700, color: "#7C3AED", letterSpacing: "3px", textTransform: "uppercase", marginBottom: 40 }}>
          Feed by the numbers
        </p>
        <div
          className="feed-stats-grid"
          style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, maxWidth: 900, margin: "0 auto" }}
        >
          {[
            { val: counts.posts,     suf: "M+", label: "Posts Shared",    color: "#60A5FA" },
            { val: counts.creators,  suf: "K+", label: "Active Creators", color: "#A78BFA" },
            { val: counts.countries, suf: "+",  label: "Countries",       color: "#34D399" },
            { val: counts.uptime,    suf: "%",  label: "Uptime",          color: "#F472B6" },
          ].map((s, i) => (
            <div
              key={i}
              className="feed-stat-box"
              style={{
                textAlign: "center",
                background: "rgba(255,255,255,.02)",
                border: "1px solid rgba(255,255,255,.05)",
                borderRadius: 22, padding: "28px 16px",
                transition: "all .3s", cursor: "default",
              }}
            >
              <div style={{ fontSize: "clamp(26px,4vw,44px)", fontWeight: 900, letterSpacing: "-1px", color: s.color }}>
                {s.val}{s.suf}
              </div>
              <div style={{ fontSize: 12, color: "#64748B", marginTop: 8, fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ────────────────────────────────────────────────────── */}
      <section ref={featRef} style={{ position: "relative", zIndex: 1, padding: "80px 40px" }}>
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "#0EA5E9", letterSpacing: "3px", textTransform: "uppercase", marginBottom: 14 }}>
            Everything in one place
          </p>
          <h2 style={{ fontSize: "clamp(28px,5vw,52px)", fontWeight: 900, letterSpacing: "-1.5px", lineHeight: 1.1, color: "#F1F5F9" }}>
            Built for how creators<br />
            <span style={{
              background: "linear-gradient(135deg,#60A5FA,#A78BFA,#F472B6)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>
              actually work
            </span>
          </h2>
        </div>

        <div
          className="feed-feat-grid"
          style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, maxWidth: 980, margin: "0 auto" }}
        >
          {FEATURES.map((f, i) => (
            <div
              key={i}
              className="feed-feat-card"
              style={{
                background: "rgba(255,255,255,.02)",
                border: "1px solid rgba(255,255,255,.06)",
                borderRadius: 26, padding: "28px 24px",
                transition: "all .3s ease", cursor: "default",
                position: "relative", overflow: "hidden",
                animation: featVis ? `slideUp .6s ease ${i * .07}s both` : "none",
                opacity: featVis ? 1 : 0,
              }}
            >
              <div style={{
                position: "absolute", top: -28, right: -28, width: 90, height: 90,
                borderRadius: "50%",
                background: `radial-gradient(circle,${f.color}14,transparent 70%)`,
                pointerEvents: "none",
              }} />
              <div style={{
                fontSize: 28, marginBottom: 16,
                width: 54, height: 54, borderRadius: 17,
                background: `${f.color}12`, border: `1px solid ${f.color}22`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {f.icon}
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: "#F1F5F9", marginBottom: 8, letterSpacing: "-.3px" }}>
                {f.title}
              </h3>
              <p style={{ fontSize: 14, color: "#64748B", lineHeight: 1.65 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CREATOR HIGHLIGHT ───────────────────────────────────────────── */}
      <section style={{ position: "relative", zIndex: 1, padding: "0 40px 80px" }}>
        <div style={{ maxWidth: 980, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {[
            {
              emoji: "🎙️", label: "Audio Spaces",
              title: "Talk live with your audience",
              desc: "Host real-time audio rooms, invite speakers, raise hands. Your Twitter Spaces — built right in.",
              color: "#7C3AED", grad: "rgba(124,58,237,.1)",
            },
            {
              emoji: "📰", label: "Headlines",
              title: "Community news, ranked by votes",
              desc: "Reddit-style posts with upvotes, flairs, Hot/New/Top/Rising — your community decides what matters.",
              color: "#F59E0B", grad: "rgba(245,158,11,.08)",
            },
          ].map((c, i) => (
            <div key={i} style={{
              background: c.grad, border: `1px solid ${c.color}22`,
              borderRadius: 26, padding: "32px 28px",
              transition: "all .3s",
            }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: `${c.color}18`, border: `1px solid ${c.color}30`, borderRadius: 100, padding: "4px 12px", marginBottom: 18, fontSize: 12, color: c.color, fontWeight: 700 }}>
                <span>{c.emoji}</span> {c.label}
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 900, color: "#F1F5F9", marginBottom: 10, letterSpacing: "-.4px" }}>{c.title}</h3>
              <p style={{ fontSize: 14, color: "#64748B", lineHeight: 1.65 }}>{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────── */}
      <section ref={ctaRef} style={{ position: "relative", zIndex: 1, padding: "0 40px 80px" }}>
        <div style={{
          maxWidth: 740, margin: "0 auto",
          background: "linear-gradient(135deg,rgba(37,99,235,.1),rgba(124,58,237,.1),rgba(14,165,233,.06))",
          border: "1px solid rgba(124,58,237,.22)",
          borderRadius: 36, padding: "60px 48px",
          textAlign: "center",
          backdropFilter: "blur(24px)",
          position: "relative", overflow: "hidden",
          animation: ctaVis ? "scaleIn .7s ease forwards" : "none",
          opacity: ctaVis ? 1 : 0,
        }}>
          {/* Corner glows */}
          <div style={{ position: "absolute", top: -50, right: -50, width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(circle,rgba(124,58,237,.18),transparent)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -50, left: -50, width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(circle,rgba(37,99,235,.14),transparent)", pointerEvents: "none" }} />

          <div style={{ fontSize: 52, marginBottom: 20 }}>🚀</div>
          <h2 style={{ fontSize: "clamp(28px,5vw,52px)", fontWeight: 900, letterSpacing: "-1.5px", lineHeight: 1.08, color: "#F8FAFC", marginBottom: 16 }}>
            Ready to build<br />
            <span style={{ background: "linear-gradient(135deg,#60A5FA 0%,#A78BFA 45%,#F472B6 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              your audience?
            </span>
          </h2>
          <p style={{ fontSize: 17, color: "#94A3B8", maxWidth: 420, margin: "0 auto 36px", lineHeight: 1.7 }}>
            Join half a million creators who share, earn, and grow every day on Feed.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              className="feed-btn-primary"
              onClick={() => navigate("/register")}
              style={{
                background: "linear-gradient(135deg,#2563EB,#7C3AED)",
                color: "white", padding: "16px 44px", borderRadius: 100,
                cursor: "pointer", fontSize: 17, fontWeight: 800,
                border: "none", transition: "all .25s",
                boxShadow: "0 8px 36px rgba(37,99,235,.45)", letterSpacing: "-.3px",
              }}
            >
              Create your account — free
            </button>
            <button
              className="feed-btn-ghost"
              onClick={() => navigate("/login")}
              style={{
                background: "transparent", border: "1px solid rgba(255,255,255,.1)",
                color: "#94A3B8", padding: "16px 36px", borderRadius: 100,
                cursor: "pointer", fontSize: 17, fontWeight: 600, transition: "all .25s",
              }}
            >
              Already have an account
            </button>
          </div>
          <p style={{ marginTop: 22, fontSize: 13, color: "#374151" }}>No credit card required · Cancel anytime</p>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────── */}
      <footer style={{
        position: "relative", zIndex: 1, padding: "28px 40px",
        borderTop: "1px solid rgba(255,255,255,.04)",
        display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 14,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg,#2563EB,#7C3AED)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 900, color: "white" }}>F</div>
          <span style={{ fontSize: 15, fontWeight: 800, color: "#475569" }}>Feed</span>
        </div>
        <p style={{ fontSize: 13, color: "#2D3748" }}>© 2026 Feed. Connect. Create. Captivate.</p>
        <div style={{ display: "flex", gap: 22 }}>
          {["Privacy", "Terms", "Support", "Contact"].map(l => (
            <a key={l} className="feed-footer-link" href="#" style={{ fontSize: 13, color: "#374151", textDecoration: "none", transition: "color .2s" }}>{l}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}
