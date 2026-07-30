import * as Phaser from 'phaser';
import { CoverScene } from './scenes/CoverScene';
import { IntroScene } from './scenes/IntroScene';
import { BootScene } from './scenes/BootScene';
import { CaseSelectScene } from './scenes/CaseSelectScene';
import { InvestigationScene } from './scenes/InvestigationScene';
import { ConclusionScene } from './scenes/ConclusionScene';
import { SolutionScene } from './scenes/SolutionScene';

import { CleanUpScene } from './scenes/CleanUpScene';
import { Case1TransitionScene } from './scenes/Case1TransitionScene';
import { Case1BriefingScene } from './scenes/Case1BriefingScene';
import { Case2BriefingScene } from './scenes/Case2BriefingScene';
import { Case2AnalysisScene } from './scenes/Case2AnalysisScene';
import { Case2SortScene } from './scenes/Case2SortScene';
import { Case3BriefingScene } from './scenes/Case3BriefingScene';
import { Case3AnalysisScene } from './scenes/Case3AnalysisScene';
import { Case3CleanUpScene } from './scenes/Case3CleanUpScene';
import { Case3TransitionScene } from './scenes/Case3TransitionScene';
import { OutroScene } from './scenes/OutroScene';
import { LeaderboardScene } from './scenes/LeaderboardScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'game-container', // Default, will be overridden by initGame argument
  dom: {
    createContainer: true
  },
  width: 1920,
  height: 1080,
  transparent: true,
  antialias: true,
  // @ts-ignore - Phaser TS definitions sometimes miss resolution at the root
  resolution: window.devicePixelRatio, 
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  }
};

export default function initGame(parentContainerId: string, startScene?: string) {
  let scenes = [
    CoverScene,
    IntroScene,
    BootScene,
    CaseSelectScene,
    InvestigationScene,
    ConclusionScene,
    SolutionScene,

    CleanUpScene,
    Case1TransitionScene,
    Case1BriefingScene,
    Case2BriefingScene,
    Case2AnalysisScene,
    Case2SortScene,
    Case3BriefingScene,
    Case3AnalysisScene,
    Case3CleanUpScene,
    Case3TransitionScene,
    OutroScene,
    LeaderboardScene
  ];

  // If a start scene is requested, bring it to the front of the array
  if (startScene) {
    const sceneIndex = scenes.findIndex(s => s.name === startScene || s.prototype.constructor.name === startScene);
    if (sceneIndex > 0) {
      const sceneToStart = scenes.splice(sceneIndex, 1)[0];
      scenes.unshift(sceneToStart);
    }
  }

  const gameConfig = { ...config, parent: parentContainerId, scene: scenes };
  return new Phaser.Game(gameConfig);
}
