import * as Phaser from 'phaser';

import case1GameBg from '../../assets/backgrounds/case1-game.png';
import organikBin from '../../assets/objects/organik.png';
import anorganikBin from '../../assets/objects/anorganik.png';
import appleImg from '../../assets/objects/apple.png';
import botolImg from '../../assets/objects/botol.png';
import daunImg from '../../assets/objects/daun.png';
import kalengImg from '../../assets/objects/kaleng.png';
import kertasImg from '../../assets/objects/kertas.png';
import pisangImg from '../../assets/objects/pisang.png';
import teacherThumbUp from '../../assets/characters/teachers/thumb-up.png';

export class Case2SortScene extends Phaser.Scene {
  private trashItemsRemaining: number = 0;
  private bannerContainer!: Phaser.GameObjects.Container;

  constructor() {
    super('Case2SortScene');
  }

  preload() {
    this.load.image('game_bg', case1GameBg);
    this.load.image('bin_organik', organikBin);
    this.load.image('bin_anorganik', anorganikBin);
    this.load.image('apple', appleImg);
    this.load.image('botol', botolImg);
    this.load.image('daun', daunImg);
    this.load.image('kaleng', kalengImg);
    this.load.image('kertas', kertasImg);
    this.load.image('pisang', pisangImg);
    this.load.image('teacher_thumbup', teacherThumbUp);
  }

  create() {
    const { width, height } = this.cameras.main;
    let binOrganik: Phaser.GameObjects.Image;
    const createdTrash: Phaser.GameObjects.Image[] = [];

    // 1. Background
    const bg = this.add.image(width / 2, height / 2, 'game_bg');
    bg.setScale(Math.max(width / bg.width, height / bg.height));

    // 2. Judul Misi / Instruksi
    this.bannerContainer = this.add.container(width / 2, 60);
    this.bannerContainer.setDepth(50);
    this.bannerContainer.setAlpha(0);
    
    const instructionBg = this.add.graphics();
    instructionBg.fillStyle(0x0f172a, 0.9); // Slate 900
    instructionBg.fillRoundedRect(-380, -45, 760, 90, 25);
    instructionBg.lineStyle(4, 0x3b82f6, 1); // Blue border
    instructionBg.strokeRoundedRect(-380, -45, 760, 90, 25);

    const instructionTitle = this.add.text(0, -15, 'Misi: Pilah Sampah Organik & Anorganik!', {
      fontFamily: 'Fredoka One, Arial, sans-serif',
      fontSize: '28px',
      color: '#facc15',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 4,
      shadow: { offsetX: 2, offsetY: 2, color: '#000000', blur: 0, fill: true }
    }).setOrigin(0.5);

    const instructionSub = this.add.text(0, 15, 'Tarik (drag) sampah ke tong yang sesuai!', {
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
      color: '#facc15', // Kuning
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
              this.bannerContainer.y = -50;
              this.tweens.add({
                targets: this.bannerContainer,
                y: 60,
                alpha: 1,
                duration: 500,
                ease: 'Back.easeOut',
                onComplete: () => {
                  if (createdTrash.length > 2) {
                    this.showTutorial(width, height, binOrganik, createdTrash[2]);
                  }
                }
              });
            }
          });
        });
      }
    });

    // 3. Tempat Sampah (Drop Zones)
    binOrganik = this.add.image(width * 0.3, height * 0.4, 'bin_organik');
    binOrganik.setScale(0.7);
    const dropZoneOrganik = this.add.zone(binOrganik.x, binOrganik.y, binOrganik.displayWidth * 0.8, binOrganik.displayHeight * 0.8)
      .setRectangleDropZone(binOrganik.displayWidth * 0.8, binOrganik.displayHeight * 0.8);
    dropZoneOrganik.setData('type', 'organik');

    const binAnorganik = this.add.image(width * 0.7, height * 0.4, 'bin_anorganik');
    binAnorganik.setScale(0.7);
    const dropZoneAnorganik = this.add.zone(binAnorganik.x, binAnorganik.y, binAnorganik.displayWidth * 0.8, binAnorganik.displayHeight * 0.8)
      .setRectangleDropZone(binAnorganik.displayWidth * 0.8, binAnorganik.displayHeight * 0.8);
    dropZoneAnorganik.setData('type', 'anorganik');

    // 4. Daftar Sampah
    const trashItems = [
      { key: 'apple', type: 'organik' },
      { key: 'daun', type: 'organik' },
      { key: 'pisang', type: 'organik' },
      { key: 'botol', type: 'anorganik' },
      { key: 'kaleng', type: 'anorganik' },
      { key: 'kertas', type: 'anorganik' }
    ];
    this.trashItemsRemaining = trashItems.length;

    // Koordinat sebaran sampah
    const positions = [
      { x: width * 0.2, y: height * 0.7 },
      { x: width * 0.35, y: height * 0.85 },
      { x: width * 0.5, y: height * 0.65 },
      { x: width * 0.65, y: height * 0.85 },
      { x: width * 0.8, y: height * 0.7 },
      { x: width * 0.5, y: height * 0.85 }
    ];

    trashItems.forEach((item, index) => {
      const pos = positions[index];
      const trash = this.add.image(pos.x, pos.y, item.key);
      createdTrash.push(trash);
      
      const maxDim = 160;
      if (trash.width > maxDim || trash.height > maxDim) {
        trash.setScale(maxDim / Math.max(trash.width, trash.height));
      }
      
      trash.setData('baseScale', trash.scale);
      trash.setData('isDragging', false);
      trash.setData('type', item.type);
      trash.setData('startX', pos.x);
      trash.setData('startY', pos.y);

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
      const itemType = gameObject.getData('type');
      const zoneType = dropZone.getData('type');

      if (itemType === zoneType) {
        // BENAR
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
              this.showEndingSequence();
            }
          }
        });
      } else {
        // SALAH
        gameObject.setTint(0xff5555);
        const xMark = this.add.text(gameObject.x, gameObject.y - 50, '❌', { fontSize: '64px' }).setOrigin(0.5);
        xMark.setDepth(20);
        
        // Deduct Eco Points (Penalty)
        let currentEp = this.registry.get('ecoPoints') || 100;
        currentEp = Math.max(0, currentEp - 10);
        this.registry.set('ecoPoints', currentEp);

        // Show floating penalty text
        const penaltyText = this.add.text(gameObject.x, gameObject.y - 100, '-10 EP', { 
          fontSize: '32px', color: '#ef4444', fontStyle: 'bold', stroke: '#000000', strokeThickness: 4 
        }).setOrigin(0.5).setDepth(20);

        this.tweens.add({
          targets: [xMark, penaltyText],
          y: '-=30',
          alpha: 0,
          duration: 1200,
          ease: 'Power2',
          onComplete: () => {
            xMark.destroy();
            penaltyText.destroy();
          }
        });

        this.tweens.add({
          targets: gameObject,
          x: { value: gameObject.x + (Math.random() > 0.5 ? 20 : -20), yoyo: true, repeat: 2, duration: 50 },
          onComplete: () => {
            this.tweens.add({
              targets: gameObject,
              x: gameObject.getData('startX'),
              y: gameObject.getData('startY'),
              duration: 400,
              ease: 'Bounce.easeOut',
              onComplete: () => {
                gameObject.clearTint();
              }
            });
          }
        });
      }
    });

    this.input.on('dragend', (pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.Image, dropped: boolean) => {
      if (!dropped) {
        this.tweens.add({
          targets: gameObject,
          x: gameObject.getData('startX'),
          y: gameObject.getData('startY'),
          duration: 300,
          ease: 'Power2'
        });
      }
    });
  }

  private showEndingSequence() {
    const { width, height } = this.cameras.main;

    this.tweens.add({
      targets: this.bannerContainer,
      y: -50,
      alpha: 0,
      duration: 300,
      ease: 'Power2'
    });

    const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.6).setOrigin(0, 0);
    overlay.setDepth(30);

    const teacher = this.add.image(width * 0.25, height, 'teacher_thumbup').setOrigin(0.5, 1);
    teacher.setFlipX(true);
    const teacherMaxHeight = height * 0.85;
    teacher.setScale(teacherMaxHeight / teacher.height);
    teacher.setDepth(31);
    
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

    const textObj = this.add.text(-dialogWidth/2 + 50, -dialogHeight/2 + 40, '', {
      fontFamily: 'monospace',
      fontSize: '32px',
      color: '#f8fafc',
      wordWrap: { width: dialogWidth - 100 },
      lineSpacing: 10
    });

    const clickArea = this.add.zone(0, 0, dialogWidth, dialogHeight)
      .setRectangleDropZone(dialogWidth, dialogHeight)
      .setInteractive({ useHandCursor: true });
    
    dialogContainer.add([dialogBg, nameBg, nameText, textObj, clickArea]);
    dialogContainer.setAlpha(0);
    dialogContainer.y += 50;

    teacher.y = height + 300;
    this.tweens.add({
      targets: teacher,
      y: height,
      duration: 600,
      ease: 'Back.easeOut',
      onComplete: () => {
        this.tweens.add({
          targets: dialogContainer,
          alpha: 1,
          y: height - 150,
          duration: 400,
          ease: 'Power2',
          onComplete: () => {
            const content = "Hebat! Sekarang sampah sudah dipilah dengan benar.";
            let i = 0;
            let isTyping = true;
            let typeWriterEvent = this.time.addEvent({
              delay: 30,
              repeat: content.length - 1,
              callback: () => {
                textObj.text += content[i];
                i++;
                if (i >= content.length) {
                  isTyping = false;
                }
              }
            });

            clickArea.on('pointerdown', () => {
              if (isTyping) {
                typeWriterEvent.remove();
                textObj.text = content;
                isTyping = false;
              } else {
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
            });
          }
        });
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
        this.scene.start('CaseSelectScene', { unlockCase3: true }); 
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

  private showTutorial(width: number, height: number, bin: Phaser.GameObjects.Image, targetTrash: Phaser.GameObjects.Image) {
    const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.7).setOrigin(0, 0);
    overlay.setDepth(140);
    overlay.setAlpha(0);
    overlay.setInteractive(); // Blokir interaksi game selama tutorial

    // Bawa bin dan 1 sampah ke atas overlay agar menyala/fokus
    bin.setDepth(141);
    targetTrash.setDepth(141);

    // 1. Munculkan karakter player di KIRI bawah
    const gender = this.registry.get('playerGender') || 'boy';
    const playerAsset = gender === 'boy' ? 'boy_idle' : 'girl_idle';
    const player = this.add.image(width * 0.2, height + 150, playerAsset).setOrigin(0.5, 1);
    const playerMaxHeight = height * 0.97;
    const playerMaxScale = playerMaxHeight / player.height;
    player.setScale(playerMaxScale);
    player.setFlipX(true);
    player.setAlpha(0);
    player.setDepth(150);

    // 2. Kotak Dialog
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

    // Name Tag
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

    const fullText = "Ayo kita mulai memilah sampahnya!\nTarik sampah Organik (sisa makanan/daun) ke tong HIJAU,\ndan Anorganik (plastik/kaleng) ke tong KUNING!";
    const dialogText = this.add.text(-dialogWidth / 2 + 50, -dialogHeight / 2 + 40, "", {
      fontFamily: 'monospace',
      fontSize: '32px',
      color: '#f8fafc',
      wordWrap: { width: dialogWidth - 100 },
      lineSpacing: 10
    });

    let currentTextCharIndex = 0;
    this.time.addEvent({
      delay: 30,
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
    nextBtnBg.fillStyle(0x22c55e, 1);
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

    this.time.delayedCall(fullText.length * 30 + 500, () => {
      this.tweens.add({ targets: nextBtnContainer, alpha: 1, duration: 300 });
      const hitArea = new Phaser.Geom.Rectangle(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight);
      nextBtnContainer.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);
      
      nextBtnContainer.on('pointerover', () => {
        this.input.setDefaultCursor('pointer');
        nextBtnBg.clear();
        nextBtnBg.fillStyle(0x16a34a, 1);
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
        isTutorialActive = false;
        
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

    this.tweens.add({ targets: [overlay, player, dialogContainer], alpha: 1, duration: 500 });

    // 4. Animasi Kursor
    const cursor = this.add.circle(targetTrash.x, targetTrash.y, 25, 0xffffff, 0.7);
    cursor.setStrokeStyle(4, 0x3b82f6, 1);
    cursor.setDepth(200);
    cursor.setAlpha(0);

    let isTutorialActive = true;

    const animateCursor = () => {
      if (!isTutorialActive) return;

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

