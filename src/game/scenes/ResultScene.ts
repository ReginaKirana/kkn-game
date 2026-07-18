import * as Phaser from 'phaser';

export class ResultScene extends Phaser.Scene {
  constructor() {
    super('ResultScene');
  }

  create(data: { caseId: string, stars: number }) {
    this.add.rectangle(400, 300, 800, 600, 0xa7f3d0);
    this.add.text(400, 100, 'Kasus Selesai!', { fontSize: '36px', color: '#000', fontFamily: 'Baloo 2' }).setOrigin(0.5);

    this.add.text(400, 200, `Bintang: ${data.stars}`, { fontSize: '24px', color: '#f59e0b', fontFamily: 'Baloo 2' }).setOrigin(0.5);

    this.add.text(400, 300, 'Tepat! Jadwal piket yang jelas membantu\nsampah diangkut rutin sebelum menumpuk.', { 
      fontSize: '20px', color: '#1f2937', align: 'center' 
    }).setOrigin(0.5);

    const backBtn = this.add.rectangle(400, 450, 250, 60, 0x4ade80).setInteractive();
    this.add.text(400, 450, 'Kembali ke Menu', { color: '#fff', fontSize: '20px' }).setOrigin(0.5);

    // Save progress to local storage
    let progress = JSON.parse(localStorage.getItem('detektif_progress') || '{}');
    progress[data.caseId] = { stars: data.stars };
    localStorage.setItem('detektif_progress', JSON.stringify(progress));

    backBtn.on('pointerdown', () => {
      this.scene.start('MenuScene');
    });
  }
}
