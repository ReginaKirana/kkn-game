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
import halamanKotor2Bg from '../../assets/backgrounds/Halaman-kotor2.png';
import halamanKotor from '../../assets/backgrounds/halaman-kotor.png';
import halamanBg from '../../assets/backgrounds/halaman.png';
import teacherThumbUp from '../../assets/characters/teachers/thumb-up.png';

export class CleanUpScene extends Phaser.Scene {
  private caseId!: string;
  private trashItemsRemaining: number = 0;
  private bannerContainer!: Phaser.GameObjects.Container;

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
    this.load.image('halaman_kotor_bg', halamanKotor);
    this.load.image('halaman_transisi', halamanKotor2Bg);
    this.load.image('halaman_bersih', halamanBg);
    this.load.image('teacher_thumbup', teacherThumbUp);
  }

  create(data: { caseId: string }) {
    this.caseId = data.caseId || 'kasus_halaman';
    const { width, height } = this.cameras.main;

    // 1. Background
    const bg = this.add.image(width / 2, height / 2, 'game_bg');
    bg.setScale(Math.max(width / bg.width, height / bg.height));

    // 2. Judul Misi / Instruksi
    this.bannerContainer = this.add.container(width / 2, 60);
    this.bannerContainer.setDepth(50);
    this.bannerContainer.setAlpha(0); // Sembunyikan awal

    const instructionBg = this.add.graphics();
    instructionBg.fillStyle(0x0f172a, 0.9); // Slate 900
    instructionBg.fillRoundedRect(-350, -45, 700, 90, 25);
    instructionBg.lineStyle(4, 0x3b82f6, 1); // Blue border
    instructionBg.strokeRoundedRect(-350, -45, 700, 90, 25);

    const instructionTitle = this.add.text(0, -15, 'Misi: Bersihkan Halaman!', {
      fontFamily: 'Fredoka One, Arial, sans-serif',
      fontSize: '28px',
      color: '#facc15', // Yellow
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 4,
      shadow: { offsetX: 2, offsetY: 2, color: '#000000', blur: 0, fill: true }
    }).setOrigin(0.5);

    const instructionSub = this.add.text(0, 15, 'Tarik (drag) sampah ke dalam tempat sampah!', {
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
      color: '#facc15', // Kuning (selaras dengan UI premium)
      fontStyle: 'bold',
      align: 'center',
      stroke: '#000000',
      strokeThickness: 6,
      shadow: { offsetX: 3, offsetY: 3, color: '#000000', blur: 0, fill: true }
    }).setOrigin(0.5);
    introText.setDepth(101);
    introText.setAlpha(0);

    // Animasi muncul perlahan (smooth) tanpa zoom yang berlebihan
    this.tweens.add({
      targets: introText,
      alpha: 1,
      y: height / 2 - 20, // Bergerak sedikit ke atas
      duration: 800,
      ease: 'Power2',
      onComplete: () => {
        this.time.delayedCall(800, () => {
          // Fade out teks dan overlay bersamaan (smooth transition)
          this.tweens.add({
            targets: [introText, introOverlay],
            alpha: 0,
            duration: 600,
            ease: 'Power2',
            onComplete: () => {
              introOverlay.destroy();
              introText.destroy();
              
              // Tampilkan banner instruksi dari atas
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

    // 3. Tempat Sampah (Drop Zone)
    const bin = this.add.image(width * 0.5, height * 0.35, 'bin');
    bin.setScale(0.55);
    const dropZone = this.add.zone(bin.x, bin.y, bin.displayWidth * 0.8, bin.displayHeight * 0.8)
      .setRectangleDropZone(bin.displayWidth * 0.8, bin.displayHeight * 0.8);

    // 4. Daftar Sampah
    const trashList = [
      'apple', 'botol', 'daun', 'gelas', 'kaleng', 'kertas', 'pisang', 'plastik', 'ranting'
    ];
    this.trashItemsRemaining = trashList.length;

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
      const maxDim = 160;
      if (trash.width > maxDim || trash.height > maxDim) {
        trash.setScale(maxDim / Math.max(trash.width, trash.height));
      }
      trash.setData('baseScale', trash.scale);
      trash.setData('isDragging', false);
      trash.setInteractive({ draggable: true });
      this.input.setDraggable(trash);

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
      trash.on('drag', (pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
        trash.x = dragX;
        trash.y = dragY;
        this.input.setDefaultCursor('grabbing');
      });
      trash.on('dragstart', () => {
        trash.setData('isDragging', true);
        trash.setDepth(10);
        this.tweens.add({ targets: trash, scale: trash.getData('baseScale') * 1.3, duration: 100 });
      });
      trash.on('dragend', () => {
        trash.setData('isDragging', false);
        this.input.setDefaultCursor('default');
        this.tweens.add({ targets: trash, scale: trash.getData('baseScale'), duration: 100 });
        trash.setDepth(0);
      });
    });

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

    this.tweens.add({
      targets: this.bannerContainer,
      y: -50,
      alpha: 0,
      duration: 300,
      ease: 'Power2'
    });

    const kotorBg = this.add.image(width / 2, height / 2, 'halaman_kotor_bg');
    kotorBg.setScale(Math.max(width / kotorBg.width, height / kotorBg.height));
    kotorBg.setAlpha(0);
    kotorBg.setDepth(19);

    this.tweens.add({
      targets: kotorBg,
      alpha: 1,
      duration: 800,
      onComplete: () => {
        this.time.delayedCall(600, () => {
          const transisiBg = this.add.image(width / 2, height / 2, 'halaman_transisi');
          transisiBg.setScale(Math.max(width / transisiBg.width, height / transisiBg.height));
          transisiBg.setAlpha(0);
          transisiBg.setDepth(20);
          
          this.tweens.add({
            targets: transisiBg,
            alpha: 1,
            duration: 800,
            onComplete: () => {
              this.time.delayedCall(600, () => {
                const cleanBg = this.add.image(width / 2, height / 2, 'halaman_bersih');
                cleanBg.setScale(Math.max(width / cleanBg.width, height / cleanBg.height));
                cleanBg.setAlpha(0);
                cleanBg.setDepth(21);
                
                this.tweens.add({
                  targets: cleanBg,
                  alpha: 1,
                  duration: 800,
                  onComplete: () => {
                    this.time.delayedCall(1500, () => this.showTeacherConclusion(width, height));
                  }
                });
              });
            }
          });
        });
      }
    });
  }

  private showTeacherConclusion(width: number, height: number) {
    const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.6).setOrigin(0, 0);
    overlay.setDepth(30);

    const teacher = this.add.image(width * 0.25, height, 'teacher_thumbup').setOrigin(0.5, 1);
    const teacherMaxHeight = height * 0.85;
    teacher.setScale(teacherMaxHeight / teacher.height);
    teacher.setFlipX(true);
    teacher.setDepth(31);
    teacher.y = height + 300;
    this.tweens.add({ targets: teacher, y: height, duration: 600, ease: 'Back.easeOut' });

    const dialogContainer = this.add.container(width / 2, height - 150);
    dialogContainer.setDepth(32);
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

    const dialogTexts = [
      "Hebat, Detektif! Kamu berhasil menemukan penyebab halaman sekolah menjadi kotor dan membersihkannya.",
      "Ingat ya, membuang sampah pada tempatnya akan membuat lingkungan tetap bersih dan nyaman."
    ];
    let currentDialogIndex = 0;

    const textObj = this.add.text(-dialogWidth / 2 + 50, -dialogHeight / 2 + 40, '', {
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
          if (charIndex >= currentTextContent.length) { isTyping = false; }
        }
      });
    };
    startTyping();

    const clickArea = this.add.zone(0, 0, dialogWidth, dialogHeight)
      .setRectangleDropZone(dialogWidth, dialogHeight)
      .setInteractive({ useHandCursor: true });

    dialogContainer.add([dialogBg, nameBg, nameText, textObj, clickArea]);
    dialogContainer.setAlpha(0);
    dialogContainer.y += 50;
    this.tweens.add({ targets: dialogContainer, alpha: 1, y: height - 150, duration: 500, delay: 400, ease: 'Power2' });

    clickArea.on('pointerdown', () => {
      if (isTyping) {
        typeWriterEvent.remove();
        textObj.text = currentTextContent;
        isTyping = false;
      } else {
        currentDialogIndex++;
        if (currentDialogIndex < dialogTexts.length) { startTyping(); }
        else {
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
    shadow.fillRoundedRect(-btnWidth / 2 + 3, -btnHeight / 2 + 4, btnWidth, btnHeight, 20);

    const nextBtnBg = this.add.graphics();
    nextBtnBg.fillStyle(0x2563eb, 1);
    nextBtnBg.fillRoundedRect(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight, 20);
    nextBtnBg.lineStyle(4, 0xffffff, 0.3);
    nextBtnBg.strokeRoundedRect(-btnWidth / 2 + 2, -btnHeight / 2 + 2, btnWidth - 4, btnHeight - 4, 18);
    nextBtnBg.lineStyle(3, 0x000000, 1);
    nextBtnBg.strokeRoundedRect(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight, 20);

    const nextBtnText = this.add.text(0, 0, 'KEMBALI KE PAPAN', {
      fontFamily: 'Fredoka One, Arial, sans-serif',
      fontSize: '24px',
      color: '#ffffff',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5);

    nextBtnContainer.add([shadow, nextBtnBg, nextBtnText]);
    const hitArea = new Phaser.Geom.Rectangle(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight);
    nextBtnContainer.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);

    let isClicking = false;
    nextBtnContainer.on('pointerover', () => {
      if (isClicking) return;
      this.input.setDefaultCursor('pointer');
      nextBtnBg.clear();
      nextBtnBg.fillStyle(0x3b82f6, 1);
      nextBtnBg.fillRoundedRect(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight, 20);
      nextBtnBg.lineStyle(4, 0xffffff, 0.5);
      nextBtnBg.strokeRoundedRect(-btnWidth / 2 + 2, -btnHeight / 2 + 2, btnWidth - 4, btnHeight - 4, 18);
      nextBtnBg.lineStyle(3, 0x000000, 1);
      nextBtnBg.strokeRoundedRect(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight, 20);
      nextBtnContainer.y = nextBtnY - 2;
      shadow.y = 2;
    });

    nextBtnContainer.on('pointerout', () => {
      if (isClicking) return;
      this.input.setDefaultCursor('default');
      nextBtnBg.clear();
      nextBtnBg.fillStyle(0x2563eb, 1);
      nextBtnBg.fillRoundedRect(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight, 20);
      nextBtnBg.lineStyle(4, 0xffffff, 0.3);
      nextBtnBg.strokeRoundedRect(-btnWidth / 2 + 2, -btnHeight / 2 + 2, btnWidth - 4, btnHeight - 4, 18);
      nextBtnBg.lineStyle(3, 0x000000, 1);
      nextBtnBg.strokeRoundedRect(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight, 20);
      nextBtnContainer.y = nextBtnY;
      shadow.y = 0;
    });

    nextBtnContainer.on('pointerdown', () => {
      if (isClicking) return;
      isClicking = true;
      this.input.setDefaultCursor('default');
      nextBtnContainer.y = nextBtnY + 4;
      shadow.y = -4;
      setTimeout(() => { this.scene.start('CaseSelectScene', { unlockCase2: true }); }, 150);
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
