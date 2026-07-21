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
    
    // Teacher
    this.teacherObj = this.add.image(width * 0.2, height * 0.65, 'teacher_smile');
    this.teacherObj.setFlipX(true);
    
    // Speech Bubble Setup
    const bubbleWidth = width * 0.5;
    const bubbleHeight = 200; // Increased slightly to fit buttons
    const bubbleX = width * 0.33;
    const bubbleY = height * 0.13;

    this.typingSound = this.sound.add('typing_sfx', { loop: true, volume: 1.5 });
    
    this.bgMusic = this.sound.add('intro_bgm', { loop: true, volume: 3 });
    this.bgMusic.play();

    // Stop music if the scene is forcefully shut down (e.g., via debug scene skip)
    this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
      if (this.bgMusic) {
        this.bgMusic.stop();
      }
    });

    this.setupSpeechBubble(bubbleX, bubbleY, bubbleWidth, bubbleHeight);
    
    // Start first dialog
    this.currentDialogIndex = 0;
    this.showDialog();
  }

  private setupSpeechBubble(x: number, y: number, width: number, height: number) {
    const container = this.add.container(x, y);

    const bubble = this.add.graphics({ x: 0, y: 0 });
    const radius = 20;

    bubble.lineStyle(7, 0x000000, 1);
    bubble.fillStyle(0xffffff, 1);
    bubble.beginPath();
    bubble.moveTo(radius, 0);
    bubble.lineTo(width - radius, 0);
    bubble.arc(width - radius, radius, radius, Phaser.Math.DegToRad(270), Phaser.Math.DegToRad(360), false);
    bubble.lineTo(width, height - radius);
    bubble.arc(width - radius, height - radius, radius, Phaser.Math.DegToRad(0), Phaser.Math.DegToRad(90), false);
    
    const tailRightX = width * 0.15;
    const tailTipX = width * 0.1;
    const tailTipY = height + 40;
    const tailLeftX = width * 0.1;

    bubble.lineTo(tailRightX, height);
    bubble.lineTo(tailTipX, tailTipY);
    bubble.lineTo(tailLeftX, height);
    bubble.lineTo(radius, height);
    bubble.arc(radius, height - radius, radius, Phaser.Math.DegToRad(90), Phaser.Math.DegToRad(180), false);
    bubble.lineTo(0, radius);
    bubble.arc(radius, radius, radius, Phaser.Math.DegToRad(180), Phaser.Math.DegToRad(270), false);
    
    bubble.closePath();
    bubble.fillPath();
    bubble.strokePath();

    container.add(bubble);

    const bubblePadding = 20;
    const textStyle = { 
      fontFamily: 'monospace', 
      fontSize: '30px', 
      color: '#000000', 
      align: 'center',
      wordWrap: { width: width - (bubblePadding * 2) }
    };

    this.textObj = this.add.text(
      width / 2, 
      40, 
      '', 
      textStyle
    ).setOrigin(0.5, 0);
    
    container.add(this.textObj);

    // Next Button (Hidden initially)
    this.nextBtn = this.add.text(width - 30, height - 20, 'Next ➜', {
      fontFamily: 'monospace',
      fontSize: '26px',
      color: '#2563eb',
      fontStyle: 'bold'
    }).setOrigin(1, 1).setInteractive({ useHandCursor: true }).setVisible(false);

    this.nextBtn.on('pointerdown', () => {
      if (!this.isTyping) {
        this.currentDialogIndex++;
        this.showDialog();
      }
    });

    this.nextBtn.on('pointerover', () => this.nextBtn.setColor('#1d4ed8'));
    this.nextBtn.on('pointerout', () => this.nextBtn.setColor('#2563eb'));

    container.add(this.nextBtn);

    // Separate Action Button (Styled with Code)
    const btnWidth = 480;
    const btnHeight = 70;
    const btnAbsoluteX = x + width / 2;
    const btnAbsoluteY = y + height + 100; // Positioned below the bubble entirely

    this.actionBtn = this.add.container(btnAbsoluteX, btnAbsoluteY);
    
    // Shadow
    const shadow = this.add.graphics();
    shadow.fillStyle(0x000000, 0.2);
    shadow.fillRoundedRect(-btnWidth/2 + 5, -btnHeight/2 + 5, btnWidth, btnHeight, 35);
    
    // Background
    const bg = this.add.graphics();
    bg.fillStyle(0x16a34a, 1);
    bg.fillRoundedRect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight, 35);
    bg.lineStyle(4, 0xffffff, 1);
    bg.strokeRoundedRect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight, 35);
    
    // Text
    const btnText = this.add.text(0, 0, '🔍 Buka Papan Investigasi', {
      fontFamily: 'monospace',
      fontSize: '28px',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.actionBtn.add([shadow, bg, btnText]);
    this.actionBtn.setVisible(false);
    this.actionBtn.setAlpha(0);

    // Make Container Interactive
    const hitArea = new Phaser.Geom.Rectangle(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight);
    this.actionBtn.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);
    // Use the native cursor manually for container if needed, or rely on input plugin
    this.input.setDefaultCursor('default');
    this.actionBtn.on('pointerover', () => this.input.setDefaultCursor('pointer'));
    this.actionBtn.on('pointerout', () => this.input.setDefaultCursor('default'));

    this.actionBtn.on('pointerdown', () => {
      this.input.setDefaultCursor('default'); // Reset cursor on leave
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
    });

    // Hover Effects
    this.actionBtn.on('pointerover', () => {
      bg.clear();
      bg.fillStyle(0x15803d, 1);
      bg.fillRoundedRect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight, 35);
      bg.lineStyle(4, 0xffffff, 1);
      bg.strokeRoundedRect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight, 35);
      this.actionBtn.y += 2;
      shadow.y -= 2; // Keep shadow in place to simulate pressing
    });
    this.actionBtn.on('pointerout', () => {
      bg.clear();
      bg.fillStyle(0x16a34a, 1);
      bg.fillRoundedRect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight, 35);
      bg.lineStyle(4, 0xffffff, 1);
      bg.strokeRoundedRect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight, 35);
      this.actionBtn.y -= 2;
      shadow.y += 2;
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
      this.teacherObj.setScale(0.85); // Ganti angka 1.0 ini untuk mengatur ukuran ekspresi Sedih (sad)
    } else if (this.currentDialogIndex === 2) {
      this.teacherObj.setTexture('teacher_surprised');
      this.teacherObj.setScale(0.85); // Ganti angka 1.0 ini untuk mengatur ukuran ekspresi Terkejut (surprised)
    } else {
      this.teacherObj.setTexture('teacher_smile');
      this.teacherObj.setScale(1.0); // Ganti angka 1.0 ini untuk mengatur ukuran ekspresi Senyum (smile)
    }

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
