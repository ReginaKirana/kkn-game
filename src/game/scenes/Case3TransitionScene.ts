import * as Phaser from 'phaser';

export class Case3TransitionScene extends Phaser.Scene {
  private bg!: Phaser.GameObjects.Image;
  private teacher!: Phaser.GameObjects.Image;
  private dialogContainer!: Phaser.GameObjects.Container;
  private textObj!: Phaser.GameObjects.Text;
  private typeWriterEvent!: Phaser.Time.TimerEvent;
  private overlay!: Phaser.GameObjects.Rectangle;
  private nextBtn!: Phaser.GameObjects.Text;
  
  private currentDialogIndex = 0;
  private isTyping = false;
  private currentTextContent = "";
  
  private bgMusic!: Phaser.Sound.BaseSound;
  private typingSound!: Phaser.Sound.BaseSound;

  private dialogs = [
    {
      text: "Hebat!",
      teacherKey: 'teacher_smile',
      teacherScale: 1.0
    },
    {
      text: "Sekarang air dapat mengalir kembali dengan lancar.",
      teacherKey: 'teacher_thumbup',
      teacherScale: 1.0
    }
  ];

  constructor() {
    super('Case3TransitionScene');
  }

  init() {
    this.currentDialogIndex = 0;
    this.isTyping = false;
  }

  create() {
    const { width, height } = this.cameras.main;
    this.currentDialogIndex = 0;

    // Background Awal (Tanpa sampah)
    this.bg = this.add.image(width / 2, height / 2, 'selokan_bg');
    this.bg.setScale(Math.max(width / this.bg.width, height / this.bg.height));

    this.bgMusic = this.sound.add('bg_gameplay', { loop: true, volume: 0.3 });
    this.bgMusic.play();
    this.typingSound = this.sound.add('keyboard_typing', { loop: true, volume: 1 });

    this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
      if (this.bgMusic) this.bgMusic.stop();
      if (this.typingSound) this.typingSound.stop();
    });

    // Persiapan UI Guru (Hidden initially)
    this.overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.6).setOrigin(0, 0);
    this.overlay.setAlpha(0);
    this.overlay.setDepth(10);

    this.teacher = this.add.image(width * 0.2 + 60, height + 40, 'teacher_smile').setOrigin(0.5, 1);
    const teacherMaxHeight = height * 0.82;
    this.teacher.setScale(teacherMaxHeight / this.teacher.height);
    this.teacher.setFlipX(true);
    this.teacher.setAlpha(0);
    this.teacher.setDepth(20);

    this.createDialogUI(width, height);

    // Sequence transisi air selokan
    const transitionKeys = [
      'selokan_transisi1',
      'selokan_transisi3',
      'selokan_final'
    ];
    
    let step = 0;
    
    const playNextTransition = () => {
      if (step >= transitionKeys.length) {
        this.showWinText(width, height);
        return;
      }

      const key = transitionKeys[step];
      const nextBg = this.add.image(width / 2, height / 2, key);
      nextBg.setScale(Math.max(width / nextBg.width, height / nextBg.height));
      nextBg.setAlpha(0);
      nextBg.setDepth(0); 

      this.tweens.add({
        targets: nextBg,
        alpha: 1,
        duration: 1000, 
        ease: 'Sine.easeInOut',
        onComplete: () => {
          this.bg.destroy();
          this.bg = nextBg;
          step++;
          playNextTransition();
        }
      });
    };

    // Mulai transisi air secara otomatis
    this.time.delayedCall(500, playNextTransition);
  }

  private showWinText(width: number, height: number) {
    const container = this.add.container(width / 2, height / 2);
    container.setDepth(100);

    const bannerWidth = 650;
    const bannerHeight = 100;

    // Background Panel
    const bg = this.add.graphics();
    bg.fillStyle(0x0f172a, 0.95);
    bg.fillRoundedRect(-bannerWidth/2, -bannerHeight/2, bannerWidth, bannerHeight, 20);
    bg.lineStyle(4, 0x3b82f6, 1);
    bg.strokeRoundedRect(-bannerWidth/2, -bannerHeight/2, bannerWidth, bannerHeight, 20);

    const winText = this.add.text(0, 0, 'SELOKAN TERLIHAT BERSIH! ✨', {
      fontFamily: 'Fredoka One, Arial, sans-serif',
      fontSize: '36px',
      color: '#ffffff',
      fontStyle: 'bold',
      shadow: { offsetX: 3, offsetY: 3, color: '#000000', blur: 8, fill: true }
    }).setOrigin(0.5);

    container.add([bg, winText]);
    container.setAlpha(0);
    container.setScale(0.5);

    this.tweens.add({
      targets: container,
      alpha: 1,
      scale: 1,
      duration: 800,
      ease: 'Elastic.easeOut',
      onStart: () => {
        this.sound.play('sparkle', { volume: 0.8 });
        
        const { width, height } = this.cameras.main;
        const createSparkle = () => {
            const angle = Phaser.Math.Between(0, 360) * Math.PI / 180;
            const radius = Phaser.Math.Between(100, 250);
            const sparkle = this.add.text(width/2, height/2, '✨', { fontSize: '50px' })
                .setOrigin(0.5).setDepth(101).setAlpha(0);
            this.tweens.add({
                targets: sparkle,
                x: width/2 + Math.cos(angle) * radius,
                y: height/2 + Math.sin(angle) * radius,
                alpha: { from: 1, to: 0 },
                scale: { from: 0.5, to: 1.5 },
                duration: 800 + Phaser.Math.Between(0, 400),
                ease: 'Power2',
                onComplete: () => sparkle.destroy()
            });
        };
        for (let i = 0; i < 20; i++) {
            this.time.delayedCall(i * 50, createSparkle);
        }

        // Menghentikan sparkle setelah 2 detik sesuai request sebelumnya (0-2 detik)
        this.time.delayedCall(2000, () => {
          this.sound.stopByKey('sparkle');
        });
      },
      onComplete: () => {
        this.time.delayedCall(2000, () => {
          container.destroy();
          this.showEndingSequence();
        });
      }
    });
  }

  private createDialogUI(width: number, height: number) {
    this.dialogContainer = this.add.container(width / 2, height - 150);
    this.dialogContainer.setDepth(30);
    this.dialogContainer.setAlpha(0);

    const dialogWidth = width * 0.8;
    const dialogHeight = 220;

    const dialogBg = this.add.graphics();
    dialogBg.fillStyle(0x0f172a, 0.85);
    dialogBg.fillRoundedRect(-dialogWidth/2, -dialogHeight/2, dialogWidth, dialogHeight, 20);
    dialogBg.lineStyle(4, 0x3b82f6, 1);
    dialogBg.strokeRoundedRect(-dialogWidth/2, -dialogHeight/2, dialogWidth, dialogHeight, 20);

    const nameBg = this.add.graphics();
    nameBg.fillStyle(0x3b82f6, 1);
    nameBg.fillRoundedRect(-dialogWidth/2 + 30, -dialogHeight/2 - 25, 200, 50, 10);
    const nameText = this.add.text(-dialogWidth/2 + 130, -dialogHeight/2, 'Ibu Guru', {
      fontFamily: 'monospace',
      fontSize: '28px',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.textObj = this.add.text(-dialogWidth/2 + 50, -dialogHeight/2 + 40, '', {
      fontFamily: 'monospace',
      fontSize: '32px',
      color: '#f8fafc',
      wordWrap: { width: dialogWidth - 100 },
      lineSpacing: 10
    });

    this.nextBtn = this.add.text(dialogWidth / 2 - 30, dialogHeight / 2 - 20, 'Lanjut ➔', {
      fontFamily: 'monospace',
      fontSize: '26px',
      color: '#4ade80',
      fontStyle: 'bold'
    }).setOrigin(1, 1).setAlpha(0);

    const clickArea = this.add.zone(0, 0, width, height).setOrigin(0).setInteractive();

    const advanceDialog = () => {
      this.sound.play('btn_click', { seek: 0.8 });
      this.handleDialogClick();
    };

    clickArea.on('pointerdown', advanceDialog);

    this.dialogContainer.add([dialogBg, nameBg, nameText, this.textObj, this.nextBtn]);
  }

  private showEndingSequence() {
    this.tweens.add({
      targets: this.overlay,
      alpha: 1,
      duration: 800
    });
    
    this.sound.play('karakter_muncul', { volume: 0.8 });
    this.tweens.add({
      targets: this.teacher,
      alpha: 1,
      duration: 800,
      ease: 'Power2',
      onComplete: () => {
        this.dialogContainer.y += 50;
        this.tweens.add({
          targets: this.dialogContainer,
          alpha: 1,
          y: this.cameras.main.height - 150,
          duration: 400,
          ease: 'Power2',
          onComplete: () => this.startTyping()
        });
      }
    });
  }

  private startTyping() {
    const dialogData = this.dialogs[this.currentDialogIndex];
    
    this.teacher.setTexture(dialogData.teacherKey);

    let baseTeacherX = this.cameras.main.width * 0.2;
    let baseTeacherY = this.cameras.main.height + 40; // Naikkan sedikit

    if (dialogData.teacherKey === 'teacher_smile') {
       baseTeacherX += 60; // Geser ke kanan (cukup banyak agar tidak terlalu kiri)
    } else if (dialogData.teacherKey === 'teacher_thumbup') {
       baseTeacherX += 20; // Geser ke kanan (tapi tidak sebanyak smile)
    }

    this.teacher.setPosition(baseTeacherX, baseTeacherY);

    const teacherMaxHeight = this.cameras.main.height * 0.82;
    this.teacher.setScale((teacherMaxHeight / this.teacher.height) * (dialogData.teacherScale || 1));

    this.isTyping = true;
    this.nextBtn.setAlpha(0);
    this.currentTextContent = dialogData.text;
    this.textObj.text = '';

    let i = 0;
    this.typeWriterEvent = this.time.addEvent({
      delay: 30,
      repeat: this.currentTextContent.length - 1,
      callback: () => {
        if (this.typingSound && !this.typingSound.isPlaying) this.typingSound.play();
        this.textObj.text += this.currentTextContent[i];
        i++;
        if (i === this.currentTextContent.length) {
          this.isTyping = false;
          if (this.typingSound) this.typingSound.stop();
          this.nextBtn.setAlpha(1);
          if (this.currentDialogIndex === this.dialogs.length - 1) {
            this.nextBtn.setText('Selesai ➔');
          } else {
            this.nextBtn.setText('Lanjut ➔');
          }
        }
      }
    });
  }

  private handleDialogClick() {
    if (this.isTyping) return;

      this.currentDialogIndex++;
      if (this.currentDialogIndex < this.dialogs.length) {
        this.startTyping();
      } else {
        this.tweens.add({
          targets: [this.dialogContainer, this.teacher],
          alpha: 0,
          duration: 300,
          onComplete: () => {
            this.dialogContainer.destroy();
            this.teacher.destroy();
            this.showFinalResult(this.cameras.main.width, this.cameras.main.height);
          }
        });
      }
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

    const score = this.add.text(0, -10, 'Eco Point +500', {
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
    shadow.fillRoundedRect(-btnWidth/2 + 3, -btnHeight/2 + 4, btnWidth, btnHeight, 20);

    const nextBtnBg = this.add.graphics();
    nextBtnBg.fillStyle(0x2563eb, 1);
    nextBtnBg.fillRoundedRect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight, 20);
    nextBtnBg.lineStyle(4, 0xffffff, 0.3);
    nextBtnBg.strokeRoundedRect(-btnWidth/2 + 2, -btnHeight/2 + 2, btnWidth - 4, btnHeight - 4, 18);
    nextBtnBg.lineStyle(3, 0x000000, 1);
    nextBtnBg.strokeRoundedRect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight, 20);

    const nextBtnText = this.add.text(0, 0, 'LANJUT ➔', {
      fontFamily: 'Fredoka One, Arial, sans-serif',
      fontSize: '24px',
      color: '#ffffff',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5);

    nextBtnContainer.add([shadow, nextBtnBg, nextBtnText]);
    const hitArea = new Phaser.Geom.Rectangle(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight);
    nextBtnContainer.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);

    let isClicking = false;
    nextBtnContainer.on('pointerover', () => {
      if (isClicking) return;
      this.input.setDefaultCursor('pointer');
      nextBtnBg.clear();
      nextBtnBg.fillStyle(0x3b82f6, 1);
      nextBtnBg.fillRoundedRect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight, 20);
      nextBtnBg.lineStyle(4, 0xffffff, 0.5);
      nextBtnBg.strokeRoundedRect(-btnWidth/2 + 2, -btnHeight/2 + 2, btnWidth - 4, btnHeight - 4, 18);
      nextBtnBg.lineStyle(3, 0x000000, 1);
      nextBtnBg.strokeRoundedRect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight, 20);
      nextBtnContainer.y = nextBtnY - 2;
      shadow.y = 2;
    });

    nextBtnContainer.on('pointerout', () => {
      if (isClicking) return;
      this.input.setDefaultCursor('default');
      nextBtnBg.clear();
      nextBtnBg.fillStyle(0x2563eb, 1);
      nextBtnBg.fillRoundedRect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight, 20);
      nextBtnBg.lineStyle(4, 0xffffff, 0.3);
      nextBtnBg.strokeRoundedRect(-btnWidth/2 + 2, -btnHeight/2 + 2, btnWidth - 4, btnHeight - 4, 18);
      nextBtnBg.lineStyle(3, 0x000000, 1);
      nextBtnBg.strokeRoundedRect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight, 20);
      nextBtnContainer.y = nextBtnY;
      shadow.y = 0;
    });

    nextBtnContainer.on('pointerdown', () => {
      if (isClicking) return;
      isClicking = true;
      this.input.setDefaultCursor('default');
      this.sound.play('btn_click', { seek: 0.8 });
      nextBtnContainer.y = nextBtnY + 4;
      shadow.y = -4;

      if (this.bgMusic) {
        this.tweens.add({
          targets: this.bgMusic,
          volume: 0,
          duration: 500,
          onComplete: () => this.bgMusic.stop()
        });
      }

      setTimeout(() => { 
        this.registry.set('ecoPoints', (this.registry.get('ecoPoints') || 1000) + 500);
        this.scene.start('OutroScene'); 
      }, 500);
    });

    resultContainer.add([bg, title, score, nextBtnContainer]);
    resultContainer.setScale(0);
    this.tweens.add({
      targets: resultContainer,
      scale: 1,
      duration: 500,
      ease: 'Back.easeOut',
      onStart: () => {
        this.sound.play('finish_case');
      }
    });
  }
}
