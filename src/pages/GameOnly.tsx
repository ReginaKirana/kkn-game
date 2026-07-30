import { useEffect, useRef, useState } from 'react';
import initGame from '../game/main';
import * as Phaser from 'phaser';

export default function GameOnly() {
  const gameRef = useRef<HTMLDivElement>(null);
  const gameInstanceRef = useRef<Phaser.Game | null>(null);
  
  // Detect mobile device on initial render
  const [isMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
    }
    return false;
  });
  
  const [isPlaying, setIsPlaying] = useState(!isMobile); // Auto-start on desktop

  useEffect(() => {
    // Change tab title for the game
    const originalTitle = document.title;
    document.title = 'Detektif Sampah';

    return () => {
      document.title = originalTitle; // Restore original title on unmount
      if (gameInstanceRef.current) {
        gameInstanceRef.current.destroy(true);
        gameInstanceRef.current = null;
      }
    };
  }, []);

  const initializePhaser = () => {
    if (gameRef.current && !gameInstanceRef.current) {
      const searchParams = new URLSearchParams(window.location.search);
      const sceneParam = searchParams.get('scene') || undefined;
      gameInstanceRef.current = initGame(gameRef.current.id, sceneParam);
    }
  };

  const startGame = async () => {
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
      
      // Try to lock orientation to landscape
      const screenAny = window.screen as any;
      if (screenAny && screenAny.orientation && screenAny.orientation.lock) {
        try {
          await screenAny.orientation.lock('landscape');
        } catch (e) {
          console.log("Orientation lock not supported or failed", e);
        }
      }
    } catch (err) {
      console.log("Error attempting to enable fullscreen:", err);
    }

    setIsPlaying(true);

    // Initialize game after a short delay to allow fullscreen resize to settle
    setTimeout(() => {
      initializePhaser();
    }, 200);
  };

  // Automatically start if not on mobile (isPlaying is initialized to true on desktop)
  useEffect(() => {
    if (isPlaying && !gameInstanceRef.current) {
      initializePhaser();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying]);

  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#000', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: 0, padding: 0, position: 'relative' }}>
      
      {!isPlaying && isMobile && (
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: '#0f172a',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 50,
          padding: '24px',
          textAlign: 'center'
        }}>
          <h2 style={{ color: 'white', marginBottom: '16px', fontSize: '1.75rem', fontWeight: '800' }}>Detektif Sampah</h2>
          <p style={{ color: '#94a3b8', marginBottom: '40px', maxWidth: '300px', lineHeight: '1.6' }}>
            Untuk pengalaman bermain terbaik, mohon mainkan dalam mode Layar Penuh (Mendatar/Landscape).
          </p>
          <button 
            onClick={startGame}
            style={{
              backgroundColor: '#16a34a',
              color: 'white',
              border: 'none',
              padding: '16px 32px',
              fontSize: '1.1rem',
              fontWeight: '800',
              borderRadius: '50px',
              cursor: 'pointer',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)'
            }}
          >
            Mulai Layar Penuh
          </button>
        </div>
      )}

      <div id="phaser-game-container" ref={gameRef} style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      </div>
    </div>
  );
}
