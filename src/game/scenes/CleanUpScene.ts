import * as Phaser from 'phaser';

import case1GameBg from '../../assets/backgrounds/case1-game.png';
import binImg from '../../assets/objects/bin.png';
import appleImg from '../../assets/objects/apple.png';
import botolImg from '../../assets/objects/botol.png';
import daunImg from '../../assets/objects/daun.png';
import gelasImg from '../../assets/objects/gelas.png';
import kalengImg from '../../assets/objects/kaleng.png';
import kertasImg from '../../assets/objects/kertas.png';
import pisangImg from '../../assets/objects/pisang.png';
import plastikImg from '../../assets/objects/plastik.png';
import rantingImg from '../../assets/objects/ranting.png';
import halamanBg from '../../assets/backgrounds/halaman.png';
import teacherThumbUp from '../../assets/characters/teachers/thumb-up.png';

export class CleanUpScene extends Phaser.Scene {
  private caseId!: string;
  private trashItemsRemaining: number = 0;

  constructor() {
    super('CleanUpScene');
  }

  preload() {
    this.load.image('game_bg', case1GameBg);
    this.load.image('bin', binImg);
    this.load.image('apple', appleImg);
    this.load.image('botol', botolImg);
    this.load.image('daun', daunImg);
    this.load.image('gelas', gelasImg);
    this.load.image('kaleng', kalengImg);
    this.load.image('kertas', kertasImg);
    this.load.image('pisang', pisangImg);
    this.load.image('plastik', plastikImg);
    this.load.image('ranting', rantingImg);
    this.load.image('halaman_bersih', halamanBg);
    this.load.image('teacher_thumbup', teacherThumbUp);
  }

  create(data: { caseId: string }) {
    this.caseId = data.caseId || 'kasus_halaman';
    const { width, height } = this.cameras.main;

    // 1. Background
    const bg = this.add.image(width / 2, height / 2, 'game_bg');
    bg.setScale(Math.max(width / bg.width, height / bg.height));

    // 2. Judul Misi
    const instructionBg = this.add.rectangle(width / 2, 60, 600, 70, 0x000000, 0.6);
    instructionBg.setStrokeStyle(4, 0xffffff);
    this.add.text(width / 2, 60, 'Misi: Bersihkan Halaman!', {
      fontSize: '28px',
      color: '#ffffff',
      fontStyle: 'bold',
      fontFamily: 'monospace'
    }).setOrigin(0.5);

    // 3. Tempat Sampah (Drop Zone)
    // diletakan agak ke belakang (y lebih kecil) dan diperkecil
    const bin = this.add.image(width * 0.5, height * 0.35, 'bin');
    bin.setScale(0.55);
    // Tambahkan drop zone pada bin - kembalikan ke ukuran yang lebih realistis (sedikit lebih kecil dari gambar aslinya)
    const dropZone = this.add.zone(bin.x, bin.y, bin.displayWidth * 0.8, bin.displayHeight * 0.8)
      .setRectangleDropZone(bin.displayWidth * 0.8, bin.displayHeight * 0.8);

    // 4. Daftar Sampah
    const trashList = [
      'apple', 'botol', 'daun', 'gelas', 'kaleng', 'kertas', 'pisang', 'plastik', 'ranting'
    ];
    this.trashItemsRemaining = trashList.length;

    // Koordinat sebaran sampah
    const positions = [
      { x: width * 0.2, y: height * 0.8 },
      { x: width * 0.35, y: height * 0.65 },
      { x: width * 0.7, y: height * 0.75 },
      { x: width * 0.8, y: height * 0.6 },
      { x: width * 0.15, y: height * 0.6 },
      { x: width * 0.5, y: height * 0.85 },
      { x: width * 0.85, y: height * 0.85 },
      { x: width * 0.6, y: height * 0.7 },
      { x: width * 0.25, y: height * 0.9 }
    ];

    trashList.forEach((trashKey, index) => {
      const pos = positions[index];
      const trash = this.add.image(pos.x, pos.y, trashKey);
      
      // Skalakan sampah (diperbesar menjadi max 160px)
      const maxDim = 160;
      if (trash.width > maxDim || trash.height > maxDim) {
        trash.setScale(maxDim / Math.max(trash.width, trash.height));
      }
      
      trash.setData('baseScale', trash.scale);
      trash.setData('isDragging', false);

      // Jadikan bisa di-drag dan dideteksi hover
      trash.setInteractive({ draggable: true });
      this.input.setDraggable(trash);

      // --- ANIMASI HOVER ---
      trash.on('pointerover', () => {
        if (!trash.getData('isDragging')) {
          this.input.setDefaultCursor('pointer');
          this.tweens.add({ targets: trash, scale: trash.getData('baseScale') * 1.15, duration: 100 });
        }
      });

      trash.on('pointerout', () => {
        if (!trash.getData('isDragging')) {
          this.input.setDefaultCursor('default');
          this.tweens.add({ targets: trash, scale: trash.getData('baseScale'), duration: 100 });
        }
      });

      // --- EVENT DRAG ---
      trash.on('drag', (pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
        trash.x = dragX;
        trash.y = dragY;
        this.input.setDefaultCursor('grabbing');
      });

      trash.on('dragstart', () => {
        trash.setData('isDragging', true);
        trash.setDepth(10); // Bawa ke atas saat ditarik
        this.tweens.add({ targets: trash, scale: trash.getData('baseScale') * 1.3, duration: 100 });
      });

      trash.on('dragend', () => {
        trash.setData('isDragging', false);
        this.input.setDefaultCursor('default');
        this.tweens.add({ targets: trash, scale: trash.getData('baseScale'), duration: 100 });
        trash.setDepth(0);
      });
    });

    // 5. Logic Drop ke Tempat Sampah
    this.input.on('drop', (pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.Image, dropZone: Phaser.GameObjects.Zone) => {
      gameObject.disableInteractive();
      
      this.tweens.add({
        targets: gameObject,
        x: dropZone.x,
        y: dropZone.y,
        scale: 0,
        alpha: 0,
        duration: 300,
        ease: 'Back.easeIn',
        onComplete: () => {
          gameObject.destroy();
          this.trashItemsRemaining--;
          
          if (this.trashItemsRemaining <= 0) {
            this.finishGame();
          }
        }
      });
    });
  }

  private finishGame() {
    const { width, height } = this.cameras.main;

    // 1. Ganti background menjadi bersih (halaman.png)
    const cleanBg = this.add.image(width / 2, height / 2, 'halaman_bersih');
    cleanBg.setScale(Math.max(width / cleanBg.width, height / cleanBg.height));
    cleanBg.setAlpha(0);
    cleanBg.setDepth(20); // Pastikan di atas layer sampah dsb
    
    // Transisi background
    this.tweens.add({
      targets: cleanBg,
      alpha: 1,
      duration: 1000,
      onComplete: () => {
        // 2. Confetti kecil (menggunakan teks sparkle)
        for (let i = 0; i < 40; i++) {
          const sparkle = this.add.text(Phaser.Math.Between(0, width), Phaser.Math.Between(-100, -10), '✨', { fontSize: '32px' });
          sparkle.setDepth(21);
          this.tweens.add({
            targets: sparkle,
            y: height + 100,
            x: sparkle.x + Phaser.Math.Between(-150, 150),
            rotation: Phaser.Math.Between(-4, 4),
            duration: Phaser.Math.Between(2000, 4500),
            ease: 'Sine.easeInOut'
          });
        }
        
        // Jeda sebentar sebelum guru muncul
        this.time.delayedCall(1500, () => this.showTeacherConclusion(width, height));
      }
    });
  }

  private showTeacherConclusion(width: number, height: number) {
    // 3. Overlay gelap
    const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.6).setOrigin(0, 0);
    overlay.setDepth(30);

    // 4. Guru muncul (thumb-up)
    const teacher = this.add.image(width * 0.25, height, 'teacher_thumbup').setOrigin(0.5, 1);
    const teacherMaxHeight = height * 0.85;
    teacher.setScale(teacherMaxHeight / teacher.height);
    teacher.setFlipX(true);
    teacher.setDepth(31);
    
    teacher.y = height + 300;
    this.tweens.add({
      targets: teacher,
      y: height,
      duration: 600,
      ease: 'Back.easeOut'
    });

    // 5. Kotak Dialog
    const dialogContainer = this.add.container(width / 2, height - 150);
    dialogContainer.setDepth(32);
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

    const dialogTexts = [
      "Hebat, Detektif!\nKamu berhasil menemukan penyebab halaman sekolah menjadi kotor dan membersihkannya.",
      "Ingat ya, membuang sampah pada tempatnya akan membuat lingkungan tetap bersih dan nyaman."
    ];
    let currentDialogIndex = 0;

    const textObj = this.add.text(-dialogWidth/2 + 50, -dialogHeight/2 + 40, '', {
      fontFamily: 'monospace',
      fontSize: '32px',
      color: '#f8fafc',
      wordWrap: { width: dialogWidth - 100 },
      lineSpacing: 10
    });

    let typeWriterEvent: Phaser.Time.TimerEvent;
    let isTyping = false;
    let currentTextContent = "";

    const startTyping = () => {
      textObj.text = "";
      currentTextContent = dialogTexts[currentDialogIndex];
      isTyping = true;
      let charIndex = 0;

      typeWriterEvent = this.time.addEvent({
        delay: 30,
        repeat: currentTextContent.length - 1,
        callback: () => {
          textObj.text += currentTextContent[charIndex];
          charIndex++;
          if (charIndex >= currentTextContent.length) {
            isTyping = false;
          }
        }
      });
    };

    startTyping();

    // Area klik untuk lanjut teks (sebesar kotak dialog)
    const clickArea = this.add.zone(0, 0, dialogWidth, dialogHeight)
      .setRectangleDropZone(dialogWidth, dialogHeight)
      .setInteractive({ useHandCursor: true });
    
    dialogContainer.add([dialogBg, nameBg, nameText, textObj, clickArea]);
    
    dialogContainer.setAlpha(0);
    dialogContainer.y += 50;
    this.tweens.add({
      targets: dialogContainer,
      alpha: 1,
      y: height - 150,
      duration: 500,
      delay: 400,
      ease: 'Power2'
    });

    clickArea.on('pointerdown', () => {
      if (isTyping) {
        // Skip animasi ngetik
        typeWriterEvent.remove();
        textObj.text = currentTextContent;
        isTyping = false;
      } else {
        currentDialogIndex++;
        if (currentDialogIndex < dialogTexts.length) {
          startTyping();
        } else {
          // Dialog habis, munculkan pop up Result
          clickArea.disableInteractive();
          this.tweens.add({
            targets: [dialogContainer, teacher],
            alpha: 0,
            duration: 300,
            onComplete: () => {
              dialogContainer.destroy();
              teacher.destroy();
              this.showFinalResult(width, height);
            }
          });
        }
      }
    });
  }

  private showFinalResult(width: number, height: number) {
    const resultContainer = this.add.container(width / 2, height / 2);
    resultContainer.setDepth(40);

    const bg = this.add.graphics();
    bg.fillStyle(0xffffff, 1);
    bg.fillRoundedRect(-300, -200, 600, 400, 20);
    bg.lineStyle(6, 0x16a34a, 1);
    bg.strokeRoundedRect(-300, -200, 600, 400, 20);

    const title = this.add.text(0, -100, '🏅 Kasus 1 Selesai', {
      fontFamily: 'monospace',
      fontSize: '42px',
      color: '#16a34a',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    const score = this.add.text(0, -10, '⭐ Eco Point +10', {
      fontFamily: 'monospace',
      fontSize: '36px',
      color: '#f59e0b',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Tombol Kembali
    const nextBtnContainer = this.add.container(0, 100);
    const nextBtnBg = this.add.graphics();
    nextBtnBg.fillStyle(0x3b82f6, 1);
    nextBtnBg.fillRoundedRect(-180, -35, 360, 70, 35);
    const nextBtnText = this.add.text(0, 0, 'Kembali ke Papan', {
      fontFamily: 'monospace',
      fontSize: '24px',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    nextBtnContainer.add([nextBtnBg, nextBtnText]);

    const hitArea = new Phaser.Geom.Rectangle(-180, -35, 360, 70);
    nextBtnContainer.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);

    nextBtnContainer.on('pointerdown', () => {
      this.input.setDefaultCursor('default');
      this.scene.start('CaseSelectScene', { unlockCase2: true });
    });
    
    nextBtnContainer.on('pointerover', () => {
      this.input.setDefaultCursor('pointer');
      this.tweens.add({ targets: nextBtnContainer, scale: 1.05, duration: 100 });
    });
    nextBtnContainer.on('pointerout', () => {
      this.input.setDefaultCursor('default');
      this.tweens.add({ targets: nextBtnContainer, scale: 1, duration: 100 });
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
