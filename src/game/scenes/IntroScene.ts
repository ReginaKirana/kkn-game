import * as Phaser from 'phaser';

export class IntroScene extends Phaser.Scene {
  constructor() {
    super('IntroScene');
  }

  create() {
    const { width, height } = this.cameras.main;
    
    // Background for IntroScene
    this.add.rectangle(0, 0, width, height, 0x1e293b).setOrigin(0, 0);
    
    this.add.text(width / 2, height / 2, 'Intro Scene (Work in Progress)', {
      fontSize: '24px',
      color: '#ffffff'
    }).setOrigin(0.5);
  }
}
