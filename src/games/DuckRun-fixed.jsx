import React, { useEffect, useRef, useState } from 'react';

export default function DuckRun() {
  const canvasRef = useRef(null);
  const runningRef = useRef(false);
  const scoreRef = useRef(0);
  const bestRef = useRef(Number(localStorage.getItem('duckRunBest') || 0));
  const startRequestedRef = useRef(false);

  const [running, setRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(bestRef.current);

  const startGame = () => {
    startRequestedRef.current = true;
    runningRef.current = true;
    scoreRef.current = 0;
    setScore(0);
    setRunning(true);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId = 0;
    let lastTime = performance.now();
    let speed = 6;
    let spawnTimer = 0;
    let obstacles = [];
    let coins = [];

    const duck = {
      x: 80,
      y: 230,
      w: 54,
      h: 54,
      vy: 0,
      grounded: true,
    };

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = window.devicePixelRatio || 1;

      canvas.width = Math.max(600, Math.floor(rect.width * ratio));
      canvas.height = Math.floor(340 * ratio);

      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const resetWorld = () => {
      duck.y = 230;
      duck.vy = 0;
      duck.grounded = true;
      obstacles = [];
      coins = [];
      speed = 6;
      spawnTimer = 25;
    };

    const endGame = () => {
      runningRef.current = false;
      setRunning(false);

      const finalScore = Math.floor(scoreRef.current);
      setScore(finalScore);

      if (finalScore > bestRef.current) {
        bestRef.current = finalScore;
        setBest(finalScore);
        localStorage.setItem('duckRunBest', String(finalScore));
      }
    };

    const jump = () => {
      if (!runningRef.current) {
        startRequestedRef.current = true;
        runningRef.current = true;
        scoreRef.current = 0;
        setScore(0);
        setRunning(true);
        return;
      }

      if (duck.grounded) {
        duck.vy = -15;
        duck.grounded = false;
      }
    };

    const handleKeyDown = (event) => {
      if (event.code === 'Space' || event.code === 'ArrowUp') {
        event.preventDefault();
        jump();
      }
    };

    const collides = (a, b) =>
      a.x < b.x + b.w &&
      a.x + a.w > b.x &&
      a.y < b.y + b.h &&
      a.y + a.h > b.y;

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
      ctx.moveTo(45, 13);
      ctx.lineTo(61, 18);
      ctx.lineTo(45, 22);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#090909';
      ctx.fillRect(20, 8, 26, 7);
      ctx.fillRect(24, 4, 7, 7);
      ctx.fillRect(36, 4, 7, 7);

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(17, 28, 26, 22);

      ctx.fillStyle = '#111111';
      ctx.fillRect(27, 28, 7, 22);

      ctx.fillStyle = '#f6c621';
      ctx.fillRect(5, 47, 18, 5);
      ctx.fillRect(30, 47, 18, 5);

      ctx.restore();
    };

    const drawObstacle = (obstacle) => {
      ctx.fillStyle = '#ef4545';
      ctx.fillRect(obstacle.x, obstacle.y, obstacle.w, obstacle.h);

      ctx.fillStyle = '#111111';
      ctx.fillRect(
        obstacle.x + 7,
        obstacle.y + 9,
        Math.max(8, obstacle.w - 14),
        7
      );
    };

    const drawCoin = (coin) => {
      ctx.fillStyle = '#f6c621';
      ctx.beginPath();
      ctx.arc(coin.x + 12, coin.y + 12, 12, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#111111';
      ctx.font = 'bold 13px Arial';
      ctx.fillText('$', coin.x + 8, coin.y + 17);
    };

    const render = (now) => {
      const delta = Math.min(2, (now - lastTime) / 16.67);
      lastTime = now;

      const width = canvas.clientWidth;
      const height = 340;

      if (startRequestedRef.current) {
        resetWorld();
        startRequestedRef.current = false;
      }

      ctx.clearRect(0, 0, width, height);

      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, '#151515');
      gradient.addColorStop(1, '#26200c');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = 'rgba(246,198,33,.09)';
      for (let i = 0; i < 9; i += 1) {
        ctx.fillRect(
          i * 170 - ((now * 0.02) % 170),
          70 + (i % 3) * 28,
          90,
          2
        );
      }

      ctx.fillStyle = '#383838';
      ctx.fillRect(0, 284, width, 56);

      ctx.fillStyle = '#f6c621';
      ctx.fillRect(0, 284, width, 4);

      if (runningRef.current) {
        duck.vy += 0.85 * delta;
        duck.y += duck.vy * delta;

        if (duck.y >= 230) {
          duck.y = 230;
          duck.vy = 0;
          duck.grounded = true;
        }

        spawnTimer -= delta;

        if (spawnTimer <= 0) {
          const tall = Math.random() > 0.55;

          obstacles.push({
            x: width + 30,
            y: tall ? 225 : 246,
            w: tall ? 36 : 48,
            h: tall ? 59 : 38,
          });

          if (Math.random() > 0.35) {
            coins.push({
              x: width + 150,
              y: 190 - Math.random() * 70,
              w: 24,
              h: 24,
              taken: false,
            });
          }

          spawnTimer = 75 + Math.random() * 55;
        }

        speed = Math.min(13, 6 + scoreRef.current / 900);

        obstacles.forEach((obstacle) => {
          obstacle.x -= speed * delta;
        });

        coins.forEach((coin) => {
          coin.x -= speed * delta;
        });

        const duckHitbox = {
          x: duck.x + 8,
          y: duck.y + 5,
          w: 42,
          h: 47,
        };

        for (const obstacle of obstacles) {
          if (collides(duckHitbox, obstacle)) {
            endGame();
            break;
          }
        }

        for (const coin of coins) {
          if (!coin.taken && collides(duckHitbox, coin)) {
            coin.taken = true;
            scoreRef.current += 100;
          }
        }

        obstacles = obstacles.filter((obstacle) => obstacle.x > -80);
        coins = coins.filter((coin) => coin.x > -50 && !coin.taken);

        if (runningRef.current) {
          scoreRef.current += 0.55 * delta;
          setScore(Math.floor(scoreRef.current));
        }
      }

      obstacles.forEach(drawObstacle);
      coins.forEach(drawCoin);
      drawDuck();

      ctx.fillStyle = '#ffffff';
      ctx.font = '700 16px Arial';
      ctx.fillText(`SCORE ${Math.floor(scoreRef.current)}`, 20, 30);

      ctx.fillStyle = '#f6c621';
      ctx.fillText(`BEST ${bestRef.current}`, 20, 54);

      if (!runningRef.current) {
        ctx.fillStyle = 'rgba(0,0,0,.64)';
        ctx.fillRect(0, 0, width, height);

        ctx.textAlign = 'center';

        ctx.fillStyle = '#f6c621';
        ctx.font = '900 32px Arial';
        ctx.fillText(
          scoreRef.current > 0 ? 'THE CEO NEVER QUITS' : 'DUCK RUN',
          width / 2,
          135
        );

        ctx.fillStyle = '#ffffff';
        ctx.font = '600 16px Arial';
        ctx.fillText('Tap, click or press SPACE to jump', width / 2, 171);
        ctx.fillText(
          'Avoid red candles. Collect golden coins.',
          width / 2,
          198
        );

        ctx.textAlign = 'left';
      }

      animationId = requestAnimationFrame(render);
    };

    resetWorld();
    resizeCanvas();

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('keydown', handleKeyDown);
    canvas.addEventListener('pointerdown', jump);

    animationId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('keydown', handleKeyDown);
      canvas.removeEventListener('pointerdown', jump);
    };
  }, []);

  return (
    <div className="game-card">
      <div className="game-card-top">
        <div>
          <span>ENDLESS RUNNER</span>
          <h3>Duck CEO: Pond Run</h3>
        </div>

        <button type="button" onClick={startGame}>
          {running ? 'Restart' : 'Start Game'}
        </button>
      </div>

      <canvas
        ref={canvasRef}
        className="runner-canvas"
        aria-label="Duck CEO endless runner game"
      />

      <div className="game-note">
        Score: {score} · Best: {best}. Free browser game. No wallet, wager or
        payment required.
      </div>
    </div>
  );
}
