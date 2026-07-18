import * as Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    // Load assets here later (images, data JSONs)
    this.load.json('cases', '/data/cases.json');
  }

  create() {
    // Show a loading text or transition directly to menu
    this.add.text(400, 300, 'Loading...', { fontSize: '32px', color: '#000' }).setOrigin(0.5);
    
    // Jump to Menu after short delay
    this.time.delayedCall(1000, () => {
      this.scene.start('MenuScene');
    });
  }
}
