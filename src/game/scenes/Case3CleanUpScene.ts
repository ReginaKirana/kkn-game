import * as Phaser from 'phaser';

import selokanBg from '../../assets/backgrounds/selokan-tinngi.png';
import selokanTransisi1 from '../../assets/backgrounds/selokan-transisi1.png';
import selokanTransisi3 from '../../assets/backgrounds/selokan-transisi3.png';
import selokanFinal from '../../assets/backgrounds/selokan-final.png';

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

import { Case3TrashConfig } from '../config/Case3TrashConfig';

export class Case3CleanUpScene extends Phaser.Scene {
  private totalTrash: number = 0;
  private trashCleaned: number = 0;

  private teacher!: Phaser.GameObjects.Image;
  private dialogContainer!: Phaser.GameObjects.Container;
  private textObj!: Phaser.GameObjects.Text;
  private typeWriterEvent!: Phaser.Time.TimerEvent;
  private overlay!: Phaser.GameObjects.Rectangle;
  private bg!: Phaser.GameObjects.Image;
  private bannerContainer!: Phaser.GameObjects.Container;
  
  private currentDialogIndex = 0;
  private isTyping = false;
  private currentTextContent = "";

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
    super('Case3CleanUpScene');
  }

  preload() {
    this.load.image('selokan_bg', selokanBg);
    this.load.image('selokan_transisi1', selokanTransisi1);
    this.load.image('selokan_transisi3', selokanTransisi3);
    this.load.image('selokan_final', selokanFinal);
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
  }

  create() {
    const { width, height } = this.cameras.main;
    this.trashCleaned = 0;
    this.currentDialogIndex = 0;

    // Background
    this.bg = this.add.image(width / 2, height / 2, 'selokan_bg');
    this.bg.setScale(Math.max(width / this.bg.width, height / this.bg.height));

    // Judul Instruksi / Banner Premium
    this.bannerContainer = this.add.container(width / 2, 60);
    this.bannerContainer.setDepth(50);
    this.bannerContainer.setAlpha(0);
    
    const instructionBg = this.add.graphics();
    instructionBg.fillStyle(0x0f172a, 0.9); // Slate 900
    instructionBg.fillRoundedRect(-380, -45, 760, 90, 25);
    instructionBg.lineStyle(4, 0x3b82f6, 1); // Blue border
    instructionBg.strokeRoundedRect(-380, -45, 760, 90, 25);

    const instructionTitle = this.add.text(0, -15, 'Misi: Bersihkan Selokan!', {
      fontFamily: 'Fredoka One, Arial, sans-serif',
      fontSize: '28px',
      color: '#facc15',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 4,
      shadow: { offsetX: 2, offsetY: 2, color: '#000000', blur: 0, fill: true }
    }).setOrigin(0.5);

    const instructionSub = this.add.text(0, 15, 'Klik pada semua sampah untuk mengambilnya.', {
      fontFamily: 'Nunito, sans-serif',
      fontSize: '18px',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    this.bannerContainer.add([instructionBg, instructionTitle, instructionSub]);

    // Transisi Intro (Layar Gelap -> Teks Muncul Lembut -> Terang -> Banner Turun)
    const introOverlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.8).setOrigin(0, 0);
    introOverlay.setDepth(100);

    const introText = this.add.text(width / 2, height / 2, 'MISI DIMULAI!', {
      fontFamily: 'Fredoka One, Arial, sans-serif',
      fontSize: '56px',
      color: '#facc15',
      fontStyle: 'bold',
      align: 'center',
      stroke: '#000000',
      strokeThickness: 6,
      shadow: { offsetX: 3, offsetY: 3, color: '#000000', blur: 0, fill: true }
    }).setOrigin(0.5);
    introText.setDepth(101);
    introText.setAlpha(0);

    this.tweens.add({
      targets: introText,
      alpha: 1,
      y: height / 2 - 20,
      duration: 800,
      ease: 'Power2',
      onComplete: () => {
        this.time.delayedCall(800, () => {
          this.tweens.add({
            targets: [introText, introOverlay],
            alpha: 0,
            duration: 600,
            ease: 'Power2',
            onComplete: () => {
              introOverlay.destroy();
              introText.destroy();
              this.bannerContainer.y = -50;
              this.tweens.add({
                targets: this.bannerContainer,
                y: 60,
                alpha: 1,
                duration: 500,
                ease: 'Back.easeOut'
              });
            }
          });
        });
      }
    });

    // Kumpulkan semua sampah (clues + distractors) dari config
    const allTrashData = [...Case3TrashConfig.clues, ...Case3TrashConfig.distractors];
    this.totalTrash = allTrashData.length;

    allTrashData.forEach(itemData => {
      const img = this.add.image(width * itemData.x, height * itemData.y, itemData.asset);
      const maxDim = itemData.maxDim || 150;
      
      if (img.width > maxDim || img.height > maxDim) {
        img.setScale(maxDim / Math.max(img.width, img.height));
      }

      img.setInteractive({ useHandCursor: true });

      img.on('pointerover', () => {
        this.tweens.add({ targets: img, scale: img.scale * 1.15, duration: 150, ease: 'Back.easeOut' });
      });

      img.on('pointerout', () => {
        this.tweens.add({ targets: img, scale: maxDim / Math.max(img.width, img.height), duration: 150, ease: 'Power2' });
      });

      img.on('pointerdown', () => {
        img.disableInteractive();

        this.tweens.add({
          targets: img,
          scale: 0,
          alpha: 0,
          angle: 180,
          duration: 300,
          ease: 'Back.easeIn',
          onComplete: () => {
            img.destroy();
            this.trashCleaned++;
            this.checkWinCondition(width, height);
          }
        });
      });
    });

    // Persiapan UI Guru (Hidden initially)
    this.overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.6).setOrigin(0, 0);
    this.overlay.setAlpha(0);
    this.overlay.setDepth(10);

    this.teacher = this.add.image(width * 0.25, height, 'teacher_smile').setOrigin(0.5, 1);
    const teacherMaxHeight = height * 0.85;
    this.teacher.setScale(teacherMaxHeight / this.teacher.height);
    this.teacher.setFlipX(true);
    this.teacher.setAlpha(0);
    this.teacher.setDepth(20);

    this.createDialogUI(width, height);
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

  private checkWinCondition(width: number, height: number) {
    if (this.trashCleaned >= this.totalTrash) {
      this.tweens.add({
        targets: this.bannerContainer,
        y: -50,
        alpha: 0,
        duration: 300,
        ease: 'Power2'
      });

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

      playNextTransition();
    }
  }

  private showWinText(width: number, height: number) {
    const winText = this.add.text(width / 2, height / 2, '✨ Selokan Terlihat Bersih! ✨', {
      fontFamily: 'monospace',
      fontSize: '42px',
      color: '#fef08a',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 8,
      align: 'center'
    }).setOrigin(0.5);
    winText.setAlpha(0);
    winText.setScale(0.5);

    this.tweens.add({
      targets: winText,
      alpha: 1,
      scale: 1,
      duration: 800,
      ease: 'Elastic.easeOut',
      onComplete: () => {
        this.time.delayedCall(2000, () => {
          winText.destroy();
          this.showEndingSequence();
        });
      }
    });
  }

  private showEndingSequence() {
    this.tweens.add({
      targets: this.overlay,
      alpha: 1,
      duration: 800,
      onComplete: () => {
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
    });
  }

  private startTyping() {
    const dialogData = this.dialogs[this.currentDialogIndex];
    
    this.teacher.setTexture(dialogData.teacherKey);
    const teacherMaxHeight = this.cameras.main.height * 0.85;
    this.teacher.setScale((teacherMaxHeight / this.teacher.height) * (dialogData.teacherScale || 1));

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
      nextBtnContainer.y = nextBtnY + 4;
      shadow.y = -4;
      setTimeout(() => { 
        this.registry.set('ecoPoints', (this.registry.get('ecoPoints') || 0) + 10);
        this.scene.start('OutroScene'); 
      }, 150);
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
