import * as Phaser from 'phaser';
import papanKasusBg from '../../assets/backgrounds/papan-kasus.png';
import papanKasus2Bg from '../../assets/backgrounds/papan-kasus2.png';

export class CaseSelectScene extends Phaser.Scene {
  constructor() {
    super('CaseSelectScene');
  }

  preload() {
    this.load.image('papan_kasus_bg', papanKasusBg);
    this.load.image('papan_kasus2_bg', papanKasus2Bg);
  }

  create(data: { unlockCase2?: boolean }) {
    const { width, height } = this.cameras.main;
    
    // Background Image
    const bg = this.add.image(width / 2, height / 2, 'papan_kasus_bg').setDepth(0);
    // Cover the screen
    const scaleX = width / bg.width;
    const scaleY = height / bg.height;
    bg.setScale(Math.max(scaleX, scaleY));

    // Kasus 1 (Aktif)
    this.createCaseButton(width * 0.25, height * 0.73, 'kasus_halaman', true, -3);
    
    // Kasus 2 (Terkunci)
    const lockOverlay2 = this.drawLockedCaseOverlay(width * 0.50, height * 0.52, 2);
    const btn2 = this.createCaseButton(width * 0.50, height * 0.73, 'kasus_sampah', false, 2);

    // Kasus 3 (Terkunci)
    this.drawLockedCaseOverlay(width * 0.75, height * 0.52, -1);
    this.createCaseButton(width * 0.75, height * 0.73, 'kasus_selokan', false, -1);

    if (data.unlockCase2) {
      // Tunggu sebentar agar pemain siap melihat efeknya
      this.time.delayedCall(800, () => {
        const lockIcon = lockOverlay2.list[0] as Phaser.GameObjects.Text;
        
        // Animasi Gembok Bergoyang
        this.tweens.add({
          targets: lockIcon,
          angle: { from: -15, to: 15 },
          yoyo: true,
          repeat: 3,
          duration: 120,
          onComplete: () => {
            lockIcon.setAngle(0);
            lockIcon.text = '🔓'; // Gembok terbuka
            
            // Gembok membesar dan pudar
            this.tweens.add({
              targets: lockIcon,
              scale: 1.5,
              alpha: 0,
              duration: 500,
              ease: 'Power2',
              onComplete: () => {
                lockOverlay2.destroy();
                
                // Transisi Background ke papan-kasus2
                const bg2 = this.add.image(width / 2, height / 2, 'papan_kasus2_bg').setDepth(1);
                bg2.setScale(Math.max(scaleX, scaleY));
                bg2.setAlpha(0);
                
                this.tweens.add({
                  targets: bg2,
                  alpha: 1,
                  duration: 800,
                  onComplete: () => {
                    // Ubah tombol menjadi Aktif
                    btn2.destroy();
                    this.createCaseButton(width * 0.50, height * 0.73, 'kasus_sampah', true, 2);
                  }
                });
              }
            });
          }
        });
      });
    }
  }

  private drawLockedCaseOverlay(x: number, y: number, angle: number) {
    const overlay = this.add.container(x, y).setDepth(10);

    // Giant Lock Emoji
    const lockIcon = this.add.text(0, -20, '🔒', {
      fontSize: '120px'
    }).setOrigin(0.5);

    overlay.add([lockIcon]);
    overlay.setAngle(angle);
    return overlay;
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
    
    selidikiBtn.setDepth(10);
    return selidikiBtn;
  }
}
