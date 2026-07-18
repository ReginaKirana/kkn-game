import * as Phaser from 'phaser';

export class SolutionScene extends Phaser.Scene {
  constructor() {
    super('SolutionScene');
  }

  create(data: { caseId: string }) {
    this.add.rectangle(400, 300, 800, 600, 0xbfdbfe);
    this.add.text(400, 100, 'Pilih Solusi', { fontSize: '24px', color: '#000' }).setOrigin(0.5);

    const ansBtn = this.add.rectangle(400, 300, 300, 60, 0xf97316).setInteractive();
    this.add.text(400, 300, 'Buat Jadwal Piket & Angkut Rutin', { color: '#fff' }).setOrigin(0.5);

    ansBtn.on('pointerdown', () => {
      this.scene.start('ResultScene', { caseId: data.caseId, stars: 3 });
    });
  }
}
