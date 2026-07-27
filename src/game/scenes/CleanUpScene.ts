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
import { createBackButton } from '../utils/UIUtils';
import halamanKotor from '../../assets/backgrounds/halaman-kotor.png';
import halamanKotor2Bg from '../../assets/backgrounds/Halaman-kotor2.png';
import halamanBg from '../../assets/backgrounds/halaman.png';
import teacherThumbUp from '../../assets/characters/teachers/thumb-up.png';
import boyIdle from '../../assets/characters/boy/boy-idle.png';
import girlIdle from '../../assets/characters/girl/girl-idle.png';

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
    this.load.image('halaman_kotor2_bg', halamanKotor2Bg);
    this.load.image('halaman_bersih', halamanBg);
    this.load.image('teacher_thumbup', teacherThumbUp);
    this.load.image('boy_idle', boyIdle);
    this.load.image('girl_idle', girlIdle);
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
              ease: 'Back.easeOut',
              onComplete: () => {
                // Panggil tutorial setelah banner selesai turun (menggunakan kaleng sebagai contoh)
                this.showTutorial(width, height, bin, trashObjects[3]);
              }
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

    // 4. Daftar Sampah (Hanya sampah buatan/sisa makanan, tanpa daun/ranting)
    const trashList = [
      'apple', 'botol', 'gelas', 'kaleng', 'kertas', 'pisang', 'plastik'
    ];
    this.trashItemsRemaining = trashList.length;

    const positions = [
      { x: width * 0.2, y: height * 0.8 },
      { x: width * 0.35, y: height * 0.65 },
      { x: width * 0.7, y: height * 0.75 },
      { x: width * 0.8, y: height * 0.6 },
      { x: width * 0.15, y: height * 0.6 },
      { x: width * 0.5, y: height * 0.85 },
      { x: width * 0.85, y: height * 0.85 }
    ];

    const trashObjects: Phaser.GameObjects.Image[] = [];

    trashList.forEach((trashKey, index) => {
      const pos = positions[index];
      const trash = this.add.image(pos.x, pos.y, trashKey);
      const maxDim = 160;
      if (trash.width > maxDim || trash.height > maxDim) {
        trash.setScale(maxDim / Math.max(trash.width, trash.height));
      }
      
      // Simpan objek sampah untuk dipakai tutorial
      trashObjects.push(trash);

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

      // Add Eco Points
      let currentEp = this.registry.get('ecoPoints') || 1000;
      this.registry.set('ecoPoints', currentEp + 100);

      // Floating +100 EP text
      const bonusText = this.add.text(gameObject.x, gameObject.y - 40, '+100 EP', { 
        fontSize: '28px', color: '#4ade80', fontStyle: 'bold', stroke: '#000000', strokeThickness: 4 
      }).setOrigin(0.5).setDepth(20);

      this.tweens.add({
        targets: bonusText,
        y: '-=50',
        alpha: 0,
        duration: 1000,
        ease: 'Power2',
        onComplete: () => bonusText.destroy()
      });

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
            this.scene.start('Case1TransitionScene', { caseId: this.caseId });
          }
        }
      });
    });

    createBackButton(this, 70, 70, () => {
      this.scene.start('CaseSelectScene');
    });
  }



  private showTutorial(width: number, height: number, bin: Phaser.GameObjects.Image, targetTrash: Phaser.GameObjects.Image) {
    // 0. Overlay Gelap (supaya fokus ke tutorial)
    const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.6).setOrigin(0, 0);
    overlay.setDepth(140);
    overlay.setAlpha(0);
    overlay.setInteractive(); // Blokir interaksi ke background selama tutorial

    // Bawa bin dan 1 sampah ke atas overlay agar menyala/fokus
    bin.setDepth(141);
    targetTrash.setDepth(141);

    // 1. Munculkan karakter player di KIRI bawah (besar seperti di Briefing)
    const gender = this.registry.get('playerGender') || 'boy';
    const playerAsset = gender === 'boy' ? 'boy_idle' : 'girl_idle';
    const player = this.add.image(width * 0.2, height + 150, playerAsset).setOrigin(0.5, 1);
    const playerMaxHeight = height * 0.97;
    const playerMaxScale = playerMaxHeight / player.height;
    player.setScale(playerMaxScale);
    player.setFlipX(true); // Menghadap kanan
    player.setAlpha(0);
    player.setDepth(150);

    // 2. Kotak Dialog (Style Visual Novel seperti di Briefing Scene)
    const dialogContainer = this.add.container(width / 2, height - 150);
    dialogContainer.setDepth(150);
    dialogContainer.setAlpha(0);

    const dialogWidth = width * 0.8;
    const dialogHeight = 220;

    const dialogBg = this.add.graphics();
    dialogBg.fillStyle(0x0f172a, 0.85); // Slate 900
    dialogBg.fillRoundedRect(-dialogWidth / 2, -dialogHeight / 2, dialogWidth, dialogHeight, 20);
    dialogBg.lineStyle(4, 0x3b82f6, 1); // Blue border
    dialogBg.strokeRoundedRect(-dialogWidth / 2, -dialogHeight / 2, dialogWidth, dialogHeight, 20);

    // Name Tag (Green for player)
    const nameBg = this.add.graphics();
    nameBg.fillStyle(0x16a34a, 1);
    nameBg.fillRoundedRect(-dialogWidth / 2 + 30, -dialogHeight / 2 - 25, 200, 50, 10);
    
    const playerName = this.registry.get('playerName') || 'Detektif';
    const nameText = this.add.text(-dialogWidth / 2 + 130, -dialogHeight / 2, playerName, {
      fontFamily: 'monospace',
      fontSize: '28px',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    const fullText = "Ayo teman-teman, bantu aku membersihkan halaman!\nTarik (drag) sampah ke dalam tempat sampah kuning ya!";
    const dialogText = this.add.text(-dialogWidth / 2 + 50, -dialogHeight / 2 + 40, "", {
      fontFamily: 'monospace',
      fontSize: '32px',
      color: '#f8fafc',
      wordWrap: { width: dialogWidth - 100 },
      lineSpacing: 10
    });

    // Typewriter effect
    let currentTextCharIndex = 0;
    this.time.addEvent({
      delay: 30, // Kecepatan mengetik
      repeat: fullText.length - 1,
      callback: () => {
        dialogText.text += fullText[currentTextCharIndex];
        currentTextCharIndex++;
      }
    });

    dialogContainer.add([dialogBg, nameBg, nameText, dialogText]);

    // 3. Tombol Mulai Misi
    const btnWidth = 240; 
    const btnHeight = 55;
    const nextBtnY = dialogHeight / 2 - 45;
    const nextBtnContainer = this.add.container(dialogWidth / 2 - 150, nextBtnY);

    const shadow = this.add.graphics();
    shadow.fillStyle(0x000000, 0.4);
    shadow.fillRoundedRect(-btnWidth / 2 + 3, -btnHeight / 2 + 4, btnWidth, btnHeight, 15);

    const nextBtnBg = this.add.graphics();
    nextBtnBg.fillStyle(0x22c55e, 1); // Green
    nextBtnBg.fillRoundedRect(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight, 15);
    nextBtnBg.lineStyle(4, 0xffffff, 0.3);
    nextBtnBg.strokeRoundedRect(-btnWidth / 2 + 2, -btnHeight / 2 + 2, btnWidth - 4, btnHeight - 4, 13);
    nextBtnBg.lineStyle(3, 0x000000, 1);
    nextBtnBg.strokeRoundedRect(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight, 15);

    const nextBtnText = this.add.text(0, 0, 'MULAI ➔', {
      fontFamily: 'Fredoka One, Arial, sans-serif',
      fontSize: '24px',
      color: '#ffffff',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 4,
      shadow: { offsetX: 2, offsetY: 2, color: '#000000', blur: 0, fill: true }
    }).setOrigin(0.5);

    nextBtnContainer.add([shadow, nextBtnBg, nextBtnText]);
    nextBtnContainer.setAlpha(0);
    dialogContainer.add(nextBtnContainer);

    // Munculkan tombol setelah teks selesai diketik
    this.time.delayedCall(fullText.length * 30 + 500, () => {
      this.tweens.add({ targets: nextBtnContainer, alpha: 1, duration: 300 });
      
      nextBtnContainer.setInteractive(new Phaser.Geom.Rectangle(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight), Phaser.Geom.Rectangle.Contains);
      
      nextBtnContainer.on('pointerover', () => {
        this.input.setDefaultCursor('pointer');
        nextBtnBg.clear();
        nextBtnBg.fillStyle(0x4ade80, 1); // Lighter green
        nextBtnBg.fillRoundedRect(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight, 15);
        nextBtnBg.lineStyle(4, 0xffffff, 0.5);
        nextBtnBg.strokeRoundedRect(-btnWidth / 2 + 2, -btnHeight / 2 + 2, btnWidth - 4, btnHeight - 4, 13);
        nextBtnBg.lineStyle(3, 0x000000, 1);
        nextBtnBg.strokeRoundedRect(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight, 15);
        nextBtnContainer.y = nextBtnY - 2;
        shadow.y = 2;
      });

      nextBtnContainer.on('pointerout', () => {
        this.input.setDefaultCursor('default');
        nextBtnBg.clear();
        nextBtnBg.fillStyle(0x22c55e, 1);
        nextBtnBg.fillRoundedRect(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight, 15);
        nextBtnBg.lineStyle(4, 0xffffff, 0.3);
        nextBtnBg.strokeRoundedRect(-btnWidth / 2 + 2, -btnHeight / 2 + 2, btnWidth - 4, btnHeight - 4, 13);
        nextBtnBg.lineStyle(3, 0x000000, 1);
        nextBtnBg.strokeRoundedRect(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight, 15);
        nextBtnContainer.y = nextBtnY;
        shadow.y = 0;
      });

      nextBtnContainer.on('pointerdown', () => {
        this.input.setDefaultCursor('default');
        isTutorialActive = false; // Stop cursor loop
        
        // Animasi keluar
        this.tweens.add({
          targets: [overlay, player, dialogContainer, cursor],
          alpha: 0,
          duration: 400,
          onComplete: () => {
            player.destroy();
            dialogContainer.destroy();
            cursor.destroy();
            overlay.destroy();
            bin.setDepth(0);
            targetTrash.setDepth(0);
          }
        });
      });
    });

    // Fade in player & dialog & overlay
    this.tweens.add({ targets: [overlay, player, dialogContainer], alpha: 1, duration: 500 });

    // 4. Animasi Kursor/Touch Gesture
    const cursor = this.add.circle(targetTrash.x, targetTrash.y, 25, 0xffffff, 0.7);
    cursor.setStrokeStyle(4, 0x3b82f6, 1);
    cursor.setDepth(200);
    cursor.setAlpha(0);

    let isTutorialActive = true;

    // Animasi kursor looping tak terbatas sampai tombol ditekan
    const animateCursor = () => {
      if (!isTutorialActive) return;

      // Reset posisi kursor
      cursor.setPosition(targetTrash.x, targetTrash.y);
      cursor.setScale(1);

      this.tweens.add({
        targets: cursor,
        alpha: 1,
        duration: 300,
        onComplete: () => {
          if (!isTutorialActive) return;
          this.tweens.add({
            targets: cursor,
            scale: 0.7,
            duration: 200,
            onComplete: () => {
              if (!isTutorialActive) return;
              this.tweens.add({
                targets: cursor,
                x: bin.x,
                y: bin.y - 50,
                duration: 1200,
                ease: 'Sine.easeInOut',
                onComplete: () => {
                  if (!isTutorialActive) return;
                  this.tweens.add({
                    targets: cursor,
                    alpha: 0,
                    scale: 1,
                    duration: 300,
                    onComplete: () => {
                      if (!isTutorialActive) return;
                      // Jeda sedikit sebelum loop lagi
                      this.time.delayedCall(300, animateCursor);
                    }
                  });
                }
              });
            }
          });
        }
      });
    };

    animateCursor();
  }
}
