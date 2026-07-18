import * as Phaser from 'phaser';

export class CaseSelectScene extends Phaser.Scene {
  constructor() {
    super('CaseSelectScene');
  }

  create() {
    this.add.rectangle(400, 300, 800, 600, 0xf0fdf4);
    this.add.text(400, 100, 'Pilih Kasus', { fontSize: '32px', color: '#1f2937' }).setOrigin(0.5);

    const case1Btn = this.add.rectangle(400, 200, 300, 60, 0x4ade80).setInteractive();
    this.add.text(400, 200, 'Kasus 1: Kantin Sekolah', { fontSize: '20px', color: '#fff' }).setOrigin(0.5);

    case1Btn.on('pointerdown', () => {
      this.scene.start('InvestigationScene', { caseId: 'kasus_kantin' });
    });
  }
}
