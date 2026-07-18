import * as Phaser from 'phaser';

export class InvestigationScene extends Phaser.Scene {
  constructor() {
    super('InvestigationScene');
  }

  create(data: { caseId: string }) {
    this.add.rectangle(400, 300, 800, 600, 0xe5e7eb);
    this.add.text(400, 50, 'Investigasi: ' + data.caseId, { fontSize: '24px', color: '#000' }).setOrigin(0.5);

    // Dummy NPC
    const npc = this.add.circle(400, 300, 50, 0xf87171).setInteractive();
    this.add.text(400, 300, 'NPC', { color: '#fff' }).setOrigin(0.5);

    npc.on('pointerdown', () => {
      // Simulate getting a clue and moving to conclusion
      this.scene.start('ConclusionScene', { caseId: data.caseId });
    });
  }
}
