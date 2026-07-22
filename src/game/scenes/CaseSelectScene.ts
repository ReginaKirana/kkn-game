import * as Phaser from 'phaser';
import kasusSatuBg from '../../assets/backgrounds/kasus-satu.png';

export class CaseSelectScene extends Phaser.Scene {
  constructor() {
    super('CaseSelectScene');
  }

  preload() {
    this.load.image('kasus_satu_bg', kasusSatuBg);
  }

  create() {
    const { width, height } = this.cameras.main;
    
    // Background Image
    const bg = this.add.image(width / 2, height / 2, 'kasus_satu_bg');
    // Cover the screen
    const scaleX = width / bg.width;
    const scaleY = height / bg.height;
    bg.setScale(Math.max(scaleX, scaleY));

    // Kasus 1 (Aktif)
    this.createCaseButton(width * 0.25, height * 0.71, 'kasus_halaman', true, -3);
    
    // Kasus 2 (Terkunci)
    this.createCaseButton(width * 0.50, height * 0.71, 'kasus_sampah', false, 2);

    // Kasus 3 (Terkunci)
    this.createCaseButton(width * 0.75, height * 0.71, 'kasus_selokan', false, -1);
  }

  private createCaseButton(x: number, y: number, caseId: string, isActive: boolean, angle: number) {
    const btnWidth = 220;
    const btnHeight = 65;
    const selidikiBtn = this.add.container(x, y);

    // Button Shadow
    const shadow = this.add.graphics();
    shadow.fillStyle(0x000000, 0.3);
    shadow.fillRect(-btnWidth/2 + 5, -btnHeight/2 + 5, btnWidth, btnHeight);

    // Colors based on state
    const bgColor = isActive ? 0xfde047 : 0xd1d5db; // Yellow for active, Gray for locked
    const hoverColor = isActive ? 0xfacc15 : 0xd1d5db;
    const borderColor = isActive ? 0x333333 : 0x6b7280;
    const accentColor = isActive ? 0xdc2626 : 0x9ca3af;
    const textColor = isActive ? '#1f2937' : '#6b7280';
    const textIcon = isActive ? '🔍' : '🔒';

    // Button Background
    const btnBg = this.add.graphics();
    btnBg.fillStyle(bgColor, 1); 
    btnBg.fillRect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight);
    btnBg.lineStyle(4, borderColor, 1); 
    btnBg.strokeRect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight);

    // Accent detail
    const accent = this.add.graphics();
    accent.fillStyle(accentColor, 1); 
    accent.fillRect(-btnWidth/2 + 12, -btnHeight/2 + 10, 8, btnHeight - 20);

    // Text
    const btnText = this.add.text(10, 0, `${textIcon} SELIDIKI`, {
      fontFamily: 'monospace',
      fontSize: '24px',
      color: textColor, 
      fontStyle: '900'
    }).setOrigin(0.5);

    selidikiBtn.add([shadow, btnBg, accent, btnText]);
    selidikiBtn.setAngle(angle);

    if (isActive) {
      const hitArea = new Phaser.Geom.Rectangle(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight);
      selidikiBtn.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);
      
      selidikiBtn.on('pointerover', () => {
        this.input.setDefaultCursor('pointer');
        this.tweens.add({
          targets: selidikiBtn,
          scale: 1.05,
          angle: 0,
          duration: 150,
          ease: 'Back.easeOut'
        });
        btnBg.clear();
        btnBg.fillStyle(hoverColor, 1);
        btnBg.fillRect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight);
        btnBg.lineStyle(4, borderColor, 1);
        btnBg.strokeRect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight);
      });

      selidikiBtn.on('pointerout', () => {
        this.input.setDefaultCursor('default');
        this.tweens.add({
          targets: selidikiBtn,
          scale: 1,
          angle: angle,
          duration: 150,
          ease: 'Power2'
        });
        btnBg.clear();
        btnBg.fillStyle(bgColor, 1);
        btnBg.fillRect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight);
        btnBg.lineStyle(4, borderColor, 1);
        btnBg.strokeRect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight);
      });

      selidikiBtn.on('pointerdown', () => {
        this.input.setDefaultCursor('default');
        this.scene.start('InvestigationScene', { caseId: caseId });
      });
    }
  }
}
