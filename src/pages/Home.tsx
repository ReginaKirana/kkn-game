import { useEffect, useRef, useState } from 'react';
import initGame from '../game/main';
import * as Phaser from 'phaser';

export default function Home() {
  const gameRef = useRef<HTMLDivElement>(null);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    let gameInstance: Phaser.Game | null = null;
    
    if (gameStarted && gameRef.current) {
      gameInstance = initGame(gameRef.current.id);
    }

    return () => {
      if (gameInstance) {
        gameInstance.destroy(true);
      }
    };
  }, [gameStarted]);

  return (
    <div className="flex flex-col items-center">
      <div className="text-center mb-8">
        <h1 style={{ fontSize: '3rem', color: 'var(--primary)', marginBottom: '8px' }}>
          Detektif Sampah
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>
          Jadilah pahlawan lingkungan! Selesaikan misteri sampah di sekitarmu.
        </p>
      </div>

      {!gameStarted ? (
        <div className="card text-center animate-float" style={{ maxWidth: '400px', width: '100%' }}>
          <img 
            src="https://placehold.co/200x200/4ade80/ffffff?text=Detektif+Kecil" 
            alt="Detektif Mascot" 
            style={{ borderRadius: '50%', marginBottom: '24px' }}
          />
          <button 
            className="btn btn-primary" 
            style={{ width: '100%', fontSize: '1.5rem', padding: '16px' }}
            onClick={() => setGameStarted(true)}
          >
            Main Sekarang!
          </button>
        </div>
      ) : (
        <div id="game-container" ref={gameRef}></div>
      )}
    </div>
  );
}
