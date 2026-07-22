import * as Phaser from 'phaser';
import halamanKotorBg from '../../assets/backgrounds/halaman-kotor.png';

export class InvestigationScene extends Phaser.Scene {
  private cluesFound: number = 0;
  private totalClues: number = 4;
  private nextBtn!: Phaser.GameObjects.Container;
  private caseId!: string;

  constructor() {
    super('InvestigationScene');
  }

  preload() {
    this.load.image('halaman_kotor_bg', halamanKotorBg);
  }

  create(data: { caseId: string }) {
    this.caseId = data.caseId || 'kasus_halaman';
    const { width, height } = this.cameras.main;
    this.cluesFound = 0;

    // Background Image
    const bg = this.add.image(width / 2, height / 2, 'halaman_kotor_bg');
    const scaleX = width / bg.width;
    const scaleY = height / bg.height;
    bg.setScale(Math.max(scaleX, scaleY));

    // Title / Instructions
    const instructionBg = this.add.rectangle(width / 2, 60, 600, 70, 0x000000, 0.6);
    instructionBg.setStrokeStyle(4, 0xffffff);
    this.add.text(width / 2, 60, 'Temukan 4 Bukti di Halaman!', {
      fontSize: '28px',
      color: '#ffffff',
      fontStyle: 'bold',
      fontFamily: 'monospace'
    }).setOrigin(0.5);

    // Clues Configuration
    // Koordinat ini adalah perkiraan, mungkin perlu disesuaikan dengan posisi asli di gambar
    const clues = [
      {
        id: 'botol',
        x: width * 0.47, 
        y: height * 0.52,
        text: 'Botol plastik ini dibuang di halaman,\nbukan di tempat sampah.'
      },
      {
        id: 'pisang',
        x: width * 0.28, 
        y: height * 0.8,
        text: 'Kulit pisang ini juga dibiarkan\nbegitu saja di halaman.'
      },
      {
        id: 'daun',
        x: width * 0.75, 
        y: height * 0.8,
        text: '🍃 Daun\n\nPetunjuk: Daun memang jatuh dari pohon,\ntetapi jumlahnya hanya sedikit.'
      },
      {
        id: 'tempat_sampah',
        x: width * 0.71, 
        y: height * 0.45,
        text: 'Tempat sampah hijau dan kuning.\nSeharusnya sampah dibuang ke sini\nsesuai dengan jenisnya!'
      }
    ];

    clues.forEach(clue => {
      this.createClueMarker(clue.x, clue.y, clue.text);
    });

    // Selesai Button (Hidden until all clues found)
    this.createNextButton(width, height);
  }

  private createClueMarker(x: number, y: number, text: string) {
    const container = this.add.container(x, y);
    
    // Pulsing outer ring
    const ring = this.add.circle(0, 0, 35, 0xfacc15, 0.4);
    
    // Inner icon background
    const bg = this.add.circle(0, 0, 25, 0xfef08a);
    bg.setStrokeStyle(3, 0xffffff);
    
    // Icon
    const icon = this.add.text(0, 0, '🔍', { fontSize: '24px' }).setOrigin(0.5);
    
    container.add([ring, bg, icon]);

    // Animation for pulsing ring
    this.tweens.add({
      targets: ring,
      scale: 1.8,
      alpha: 0,
      duration: 1200,
      repeat: -1
    });
    
    // Bounce animation for the icon itself
    this.tweens.add({
      targets: [bg, icon],
      y: -5,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    const hitArea = new Phaser.Geom.Circle(0, 0, 40);
    container.setInteractive(hitArea, Phaser.Geom.Circle.Contains);
    
    let isFound = false;

    container.on('pointerover', () => {
      this.input.setDefaultCursor('pointer');
      bg.setFillStyle(0xfde047);
    });

    container.on('pointerout', () => {
      this.input.setDefaultCursor('default');
      if (isFound) {
        bg.setFillStyle(0x86efac); // Green if already found
      } else {
        bg.setFillStyle(0xfef08a);
      }
    });

    container.on('pointerdown', () => {
      this.input.setDefaultCursor('default');
      this.showDialog(text);
      
      if (!isFound) {
        isFound = true;
        this.cluesFound++;
        
        // Change appearance to indicate it's been found
        bg.setFillStyle(0x86efac); // Light green
        icon.setText('✔️');
        ring.setVisible(false); // Stop pulsing
        
        if (this.cluesFound >= this.totalClues) {
          this.nextBtn.setVisible(true);
          this.tweens.add({
            targets: this.nextBtn,
            alpha: 1,
            y: this.cameras.main.height - 100,
            duration: 500,
            ease: 'Back.easeOut'
          });
        }
      }
    });
  }

  private showDialog(text: string) {
    const { width, height } = this.cameras.main;
    
    // Dim background
    const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.5).setOrigin(0, 0);
    overlay.setInteractive(); // Block clicks to things behind it
    
    const dialogBox = this.add.container(width / 2, height / 2);
    
    // Box
    const boxWidth = 600;
    const boxHeight = 250;
    const box = this.add.graphics();
    box.fillStyle(0xffffff, 1);
    box.fillRoundedRect(-boxWidth/2, -boxHeight/2, boxWidth, boxHeight, 20);
    box.lineStyle(4, 0x000000, 1);
    box.strokeRoundedRect(-boxWidth/2, -boxHeight/2, boxWidth, boxHeight, 20);
    
    // Text
    const dialogText = this.add.text(0, -20, text, {
      fontFamily: 'monospace',
      fontSize: '24px',
      color: '#000000',
      align: 'center',
      wordWrap: { width: boxWidth - 60 }
    }).setOrigin(0.5);
    
    // Close button
    const closeBtn = this.add.container(0, 70);
    const closeBg = this.add.graphics();
    closeBg.fillStyle(0x3b82f6, 1); // Blue
    closeBg.fillRoundedRect(-80, -25, 160, 50, 15);
    closeBg.lineStyle(2, 0x000000, 1);
    closeBg.strokeRoundedRect(-80, -25, 160, 50, 15);
    
    const closeText = this.add.text(0, 0, 'TUTUP', {
      fontFamily: 'monospace',
      fontSize: '20px',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    closeBtn.add([closeBg, closeText]);
    
    const closeHitArea = new Phaser.Geom.Rectangle(-80, -25, 160, 50);
    closeBtn.setInteractive(closeHitArea, Phaser.Geom.Rectangle.Contains);
    
    dialogBox.add([box, dialogText, closeBtn]);
    
    // Pop-in animation
    dialogBox.setScale(0.5);
    dialogBox.setAlpha(0);
    this.tweens.add({
      targets: dialogBox,
      scale: 1,
      alpha: 1,
      duration: 300,
      ease: 'Back.easeOut'
    });
    
    // Close logic
    const closeAction = () => {
      this.input.setDefaultCursor('default');
      this.tweens.add({
        targets: [dialogBox, overlay],
        alpha: 0,
        duration: 200,
        onComplete: () => {
          overlay.destroy();
          dialogBox.destroy();
        }
      });
    };

    closeBtn.on('pointerover', () => {
      this.input.setDefaultCursor('pointer');
      closeBg.clear();
      closeBg.fillStyle(0x2563eb, 1);
      closeBg.fillRoundedRect(-80, -25, 160, 50, 15);
      closeBg.lineStyle(2, 0x000000, 1);
      closeBg.strokeRoundedRect(-80, -25, 160, 50, 15);
    });
    
    closeBtn.on('pointerout', () => {
      this.input.setDefaultCursor('default');
      closeBg.clear();
      closeBg.fillStyle(0x3b82f6, 1);
      closeBg.fillRoundedRect(-80, -25, 160, 50, 15);
      closeBg.lineStyle(2, 0x000000, 1);
      closeBg.strokeRoundedRect(-80, -25, 160, 50, 15);
    });
    
    closeBtn.on('pointerdown', closeAction);
  }

  private createNextButton(width: number, height: number) {
    this.nextBtn = this.add.container(width / 2, height + 100);
    
    const btnWidth = 300;
    const btnHeight = 70;
    
    const bg = this.add.graphics();
    bg.fillStyle(0x16a34a, 1); // Green
    bg.fillRoundedRect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight, 35);
    bg.lineStyle(4, 0xffffff, 1);
    bg.strokeRoundedRect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight, 35);
    
    const text = this.add.text(0, 0, 'SELESAI INVESTIGASI ➔', {
      fontFamily: 'monospace',
      fontSize: '22px',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    this.nextBtn.add([bg, text]);
    this.nextBtn.setVisible(false);
    this.nextBtn.setAlpha(0);
    
    const hitArea = new Phaser.Geom.Rectangle(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight);
    this.nextBtn.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);
    
    this.nextBtn.on('pointerover', () => {
      this.input.setDefaultCursor('pointer');
      this.tweens.add({ targets: this.nextBtn, scale: 1.05, duration: 100 });
    });
    
    this.nextBtn.on('pointerout', () => {
      this.input.setDefaultCursor('default');
      this.tweens.add({ targets: this.nextBtn, scale: 1, duration: 100 });
    });
    
    this.nextBtn.on('pointerdown', () => {
      this.input.setDefaultCursor('default');
      this.scene.start('ConclusionScene', { caseId: this.caseId });
    });
  }
}
