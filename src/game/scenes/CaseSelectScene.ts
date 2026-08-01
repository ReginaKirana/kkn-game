import * as Phaser from 'phaser';

export class CaseSelectScene extends Phaser.Scene {
  private bgMusic!: Phaser.Sound.BaseSound;
  constructor() {
    super('CaseSelectScene');
  }

  create(data: { unlockCase2?: boolean, unlockCase3?: boolean, case2Unlocked?: boolean, case3Unlocked?: boolean }) {
    const { width, height } = this.cameras.main;
    
    const urlParams = new URLSearchParams(window.location.search);
    const unlock2FromUrl = urlParams.get('unlockCase2') === 'true';
    const unlock3FromUrl = urlParams.get('unlockCase3') === 'true';
    
    // Read previous unlocks from local storage
    const savedState = JSON.parse(localStorage.getItem('kkn-game-unlocks') || '{}');

    const isUnlocking2 = data.unlockCase2 || unlock2FromUrl;
    const isUnlocking3 = data.unlockCase3 || unlock3FromUrl;
    
    // Check if case is unlocked either by this scene transition, previous save, or URL
    const isCase3Unlocked = data.case3Unlocked || savedState.case3Unlocked || urlParams.get('case3Unlocked') === 'true' || isUnlocking3;
    const isCase2Unlocked = data.case2Unlocked || savedState.case2Unlocked || urlParams.get('case2Unlocked') === 'true' || isUnlocking2 || isCase3Unlocked;

    // Save back to local storage to persist the unlocked state
    localStorage.setItem('kkn-game-unlocks', JSON.stringify({
      case2Unlocked: isCase2Unlocked,
      case3Unlocked: isCase3Unlocked
    }));

    this.bgMusic = this.sound.add('investigasi_bgm', { loop: true, volume: 1 });
    this.bgMusic.play();

    this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
      if (this.bgMusic) {
        this.bgMusic.stop();
      }
    });

    // Background Image
    let currentBg = 'papan_kasus_bg';
    if (isCase3Unlocked && !isUnlocking3) {
      currentBg = 'papan_kasus3_bg';
    } else if (isCase2Unlocked && !isUnlocking2) {
      currentBg = 'papan_kasus2_bg';
    }
    const bg = this.add.image(width / 2, height / 2, currentBg).setDepth(0);
    // Cover the screen
    const scaleX = width / bg.width;
    const scaleY = height / bg.height;
    bg.setScale(Math.max(scaleX, scaleY));

    // Kasus 1 (Selalu Aktif)
    this.createCaseButton(width * 0.25, height * 0.73, 'kasus_halaman', true, -3);

    // Tombol Kembali (Kiri Atas)
    this.createBackButton();
    
    // Kasus 2
    let lockOverlay2: Phaser.GameObjects.Container | null = null;
    let btn2: Phaser.GameObjects.Container | null = null;
    if (isCase2Unlocked && !isUnlocking2) {
      this.createCaseButton(width * 0.50, height * 0.73, 'kasus_sampah', true, 2);
    } else {
      lockOverlay2 = this.drawLockedCaseOverlay(width * 0.50, height * 0.52, 2);
      btn2 = this.createCaseButton(width * 0.50, height * 0.73, 'kasus_sampah', false, 2);
    }

    // Kasus 3
    let lockOverlay3: Phaser.GameObjects.Container | null = null;
    let btn3: Phaser.GameObjects.Container | null = null;
    if (isCase3Unlocked && !isUnlocking3) {
      this.createCaseButton(width * 0.75, height * 0.73, 'kasus_selokan', true, -1);
    } else {
      lockOverlay3 = this.drawLockedCaseOverlay(width * 0.75, height * 0.52, -1);
      btn3 = this.createCaseButton(width * 0.75, height * 0.73, 'kasus_selokan', false, -1);
    }

    if (isUnlocking2 && lockOverlay2 && btn2) {
      this.animateUnlock(lockOverlay2, btn2, width * 0.50, height * 0.73, 'kasus_sampah', 2, () => {
        // Transisi Background ke papan-kasus2
        const bg2 = this.add.image(width / 2, height / 2, 'papan_kasus2_bg').setDepth(1);
        bg2.setScale(Math.max(scaleX, scaleY));
        bg2.setAlpha(0);
        
        this.tweens.add({
          targets: bg2,
          alpha: 1,
          duration: 800
        });
      });
    }

    if (isUnlocking3 && lockOverlay3 && btn3) {
      this.animateUnlock(lockOverlay3, btn3, width * 0.75, height * 0.73, 'kasus_selokan', -1, () => {
        // Transisi Background ke papan-kasus3
        const bg3 = this.add.image(width / 2, height / 2, 'papan_kasus3_bg').setDepth(1);
        bg3.setScale(Math.max(scaleX, scaleY));
        bg3.setAlpha(0);
        
        this.tweens.add({
          targets: bg3,
          alpha: 1,
          duration: 800
        });
      });
    }
  }

  private animateUnlock(lockOverlay: Phaser.GameObjects.Container, oldBtn: Phaser.GameObjects.Container, x: number, y: number, caseId: string, angle: number, onUnlockBg?: () => void) {
    this.time.delayedCall(800, () => {
      const lockIcon = lockOverlay.list[0] as Phaser.GameObjects.Text;
      
      this.tweens.add({
        targets: lockIcon,
        angle: { from: -15, to: 15 },
        yoyo: true,
        repeat: 3,
        duration: 120,
        onComplete: () => {
          lockIcon.setAngle(0);
          lockIcon.text = '🔓';
          this.sound.play('padlock_open', { volume: 0.8 });
          
          this.tweens.add({
            targets: lockIcon,
            scale: 1.5,
            alpha: 0,
            duration: 500,
            ease: 'Power2',
            onComplete: () => {
              this.sound.play('level_up', { volume: 0.8 });
              lockOverlay.destroy();
              oldBtn.destroy();
              this.createCaseButton(x, y, caseId, true, angle);
              
              if (onUnlockBg) {
                onUnlockBg();
              }
            }
          });
        }
      });
    });
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
        this.sound.play('btn_click', { seek: 0.8, volume: 0.9 });
        
        this.cameras.main.fadeOut(500, 0, 0, 0);

        if (this.bgMusic) {
          this.tweens.add({
            targets: this.bgMusic,
            volume: 0,
            duration: 500
          });
        }

        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
          if (this.bgMusic) this.bgMusic.stop();
          if (caseId === 'kasus_sampah') {
            this.scene.start('Case2BriefingScene');
          } else if (caseId === 'kasus_selokan') {
            this.scene.start('Case3BriefingScene');
          } else if (caseId === 'kasus_halaman') {
            this.scene.start('Case1BriefingScene');
          } else {
            this.scene.start('InvestigationScene', { caseId: caseId });
          }
        });
      });
    }
    
    selidikiBtn.setDepth(10);
    return selidikiBtn;
  }

  private createBackButton() {
    const btnRadius = 35;
    const x = 70;
    const y = 70;
    const backBtn = this.add.container(x, y);

    // Button Shadow
    const shadow = this.add.graphics();
    shadow.fillStyle(0x000000, 0.4);
    shadow.fillCircle(3, 4, btnRadius);

    // Background Kayu (Sienna / SaddleBrown)
    const btnBg = this.add.graphics();
    btnBg.fillStyle(0x8B4513, 1);
    btnBg.fillCircle(0, 0, btnRadius);
    btnBg.lineStyle(4, 0x5C4033, 1); // Darker wood border
    btnBg.strokeCircle(0, 0, btnRadius);

    // Icon (Arrow or Home) -> Menggunakan simbol Panah Kiri
    const icon = this.add.text(0, 0, '🏠', {
      fontSize: '32px'
    }).setOrigin(0.5);

    backBtn.add([shadow, btnBg, icon]);
    backBtn.setDepth(100);

    const hitArea = new Phaser.Geom.Circle(0, 0, btnRadius);
    backBtn.setInteractive(hitArea, Phaser.Geom.Circle.Contains);

    backBtn.on('pointerover', () => {
      this.input.setDefaultCursor('pointer');
      backBtn.y = y - 2;
      shadow.y = 2;
      btnBg.clear();
      btnBg.fillStyle(0xA0522D, 1); // Lighter wood on hover
      btnBg.fillCircle(0, 0, btnRadius);
      btnBg.lineStyle(4, 0x5C4033, 1);
      btnBg.strokeCircle(0, 0, btnRadius);
    });

    backBtn.on('pointerout', () => {
      this.input.setDefaultCursor('default');
      backBtn.y = y;
      shadow.y = 0;
      btnBg.clear();
      btnBg.fillStyle(0x8B4513, 1); // Normal wood
      btnBg.fillCircle(0, 0, btnRadius);
      btnBg.lineStyle(4, 0x5C4033, 1);
      btnBg.strokeCircle(0, 0, btnRadius);
    });

    backBtn.on('pointerdown', () => {
      this.input.setDefaultCursor('default');
      this.sound.play('btn_click', { seek: 0.8, volume: 0.9 });
      backBtn.y = y + 4;
      shadow.y = -4;
      
      this.cameras.main.fadeOut(500, 0, 0, 0);

      if (this.bgMusic) {
        this.tweens.add({
          targets: this.bgMusic,
          volume: 0,
          duration: 500
        });
      }

      this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
        if (this.bgMusic) this.bgMusic.stop();
        this.scene.start('CoverScene');
      });
    });
  }
}
