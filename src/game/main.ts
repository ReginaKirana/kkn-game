import * as Phaser from 'phaser';
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
  width: 800,
  height: 600,
  transparent: true,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: [
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
