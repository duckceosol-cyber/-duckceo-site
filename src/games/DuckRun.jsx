import React, { useEffect, useRef, useState } from 'react';

export default function DuckRun() {
  const canvasRef = useRef(null);
  const gameRef = useRef({ running: false, score: 0 });
  const [running, setRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => Number(localStorage.getItem('duckRunBest') || 0));

  const start = () => {
    gameRef.current.running = true;
    gameRef.current.score = 0;
    setScore(0);
    setRunning(true);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;
    let last = performance.now();
    let speed = 6;
    const duck = { x: 80, y: 230, w: 54, h: 54, vy: 0, grounded: true };
    let obstacles = [];
    let coins = [];
    let spawnTimer = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(600, Math.floor(rect.width * devicePixelRatio));
      canvas.height = Math.floor(340 * devicePixelRatio);
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const jump = () => {
      if (!gameRef.current.running) {
        start();
        return;
      }
      if (duck.grounded) {
        duck.vy = -15;
        duck.grounded = false;
      }
    };

    const onKey = (e) => {
      if (['Space', 'ArrowUp'].includes(e.code)) {
        e.preventDefault();
        jump();
      }
    };

    window.addEventListener('keydown', onKey);
    canvas.addEventListener('pointerdown', jump);

    const collide = (a, b) =>
      a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;

    const resetWorld = () => {
      duck.y = 230;
      duck.vy = 0;
      duck.grounded = true;
      obstacles = [];
      coins = [];
      speed = 6;
      spawnTimer = 0;
    };

    const drawDuck = () => {
      ctx.save();
      ctx.translate(duck.x, duck.y);
      ctx.fillStyle = '#f6c621';
      ctx.beginPath();
      ctx.ellipse(25, 28, 22, 20, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(33, 12, 15, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#f58b20';
      ctx.beginPath();
      ctx.moveTo(45, 13); ctx.lineTo(61, 18); ctx.lineTo(45, 22); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#090909';
      ctx.fillRect(20, 8, 26, 7);
      ctx.fillRect(24, 4, 7, 7);
      ctx.fillRect(36, 4, 7, 7);
      ctx.fillStyle = '#fff';
      ctx.fillRect(17, 28, 26, 22);
      ctx.fillStyle = '#111';
      ctx.fillRect(27, 28, 7, 22);
      ctx.fillStyle = '#f6c621';
      ctx.fillRect(5, 47, 18, 5);
      ctx.fillRect(30, 47, 18, 5);
      ctx.restore();
    };

    const render = (now) => {
      const dt = Math.min(2, (now - last) / 16.67);
      last = now;
      const W = canvas.clientWidth;
      const H = 340;

      ctx.clearRect(0, 0, W, H);
      const grad = ctx.createLinearGradient(0, 0, W, H);
      grad.addColorStop(0, '#151515');
      grad.addColorStop(1, '#26200c');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      ctx.fillStyle = 'rgba(246,198,33,.09)';
      for (let i = 0; i < 9; i++) ctx.fillRect((i * 170 - (now * .02) % 170), 70 + (i % 3) * 28, 90, 2);

      ctx.fillStyle = '#383838';
      ctx.fillRect(0, 284, W, 56);
      ctx.fillStyle = '#f6c621';
      ctx.fillRect(0, 284, W, 4);

      if (gameRef.current.running) {
        duck.vy += 0.85 * dt;
        duck.y += duck.vy * dt;
        if (duck.y >= 230) {
          duck.y = 230;
          duck.vy = 0;
          duck.grounded = true;
        }

        spawnTimer -= dt;
        if (spawnTimer <= 0) {
          const tall = Math.random() > .55;
          obstacles.push({ x: W + 30, y: tall ? 225 : 246, w: tall ? 36 : 48, h: tall ? 59 : 38 });
          if (Math.random() > .35) coins.push({ x: W + 150, y: 190 - Math.random() * 70, w: 24, h: 24, taken: false });
          spawnTimer = 75 + Math.random() * 55;
        }

        speed = Math.min(13, 6 + gameRef.current.score / 900);
        obstacles.forEach(o => o.x -= speed * dt);
        coins.forEach(c => c.x -= speed * dt);

        const duckHitbox = { x: duck.x + 8, y: duck.y + 5, w: 42, h: 47 };
        for (const o of obstacles) {
          if (collide(duckHitbox, o)) {
            gameRef.current.running = false;
            setRunning(false);
            const finalScore = Math.floor(gameRef.current.score);
            setScore(finalScore);
            if (finalScore > best) {
              setBest(finalScore);
              localStorage.setItem('duckRunBest', String(finalScore));
            }
          }
        }

        for (const c of coins) {
          if (!c.taken && collide(duckHitbox, c)) {
            c.taken = true;
            gameRef.current.score += 100;
          }
        }

        obstacles = obstacles.filter(o => o.x > -80);
        coins = coins.filter(c => c.x > -50 && !c.taken);
        gameRef.current.score += .55 * dt;
        setScore(Math.floor(gameRef.current.score));
      } else if (!running) {
        resetWorld();
      }

      ctx.fillStyle = '#ef4545';
      obstacles.forEach(o => {
        ctx.fillRect(o.x, o.y, o.w, o.h);
        ctx.fillStyle = '#111';
        ctx.fillRect(o.x + 7, o.y + 9, o.w - 14, 7);
        ctx.fillStyle = '#ef4545';
      });

      coins.forEach(c => {
        ctx.fillStyle = '#f6c621';
        ctx.beginPath();
        ctx.arc(c.x + 12, c.y + 12, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#111';
        ctx.font = 'bold 13px Arial';
        ctx.fillText('$', c.x + 8, c.y + 17);
      });

      drawDuck();

      ctx.fillStyle = '#fff';
      ctx.font = '700 16px Arial';
      ctx.fillText(`SCORE ${Math.floor(gameRef.current.score)}`, 20, 30);
      ctx.fillStyle = '#f6c621';
      ctx.fillText(`BEST ${best}`, 20, 54);

      if (!gameRef.current.running) {
        ctx.fillStyle = 'rgba(0,0,0,.64)';
        ctx.fillRect(0, 0, W, H);
        ctx.textAlign = 'center';
        ctx.fillStyle = '#f6c621';
        ctx.font = '900 32px Arial';
        ctx.fillText(score > 0 ? 'THE CEO NEVER QUITS' : 'DUCK RUN', W / 2, 135);
        ctx.fillStyle = '#fff';
        ctx.font = '600 16px Arial';
        ctx.fillText('Tap, click or press SPACE to jump', W / 2, 171);
        ctx.fillText('Avoid red candles. Collect golden coins.', W / 2, 198);
        ctx.textAlign = 'left';
      }

      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('keydown', onKey);
      canvas.removeEventListener('pointerdown', jump);
    };
  }, [best, running, score]);

  return (
    <div className="game-card">
      <div className="game-card-top">
        <div><span>ENDLESS RUNNER</span><h3>Duck CEO: Pond Run</h3></div>
        <button onClick={start}>{running ? 'Restart' : 'Start Game'}</button>
      </div>
      <canvas ref={canvasRef} className="runner-canvas" />
      <div className="game-note">Free browser game. No wallet, wager or payment required.</div>
    </div>
  );
}
