import * as Phaser from 'phaser';
import introBgAsset from '../../assets/backgrounds/intro.png';
import teacherSmileAsset from '../../assets/characters/teachers/smile.png';
import teacherSadAsset from '../../assets/characters/teachers/sad.png';
import teacherSurprisedAsset from '../../assets/characters/teachers/suprised.png';
import teacherHappyAsset from '../../assets/characters/teachers/happy.png';
import typingAudioUrl from '../../assets/audio/keyboard-typing.wav';
import introAudioUrl from '../../assets/audio/intro.mp3';
import btnClickUrl from '../../assets/audio/button_click.mp3';

export class IntroScene extends Phaser.Scene {
  private dialogues: string[] = [
    "Halo Detektif Cilik!",
    "Selamat! Kamu sudah resmi bergabung dengan Tim Detektif Sampah.",
    "Sebagai Detektif, kamu harus bisa mengawasi dan menjaga lingkungan supaya selalu bersih dan nyaman.",
    "Hari ini tim mendapatkan laporan!\nDikabarkan sampah terlihat berserakan di lingkungan sekolah.",
    "Ini adalah misi pertama mu",
    "Bersiaplah! Kamu harus teliti dan cermat dalam mencari bukti kasus pertama."
  ];
  private currentDialogIndex: number = 0;

  private textObj!: Phaser.GameObjects.Text;
  private lanjutText!: Phaser.GameObjects.Text;
  private mulaiBtn!: Phaser.GameObjects.Container;
  private typewriterEvent: Phaser.Time.TimerEvent | null = null;
  private isTyping: boolean = false;
  private isClicking: boolean = false;

  private typingSound!: Phaser.Sound.BaseSound;
  private bgMusic!: Phaser.Sound.BaseSound;
  private teacherObj!: Phaser.GameObjects.Image;

  constructor() {
    super('IntroScene');
  }

  init() {
    this.currentDialogIndex = 0;
    this.isTyping = false;
    this.isClicking = false;
    this.typewriterEvent = null;
  }

  preload() {
    this.load.image('intro_bg', introBgAsset);
    this.load.image('teacher_smile', teacherSmileAsset);
    this.load.image('teacher_sad', teacherSadAsset);
    this.load.image('teacher_surprised', teacherSurprisedAsset);
    this.load.image('teacher_happy', teacherHappyAsset);
    this.load.audio('typing_sfx', typingAudioUrl);
    this.load.audio('intro_bgm', introAudioUrl);
    this.load.audio('btn_click', btnClickUrl);
  }

  create() {
    const { width, height } = this.cameras.main;

    // Background
    const bg = this.add.image(width / 2, height / 2, 'intro_bg');
    const scaleX = width / bg.width;
    const scaleY = height / bg.height;
    bg.setScale(Math.max(scaleX, scaleY));

    // Overlay gelap
    const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.6).setOrigin(0, 0);
    overlay.setDepth(10);

    // Teacher
    this.teacherObj = this.add.image(width * 0.25, height, 'teacher_smile').setOrigin(0.5, 1);
    const teacherMaxHeight = height * 0.85;
    this.teacherObj.setScale(teacherMaxHeight / this.teacherObj.height);
    this.teacherObj.setFlipX(true);
    this.teacherObj.setDepth(20);

    this.typingSound = this.sound.add('typing_sfx', { loop: true, volume: 1.0 });

    this.bgMusic = this.sound.add('intro_bgm', { loop: true, volume: 2 });
    this.bgMusic.play();

    // Stop music if the scene is forcefully shut down (e.g., via debug scene skip)
    this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
      if (this.bgMusic) {
        this.bgMusic.stop();
      }
    });

    this.setupDialogUI(width, height);

    // Start first dialog
    this.currentDialogIndex = 0;
    this.showDialog();

    this.createBackButton();
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
      backBtn.y = y + 4;
      shadow.y = -4;
      setTimeout(() => {
        this.scene.start('CoverScene');
      }, 150);
    });
  }

  private setupDialogUI(width: number, height: number) {
    const container = this.add.container(width / 2, height - 150);
    container.setDepth(30);

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

    this.textObj = this.add.text(-dialogWidth / 2 + 50, -dialogHeight / 2 + 40, '', {
      fontFamily: 'monospace',
      fontSize: '32px',
      color: '#f8fafc',
      wordWrap: { width: dialogWidth - 100 },
      lineSpacing: 10
    });

    this.lanjutText = this.add.text(dialogWidth / 2 - 30, dialogHeight / 2 - 20, 'Lanjut ➔', {
      fontFamily: 'monospace',
      fontSize: '26px',
      color: '#4ade80',
      fontStyle: 'bold'
    }).setOrigin(1, 1).setAlpha(0).setInteractive({ useHandCursor: true });

    this.lanjutText.on('pointerover', () => this.lanjutText.setColor('#22c55e'));
    this.lanjutText.on('pointerout', () => this.lanjutText.setColor('#4ade80'));

    container.add([dialogBg, nameBg, nameText, this.textObj, this.lanjutText]);

    // Mulai Button
    this.mulaiBtn = this.add.container(dialogWidth / 2 - 90, dialogHeight / 2 - 40);
    
    const btnBg = this.add.graphics();
    btnBg.fillStyle(0x3b82f6, 1);
    btnBg.fillRoundedRect(-70, -25, 140, 50, 15);
    
    const btnText = this.add.text(0, 0, 'Mulai ➔', {
      fontFamily: 'monospace',
      fontSize: '24px',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    this.mulaiBtn.add([btnBg, btnText]);
    
    const btnHitArea = new Phaser.Geom.Rectangle(-70, -25, 140, 50);
    this.mulaiBtn.setInteractive(btnHitArea, Phaser.Geom.Rectangle.Contains);
    
    this.mulaiBtn.on('pointerover', () => {
      this.input.setDefaultCursor('pointer');
      btnBg.clear();
      btnBg.fillStyle(0x2563eb, 1);
      btnBg.fillRoundedRect(-70, -25, 140, 50, 15);
    });
    
    this.mulaiBtn.on('pointerout', () => {
      this.input.setDefaultCursor('default');
      btnBg.clear();
      btnBg.fillStyle(0x3b82f6, 1);
      btnBg.fillRoundedRect(-70, -25, 140, 50, 15);
    });

    this.mulaiBtn.setVisible(false);

    this.mulaiBtn.on('pointerdown', () => {
      if (!this.isTyping && this.currentDialogIndex === this.dialogues.length - 1) {
        this.input.setDefaultCursor('default');
        this.sound.play('btn_click', { seek: 0.8, volume: 0.9 });
        
        // Go to next scene
        this.cameras.main.fadeOut(500, 0, 0, 0);

        if (this.bgMusic) {
          this.tweens.add({
            targets: this.bgMusic,
            volume: 0,
            duration: 500
          });
        }

        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
          if (this.typingSound) this.typingSound.stop();
          if (this.bgMusic) this.bgMusic.stop();
          this.scene.start('CaseSelectScene');
        });
      }
    });

    container.add(this.mulaiBtn);

    // Click anywhere on dialog to skip typing or proceed to next dialog
    const hitArea = new Phaser.Geom.Rectangle(-dialogWidth / 2, -dialogHeight / 2, dialogWidth, dialogHeight);
    const interactiveBg = this.add.zone(0, 0, dialogWidth, dialogHeight);
    interactiveBg.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);
    // Show pointer cursor for dialog background so user knows they can click
    interactiveBg.on('pointerover', () => {
      if (this.currentDialogIndex < this.dialogues.length - 1 || this.isTyping) {
        this.input.setDefaultCursor('pointer');
      }
    });
    interactiveBg.on('pointerout', () => {
      this.input.setDefaultCursor('default');
    });
    container.add(interactiveBg);

    // Pop-in animation for bubble
    container.setAlpha(0);
    container.setScale(0.5);
    this.tweens.add({
      targets: container,
      alpha: 1,
      scale: 1,
      duration: 400,
      ease: 'Back.easeOut'
    });
    
    
    const handleNextDialog = () => {
      if (this.isTyping) {
        this.finishTyping();
      } else {
        if (this.currentDialogIndex < this.dialogues.length - 1) {
          this.sound.play('btn_click', { seek: 0.8, volume: 0.3 });
          this.currentDialogIndex++;
          this.showDialog();
          if (this.currentDialogIndex === this.dialogues.length - 1) {
            this.input.setDefaultCursor('default');
          }
        }
      }
    };
    
    interactiveBg.on('pointerdown', handleNextDialog);
    this.lanjutText.on('pointerdown', handleNextDialog);
  }

  private showDialog() {
    if (this.currentDialogIndex >= this.dialogues.length) return;

    const text = this.dialogues[this.currentDialogIndex];
    this.textObj.setText('');
    this.mulaiBtn.setVisible(false);
    this.lanjutText.setAlpha(0);
    this.isTyping = true;

    // Reset posisi awal setiap kali dialog berganti
    this.teacherObj.setPosition(this.cameras.main.width * 0.25, this.cameras.main.height);

    // Update teacher expression
    if (this.currentDialogIndex === 0) {
      this.teacherObj.setTexture('teacher_smile');
      this.teacherObj.setFlipX(true);
    } else if (this.currentDialogIndex === 1) {
      this.teacherObj.setTexture('teacher_happy');
      this.teacherObj.setFlipX(true); 
      // happy: posisinya kebawahin dikit
      this.teacherObj.y += 55;
    } else if (this.currentDialogIndex === 2) {
      this.teacherObj.setTexture('teacher_surprised');
      this.teacherObj.setFlipX(true);
      // surprised: posisinya ke atas dikit
      this.teacherObj.y;
    } else if (this.currentDialogIndex === 3) {
      this.teacherObj.setTexture('teacher_sad');
      this.teacherObj.setFlipX(true);
    } else if (this.currentDialogIndex === 4) {
      this.teacherObj.setTexture('teacher_surprised');
      this.teacherObj.setFlipX(true);
      this.teacherObj.y;
    } else if (this.currentDialogIndex === 5) {
      this.teacherObj.setTexture('teacher_smile');
      this.teacherObj.setFlipX(true);
    }

    // Scale dynamically
    const teacherMaxHeight = this.cameras.main.height * 0.85;
    let finalScale = teacherMaxHeight / this.teacherObj.height;
    
    // Custom Scaling
    if (this.currentDialogIndex === 1) {
      // happy: zoom dikit
      finalScale *= 1.05;
    } else if (this.currentDialogIndex === 2 || this.currentDialogIndex === 4) {
      // surprised: reduce scale slightly as it appears too large
      finalScale *= 1.0;
    }
    
    this.teacherObj.setScale(finalScale);

    if (this.typewriterEvent) {
      this.typewriterEvent.destroy();
    }

    // Play typing sound
    if (!this.typingSound.isPlaying) {
      this.typingSound.play();
    }

    let length = 0;
    this.typewriterEvent = this.time.addEvent({
      delay: 40,
      callback: () => {
        length++;
        this.textObj.setText(text.substring(0, length));
        if (length === text.length) {
          this.finishTyping();
        }
      },
      repeat: text.length - 1
    });
  }

  private finishTyping() {
    if (this.typewriterEvent) {
      this.typewriterEvent.destroy();
    }
    const text = this.dialogues[this.currentDialogIndex];
    this.textObj.setText(text);
    this.isTyping = false;
    this.typingSound.stop();
    
    if (this.currentDialogIndex === this.dialogues.length - 1) {
      this.mulaiBtn.setVisible(true);
    } else {
      this.lanjutText.setAlpha(1);
    }
  }
}
