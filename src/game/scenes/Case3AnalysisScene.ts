import * as Phaser from 'phaser';

import selokanBg from '../../assets/backgrounds/selokan-tinngi.png';
import thumbUpTeacher from '../../assets/characters/teachers/thumb-up.png';
import surprisedTeacher from '../../assets/characters/teachers/suprised.png';
import smileTeacher from '../../assets/characters/teachers/smile.png';
import thinkingTeacher from '../../assets/characters/teachers/thinking.png';

export class Case3AnalysisScene extends Phaser.Scene {
  private teacher!: Phaser.GameObjects.Image;
  private dialogContainer!: Phaser.GameObjects.Container;
  private textObj!: Phaser.GameObjects.Text;
  private optionsContainer!: Phaser.GameObjects.Container;
  private typeWriterEvent!: Phaser.Time.TimerEvent;
  
  private currentDialogIndex = 0;
  private isTyping = false;
  private currentTextContent = "";

  private dialogs = [
    {
      text: "Berdasarkan petunjuk yang kamu temukan, mengapa kita tidak boleh membuang sampah ke selokan?",
      teacherKey: 'teacher_thinking',
      teacherScale: 0.85,
      showOptions: true
    },
    {
      text: "Benar sekali!",
      teacherKey: 'teacher_smile',
      teacherScale: 1.0
    },
    {
      text: "Sampah yang dibuang ke selokan dapat menumpuk sehingga menghambat aliran air dan bahkan menyebabkan banjir.",
      teacherKey: 'teacher_thumbup',
      teacherScale: 1.0,
      isEnd: true
    }
  ];

  constructor() {
    super('Case3AnalysisScene');
  }

  preload() {
    this.load.image('selokan_bg', selokanBg);
    this.load.image('teacher_thumbup', thumbUpTeacher);
    this.load.image('teacher_surprised', surprisedTeacher);
    this.load.image('teacher_smile', smileTeacher);
    this.load.image('teacher_thinking', thinkingTeacher);
  }

  create() {
    const { width, height } = this.cameras.main;
    this.currentDialogIndex = 0;

    // Background
    const bg = this.add.image(width / 2, height / 2, 'selokan_bg');
    bg.setScale(Math.max(width / bg.width, height / bg.height));

    // Dark Overlay
    this.add.rectangle(0, 0, width, height, 0x000000, 0.7).setOrigin(0, 0);

    // Teacher Character
    this.teacher = this.add.image(width * 0.25, height, 'teacher_thinking').setOrigin(0.5, 1);
    this.teacher.setFlipX(true);
    
    // Set scale immediately so it doesn't pop up giant
    const teacherMaxHeight = height * 0.85;
    this.teacher.setScale((teacherMaxHeight / this.teacher.height) * (this.dialogs[0].teacherScale || 1));
    
    // Animasi masuk guru dari bawah
    this.teacher.y = height + 300;
    this.tweens.add({
      targets: this.teacher,
      y: height,
      duration: 600,
      ease: 'Back.easeOut',
      onComplete: () => {
        this.dialogContainer.y += 50;
        this.tweens.add({
          targets: this.dialogContainer,
          alpha: 1,
          y: height - 150,
          duration: 400,
          ease: 'Power2',
          onComplete: () => this.startTyping()
        });
      }
    });

    this.createDialogUI(width, height);
    this.createOptionsUI(width, height);
  }

  private createDialogUI(width: number, height: number) {
    this.dialogContainer = this.add.container(width / 2, height - 150);
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

    const clickArea = this.add.zone(0, 0, dialogWidth, dialogHeight)
      .setRectangleDropZone(dialogWidth, dialogHeight)
      .setInteractive({ useHandCursor: true });
    
    clickArea.on('pointerdown', () => this.handleDialogClick());

    this.dialogContainer.add([dialogBg, nameBg, nameText, this.textObj, clickArea]);
  }

  private createOptionsUI(width: number, height: number) {
    this.optionsContainer = this.add.container(width * 0.65, height / 2 - 50);
    this.optionsContainer.setAlpha(0);
    this.optionsContainer.setVisible(false);

    const options = [
      { id: 'A', text: "Agar selokan terlihat penuh.", isCorrect: false },
      { id: 'B', text: "Karena dapat mengganggu aliran air dan mencemari lingkungan.", isCorrect: true },
      { id: 'C', text: "Karena selokan adalah tempat menyimpan sampah.", isCorrect: false }
    ];

    let startY = -100;
    options.forEach((opt, index) => {
      const btnContainer = this.add.container(0, startY + (index * 100));
      
      const btnWidth = 700;
      const btnHeight = 80;
      
      const btnBg = this.add.graphics();
      btnBg.fillStyle(0xffffff, 1);
      btnBg.fillRoundedRect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight, 15);
      btnBg.lineStyle(3, 0x333333, 1);
      btnBg.strokeRoundedRect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight, 15);

      const btnText = this.add.text(0, 0, `${opt.id}. ${opt.text}`, {
        fontFamily: 'monospace',
        fontSize: '20px',
        color: '#1f2937',
        fontStyle: 'bold',
        align: 'center',
        wordWrap: { width: btnWidth - 40 }
      }).setOrigin(0.5);

      btnContainer.add([btnBg, btnText]);

      const hitArea = new Phaser.Geom.Rectangle(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight);
      btnContainer.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);

      btnContainer.on('pointerover', () => {
        this.input.setDefaultCursor('pointer');
        this.tweens.add({ targets: btnContainer, scale: 1.05, duration: 100 });
        btnBg.clear();
        btnBg.fillStyle(0xf3f4f6, 1);
        btnBg.fillRoundedRect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight, 15);
        btnBg.lineStyle(3, 0x333333, 1);
        btnBg.strokeRoundedRect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight, 15);
      });

      btnContainer.on('pointerout', () => {
        this.input.setDefaultCursor('default');
        this.tweens.add({ targets: btnContainer, scale: 1, duration: 100 });
        btnBg.clear();
        btnBg.fillStyle(0xffffff, 1);
        btnBg.fillRoundedRect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight, 15);
        btnBg.lineStyle(3, 0x333333, 1);
        btnBg.strokeRoundedRect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight, 15);
      });

      btnContainer.on('pointerdown', () => {
        this.input.setDefaultCursor('default');
        if (opt.isCorrect) {
          // Benar
          btnBg.clear();
          btnBg.fillStyle(0x22c55e, 1); // Green
          btnBg.fillRoundedRect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight, 15);
          
          this.time.delayedCall(500, () => {
            this.hideOptionsAndNext();
          });
        } else {
          // Salah (Shake effect)
          btnBg.clear();
          btnBg.fillStyle(0xef4444, 1); // Red
          btnBg.fillRoundedRect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight, 15);
          
          this.tweens.add({
            targets: btnContainer,
            x: { from: -10, to: 10 },
            yoyo: true,
            repeat: 3,
            duration: 60,
            onComplete: () => {
              btnContainer.setX(0);
              btnBg.clear();
              btnBg.fillStyle(0xffffff, 1);
              btnBg.fillRoundedRect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight, 15);
              btnBg.lineStyle(3, 0x333333, 1);
              btnBg.strokeRoundedRect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight, 15);
            }
          });
        }
      });

      this.optionsContainer.add(btnContainer);
    });
  }

  private startTyping() {
    const dialogData = this.dialogs[this.currentDialogIndex];
    
    // Update teacher expression and scale
    this.teacher.setTexture(dialogData.teacherKey);
    const teacherMaxHeight = this.cameras.main.height * 0.85;
    this.teacher.setScale((teacherMaxHeight / this.teacher.height) * (dialogData.teacherScale || 1));

    this.textObj.text = "";
    this.currentTextContent = dialogData.text;
    this.isTyping = true;
    let charIndex = 0;

    if (this.typeWriterEvent) this.typeWriterEvent.remove();

    this.typeWriterEvent = this.time.addEvent({
      delay: 30,
      repeat: this.currentTextContent.length - 1,
      callback: () => {
        this.textObj.text += this.currentTextContent[charIndex];
        charIndex++;
        if (charIndex >= this.currentTextContent.length) {
          this.isTyping = false;
          this.onTypingComplete();
        }
      }
    });
  }

  private onTypingComplete() {
    const dialogData = this.dialogs[this.currentDialogIndex];
    if (dialogData.showOptions) {
      this.optionsContainer.setVisible(true);
      this.tweens.add({
        targets: this.optionsContainer,
        alpha: 1,
        y: this.cameras.main.height / 2 - 100,
        duration: 400,
        ease: 'Back.easeOut'
      });
    }
  }

  private handleDialogClick() {
    const dialogData = this.dialogs[this.currentDialogIndex];

    if (this.isTyping) {
      // Skip typing
      if (this.typeWriterEvent) this.typeWriterEvent.remove();
      this.textObj.text = this.currentTextContent;
      this.isTyping = false;
      this.onTypingComplete();
    } else {
      // Ignore click if options are showing
      if (dialogData.showOptions) return;

      if (dialogData.isEnd) {
        // Proceed to next scene for case 3 (Cleanup)
        this.scene.start('Case3CleanUpScene');
      } else {
        this.currentDialogIndex++;
        if (this.currentDialogIndex < this.dialogs.length) {
          this.startTyping();
        }
      }
    }
  }

  private hideOptionsAndNext() {
    this.tweens.add({
      targets: this.optionsContainer,
      alpha: 0,
      duration: 300,
      onComplete: () => {
        this.optionsContainer.setVisible(false);
        this.currentDialogIndex++;
        this.startTyping();
      }
    });
  }
}
