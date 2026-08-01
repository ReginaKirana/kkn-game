import * as Phaser from 'phaser';

export class Case1TransitionScene extends Phaser.Scene {
  constructor() {
    super('Case1TransitionScene');
  }

  create(data: { caseId?: string }) {
    const caseId = data.caseId || 'kasus_halaman';
    const { width, height } = this.cameras.main;

    if (!this.sound.get('bg_gameplay')?.isPlaying) {
      this.sound.stopAll();
      this.sound.play('bg_gameplay', { loop: true, volume: 0.4 });
    }

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

                const sparkle = this.sound.add('sparkle', { volume: 0.8 });
                sparkle.play();
                this.time.delayedCall(3000, () => {
                  if (sparkle.isPlaying) sparkle.stop();
                });

                // Flash effect
                const flash = this.add.rectangle(0, 0, width, height, 0xffffff, 1).setOrigin(0).setDepth(22);
                this.tweens.add({ targets: flash, alpha: 0, duration: 1000, onComplete: () => flash.destroy() });

                // Sparkle falling from top
                const createSparkle = () => {
                  const startX = Phaser.Math.Between(0, width);
                  const startY = -50;
                  const size = Phaser.Math.Between(40, 70);
                  const sparkle = this.add.text(startX, startY, '✨', { fontSize: `${size}px` })
                    .setOrigin(0.5).setDepth(22);

                  this.tweens.add({
                    targets: sparkle,
                    y: height + 100,
                    x: startX + Phaser.Math.Between(-150, 150),
                    rotation: Phaser.Math.Between(-3, 3),
                    alpha: { start: 1, to: 0 },
                    duration: Phaser.Math.Between(1500, 2500),
                    ease: 'Sine.easeInOut',
                    onComplete: () => sparkle.destroy()
                  });
                };

                // Spawn many sparkles over a short duration
                for (let i = 0; i < 40; i++) {
                  this.time.delayedCall(i * 50, createSparkle);
                }

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
      "Good job, Detektif! Kamu berhasil menyelesaikan tahap pertama dengan menemukan penyebab dari lingkungan sekolah yang kotor dan membersihkannya.",
      "Namun, ada hal menarik dari bukti yang sudah kamu kumpulkan.",
      "Sampah yang ditemukan ternyata berbeda-beda.",
      "Yuk, lanjutkan penyelidikan ke tahap selanjutnya."
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
    let typingSound: Phaser.Sound.BaseSound | null = null;

    const expressions = [
      'teacher_thumbup',
      'teacher_smile',
      'teacher_surprised',
      'teacher_smile'
    ];

    const nextBtn = this.add.text(dialogWidth / 2 - 30, dialogHeight / 2 - 20, 'Lanjut ➔', {
      fontFamily: 'monospace',
      fontSize: '26px',
      color: '#4ade80',
      fontStyle: 'bold'
    }).setOrigin(1, 1).setAlpha(0);

    const startTyping = () => {
      teacher.setTexture(expressions[currentDialogIndex]);
      // Sesuaikan ulang skalanya berdasarkan gambar yang baru supaya tidak kebesaran/kekecilan
      const teacherMaxHeight = height * 0.85;
      teacher.setScale(teacherMaxHeight / teacher.height);

      textObj.text = "";
      nextBtn.setAlpha(0);
      currentTextContent = dialogTexts[currentDialogIndex];
      isTyping = true;
      typingSound = this.sound.add('keyboard_typing', { loop: true, volume: 0.5 });
      typingSound.play();
      let charIndex = 0;
      typeWriterEvent = this.time.addEvent({
        delay: 30,
        repeat: currentTextContent.length - 1,
        callback: () => {
          textObj.text += currentTextContent[charIndex];
          charIndex++;
          if (charIndex >= currentTextContent.length) {
            isTyping = false;
            if (typingSound) typingSound.stop();
            nextBtn.setAlpha(1);
          }
        }
      });
    };
    startTyping();

    // Klik dimana saja di dalam dialog untuk lanjut/skip
    const hitArea = new Phaser.Geom.Rectangle(-dialogWidth / 2, -dialogHeight / 2, dialogWidth, dialogHeight);
    const interactiveBg = this.add.zone(0, 0, dialogWidth, dialogHeight);
    interactiveBg.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);

    interactiveBg.on('pointerover', () => {
      this.input.setDefaultCursor('pointer');
    });

    interactiveBg.on('pointerout', () => {
      this.input.setDefaultCursor('default');
    });

    nextBtn.setInteractive();
    nextBtn.on('pointerover', () => { this.input.setDefaultCursor('pointer'); nextBtn.setColor('#22c55e'); });
    nextBtn.on('pointerout', () => { this.input.setDefaultCursor('pointer'); nextBtn.setColor('#4ade80'); }); // Tetap pointer karena di dalam interactiveBg

    dialogContainer.add([dialogBg, nameBg, nameText, textObj, nextBtn, interactiveBg]);
    dialogContainer.setAlpha(0);
    dialogContainer.y += 50;
    this.tweens.add({ targets: dialogContainer, alpha: 1, y: height - 150, duration: 500, delay: 400, ease: 'Power2' });

    const advanceDialog = () => {
      if (isTyping) {
        if (typeWriterEvent) typeWriterEvent.destroy();
        textObj.text = currentTextContent;
        isTyping = false;
        if (typingSound) typingSound.stop();
        nextBtn.setAlpha(1);
      } else {
        currentDialogIndex++;
        if (currentDialogIndex < dialogTexts.length) { startTyping(); }
        else {
          this.input.off('pointerdown', handleDialogClick);
          interactiveBg.disableInteractive();
          nextBtn.disableInteractive();
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
    };

    const handleDialogClick = () => {
      this.sound.play('button_click', { seek: 0.8 });
      advanceDialog();
    };

    // Gunakan global pointerdown agar klik di mana saja (bahkan di luar area dialog) pasti terdeteksi
    this.input.on('pointerdown', handleDialogClick);
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
      this.sound.play('button_click', { volume: 0.8, seek: 0.8 });
      nextBtnContainer.y = nextBtnY + 4;
      shadow.y = -4;

      const bgm = this.sound.get('bg_gameplay') as any;
      if (bgm && bgm.isPlaying) {
        this.tweens.add({
          targets: bgm,
          volume: 0,
          duration: 500,
          onComplete: () => {
            bgm.stop();
            this.scene.start('CaseSelectScene', { unlockCase2: true });
          }
        });
      } else {
        setTimeout(() => { this.scene.start('CaseSelectScene', { unlockCase2: true }); }, 500);
      }
    });

    resultContainer.add([bg, title, score, nextBtnContainer]);
    resultContainer.setScale(0);
    this.sound.play('finish_case', { volume: 0.8 });
    this.tweens.add({
      targets: resultContainer,
      scale: 1,
      duration: 500,
      ease: 'Back.easeOut'
    });
  }
}
