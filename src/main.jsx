import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Menu, X, ExternalLink, Copy, Gamepad2, TrendingUp, Send, Twitter } from 'lucide-react';
import DuckRun from './games/DuckRun';
import DuckSlots from './games/DuckSlots';
import './styles.css';

const ROADMAP = [
  {
    phase: 'Phase 01',
    title: 'The CEO Enters the Pond',
    items: [
      'Brand identity, logo and social channels',
      'Official website and community launch',
      'Token launch on Solana',
      'DexScreener profile and verified links',
      'First community meme contest',
      'Target: 500 holders'
    ]
  },
  {
    phase: 'Phase 02',
    title: 'Build the Flock',
    items: [
      'Community ambassador program',
      'Weekly social challenges and giveaways',
      'Live token dashboard',
      'Duck Run leaderboard',
      'Expanded DEX visibility',
      'Target: 2,500 holders'
    ]
  },
  {
    phase: 'Phase 03',
    title: 'Duck Games',
    items: [
      'Duck Run full release',
      'Duck CEO Billionaire Slots — free demo points only',
      'Daily missions and badges',
      'Seasonal tournaments',
      'New mini-games voted by the community',
      'Target: 10,000 players'
    ]
  },
  {
    phase: 'Phase 04',
    title: 'Empire Expansion',
    items: [
      'Trade page with wallet connection',
      'Jupiter-powered SOL / DUCKCEO swap integration',
      'Community partnerships',
      'Multilingual website',
      'Merchandise concepts and digital collectibles',
      'Applications to additional DEX directories'
    ]
  },
  {
    phase: 'Phase 05',
    title: 'Global CEO',
    items: [
      'CEX listing applications when eligibility criteria are met',
      'Larger creator and influencer campaigns',
      'Duck CEO mobile game concepts',
      'Global community events',
      'Expanded utilities based on holder votes',
      'Long-term brand partnerships'
    ]
  }
];

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [game, setGame] = useState('run');
  const [copied, setCopied] = useState(false);

  const copySoon = () => {
    navigator.clipboard?.writeText('CONTRACT ADDRESS: SOON');
    setCopied(true);
    setTimeout(() => setCopied(false), 1300);
  };

  return (
    <div className="site-shell">
      <header className="navbar">
        <a className="brand" href="#home">
          <img src="/duckceo-logo.png" alt="Duck CEO logo" />
          <span>DUCK CEO</span>
        </a>

        <nav className={menuOpen ? 'nav-links open' : 'nav-links'}>
          <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
          <a href="#tokenomics" onClick={() => setMenuOpen(false)}>Tokenomics</a>
          <a href="#roadmap" onClick={() => setMenuOpen(false)}>Roadmap</a>
          <a href="#games" onClick={() => setMenuOpen(false)}>Games</a>
          <button className="trade-button" disabled>Trade Soon</button>
        </nav>

        <button className="menu-button" onClick={() => setMenuOpen(v => !v)} aria-label="Toggle navigation">
          {menuOpen ? <X /> : <Menu />}
        </button>
      </header>

      <main>
        <section id="home" className="hero">
          <div className="hero-overlay" />
          <div className="hero-content">
            <div className="eyebrow">A MEME EMPIRE ON SOLANA</div>
            <h1>THE POND WAS<br />TOO SMALL.</h1>
            <p>Duck CEO is building an entertainment-first community with memes, games and a bold Solana identity.</p>
            <div className="hero-actions">
              <a className="button primary" href="#games"><Gamepad2 size={18} /> Play Now</a>
              <button className="button secondary" disabled><TrendingUp size={18} /> Trade Soon</button>
            </div>
            <div className="contract-box">
              <span>CONTRACT ADDRESS</span>
              <strong>SOON</strong>
              <button onClick={copySoon} aria-label="Copy contract status">
                <Copy size={17} /> {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>
        </section>

        <section id="about" className="section about-grid">
          <div>
            <div className="section-kicker">THE STORY</div>
            <h2>FROM POND<br />TO EMPIRE.</h2>
          </div>
          <div className="about-copy">
            <p>Duck CEO is not another copy-paste token. It is a character-driven brand built around community, humor and free-to-play web games.</p>
            <p>The mission is simple: create a recognizable mascot, give the community reasons to return, and grow responsibly through transparent milestones.</p>
            <div className="stats-row">
              <div><strong>SOLANA</strong><span>Network</span></div>
              <div><strong>0%</strong><span>Website fee</span></div>
              <div><strong>24/7</strong><span>Community energy</span></div>
            </div>
          </div>
        </section>

        <section id="tokenomics" className="section">
          <div className="section-heading">
            <div>
              <div className="section-kicker">THE NUMBERS</div>
              <h2>TOKENOMICS</h2>
            </div>
            <p>Final values will be published before launch. Never publish details that you cannot prove on-chain.</p>
          </div>
          <div className="token-grid">
            <article><span>Total Supply</span><strong>SOON</strong><small>Final supply announced before launch</small></article>
            <article><span>Liquidity</span><strong>SOON</strong><small>Public launch details and transaction links</small></article>
            <article><span>Buy / Sell Tax</span><strong>0%</strong><small>Subject to final token configuration</small></article>
            <article><span>Contract</span><strong>SOON</strong><small>Always verify the official address</small></article>
          </div>
        </section>

        <section id="roadmap" className="section roadmap-section">
          <div className="section-heading">
            <div>
              <div className="section-kicker">THE PLAN</div>
              <h2>ROADMAP</h2>
            </div>
            <p>Targets are goals, not guarantees. Listings depend on volume, compliance and each platform’s criteria.</p>
          </div>
          <div className="roadmap-list">
            {ROADMAP.map((item, i) => (
              <article className="roadmap-card" key={item.phase}>
                <div className="phase-number">{String(i + 1).padStart(2, '0')}</div>
                <div>
                  <span>{item.phase}</span>
                  <h3>{item.title}</h3>
                  <ul>{item.items.map(x => <li key={x}>{x}</li>)}</ul>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="games" className="section games-section">
          <div className="section-heading">
            <div>
              <div className="section-kicker">THE ARCADE</div>
              <h2>DUCK GAMES</h2>
            </div>
            <p>Free entertainment only. The slot demo uses virtual points with no cash value and no wallet wagering.</p>
          </div>

          <div className="game-tabs">
            <button className={game === 'run' ? 'active' : ''} onClick={() => setGame('run')}>Duck Run</button>
            <button className={game === 'slots' ? 'active' : ''} onClick={() => setGame('slots')}>Billionaire Slots</button>
          </div>

          {game === 'run' ? <DuckRun /> : <DuckSlots />}
        </section>

        <section className="section community">
          <div>
            <div className="section-kicker">JOIN THE FLOCK</div>
            <h2>THE CEO DOESN'T<br />BUILD ALONE.</h2>
          </div>
          <div className="community-actions">
            <a href="#" className="social-card"><Twitter /> <span><strong>X / Twitter</strong><small>Add your official link</small></span><ExternalLink /></a>
            <a href="#" className="social-card"><Send /> <span><strong>Telegram</strong><small>Add your official link</small></span><ExternalLink /></a>
          </div>
        </section>
      </main>

      <footer>
        <div className="footer-brand"><img src="/duckceo-logo.png" alt="" /><span>DUCK CEO</span></div>
        <p>Entertainment-first meme project. Nothing on this website is financial advice.</p>
        <span>© 2026 Duck CEO</span>
      </footer>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
