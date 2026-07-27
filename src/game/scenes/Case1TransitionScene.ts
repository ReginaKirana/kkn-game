import * as Phaser from 'phaser';

export class Case1TransitionScene extends Phaser.Scene {
  constructor() {
    super('Case1TransitionScene');
  }

  create(data: { caseId?: string }) {
    const caseId = data.caseId || 'kasus_halaman';
    const { width, height } = this.cameras.main;

    // Start with the game_bg
    const bg = this.add.image(width / 2, height / 2, 'game_bg');
    bg.setScale(Math.max(width / bg.width, height / bg.height));

    const kotorBg = this.add.image(width / 2, height / 2, 'halaman_kotor_bg');
    kotorBg.setScale(Math.max(width / kotorBg.width, height / kotorBg.height));
    kotorBg.setAlpha(0);
    kotorBg.setDepth(19);

    this.tweens.add({
      targets: kotorBg,
      alpha: 1,
      duration: 800,
      onComplete: () => {
        this.time.delayedCall(600, () => {
          const kotor2Bg = this.add.image(width / 2, height / 2, 'halaman_kotor2_bg');
          kotor2Bg.setScale(Math.max(width / kotor2Bg.width, height / kotor2Bg.height));
          kotor2Bg.setAlpha(0);
          kotor2Bg.setDepth(20);
          
          this.tweens.add({
            targets: kotor2Bg,
            alpha: 1,
            duration: 800,
            onComplete: () => {
              this.time.delayedCall(600, () => {
                const cleanBg = this.add.image(width / 2, height / 2, 'halaman_bersih');
                cleanBg.setScale(Math.max(width / cleanBg.width, height / cleanBg.height));
                cleanBg.setAlpha(0);
                cleanBg.setDepth(21);
                
                this.tweens.add({
                  targets: cleanBg,
                  alpha: 1,
                  duration: 800,
                  onComplete: () => {
                    this.time.delayedCall(1500, () => this.showTeacherConclusion(width, height));
                  }
                });
              });
            }
          });
        });
      }
    });
  }

  private showTeacherConclusion(width: number, height: number) {
    const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.6).setOrigin(0, 0);
    overlay.setDepth(30);
    overlay.setAlpha(0);
    this.tweens.add({ targets: overlay, alpha: 0.6, duration: 600 });

    const teacher = this.add.image(width * 0.25, height, 'teacher_thumbup').setOrigin(0.5, 1);
    const teacherMaxHeight = height * 0.85;
    teacher.setScale(teacherMaxHeight / teacher.height);
    teacher.setFlipX(true);
    teacher.setDepth(31);
    teacher.y = height + 300;
    this.tweens.add({ targets: teacher, y: height, duration: 600, ease: 'Back.easeOut' });

    const dialogContainer = this.add.container(width / 2, height - 150);
    dialogContainer.setDepth(32);
    const dialogWidth = width * 0.8;
    const dialogHeight = 220;

    const dialogBg = this.add.graphics();
    dialogBg.fillStyle(0x0f172a, 0.85);
    dialogBg.fillRoundedRect(-dialogWidth / 2, -dialogHeight / 2, dialogWidth, dialogHeight, 20);
    dialogBg.lineStyle(4, 0x3b82f6, 1);
    dialogBg.strokeRoundedRect(-dialogWidth / 2, -dialogHeight / 2, dialogWidth, dialogHeight, 20);

    const nameBg = this.add.graphics();
    nameBg.fillStyle(0x3b82f6, 1);
    nameBg.fillRoundedRect(-dialogWidth / 2 + 30, -dialogHeight / 2 - 25, 200, 50, 10);
    const nameText = this.add.text(-dialogWidth / 2 + 130, -dialogHeight / 2, 'Ibu Guru', {
      fontFamily: 'monospace',
      fontSize: '28px',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    const dialogTexts = [
      "Hebat, Detektif! Kamu berhasil menemukan penyebab halaman sekolah menjadi kotor dan membersihkannya.",
      "Ingat ya, membuang sampah pada tempatnya akan membuat lingkungan tetap bersih dan nyaman."
    ];
    let currentDialogIndex = 0;

    const textObj = this.add.text(-dialogWidth / 2 + 50, -dialogHeight / 2 + 40, '', {
      fontFamily: 'monospace',
      fontSize: '32px',
      color: '#f8fafc',
      wordWrap: { width: dialogWidth - 100 },
      lineSpacing: 10
    });

    let typeWriterEvent: Phaser.Time.TimerEvent;
    let isTyping = false;
    let currentTextContent = "";

    const startTyping = () => {
      textObj.text = "";
      currentTextContent = dialogTexts[currentDialogIndex];
      isTyping = true;
      let charIndex = 0;
      typeWriterEvent = this.time.addEvent({
        delay: 30,
        repeat: currentTextContent.length - 1,
        callback: () => {
          textObj.text += currentTextContent[charIndex];
          charIndex++;
          if (charIndex >= currentTextContent.length) { isTyping = false; }
        }
      });
    };
    startTyping();

    const clickArea = this.add.zone(0, 0, dialogWidth, dialogHeight)
      .setRectangleDropZone(dialogWidth, dialogHeight)
      .setInteractive({ useHandCursor: true });

    dialogContainer.add([dialogBg, nameBg, nameText, textObj, clickArea]);
    dialogContainer.setAlpha(0);
    dialogContainer.y += 50;
    this.tweens.add({ targets: dialogContainer, alpha: 1, y: height - 150, duration: 500, delay: 400, ease: 'Power2' });

    clickArea.on('pointerdown', () => {
      if (isTyping) {
        typeWriterEvent.remove();
        textObj.text = currentTextContent;
        isTyping = false;
      } else {
        currentDialogIndex++;
        if (currentDialogIndex < dialogTexts.length) { startTyping(); }
        else {
          clickArea.disableInteractive();
          this.tweens.add({
            targets: [dialogContainer, teacher],
            alpha: 0,
            duration: 300,
            onComplete: () => {
              dialogContainer.destroy();
              teacher.destroy();
              this.showFinalResult(width, height);
            }
          });
        }
      }
    });
  }

  private showFinalResult(width: number, height: number) {
    const resultContainer = this.add.container(width / 2, height / 2);
    resultContainer.setDepth(40);

    const bg = this.add.graphics();
    bg.fillStyle(0x0f172a, 0.9);
    bg.fillRoundedRect(-300, -200, 600, 400, 30);
    bg.lineStyle(6, 0x3b82f6, 1);
    bg.strokeRoundedRect(-300, -200, 600, 400, 30);

    const title = this.add.text(0, -100, 'KASUS SELESAI!', {
      fontFamily: 'Fredoka One, Arial, sans-serif',
      fontSize: '48px',
      color: '#facc15',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 6
    }).setOrigin(0.5);

    const score = this.add.text(0, -10, 'Eco Point +10', {
      fontFamily: 'Fredoka One, Arial, sans-serif',
      fontSize: '38px',
      color: '#4ade80',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5);

    const btnWidth = 320;
    const btnHeight = 65;
    const nextBtnY = 100;
    const nextBtnContainer = this.add.container(0, nextBtnY);

    const shadow = this.add.graphics();
    shadow.fillStyle(0x000000, 0.4);
    shadow.fillRoundedRect(-btnWidth / 2 + 3, -btnHeight / 2 + 4, btnWidth, btnHeight, 20);

    const nextBtnBg = this.add.graphics();
    nextBtnBg.fillStyle(0x2563eb, 1);
    nextBtnBg.fillRoundedRect(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight, 20);
    nextBtnBg.lineStyle(4, 0xffffff, 0.3);
    nextBtnBg.strokeRoundedRect(-btnWidth / 2 + 2, -btnHeight / 2 + 2, btnWidth - 4, btnHeight - 4, 18);
    nextBtnBg.lineStyle(3, 0x000000, 1);
    nextBtnBg.strokeRoundedRect(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight, 20);

    const nextBtnText = this.add.text(0, 0, 'KEMBALI KE PAPAN', {
      fontFamily: 'Fredoka One, Arial, sans-serif',
      fontSize: '24px',
      color: '#ffffff',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5);

    nextBtnContainer.add([shadow, nextBtnBg, nextBtnText]);
    const hitArea = new Phaser.Geom.Rectangle(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight);
    nextBtnContainer.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);

    let isClicking = false;
    nextBtnContainer.on('pointerover', () => {
      if (isClicking) return;
      this.input.setDefaultCursor('pointer');
      nextBtnBg.clear();
      nextBtnBg.fillStyle(0x3b82f6, 1);
      nextBtnBg.fillRoundedRect(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight, 20);
      nextBtnBg.lineStyle(4, 0xffffff, 0.5);
      nextBtnBg.strokeRoundedRect(-btnWidth / 2 + 2, -btnHeight / 2 + 2, btnWidth - 4, btnHeight - 4, 18);
      nextBtnBg.lineStyle(3, 0x000000, 1);
      nextBtnBg.strokeRoundedRect(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight, 20);
      nextBtnContainer.y = nextBtnY - 2;
      shadow.y = 2;
    });

    nextBtnContainer.on('pointerout', () => {
      if (isClicking) return;
      this.input.setDefaultCursor('default');
      nextBtnBg.clear();
      nextBtnBg.fillStyle(0x2563eb, 1);
      nextBtnBg.fillRoundedRect(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight, 20);
      nextBtnBg.lineStyle(4, 0xffffff, 0.3);
      nextBtnBg.strokeRoundedRect(-btnWidth / 2 + 2, -btnHeight / 2 + 2, btnWidth - 4, btnHeight - 4, 18);
      nextBtnBg.lineStyle(3, 0x000000, 1);
      nextBtnBg.strokeRoundedRect(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight, 20);
      nextBtnContainer.y = nextBtnY;
      shadow.y = 0;
    });

    nextBtnContainer.on('pointerdown', () => {
      if (isClicking) return;
      isClicking = true;
      this.input.setDefaultCursor('default');
      nextBtnContainer.y = nextBtnY + 4;
      shadow.y = -4;
      setTimeout(() => { this.scene.start('CaseSelectScene', { unlockCase2: true }); }, 150);
    });

    resultContainer.add([bg, title, score, nextBtnContainer]);
    resultContainer.setScale(0);
    this.tweens.add({
      targets: resultContainer,
      scale: 1,
      duration: 500,
      ease: 'Back.easeOut'
    });
  }
}
