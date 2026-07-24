import * as Phaser from 'phaser';
import papanKasusBg from '../../assets/backgrounds/papan-kasus.png';
import papanKasus2Bg from '../../assets/backgrounds/papan-kasus2.png';
import papanKasus3Bg from '../../assets/backgrounds/papan-kasus3.png';

export class CaseSelectScene extends Phaser.Scene {
  constructor() {
    super('CaseSelectScene');
  }

  preload() {
    this.load.image('papan_kasus_bg', papanKasusBg);
    this.load.image('papan_kasus2_bg', papanKasus2Bg);
    this.load.image('papan_kasus3_bg', papanKasus3Bg);
  }

  create(data: { unlockCase2?: boolean, unlockCase3?: boolean, case2Unlocked?: boolean, case3Unlocked?: boolean }) {
    const { width, height } = this.cameras.main;
    
    const urlParams = new URLSearchParams(window.location.search);
    const unlock2FromUrl = urlParams.get('unlockCase2') === 'true';
    const unlock3FromUrl = urlParams.get('unlockCase3') === 'true';
    
    const isUnlocking2 = data.unlockCase2 || unlock2FromUrl;
    const isUnlocking3 = data.unlockCase3 || unlock3FromUrl;
    const isCase3Unlocked = data.case3Unlocked || urlParams.get('case3Unlocked') === 'true' || isUnlocking3;
    const isCase2Unlocked = data.case2Unlocked || urlParams.get('case2Unlocked') === 'true' || isUnlocking2 || isCase3Unlocked;

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
          
          this.tweens.add({
            targets: lockIcon,
            scale: 1.5,
            alpha: 0,
            duration: 500,
            ease: 'Power2',
            onComplete: () => {
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
        if (caseId === 'kasus_sampah') {
          this.scene.start('Case2BriefingScene');
        } else if (caseId === 'kasus_selokan') {
          this.scene.start('Case3BriefingScene');
        } else {
          this.scene.start('InvestigationScene', { caseId: caseId });
        }
      });
    }
    
    selidikiBtn.setDepth(10);
    return selidikiBtn;
  }
}
