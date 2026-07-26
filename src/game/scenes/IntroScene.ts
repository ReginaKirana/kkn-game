import * as Phaser from 'phaser';
import introBgAsset from '../../assets/backgrounds/intro.png';
import teacherSmileAsset from '../../assets/characters/teachers/smile.png';
import teacherSadAsset from '../../assets/characters/teachers/sad.png';
import teacherSurprisedAsset from '../../assets/characters/teachers/suprised.png';
import typingAudioUrl from '../../assets/audio/keyboard-typing.wav';
import introAudioUrl from '../../assets/audio/intro.mp3';

export class IntroScene extends Phaser.Scene {
  private dialogues: string[] = [
    "Halo detektif! Ada beberapa masalah lingkungan yang perlu kita selesaikan.",
    "Sampah yang berserakan dapat membuat lingkungan menjadi kotor dan tidak nyaman.",
    "Kamu harus menyelesaikan setiap kasus agar sekolah kembali bersih dan sehat.",
    "Semua petunjuk sudah tersedia di papan investigasi. Ayo pilih kasus pertamamu!"
  ];
  private currentDialogIndex: number = 0;

  private textObj!: Phaser.GameObjects.Text;
  private nextBtn!: Phaser.GameObjects.Text;
  private actionBtn!: Phaser.GameObjects.Container;
  private typewriterEvent: Phaser.Time.TimerEvent | null = null;
  private isTyping: boolean = false;

  private typingSound!: Phaser.Sound.BaseSound;
  private bgMusic!: Phaser.Sound.BaseSound;
  private teacherObj!: Phaser.GameObjects.Image;

  constructor() {
    super('IntroScene');
  }

  preload() {
    this.load.image('intro_bg', introBgAsset);
    this.load.image('teacher_smile', teacherSmileAsset);
    this.load.image('teacher_sad', teacherSadAsset);
    this.load.image('teacher_surprised', teacherSurprisedAsset);
    this.load.audio('typing_sfx', typingAudioUrl);
    this.load.audio('intro_bgm', introAudioUrl);
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

    this.typingSound = this.sound.add('typing_sfx', { loop: true, volume: 1.5 });

    this.bgMusic = this.sound.add('intro_bgm', { loop: true, volume: 3 });
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

    container.add([dialogBg, nameBg, nameText, this.textObj]);

    // Next Button (Hidden initially)
    this.nextBtn = this.add.text(dialogWidth / 2 - 30, dialogHeight / 2 - 20, 'Lanjut ➔', {
      fontFamily: 'monospace',
      fontSize: '26px',
      color: '#4ade80',
      fontStyle: 'bold'
    }).setOrigin(1, 1).setInteractive({ useHandCursor: true }).setVisible(false);

    this.nextBtn.on('pointerdown', () => {
      if (!this.isTyping) {
        this.currentDialogIndex++;
        this.showDialog();
      }
    });

    this.nextBtn.on('pointerover', () => this.nextBtn.setColor('#22c55e'));
    this.nextBtn.on('pointerout', () => this.nextBtn.setColor('#4ade80'));

    container.add(this.nextBtn);

    // Separate Action Button (Styled with Code)
    const btnWidth = 420;
    const btnHeight = 70;
    const btnAbsoluteX = width / 2;
    const btnAbsoluteY = height / 2 - 80; // Positioned in center, nicely above the dialog

    this.actionBtn = this.add.container(btnAbsoluteX, btnAbsoluteY);
    this.actionBtn.setDepth(100); // Pastikan berada di atas overlay dan dialog

    // Shadow (Drop shadow gaming style)
    const shadow = this.add.graphics();
    shadow.fillStyle(0x000000, 0.4);
    shadow.fillRoundedRect(-btnWidth / 2 + 4, -btnHeight / 2 + 6, btnWidth, btnHeight, 20);

    // Main background
    const bg = this.add.graphics();
    bg.fillStyle(0x16a34a, 1);
    bg.fillRoundedRect(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight, 20);

    // Inner stroke for depth
    bg.lineStyle(4, 0xffffff, 0.3);
    bg.strokeRoundedRect(-btnWidth / 2 + 2, -btnHeight / 2 + 2, btnWidth - 4, btnHeight - 4, 18);

    // Outer border
    bg.lineStyle(3, 0x000000, 1);
    bg.strokeRoundedRect(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight, 20);

    // Text
    const btnText = this.add.text(0, 0, 'BUKA PAPAN INVESTIGASI ➔', {
      fontFamily: 'Fredoka One, Arial, sans-serif',
      fontSize: '24px',
      color: '#ffffff',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 4,
      shadow: { offsetX: 2, offsetY: 2, color: '#000000', blur: 0, fill: true }
    }).setOrigin(0.5);

    this.actionBtn.add([shadow, bg, btnText]);
    this.actionBtn.setVisible(false);
    this.actionBtn.setAlpha(0);

    // Make Container Interactive
    const hitArea = new Phaser.Geom.Rectangle(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight);
    this.actionBtn.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);
    this.input.setDefaultCursor('default');

    let targetY = btnAbsoluteY;

    // Hover Effects
    this.actionBtn.on('pointerover', () => {
      this.input.setDefaultCursor('pointer');
      bg.clear();
      bg.fillStyle(0x22c55e, 1); // Lighter green on hover
      bg.fillRoundedRect(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight, 20);
      bg.lineStyle(4, 0xffffff, 0.5);
      bg.strokeRoundedRect(-btnWidth / 2 + 2, -btnHeight / 2 + 2, btnWidth - 4, btnHeight - 4, 18);
      bg.lineStyle(3, 0x000000, 1);
      bg.strokeRoundedRect(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight, 20);
      this.actionBtn.y = targetY - 2;
      shadow.y = 2; // Keep shadow grounded
    });

    this.actionBtn.on('pointerout', () => {
      this.input.setDefaultCursor('default');
      bg.clear();
      bg.fillStyle(0x16a34a, 1);
      bg.fillRoundedRect(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight, 20);
      bg.lineStyle(4, 0xffffff, 0.3);
      bg.strokeRoundedRect(-btnWidth / 2 + 2, -btnHeight / 2 + 2, btnWidth - 4, btnHeight - 4, 18);
      bg.lineStyle(3, 0x000000, 1);
      bg.strokeRoundedRect(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight, 20);
      this.actionBtn.y = targetY;
      shadow.y = 0;
    });

    this.actionBtn.on('pointerdown', () => {
      this.input.setDefaultCursor('default'); // Reset cursor on leave
      this.actionBtn.y = targetY + 4;
      shadow.y = -4;

      setTimeout(() => {
        // Transition to the next scene
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
      }, 150);
    });

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
  }

  private showDialog() {
    if (this.currentDialogIndex >= this.dialogues.length) return;

    const text = this.dialogues[this.currentDialogIndex];
    this.textObj.setText('');
    this.nextBtn.setVisible(false);
    this.actionBtn.setVisible(false);
    this.isTyping = true;

    // Update teacher expression
    if (this.currentDialogIndex === 1) {
      this.teacherObj.setTexture('teacher_sad');
    } else if (this.currentDialogIndex === 2) {
      this.teacherObj.setTexture('teacher_surprised');
    } else {
      this.teacherObj.setTexture('teacher_smile');
    }

    // Scale dynamically to match Case3
    const teacherMaxHeight = this.cameras.main.height * 0.85;
    this.teacherObj.setScale(teacherMaxHeight / this.teacherObj.height);

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
      },
      repeat: text.length - 1
    });

    this.time.delayedCall(text.length * 40, () => {
      this.isTyping = false;
      this.typingSound.stop(); // Stop typing sound when text finishes

      if (this.currentDialogIndex === this.dialogues.length - 1) {
        this.actionBtn.setVisible(true);
        // Fade in button
        this.tweens.add({
          targets: this.actionBtn,
          alpha: 1,
          duration: 300,
          ease: 'Sine.easeOut'
        });
      } else {
        this.nextBtn.setVisible(true);
      }
    });
  }
}
