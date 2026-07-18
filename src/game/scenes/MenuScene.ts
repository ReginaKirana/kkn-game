import * as Phaser from 'phaser';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  create() {
    this.add.rectangle(400, 300, 800, 600, 0x4ade80);
    this.add.text(400, 150, 'Detektif Sampah', { fontSize: '48px', color: '#fff', fontFamily: 'Baloo 2' }).setOrigin(0.5);
    
    const startBtn = this.add.rectangle(400, 300, 200, 60, 0xfbbf24).setInteractive();
    this.add.text(400, 300, 'Mulai Kasus', { fontSize: '24px', color: '#000', fontFamily: 'Baloo 2' }).setOrigin(0.5);

    startBtn.on('pointerdown', () => {
      this.scene.start('CaseSelectScene');
    });
  }
}
