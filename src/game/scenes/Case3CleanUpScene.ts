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

import { Case3TrashConfig } from '../config/Case3TrashConfig';

export class Case3CleanUpScene extends Phaser.Scene {
  private totalTrash: number = 0;
  private trashCleaned: number = 0;

  private teacher!: Phaser.GameObjects.Image;
  private dialogContainer!: Phaser.GameObjects.Container;
  private textObj!: Phaser.GameObjects.Text;
  private typeWriterEvent!: Phaser.Time.TimerEvent;
  private overlay!: Phaser.GameObjects.Rectangle;
  
  private currentDialogIndex = 0;
  private isTyping = false;
  private currentTextContent = "";

  private dialogs = [
    {
      text: "Luar biasa!",
      teacherKey: 'teacher_smile',
      teacherScale: 1.0
    },
    {
      text: "Sekarang selokan kembali bersih.",
      teacherKey: 'teacher_thumbup',
      teacherScale: 1.0
    },
    {
      text: "Ingat ya, jangan membuang sampah ke selokan agar air tetap mengalir dengan baik dan lingkungan tetap bersih.",
      teacherKey: 'teacher_thumbup',
      teacherScale: 1.0
    }
  ];

  constructor() {
    super('Case3CleanUpScene');
  }

  preload() {
    this.load.image('selokan_bg', selokanBg);
    this.load.image('botol', botolImg);
    // Kita gunakan pisang.png sebagai ganti "bungkus snack" karena aset snack.png belum ada
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
    const bg = this.add.image(width / 2, height / 2, 'selokan_bg');
    bg.setScale(Math.max(width / bg.width, height / bg.height));

    // Judul Instruksi
    const instructionText = this.add.text(width / 2, 80, 'Ayo bersihkan selokan!\nKlik pada semua sampah untuk mengambilnya.', {
      fontFamily: 'monospace',
      fontSize: '28px',
      color: '#ffffff',
      fontStyle: 'bold',
      align: 'center',
      backgroundColor: '#00000088',
      padding: { x: 20, y: 15 }
    }).setOrigin(0.5);

    // Animasi pulsing untuk instruksi
    this.tweens.add({
      targets: instructionText,
      scale: 1.05,
      yoyo: true,
      repeat: -1,
      duration: 800,
      ease: 'Sine.easeInOut'
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

      // Pastikan TANPA OVERLAY gelap (tidak ada setTint)
      img.setInteractive({ useHandCursor: true });

      // Efek Hover
      img.on('pointerover', () => {
        this.tweens.add({ targets: img, scale: img.scale * 1.15, duration: 150, ease: 'Back.easeOut' });
      });

      img.on('pointerout', () => {
        this.tweens.add({ targets: img, scale: maxDim / Math.max(img.width, img.height), duration: 150, ease: 'Power2' });
      });

      // Efek Klik (Bersihkan Sampah)
      img.on('pointerdown', () => {
        // Matikan interaksi agar tidak bisa diklik dua kali
        img.disableInteractive();

        // Animasi menghilang (pop & shrink)
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
            this.checkWinCondition(width, height, instructionText);
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

  private checkWinCondition(width: number, height: number, instructionText: Phaser.GameObjects.Text) {
    if (this.trashCleaned >= this.totalTrash) {
      // Semua sampah sudah hilang
      instructionText.destroy(); // Hapus teks instruksi awal

      // Munculkan teks kemenangan
      const winText = this.add.text(width / 2, height / 2, '✨ Selokan Terlihat Bersih! ✨', {
        fontFamily: 'monospace',
        fontSize: '42px',
        color: '#fef08a', // Kuning terang
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
          // Setelah sejenak memamerkan kebersihan, panggil Ibu Guru
          this.time.delayedCall(2000, () => {
            winText.destroy();
            this.showEndingSequence();
          });
        }
      });
    }
  }

  private showEndingSequence() {
    // Munculkan overlay gelap
    this.tweens.add({
      targets: this.overlay,
      alpha: 1,
      duration: 800,
      onComplete: () => {
        // Munculkan Guru
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
        // Tampilkan Eco Point +10
        const ecoPointText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2, '⭐ Eco Point +10', {
          fontFamily: 'monospace',
          fontSize: '64px',
          color: '#fef08a',
          fontStyle: 'bold',
          stroke: '#000000',
          strokeThickness: 8
        }).setOrigin(0.5);
        ecoPointText.setDepth(50);
        ecoPointText.setScale(0);

        this.tweens.add({
          targets: ecoPointText,
          scale: 1.2,
          y: this.cameras.main.height / 2 - 50,
          duration: 600,
          ease: 'Back.easeOut',
          onComplete: () => {
            this.tweens.add({
              targets: ecoPointText,
              scale: 1,
              duration: 300,
              yoyo: true,
              repeat: 1
            });
            this.time.delayedCall(2000, () => {
              // Semua kasus selesai!
              this.scene.start('CaseSelectScene', { case3Unlocked: true });
            });
          }
        });
      }
    }
  }
}
