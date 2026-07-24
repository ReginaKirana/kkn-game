import * as Phaser from 'phaser';

import papanBg from '../../assets/backgrounds/papan-kasus3.png';
import thumbUpTeacher from '../../assets/characters/teachers/thumb-up.png';
import smileTeacher from '../../assets/characters/teachers/smile.png';

export class OutroScene extends Phaser.Scene {
  private teacher!: Phaser.GameObjects.Image;
  private dialogContainer!: Phaser.GameObjects.Container;
  private textObj!: Phaser.GameObjects.Text;
  private typeWriterEvent!: Phaser.Time.TimerEvent;
  
  private currentDialogIndex = 0;
  private isTyping = false;
  private currentTextContent = "";

  private dialogs = [
    {
      text: "Selamat! Kamu berhasil menyelesaikan semua misi sebagai Detektif Sampah.",
      teacherKey: 'teacher_thumbup',
      teacherScale: 1.0
    },
    {
      text: "Hari ini kamu sudah belajar:\n\n🗑️ Membuang sampah pada tempatnya.\n♻️ Memilah sampah sesuai jenisnya.\n💧 Menjaga selokan agar air mengalir lancar.",
      teacherKey: 'teacher_smile',
      teacherScale: 1.0,
      textSize: '24px' // Slightly smaller text for this long bullet point list
    },
    {
      text: "Yuk, mulai biasakan menjaga kebersihan lingkungan setiap hari! 🌱",
      teacherKey: 'teacher_thumbup',
      teacherScale: 1.0
    }
  ];

  constructor() {
    super('OutroScene');
  }

  preload() {
    this.load.image('papan_kasus3', papanBg);
    this.load.image('teacher_thumbup', thumbUpTeacher);
    this.load.image('teacher_smile', smileTeacher);
  }

  create() {
    const { width, height } = this.cameras.main;
    this.currentDialogIndex = 0;

    // Background (Papan Investigasi with all checks)
    const bg = this.add.image(width / 2, height / 2, 'papan_kasus3');
    bg.setScale(Math.max(width / bg.width, height / bg.height));

    // Draw third checkmark (since papan-kasus3.png might only have 2 checkmarks)
    const checkmark = this.add.text(width * 0.72, height * 0.45, '✅', {
      fontSize: '80px',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    checkmark.setAngle(-15);
    // Animate checkmark
    this.tweens.add({
      targets: checkmark,
      scale: { from: 5, to: 1 },
      alpha: { from: 0, to: 1 },
      duration: 800,
      ease: 'Back.easeOut',
      onComplete: () => {
        this.time.delayedCall(1000, () => this.showEndingSequence(width, height));
      }
    });
  }

  private showEndingSequence(width: number, height: number) {
    // Overlay gelap
    const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.7).setOrigin(0, 0);
    overlay.setAlpha(0);

    this.tweens.add({
      targets: overlay,
      alpha: 1,
      duration: 800,
      onComplete: () => {
        // Munculkan Guru
        this.teacher = this.add.image(width * 0.25, height + 200, 'teacher_thumbup').setOrigin(0.5, 1);
        this.teacher.setFlipX(true);

        this.tweens.add({
          targets: this.teacher,
          y: height,
          duration: 600,
          ease: 'Back.easeOut',
          onComplete: () => {
            this.createDialogUI(width, height);
            this.startTyping();
          }
        });
      }
    });
  }

  private createDialogUI(width: number, height: number) {
    this.dialogContainer = this.add.container(width / 2, height - 150);
    
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

    // Animate in
    this.dialogContainer.setAlpha(0);
    this.dialogContainer.y += 50;
    this.tweens.add({
      targets: this.dialogContainer,
      alpha: 1,
      y: '-=50',
      duration: 400,
      ease: 'Power2'
    });
  }

  private startTyping() {
    const dialogData = this.dialogs[this.currentDialogIndex];
    
    this.teacher.setTexture(dialogData.teacherKey);
    const teacherMaxHeight = this.cameras.main.height * 0.85;
    this.teacher.setScale((teacherMaxHeight / this.teacher.height) * (dialogData.teacherScale || 1));

    if (dialogData.textSize) {
      this.textObj.setFontSize(dialogData.textSize);
    } else {
      this.textObj.setFontSize('32px');
    }

    this.isTyping = true;
    this.currentTextContent = dialogData.text;
    this.textObj.text = '';

    let i = 0;
    this.typeWriterEvent = this.time.addEvent({
      delay: 30,
      repeat: this.currentTextContent.length - 1,
      callback: () => {
        this.textObj.text += this.currentTextContent[i];
        i++;
        if (i === this.currentTextContent.length) {
          this.isTyping = false;
        }
      }
    });
  }

  private handleDialogClick() {
    if (this.isTyping) {
      if (this.typeWriterEvent) this.typeWriterEvent.remove();
      this.textObj.text = this.currentTextContent;
      this.isTyping = false;
    } else {
      this.currentDialogIndex++;
      if (this.currentDialogIndex < this.dialogs.length) {
        this.startTyping();
      } else {
        this.showFinalBadge();
      }
    }
  }

  private showFinalBadge() {
    const { width, height } = this.cameras.main;

    // Fade out teacher and dialog
    this.tweens.add({
      targets: [this.teacher, this.dialogContainer],
      alpha: 0,
      duration: 500,
      onComplete: () => {
        
        // Badge UI
        const badgeTitle = this.add.text(width / 2, height / 2 - 150, 'Lencana\nDetektif Sampah Hebat', {
          fontFamily: 'monospace',
          fontSize: '48px',
          color: '#fef08a',
          fontStyle: 'bold',
          align: 'center',
          stroke: '#000000',
          strokeThickness: 6
        }).setOrigin(0.5).setAlpha(0);
        
        const badgeIcon = this.add.text(width / 2, height / 2, '🏆', {
          fontSize: '150px'
        }).setOrigin(0.5).setAlpha(0).setScale(0);

        this.tweens.add({
          targets: badgeIcon,
          alpha: 1,
          scale: 1,
          angle: 360,
          duration: 1000,
          ease: 'Back.easeOut'
        });

        this.tweens.add({
          targets: badgeTitle,
          alpha: 1,
          y: height / 2 - 200,
          duration: 800,
          delay: 500,
          ease: 'Power2',
          onComplete: () => {
            this.createActionButtons(width, height);
          }
        });
      }
    });
  }

  private createActionButtons(width: number, height: number) {
    const startY = height / 2 + 180;
    
    const createBtn = (y: number, text: string, color: number, callback: () => void) => {
      const btn = this.add.container(width / 2, y);
      
      const btnWidth = 350;
      const btnHeight = 70;
      
      const bg = this.add.graphics();
      bg.fillStyle(color, 1);
      bg.fillRoundedRect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight, 35);
      bg.lineStyle(4, 0xffffff, 0.5);
      bg.strokeRoundedRect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight, 35);

      const txt = this.add.text(0, 0, text, {
        fontFamily: 'monospace',
        fontSize: '28px',
        color: '#ffffff',
        fontStyle: 'bold'
      }).setOrigin(0.5);

      btn.add([bg, txt]);
      btn.setAlpha(0);

      const hitArea = new Phaser.Geom.Rectangle(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight);
      btn.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);

      btn.on('pointerover', () => {
        this.input.setDefaultCursor('pointer');
        this.tweens.add({ targets: btn, scale: 1.05, duration: 100 });
      });

      btn.on('pointerout', () => {
        this.input.setDefaultCursor('default');
        this.tweens.add({ targets: btn, scale: 1, duration: 100 });
      });

      btn.on('pointerdown', () => {
        this.input.setDefaultCursor('default');
        callback();
      });

      this.tweens.add({
        targets: btn,
        alpha: 1,
        y: '-=20',
        duration: 500,
        ease: 'Back.easeOut'
      });
    };

    createBtn(startY, '🏠 Kembali ke Beranda', 0x3b82f6, () => {
      this.scene.start('CoverScene');
    });

    createBtn(startY + 100, '🔄 Main Lagi', 0x10b981, () => {
      // Kita langsung arahkan ke Papan Kasus dengan status semua kasus terbuka
      // Jadi pemain bebas mau latihan case 1, 2, atau 3
      this.scene.start('CaseSelectScene', { case2Unlocked: true, case3Unlocked: true });
    });
  }
}
