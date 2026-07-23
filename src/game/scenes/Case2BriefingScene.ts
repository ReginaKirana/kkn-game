import * as Phaser from 'phaser';

import case1GameBg from '../../assets/backgrounds/case1-game.png';
import halamanBg from '../../assets/backgrounds/halaman.png';
import binImg from '../../assets/objects/bin.png';
import thumbUpTeacher from '../../assets/characters/teachers/thumb-up.png';
import surprisedTeacher from '../../assets/characters/teachers/suprised.png';
import thinkingTeacher from '../../assets/characters/teachers/thinking.png';

export class Case2BriefingScene extends Phaser.Scene {
  private bg1!: Phaser.GameObjects.Image;
  private bg2!: Phaser.GameObjects.Image;
  private bin!: Phaser.GameObjects.Image;
  private overlay!: Phaser.GameObjects.Rectangle;
  private teacher!: Phaser.GameObjects.Image;
  private dialogContainer!: Phaser.GameObjects.Container;
  private textObj!: Phaser.GameObjects.Text;
  private typeWriterEvent!: Phaser.Time.TimerEvent;
  
  private currentDialogIndex = 0;
  private isTyping = false;
  private currentTextContent = "";

  private dialogs = [
    {
      text: "Hebat! Halaman sekolah sudah bersih.",
      teacherKey: 'teacher_thumbup',
      teacherScale: 1.0
    },
    {
      text: "Tetapi… semua sampah yang terkumpul masih tercampur.",
      teacherKey: 'teacher_surprised',
      teacherScale: 1.0 // Diperkecil agar tidak kebesaran
    },
    {
      text: "Menurutmu, apakah semua sampah boleh dibuang ke tempat yang sama?",
      teacherKey: 'teacher_thinking',
      teacherScale: 1.0 // Diperkecil agar proporsional
    }
  ];

  constructor() {
    super('Case2BriefingScene');
  }

  preload() {
    this.load.image('brief_case1_bg', case1GameBg);
    this.load.image('brief_halaman_bg', halamanBg);
    this.load.image('brief_bin', binImg);
    this.load.image('teacher_thumbup', thumbUpTeacher);
    this.load.image('teacher_surprised', surprisedTeacher);
    this.load.image('teacher_thinking', thinkingTeacher);
  }

  create() {
    const { width, height } = this.cameras.main;

    // Background 1 (case1-game.png)
    this.bg1 = this.add.image(width / 2, height / 2, 'brief_case1_bg');
    this.bg1.setScale(Math.max(width / this.bg1.width, height / this.bg1.height));

    // Tempat sampah (tetap dipertahankan sepanjang adegan)
    this.bin = this.add.image(width * 0.5, height * 0.45, 'brief_bin');
    this.bin.setScale(0.8);

    // Overlay gelap - hidden initially
    this.overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.6).setOrigin(0, 0);
    this.overlay.setAlpha(0);
    this.overlay.setDepth(10);

    // Teacher
    this.teacher = this.add.image(width * 0.25, height, 'teacher_thumbup').setOrigin(0.5, 1);
    const teacherMaxHeight = height * 0.85;
    this.teacher.setScale(teacherMaxHeight / this.teacher.height);
    this.teacher.setFlipX(true);
    this.teacher.setAlpha(0);
    this.teacher.setDepth(20);

    this.createDialogUI(width, height);

    // Start Sequence
    // "transisi sek janganlangsung overlay, sebentar"
    this.time.delayedCall(1500, () => {
      this.tweens.add({
        targets: this.overlay,
        alpha: 1,
        duration: 800,
        onComplete: () => {
          this.showTeacherAndDialog();
        }
      });
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

    const clickArea = this.add.zone(0, 0, dialogWidth, dialogHeight)
      .setRectangleDropZone(dialogWidth, dialogHeight)
      .setInteractive({ useHandCursor: true });
    
    clickArea.on('pointerdown', () => this.handleDialogClick());

    this.dialogContainer.add([dialogBg, nameBg, nameText, this.textObj, clickArea]);
  }

  private showTeacherAndDialog() {
    this.teacher.y = this.cameras.main.height + 200;
    this.teacher.setAlpha(1);

    this.tweens.add({
      targets: this.teacher,
      y: this.cameras.main.height,
      duration: 600,
      ease: 'Back.easeOut',
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

  private handleDialogClick() {
    if (this.isTyping) {
      // Skip typing
      if (this.typeWriterEvent) this.typeWriterEvent.remove();
      this.textObj.text = this.currentTextContent;
      this.isTyping = false;
    } else {
      // Next dialog
      this.currentDialogIndex++;
      if (this.currentDialogIndex < this.dialogs.length) {
        this.startTyping();
      } else {
        // Finish scene, go to Case 2 gameplay (or investigation)
        // Adjust this depending on what's next in the game flow. For now, go to some next scene.
        // Assuming we go to some interactive scene or show a modal. 
        // We'll leave it routing to InvestigationScene or similar for now.
        // Or if you have a specific scene for Case 2 gameplay. Let's do Case2GameScene?
        // Let's ask user or just route to InvestigationScene with case_sampah.
        this.scene.start('InvestigationScene', { caseId: 'kasus_sampah' });
      }
    }
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

    this.typeWriterEvent = this.time.addEvent({
      delay: 30,
      repeat: this.currentTextContent.length - 1,
      callback: () => {
        this.textObj.text += this.currentTextContent[charIndex];
        charIndex++;
        if (charIndex >= this.currentTextContent.length) {
          this.isTyping = false;
        }
      }
    });
  }
}
