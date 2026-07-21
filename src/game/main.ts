import * as Phaser from 'phaser';
import { CoverScene } from './scenes/CoverScene';
import { IntroScene } from './scenes/IntroScene';
import { BootScene } from './scenes/BootScene';
import { MenuScene } from './scenes/MenuScene';
import { CaseSelectScene } from './scenes/CaseSelectScene';
import { InvestigationScene } from './scenes/InvestigationScene';
import { ConclusionScene } from './scenes/ConclusionScene';
import { SolutionScene } from './scenes/SolutionScene';
import { ResultScene } from './scenes/ResultScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'game-container', // Default, will be overridden by initGame argument
  width: 1920,
  height: 1080,
  transparent: true,
  antialias: true,
  // @ts-ignore - Phaser TS definitions sometimes miss resolution at the root
  resolution: window.devicePixelRatio, 
  scale: {
    mode: Phaser.Scale.ENVELOP,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: [
    CoverScene, // Make CoverScene the first scene to run
    IntroScene,
    BootScene,
    MenuScene,
    CaseSelectScene,
    InvestigationScene,
    ConclusionScene,
    SolutionScene,
    ResultScene
  ]
};

export default function initGame(parentContainerId: string) {
  const gameConfig = { ...config, parent: parentContainerId };
  return new Phaser.Game(gameConfig);
}
