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

    // 1. Background
    const bg = this.add.image(width / 2, height / 2, 'game_bg');
    bg.setScale(Math.max(width / bg.width, height / bg.height));

    // 2. Judul Misi
    const instructionBg = this.add.rectangle(width / 2, 60, 600, 70, 0x000000, 0.6);
    instructionBg.setStrokeStyle(4, 0xffffff);
    this.add.text(width / 2, 60, 'Misi: Pilah Sampah Organik & Anorganik!', {
      fontSize: '24px',
      color: '#ffffff',
      fontStyle: 'bold',
      fontFamily: 'monospace'
    }).setOrigin(0.5);

    // 3. Tempat Sampah (Drop Zones)
    const binOrganik = this.add.image(width * 0.3, height * 0.4, 'bin_organik');
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

    // 5. Logic Drop ke Tempat Sampah
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
        // SALAH - "Se Gaming Mungkin"
        
        // 1. Merah sementara
        gameObject.setTint(0xff5555);
        
        // 2. Muncul X mark sementara
        const xMark = this.add.text(gameObject.x, gameObject.y - 50, '❌', { fontSize: '64px' }).setOrigin(0.5);
        xMark.setDepth(20);
        
        this.tweens.add({
          targets: xMark,
          y: xMark.y - 30,
          alpha: 0,
          duration: 1000,
          ease: 'Power2',
          onComplete: () => xMark.destroy()
        });

        // 3. Getar / Shake effect lalu bounce balik ke posisi awal
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

    // Jika drop meleset dari zone apapun
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

    // Dark Overlay
    this.add.rectangle(0, 0, width, height, 0x000000, 0.7).setOrigin(0, 0);

    // Teacher Character
    const teacher = this.add.image(width * 0.25, height, 'teacher_thumbup').setOrigin(0.5, 1);
    teacher.setFlipX(true);
    const teacherMaxHeight = height * 0.85;
    teacher.setScale(teacherMaxHeight / teacher.height);
    
    // Dialog Container
    const dialogContainer = this.add.container(width / 2, height - 150);
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
    
    dialogContainer.add([dialogBg, nameBg, nameText, textObj]);
    dialogContainer.setAlpha(0);
    dialogContainer.y += 50;

    // Eco Point +10 Visual
    const ecoText = this.add.text(width / 2, height / 2 - 100, '⭐ Eco Point +10', {
      fontFamily: 'monospace',
      fontSize: '64px',
      color: '#fbbf24',
      fontStyle: 'bold',
      stroke: '#b45309',
      strokeThickness: 8
    }).setOrigin(0.5);
    ecoText.setAlpha(0);
    ecoText.setScale(0);

    // Animasi muncul guru
    teacher.y = height + 300;
    this.tweens.add({
      targets: teacher,
      y: height,
      duration: 600,
      ease: 'Back.easeOut',
      onComplete: () => {
        // Muncul dialog
        this.tweens.add({
          targets: dialogContainer,
          alpha: 1,
          y: height - 150,
          duration: 400,
          ease: 'Power2',
          onComplete: () => {
            // Typewriter effect
            const content = "Hebat! Sekarang sampah sudah dipilah dengan benar.";
            let i = 0;
            this.time.addEvent({
              delay: 30,
              repeat: content.length - 1,
              callback: () => {
                textObj.text += content[i];
                i++;
                if (i >= content.length) {
                  // Tampilkan Eco Points
                  this.tweens.add({
                    targets: ecoText,
                    scale: 1.2,
                    alpha: 1,
                    duration: 500,
                    ease: 'Back.easeOut',
                    onComplete: () => {
                      this.tweens.add({
                        targets: ecoText,
                        scale: 1,
                        duration: 200
                      });
                      
                      // Tambahkan interaksi klik untuk lanjut
                      this.time.delayedCall(1000, () => {
                        const clickArea = this.add.zone(0, 0, width, height)
                          .setOrigin(0, 0)
                          .setInteractive({ useHandCursor: true });
                        
                        clickArea.on('pointerdown', () => {
                          this.input.setDefaultCursor('default');
                          this.scene.start('CaseSelectScene', { unlockCase3: true });
                        });
                      });
                    }
                  });
                }
              }
            });
          }
        });
      }
    });
  }
}
