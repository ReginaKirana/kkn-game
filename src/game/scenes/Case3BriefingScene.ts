import * as Phaser from 'phaser';

import selokanBg from '../../assets/backgrounds/selokan-tinngi.png';
import botolImg from '../../assets/objects/botol.png';
import pisangImg from '../../assets/objects/pisang.png';
import kalengImg from '../../assets/objects/kaleng.png';
import plastikImg from '../../assets/objects/plastik.png';
import appleImg from '../../assets/objects/apple.png';
import daunImg from '../../assets/objects/daun.png';
import gelasImg from '../../assets/objects/gelas.png';
import kertasImg from '../../assets/objects/kertas.png';
import rantingImg from '../../assets/objects/ranting.png';
import thumbUpTeacher from '../../assets/characters/teachers/thumb-up.png';
import smileTeacher from '../../assets/characters/teachers/smile.png';
import surprisedTeacher from '../../assets/characters/teachers/suprised.png';
import thinkingTeacher from '../../assets/characters/teachers/thinking.png';
import boyIdle from '../../assets/characters/boy/boy-idle.png';
import girlIdle from '../../assets/characters/girl/girl-idle.png';

import { Case3TrashConfig } from '../config/Case3TrashConfig';

export class Case3BriefingScene extends Phaser.Scene {
  private bg!: Phaser.GameObjects.Image;
  private overlay!: Phaser.GameObjects.Rectangle;
  private teacher!: Phaser.GameObjects.Image;
  private player!: Phaser.GameObjects.Image;
  private dialogContainer!: Phaser.GameObjects.Container;
  private textObj!: Phaser.GameObjects.Text;
  private typeWriterEvent!: Phaser.Time.TimerEvent;
  private nextBtnContainer!: Phaser.GameObjects.Container;
  private nextBtnText!: Phaser.GameObjects.Text;
  
  private currentDialogIndex = 0;
  private isTyping = false;
  private isClicking = false;
  
  private teacherMaxScale = 1;
  private playerMaxScale = 1;

  constructor() {
    super('Case3BriefingScene');
  }

  preload() {
    this.load.image('selokan_bg', selokanBg);
    this.load.image('botol', botolImg);
    this.load.image('pisang', pisangImg);
    this.load.image('kaleng', kalengImg);
    this.load.image('plastik', plastikImg);
    this.load.image('apple', appleImg);
    this.load.image('daun', daunImg);
    this.load.image('gelas', gelasImg);
    this.load.image('kertas', kertasImg);
    this.load.image('ranting', rantingImg);
    
    this.load.image('teacher_thumbup', thumbUpTeacher);
    this.load.image('teacher_smile', smileTeacher);
    this.load.image('teacher_surprised', surprisedTeacher);
    this.load.image('teacher_thinking', thinkingTeacher);
    this.load.image('boy_idle', boyIdle);
    this.load.image('girl_idle', girlIdle);
  }

  create() {
    const { width, height } = this.cameras.main;
    this.currentDialogIndex = 0;

    // Background (selokan-tinngi.png)
    this.bg = this.add.image(width / 2, height / 2, 'selokan_bg');
    this.bg.setScale(Math.max(width / this.bg.width, height / this.bg.height));

    // Render Sampah di background agar terlihat saat briefing
    Case3TrashConfig.distractors.forEach(d => {
      const img = this.add.image(width * d.x, height * d.y, d.asset);
      const maxDim = d.maxDim || 120;
      img.setScale(maxDim / Math.max(img.width, img.height));
      img.setTint(0x4a4a4a); // Di-overlay gelap
    });

    Case3TrashConfig.clues.forEach(c => {
      const img = this.add.image(width * c.x, height * c.y, c.asset);
      const maxDim = c.maxDim || 150;
      if (img.width > maxDim || img.height > maxDim) {
        img.setScale(maxDim / Math.max(img.width, img.height));
      }
      // Clue tidak digelapkan agar menonjol
    });

    // Overlay gelap - hidden initially
    this.overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.6).setOrigin(0, 0);
    this.overlay.setAlpha(0);
    this.overlay.setDepth(10);

    // Teacher
    this.teacher = this.add.image(width * 0.2, height, 'teacher_thumbup').setOrigin(0.5, 1);
    const teacherMaxHeight = height * 0.85;
    this.teacherMaxScale = teacherMaxHeight / this.teacher.height;
    this.teacher.setScale(this.teacherMaxScale);
    this.teacher.setFlipX(true);
    this.teacher.setAlpha(0);
    this.teacher.setDepth(20);
    this.teacher.y = height + 300;

    // Player
    const gender = this.registry.get('playerGender') || 'boy';
    const playerAsset = gender === 'boy' ? 'boy_idle' : 'girl_idle';
    this.player = this.add.image(width * 0.8, height, playerAsset).setOrigin(0.5, 1);
    const playerMaxHeight = height * 0.9;
    this.playerMaxScale = playerMaxHeight / this.player.height;
    this.player.setScale(this.playerMaxScale);
    this.player.setFlipX(false);
    this.player.setAlpha(0);
    this.player.setDepth(20);
    this.player.y = height + 300;

    this.createDialogUI(width, height);

    // Start Sequence
    this.time.delayedCall(3500, () => {
      this.tweens.add({
        targets: this.overlay,
        alpha: 1,
        duration: 800,
        onComplete: () => {
          this.showCharactersAndDialog();
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
    dialogBg.fillStyle(0x0f172a, 0.85); // Slate 900
    dialogBg.fillRoundedRect(-dialogWidth/2, -dialogHeight/2, dialogWidth, dialogHeight, 20);
    dialogBg.lineStyle(4, 0x3b82f6, 1); // Blue border
    dialogBg.strokeRoundedRect(-dialogWidth/2, -dialogHeight/2, dialogWidth, dialogHeight, 20);

    const nameBg = this.add.graphics();
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

    const playerName = this.registry.get('playerName') || 'Detektif';

    const dialogues = [
      {
        speaker: 'Ibu Guru',
        text: "Hebat! Kamu sudah berhasil menyelesaikan dua misi sebelumnya.",
        color: 0x3b82f6, // Blue
        teacherKey: 'teacher_thumbup',
        teacherScale: 1.0
      },
      {
        speaker: playerName,
        text: "Berarti tugas kita sudah selesai ya, Bu?",
        color: 0x16a34a, // Green
        teacherKey: 'teacher_smile',
        teacherScale: 1.0
      },
      {
        speaker: 'Ibu Guru',
        text: "Belum, masih ada satu misi terakhir. Coba lihat selokan di samping sekolah itu.",
        color: 0x3b82f6,
        teacherKey: 'teacher_surprised',
        teacherScale: 1.0
      },
      {
        speaker: playerName,
        text: "Wah, ada banyak sampah yang menyumbat aliran airnya!",
        color: 0x16a34a,
        teacherKey: 'teacher_surprised',
        teacherScale: 1.0
      },
      {
        speaker: 'Ibu Guru',
        text: "Tepat sekali. Yuk, kita cari tahu mengapa membuang sampah di selokan sangat berbahaya!",
        color: 0x3b82f6,
        teacherKey: 'teacher_thinking',
        teacherScale: 1.0
      }
    ];

    // Tombol Lanjut (Gaming Style)
    const btnWidth = 240; 
    const btnHeight = 55;
    const nextBtnY = dialogHeight/2 - 45;
    this.nextBtnContainer = this.add.container(dialogWidth/2 - 150, nextBtnY);

    const shadow = this.add.graphics();
    shadow.fillStyle(0x000000, 0.4);
    shadow.fillRoundedRect(-btnWidth/2 + 3, -btnHeight/2 + 4, btnWidth, btnHeight, 15);

    const nextBtnBg = this.add.graphics();
    nextBtnBg.fillStyle(0x16a34a, 1);
    nextBtnBg.fillRoundedRect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight, 15);
    nextBtnBg.lineStyle(4, 0xffffff, 0.3);
    nextBtnBg.strokeRoundedRect(-btnWidth/2 + 2, -btnHeight/2 + 2, btnWidth - 4, btnHeight - 4, 13);
    nextBtnBg.lineStyle(3, 0x000000, 1);
    nextBtnBg.strokeRoundedRect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight, 15);

    this.nextBtnText = this.add.text(0, 0, 'LANJUT ➔', {
      fontFamily: 'Fredoka One, Arial, sans-serif',
      fontSize: '20px',
      color: '#ffffff',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 3,
      shadow: { offsetX: 2, offsetY: 2, color: '#000000', blur: 0, fill: true }
    }).setOrigin(0.5);

    this.nextBtnContainer.add([shadow, nextBtnBg, this.nextBtnText]);
    this.nextBtnContainer.setAlpha(0);

    this.nextBtnContainer.on('pointerover', () => {
      if (this.isClicking) return;
      this.input.setDefaultCursor('pointer');
      nextBtnBg.clear();
      nextBtnBg.fillStyle(0x22c55e, 1);
      nextBtnBg.fillRoundedRect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight, 15);
      nextBtnBg.lineStyle(4, 0xffffff, 0.5);
      nextBtnBg.strokeRoundedRect(-btnWidth/2 + 2, -btnHeight/2 + 2, btnWidth - 4, btnHeight - 4, 13);
      nextBtnBg.lineStyle(3, 0x000000, 1);
      nextBtnBg.strokeRoundedRect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight, 15);
      this.nextBtnContainer.y = nextBtnY - 2;
      shadow.y = 2;
    });

    this.nextBtnContainer.on('pointerout', () => {
      if (this.isClicking) return;
      this.input.setDefaultCursor('default');
      nextBtnBg.clear();
      nextBtnBg.fillStyle(0x16a34a, 1);
      nextBtnBg.fillRoundedRect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight, 15);
      nextBtnBg.lineStyle(4, 0xffffff, 0.3);
      nextBtnBg.strokeRoundedRect(-btnWidth/2 + 2, -btnHeight/2 + 2, btnWidth - 4, btnHeight - 4, 13);
      nextBtnBg.lineStyle(3, 0x000000, 1);
      nextBtnBg.strokeRoundedRect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight, 15);
      this.nextBtnContainer.y = nextBtnY;
      shadow.y = 0;
    });

    this.nextBtnContainer.on('pointerdown', () => {
      this.input.setDefaultCursor('default');
      if (this.isTyping) {
        if (this.typeWriterEvent) this.typeWriterEvent.remove();
        this.textObj.text = dialogues[this.currentDialogIndex].text;
        this.isTyping = false;
      } else {
        if (this.currentDialogIndex < dialogues.length - 1) {
          this.currentDialogIndex++;
          this.startTyping(dialogues, dialogWidth, dialogHeight, nameBg, nameText);
          if (this.currentDialogIndex === dialogues.length - 1) {
            this.nextBtnText.text = 'INVESTIGASI ➔';
          }
        } else {
          if (this.isClicking) return;
          this.isClicking = true;
          this.nextBtnContainer.y = nextBtnY + 4;
          shadow.y = -4;
          setTimeout(() => {
            this.scene.start('InvestigationScene', { caseId: 'kasus_selokan' });
          }, 150);
        }
      }
    });

    this.dialogContainer.add([dialogBg, nameBg, nameText, this.textObj, this.nextBtnContainer]);

    // Setup startTyping closure
    this.startTyping = (dialoguesArr: any[], dWidth: number, dHeight: number, nBg: Phaser.GameObjects.Graphics, nText: Phaser.GameObjects.Text) => {
      this.isTyping = true;
      this.textObj.text = '';
      const currentDialog = dialoguesArr[this.currentDialogIndex];
      const isTeacher = currentDialog.speaker === 'Ibu Guru';

      // Update teacher texture
      this.teacher.setTexture(currentDialog.teacherKey);

      nText.text = currentDialog.speaker;
      nBg.clear();
      nBg.fillStyle(currentDialog.color, 1);

      if (isTeacher) {
        nBg.fillRoundedRect(-dWidth/2 + 30, -dHeight/2 - 25, 200, 50, 10);
        nText.x = -dWidth/2 + 130;
        this.tweens.add({ targets: this.teacher, scale: this.teacherMaxScale * currentDialog.teacherScale, alpha: 1, duration: 300 });
        this.tweens.add({ targets: this.player, scale: this.playerMaxScale * 0.9, alpha: 0.6, duration: 300 });
      } else {
        nBg.fillRoundedRect(dWidth/2 - 230, -dHeight/2 - 25, 200, 50, 10);
        nText.x = dWidth/2 - 130;
        this.tweens.add({ targets: this.player, scale: this.playerMaxScale, alpha: 1, duration: 300 });
        this.tweens.add({ targets: this.teacher, scale: this.teacherMaxScale * 0.9, alpha: 0.6, duration: 300 });
      }

      let charIndex = 0;
      this.typeWriterEvent = this.time.addEvent({
        delay: 30,
        repeat: currentDialog.text.length - 1,
        callback: () => {
          this.textObj.text += currentDialog.text[charIndex];
          charIndex++;
          if (charIndex === currentDialog.text.length) {
            this.isTyping = false;
          }
        }
      });
    };

    // Stash dialogues for startTyping closure
    this.registry.set('c3b_dialogues', dialogues);
    this.registry.set('c3b_dWidth', dialogWidth);
    this.registry.set('c3b_dHeight', dialogHeight);
    this.registry.set('c3b_nBg', nameBg);
    this.registry.set('c3b_nText', nameText);
  }

  // To be overwritten by the closure above
  private startTyping: any;

  private showCharactersAndDialog() {
    this.tweens.add({
      targets: this.teacher,
      y: this.cameras.main.height,
      duration: 600,
      ease: 'Back.easeOut'
    });

    this.tweens.add({
      targets: this.player,
      y: this.cameras.main.height,
      duration: 600,
      delay: 200,
      ease: 'Back.easeOut',
      onComplete: () => {
        this.dialogContainer.y += 50;
        this.tweens.add({
          targets: this.dialogContainer,
          alpha: 1,
          y: this.cameras.main.height - 150,
          duration: 400,
          ease: 'Power2',
          onComplete: () => {
            const dialogues = this.registry.get('c3b_dialogues');
            const dWidth = this.registry.get('c3b_dWidth');
            const dHeight = this.registry.get('c3b_dHeight');
            const nBg = this.registry.get('c3b_nBg');
            const nText = this.registry.get('c3b_nText');
            this.startTyping(dialogues, dWidth, dHeight, nBg, nText);
            
            // Show next btn
            this.time.delayedCall(dialogues[0].text.length * 30 + 500, () => {
              this.tweens.add({ targets: this.nextBtnContainer, alpha: 1, duration: 300 });
              const hitArea = new Phaser.Geom.Rectangle(-120, -27.5, 240, 55);
              this.nextBtnContainer.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);
            });
          }
        });
      }
    });
  }
}
