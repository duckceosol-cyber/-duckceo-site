import React, { useState } from 'react';

const symbols = ['🦆', '🥚', '💎', '💼', '📈', '🪙'];

function evaluate(reels) {
  const ducks = reels.filter(x => x === '🦆').length;
  if (ducks === 4) return { multiplier: 1000, label: '4 DUCK JACKPOT!' };
  if (ducks === 3) return { multiplier: 100, label: '3 DUCKS!' };
  if (ducks === 2) return { multiplier: 10, label: '2 DUCKS!' };
  if (ducks === 1) return { multiplier: 1.5, label: 'CEO APPEARANCE!' };
  if (new Set(reels).size === 1) return { multiplier: 25, label: 'SYMBOL MATCH!' };
  return { multiplier: 0, label: 'TRY AGAIN' };
}

export default function DuckSlots() {
  const [credits, setCredits] = useState(5000);
  const [bet, setBet] = useState(10);
  const [reels, setReels] = useState(['🦆', '🥚', '💎', '💼']);
  const [result, setResult] = useState('FREE DEMO MODE');
  const [spinning, setSpinning] = useState(false);

  const spin = () => {
    if (spinning || credits < bet) return;
    setSpinning(true);
    setCredits(c => c - bet);
    setResult('SPINNING...');

    let ticks = 0;
    const timer = setInterval(() => {
      setReels(Array.from({ length: 4 }, () => symbols[Math.floor(Math.random() * symbols.length)]));
      ticks++;
      if (ticks > 11) {
        clearInterval(timer);
        const final = Array.from({ length: 4 }, () => symbols[Math.floor(Math.random() * symbols.length)]);
        const outcome = evaluate(final);
        const win = Math.floor(bet * outcome.multiplier);
        setReels(final);
        setCredits(c => c + win);
        setResult(win ? `${outcome.label} +${win.toLocaleString()} DEMO CREDITS` : outcome.label);
        setSpinning(false);
      }
    }, 70);
  };

  return (
    <div className="game-card slots-card">
      <div className="game-card-top">
        <div><span>VIRTUAL POINTS ONLY</span><h3>Duck CEO Billionaire Slots</h3></div>
        <div className="credits">Credits <strong>{credits.toLocaleString()}</strong></div>
      </div>

      <div className="slot-machine">
        <div className="slot-header">DUCK CEO BILLIONAIRE SLOTS</div>
        <div className="reels">
          {reels.map((symbol, i) => <div className={spinning ? 'reel spinning' : 'reel'} key={i}>{symbol}</div>)}
        </div>
        <div className="slot-result">{result}</div>
        <div className="slot-controls">
          <label>Demo bet
            <select value={bet} onChange={e => setBet(Number(e.target.value))}>
              <option value={10}>10 credits</option>
              <option value={25}>25 credits</option>
              <option value={50}>50 credits</option>
              <option value={100}>100 credits</option>
            </select>
          </label>
          <button onClick={spin} disabled={spinning || credits < bet}>{spinning ? 'Spinning...' : 'Spin'}</button>
          <button className="ghost" onClick={() => setCredits(5000)}>Reset demo</button>
        </div>
      </div>

      <div className="payout-grid">
        <span>🦆 × 4 <strong>1000×</strong></span>
        <span>🦆 × 3 <strong>100×</strong></span>
        <span>🦆 × 2 <strong>10×</strong></span>
        <span>🦆 × 1 <strong>1.5×</strong></span>
      </div>

      <div className="game-note warning">
        Demo credits have no monetary value. This game does not accept SOL, DUCKCEO or any real-money wager.
      </div>
    </div>
  );
}
