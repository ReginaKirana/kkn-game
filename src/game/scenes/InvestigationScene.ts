import * as Phaser from 'phaser';
import halamanKotorBg from '../../assets/backgrounds/halaman-kotor.png';
import binKosongBg from '../../assets/backgrounds/bin-kosong.png';
import case1GameBg from '../../assets/backgrounds/case1-game.png';
import botolImg from '../../assets/objects/botol.png';
import pisangImg from '../../assets/objects/pisang.png';
import kalengImg from '../../assets/objects/kaleng.png';
import kertasImg from '../../assets/objects/kertas.png';
import case2InvestigationBg from '../../assets/backgrounds/case2-investigation.png';
import binOranyeImg from '../../assets/objects/bin-oranye.png';
import appleImg from '../../assets/objects/apple.png';
import daunImg from '../../assets/objects/daun.png';
import gelasImg from '../../assets/objects/gelas.png';
import plastikImg from '../../assets/objects/plastik.png';
import rantingImg from '../../assets/objects/ranting.png';

export class InvestigationScene extends Phaser.Scene {
  private cluesFound: number = 0;
  private totalClues: number = 4;
  private nextBtn!: Phaser.GameObjects.Container;
  private caseId!: string;
  private binBg!: Phaser.GameObjects.Image;

  constructor() {
    super('InvestigationScene');
  }

  preload() {
    this.load.image('halaman_kotor_bg', halamanKotorBg);
    this.load.image('bin_kosong_bg', binKosongBg);
    this.load.image('case1_game_bg', case1GameBg);
    this.load.image('botol', botolImg);
    this.load.image('pisang', pisangImg);
    this.load.image('kaleng', kalengImg);
    this.load.image('kertas', kertasImg);
    this.load.image('case2_investigation_bg', case2InvestigationBg);
    this.load.image('bin_oranye', binOranyeImg);
    this.load.image('apple', appleImg);
    this.load.image('daun', daunImg);
    this.load.image('gelas', gelasImg);
    this.load.image('plastik', plastikImg);
    this.load.image('ranting', rantingImg);
  }

  create(data: { caseId: string }) {
    const urlParams = new URLSearchParams(window.location.search);
    const caseIdFromUrl = urlParams.get('caseId');
    this.caseId = data.caseId || caseIdFromUrl || 'kasus_halaman';
    
    const { width, height } = this.cameras.main;
    this.cluesFound = 0;

    // Background Image & Title Config
    let bgKey = 'halaman_kotor_bg';
    let instructionText = 'Temukan 4 Bukti di Halaman!';
    let clues: any[] = [];

    if (this.caseId === 'kasus_halaman') {
      clues = [
        { id: 'botol', x: width * 0.47, y: height * 0.52, text: 'Botol plastik ini dibuang di halaman,\nbukan di tempat sampah.', hasPov: false },
        { id: 'pisang', x: width * 0.28, y: height * 0.8, text: 'Kulit pisang ini juga dibiarkan\nbegitu saja di halaman.', hasPov: false },
        { id: 'daun', x: width * 0.75, y: height * 0.8, text: '🍃 Daun\n\nPetunjuk: Daun memang jatuh dari pohon,\ntetapi jumlahnya hanya sedikit.', hasPov: false },
        { id: 'tempat_sampah', x: width * 0.45, y: height * 0.465, text: 'Tempat sampah hijau dan kuning.\nLoh, ternyata tempat sampahnya KOSONG!\nSeharusnya sampah dibuang ke sini!', hasPov: true }
      ];
    } else if (this.caseId === 'kasus_sampah') {
      bgKey = 'case2_investigation_bg';
      instructionText = 'Periksa Sampah yang Tercampur!';
      clues = [
        { id: 'botol_plastik', asset: 'botol', x: width * 0.44, y: height * 0.61, text: 'Botol plastik sulit terurai dan dapat didaur ulang.', hasPov: false },
        { id: 'kulit_pisang', asset: 'pisang', x: width * 0.5, y: height * 0.65, text: 'Kulit pisang berasal dari makhluk hidup dan mudah terurai.', hasPov: false },
        { id: 'kaleng_bekas', asset: 'kaleng', x: width * 0.5, y: height * 0.5, text: 'Kaleng dapat didaur ulang.', hasPov: false },
        { id: 'kertas_bekas', asset: 'kertas', x: width * 0.55, y: height * 0.72, text: 'Kertas dapat didaur ulang jika masih bersih.', hasPov: false }
      ];
    }

    const bg = this.add.image(width / 2, height / 2, bgKey);
    const scaleX = width / bg.width;
    const scaleY = height / bg.height;
    bg.setScale(Math.max(scaleX, scaleY));

    if (this.caseId === 'kasus_sampah') {
      // Tambahkan Tempat Sampah Oranye
      const bin = this.add.image(width * 0.5, height * 0.55, 'bin_oranye');
      const binMaxHeight = 1250; // Jauh lebih kecil agar tidak menutupi layar
      bin.setScale(binMaxHeight / bin.height);
      
      // Tambahkan sampah-sampah pengecoh (bukan clue)
      const distractors = [
        { asset: 'apple', x: width * 0.45, y: height * 0.5 },
        { asset: 'daun', x: width * 0.45, y: height * 0.7 }, // Digeser dari tengah
        { asset: 'gelas', x: width * 0.55, y: height * 0.59 },
        { asset: 'plastik', x: width * 0.5, y: height * 0.75 },
        { asset: 'ranting', x: width * 0.55, y: height * 0.52 }
      ];
      
      distractors.forEach(d => {
        const img = this.add.image(d.x, d.y, d.asset);
        const maxDim = 120; // Pengecoh diperbesar
        img.setScale(maxDim / Math.max(img.width, img.height));
        img.setTint(0x4a4a4a); // Di-overlay gelap
      });
    }

    // Title / Instructions
    const instructionBg = this.add.rectangle(width / 2, 60, 600, 70, 0x000000, 0.6);
    instructionBg.setStrokeStyle(4, 0xffffff);
    this.add.text(width / 2, 60, instructionText, {
      fontSize: '28px',
      color: '#ffffff',
      fontStyle: 'bold',
      fontFamily: 'monospace'
    }).setOrigin(0.5);

    clues.forEach(clue => {
      this.createClueMarker(clue.x, clue.y, clue.text, clue.hasPov, clue.asset);
    });

    // POV Background for empty bin (hidden initially, high depth to cover markers)
    this.binBg = this.add.image(width / 2, height / 2, 'bin_kosong_bg');
    const binScaleX = width / this.binBg.width;
    const binScaleY = height / this.binBg.height;
    this.binBg.setScale(Math.max(binScaleX, binScaleY));
    this.binBg.setVisible(false);
    this.binBg.setAlpha(0);
    this.binBg.setDepth(10); // Cover markers
    this.binBg.setInteractive(); // Block clicks to clues while in POV

    // Selesai Button (Hidden until all clues found)
    this.createNextButton(width, height);
  }

  private createClueMarker(x: number, y: number, text: string, hasPov: boolean, asset?: string) {
    const container = this.add.container(x, y);
    
    let imageSprite: Phaser.GameObjects.Image | null = null;
    
    // Posisi indikator '🔍' berada sedikit di atas gambar jika ada gambar sampah
    const markerY = asset ? -40 : 0;
    
    if (asset) {
      imageSprite = this.add.image(0, 0, asset);
      const maxDim = 150; // Sampah clue diperbesar
      if (imageSprite.width > maxDim || imageSprite.height > maxDim) {
        imageSprite.setScale(maxDim / Math.max(imageSprite.width, imageSprite.height));
      }
      container.add(imageSprite);

      // Float animation for image
      this.tweens.add({
        targets: imageSprite,
        y: -10,
        duration: 1000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }

    // Pulsing outer ring (selalu ada)
    const ring = this.add.circle(0, markerY, 35, 0xfacc15, 0.4);
    
    // Inner icon background (selalu ada)
    const bg = this.add.circle(0, markerY, 25, 0xfef08a);
    bg.setStrokeStyle(3, 0xffffff);
    
    // Icon kaca pembesar
    const icon = this.add.text(0, markerY, '🔍', { fontSize: '24px' }).setOrigin(0.5);
    
    container.add([ring, bg, icon]);

    // Bounce animation for the icon itself
    this.tweens.add({
      targets: [bg, icon],
      y: markerY - 5,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Animation for pulsing ring
    this.tweens.add({
      targets: ring,
      scale: 1.8,
      alpha: 0,
      duration: 1200,
      repeat: -1
    });

    // Area klik (lebih besar jika ada gambar sampah)
    const hitArea = new Phaser.Geom.Circle(0, 0, asset ? 60 : 40);
    container.setInteractive(hitArea, Phaser.Geom.Circle.Contains);
    
    let isFound = false;

    container.on('pointerover', () => {
      this.input.setDefaultCursor('pointer');
      bg.setFillStyle(0xfde047);
    });

    container.on('pointerout', () => {
      this.input.setDefaultCursor('default');
      if (isFound) {
        bg.setFillStyle(0x86efac); // Hijau saat selesai
      } else {
        bg.setFillStyle(0xfef08a); // Kembali kuning
      }
    });

    container.on('pointerdown', () => {
      this.input.setDefaultCursor('default');
      
      const onClueShown = () => {
        this.showDialog(text, hasPov);
        
        if (!isFound) {
          isFound = true;
          this.cluesFound++;
          
          // Ubah visual indikator
          bg.setFillStyle(0x86efac); // Hijau
          icon.setText('✔️'); // Centang
          
          // Redupkan gambar sampahnya
          if (imageSprite) {
            imageSprite.setTint(0xaaaaaa);
          }
          ring.setVisible(false); // Matikan denyut cahaya
          
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
      };

      if (hasPov && this.binBg) {
        this.binBg.setVisible(true);
        this.tweens.add({
          targets: this.binBg,
          alpha: 1,
          duration: 600,
          onComplete: () => {
            // Beri jeda waktu agar pemain bisa mengamati isi tempat sampah dulu
            this.time.delayedCall(1200, () => {
              onClueShown();
            });
          }
        });
      } else {
        onClueShown();
      }
    });
  }

  private showDialog(text: string, hasPov: boolean) {
    const { width, height } = this.cameras.main;
    
    // Dim background
    const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.5).setOrigin(0, 0);
    overlay.setInteractive(); // Block clicks to things behind it
    overlay.setDepth(20);
    
    const dialogBox = this.add.container(width / 2, height / 2);
    dialogBox.setDepth(20);
    
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
          
          // Return from POV if needed
          if (hasPov && this.binBg) {
            this.tweens.add({
              targets: this.binBg,
              alpha: 0,
              duration: 500,
              onComplete: () => {
                this.binBg.setVisible(false);
              }
            });
          }
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
      if (this.caseId === 'kasus_sampah') {
        this.scene.start('Case2AnalysisScene');
      } else {
        this.scene.start('ConclusionScene', { caseId: this.caseId });
      }
    });
  }
}
