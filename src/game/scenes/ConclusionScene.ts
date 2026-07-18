import * as Phaser from 'phaser';

export class ConclusionScene extends Phaser.Scene {
  constructor() {
    super('ConclusionScene');
  }

  create(data: { caseId: string }) {
    this.add.rectangle(400, 300, 800, 600, 0xfef08a);
    this.add.text(400, 100, 'Pilih Akar Masalah', { fontSize: '24px', color: '#000' }).setOrigin(0.5);

    const ansBtn = this.add.rectangle(400, 300, 300, 60, 0x3b82f6).setInteractive();
    this.add.text(400, 300, 'Jadwal Angkut Tidak Jelas', { color: '#fff' }).setOrigin(0.5);

    ansBtn.on('pointerdown', () => {
      this.scene.start('SolutionScene', { caseId: data.caseId });
    });
  }
}
