import { useEffect, useRef } from 'react';
import initGame from '../game/main';
import * as Phaser from 'phaser';

export default function GameOnly() {
  const gameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let gameInstance: Phaser.Game | null = null;
    
    // Start the game in this dedicated path
    if (gameRef.current) {
      gameInstance = initGame(gameRef.current.id);
    }
    
    // Change tab title for the game
    const originalTitle = document.title;
    document.title = 'Detektif Sampah';

    return () => {
      document.title = originalTitle; // Restore original title on unmount
      if (gameInstance) {
        gameInstance.destroy(true);
      }
    };
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#000', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: 0, padding: 0 }}>
      <div id="phaser-game-container" ref={gameRef} style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      </div>
    </div>
  );
}
