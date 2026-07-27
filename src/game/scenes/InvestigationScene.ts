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
import selokanBg from '../../assets/backgrounds/selokan-tinngi.png';
import { Case3TrashConfig } from '../config/Case3TrashConfig';
import { createBackButton } from '../utils/UIUtils';

export class InvestigationScene extends Phaser.Scene {
  private cluesFound: number = 0;
  private totalClues: number = 4;
  private nextBtn!: Phaser.GameObjects.Container;
  private caseId!: string;
  private binBg!: Phaser.GameObjects.Image;
  private instructionBanner!: Phaser.GameObjects.Container;

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
    this.load.image('selokan_bg', selokanBg);
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
        { id: 'pisang', x: width * 0.28, y: height * 0.8, text: 'Kulit pisang ini dibiarkan\nbegitu saja di halaman.', hasPov: false },
        { id: 'daun', x: width * 0.75, y: height * 0.8, text: 'Daun Kering.\nDaun gugur itu alami dan bisa menyatu dengan tanah.\nYang menjadi masalah adalah sampah buatan manusia!', hasPov: false },
        { id: 'tempat_sampah', x: width * 0.75, y: height * 0.465, text: 'Tempat Sampah.\nLoh, ternyata tempat sampahnya KOSONG!\nSeharusnya sampah dibuang ke sini!', hasPov: true }
      ];
    } else if (this.caseId === 'kasus_sampah') {
      bgKey = 'case2_investigation_bg';
      instructionText = 'Periksa Sampah yang Tercampur!';
      clues = [
        { id: 'botol_plastik', asset: 'botol', x: width * 0.44, y: height * 0.61, text: 'Botol plastik sangat sulit terurai secara alami. Ini termasuk sampah Anorganik.', hasPov: false },
        { id: 'kulit_pisang', asset: 'pisang', x: width * 0.5, y: height * 0.65, text: 'Kulit pisang adalah sisa makhluk hidup dan mudah membusuk. Ini termasuk sampah Organik.', hasPov: false },
        { id: 'kaleng_bekas', asset: 'kaleng', x: width * 0.5, y: height * 0.5, text: 'Kaleng terbuat dari logam yang tidak bisa membusuk. Ini termasuk sampah Anorganik.', hasPov: false },
        { id: 'kertas_bekas', asset: 'kertas', x: width * 0.55, y: height * 0.72, text: 'Kertas bekas harus dipisahkan agar bisa didaur ulang. Ini termasuk sampah Anorganik.', hasPov: false }
      ];
    } else if (this.caseId === 'kasus_selokan') {
      bgKey = 'selokan_bg';
      instructionText = 'Periksa Sampah di Selokan!';
      // Map dari config ke format clues
      clues = Case3TrashConfig.clues.map(c => ({
        id: c.id,
        asset: c.asset,
        x: width * c.x,
        y: height * c.y,
        text: c.text,
        maxDim: c.maxDim || 150,
        hasPov: false
      }));
    }

    this.totalClues = clues.length;

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
    } else if (this.caseId === 'kasus_selokan') {
      Case3TrashConfig.distractors.forEach(d => {
        const img = this.add.image(width * d.x, height * d.y, d.asset);
        const maxDim = d.maxDim || 120;
        img.setScale(maxDim / Math.max(img.width, img.height));
        img.setTint(0x4a4a4a); // Di-overlay gelap
      });
    }

    // Title / Instructions (Hidden initially, shown after intro)
    const bannerWidth = 600;
    const bannerHeight = 70;
    
    // Banner container
    this.instructionBanner = this.add.container(width / 2, 60);
    this.instructionBanner.setDepth(50);
    this.instructionBanner.setAlpha(0); // Hidden initially

    const instructionBg = this.add.graphics();
    instructionBg.fillStyle(0x0f172a, 0.9);
    instructionBg.fillRoundedRect(-bannerWidth/2, -bannerHeight/2, bannerWidth, bannerHeight, 15);
    instructionBg.lineStyle(4, 0x3b82f6, 1);
    instructionBg.strokeRoundedRect(-bannerWidth/2, -bannerHeight/2, bannerWidth, bannerHeight, 15);

    const bannerText = this.add.text(0, 0, instructionText, {
      fontFamily: 'Fredoka One, Arial, sans-serif',
      fontSize: '24px',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.instructionBanner.add([instructionBg, bannerText]);

    clues.forEach(clue => {
      this.createClueMarker(clue.x, clue.y, clue.text, clue.hasPov, clue.asset, clue.maxDim);
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

    this.createNextButton(width, height);

    this.playIntroSequence(instructionText);

    createBackButton(this, 70, 70, () => {
      this.scene.start('CaseSelectScene');
    });
  }

  private playIntroSequence(instructionText: string) {
    const { width, height } = this.cameras.main;

    // Dark overlay
    const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.8).setOrigin(0, 0);
    overlay.setDepth(200);
    overlay.setInteractive(); // Block clicks

    // Instruction Box
    const boxContainer = this.add.container(width / 2, height / 2);
    boxContainer.setDepth(201);
    boxContainer.setScale(0);

    const boxWidth = 700;
    const boxHeight = 150;
    const boxBg = this.add.graphics();
    boxBg.fillStyle(0x0f172a, 1);
    boxBg.fillRoundedRect(-boxWidth/2, -boxHeight/2, boxWidth, boxHeight, 20);
    boxBg.lineStyle(6, 0x3b82f6, 1);
    boxBg.strokeRoundedRect(-boxWidth/2, -boxHeight/2, boxWidth, boxHeight, 20);

    // Text starts empty for typewriter effect
    const text = this.add.text(0, 0, '', {
      fontFamily: 'Fredoka One, Arial, sans-serif',
      fontSize: '36px',
      color: '#ffffff',
      fontStyle: 'bold',
      align: 'center',
      wordWrap: { width: boxWidth - 40 }
    }).setOrigin(0.5);

    boxContainer.add([boxBg, text]);

    // Animation sequence: 1. Pop in box
    this.tweens.add({
      targets: boxContainer,
      scale: 1,
      duration: 500,
      ease: 'Back.easeOut',
      onComplete: () => {
        
        // 2. Typewriter effect
        let charIndex = 0;
        const typeTimer = this.time.addEvent({
          delay: 50,
          repeat: instructionText.length - 1,
          callback: () => {
            text.setText(text.text + instructionText[charIndex]);
            charIndex++;
          }
        });

        // 3. Wait after typing finishes, then fade out
        this.time.delayedCall(50 * instructionText.length + 1000, () => {
          this.tweens.add({
            targets: [boxContainer, overlay],
            alpha: 0,
            duration: 500,
            onComplete: () => {
              boxContainer.destroy();
              overlay.destroy();
              
              // 4. Fade in the top banner
              if (this.instructionBanner) {
                this.tweens.add({
                  targets: this.instructionBanner,
                  alpha: 1,
                  y: '+=10',
                  duration: 500,
                  ease: 'Sine.easeOut'
                });
              }
            }
          });
        });
      }
    });
  }

  private createClueMarker(x: number, y: number, text: string, hasPov: boolean, asset?: string, maxDimParam?: number) {
    const container = this.add.container(x, y);
    
    let imageSprite: Phaser.GameObjects.Image | null = null;
    
    // Posisi indikator '🔍' berada sedikit di atas gambar jika ada gambar sampah
    const markerY = asset ? -40 : 0;
    
    if (asset) {
      imageSprite = this.add.image(0, 0, asset);
      const maxDim = maxDimParam || 150; 

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
    const ring = this.add.circle(0, markerY, 35, 0x3b82f6, 0.4);
    
    // Inner icon background (selalu ada)
    const bg = this.add.circle(0, markerY, 25, 0x1e3a8a);
    bg.setStrokeStyle(3, 0x60a5fa);
    
    // Icon tanda tanya (menggantikan emoji)
    const icon = this.add.text(0, markerY, '?', { 
      fontFamily: 'Fredoka One, Arial, sans-serif',
      fontSize: '32px',
      color: '#ffffff',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 4,
      shadow: { offsetX: 2, offsetY: 2, color: '#000000', blur: 0, fill: true }
    }).setOrigin(0.5);
    
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
      bg.setFillStyle(0x3b82f6); // Hover brighter blue
    });

    container.on('pointerout', () => {
      this.input.setDefaultCursor('default');
      if (isFound) {
        bg.setFillStyle(0x16a34a); // Hijau saat selesai
      } else {
        bg.setFillStyle(0x1e3a8a); // Kembali biru tua
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
          bg.setFillStyle(0x16a34a); // Hijau
          bg.setStrokeStyle(3, 0x4ade80);
          icon.setText('✓'); // Centang
          icon.setColor('#ffffff');
          
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
    const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.6).setOrigin(0, 0);
    overlay.setInteractive(); // Block clicks to things behind it
    overlay.setDepth(20);
    
    const dialogBox = this.add.container(width / 2, height / 2);
    dialogBox.setDepth(20);
    
    // Box (Dark Theme)
    const boxWidth = 700;
    const boxHeight = 250;
    const box = this.add.graphics();
    box.fillStyle(0x0f172a, 1);
    box.fillRoundedRect(-boxWidth/2, -boxHeight/2, boxWidth, boxHeight, 20);
    box.lineStyle(6, 0x3b82f6, 1);
    box.strokeRoundedRect(-boxWidth/2, -boxHeight/2, boxWidth, boxHeight, 20);
    
    // Text
    const dialogText = this.add.text(0, -30, text, {
      fontFamily: 'Fredoka One, Arial, sans-serif',
      fontSize: '24px',
      color: '#ffffff',
      align: 'center',
      wordWrap: { width: boxWidth - 60 },
      lineSpacing: 10
    }).setOrigin(0.5);
    
    // Close button (Gaming Style)
    const closeBtnY = 70;
    const closeBtn = this.add.container(0, closeBtnY);
    
    const btnWidth = 200;
    const btnHeight = 60;
    
    const shadow = this.add.graphics();
    shadow.fillStyle(0x000000, 0.4);
    shadow.fillRoundedRect(-btnWidth/2 + 3, -btnHeight/2 + 4, btnWidth, btnHeight, 15);

    const closeBg = this.add.graphics();
    closeBg.fillStyle(0xef4444, 1); // Red
    closeBg.fillRoundedRect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight, 15);
    closeBg.lineStyle(4, 0xffffff, 0.3);
    closeBg.strokeRoundedRect(-btnWidth/2 + 2, -btnHeight/2 + 2, btnWidth - 4, btnHeight - 4, 13);
    closeBg.lineStyle(3, 0x000000, 1);
    closeBg.strokeRoundedRect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight, 15);
    
    const closeText = this.add.text(0, 0, 'TUTUP', {
      fontFamily: 'Fredoka One, Arial, sans-serif',
      fontSize: '22px',
      color: '#ffffff',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 4,
      shadow: { offsetX: 2, offsetY: 2, color: '#000000', blur: 0, fill: true }
    }).setOrigin(0.5);
    
    closeBtn.add([shadow, closeBg, closeText]);
    
    const closeHitArea = new Phaser.Geom.Rectangle(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight);
    closeBtn.setInteractive(closeHitArea, Phaser.Geom.Rectangle.Contains);
    
    let isClosing = false;

    closeBtn.on('pointerover', () => {
      if (isClosing) return;
      this.input.setDefaultCursor('pointer');
      closeBg.clear();
      closeBg.fillStyle(0xf87171, 1); // Lighter red
      closeBg.fillRoundedRect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight, 15);
      closeBg.lineStyle(4, 0xffffff, 0.5);
      closeBg.strokeRoundedRect(-btnWidth/2 + 2, -btnHeight/2 + 2, btnWidth - 4, btnHeight - 4, 13);
      closeBg.lineStyle(3, 0x000000, 1);
      closeBg.strokeRoundedRect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight, 15);
      closeBtn.y = closeBtnY - 2;
      shadow.y = 2;
    });

    closeBtn.on('pointerout', () => {
      if (isClosing) return;
      this.input.setDefaultCursor('default');
      closeBg.clear();
      closeBg.fillStyle(0xef4444, 1);
      closeBg.fillRoundedRect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight, 15);
      closeBg.lineStyle(4, 0xffffff, 0.3);
      closeBg.strokeRoundedRect(-btnWidth/2 + 2, -btnHeight/2 + 2, btnWidth - 4, btnHeight - 4, 13);
      closeBg.lineStyle(3, 0x000000, 1);
      closeBg.strokeRoundedRect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight, 15);
      closeBtn.y = closeBtnY;
      shadow.y = 0;
    });

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
      if (isClosing) return;
      isClosing = true;
      this.input.setDefaultCursor('default');
      
      closeBtn.y = closeBtnY + 4;
      shadow.y = -4;

      setTimeout(() => {
        // Fade out overlay
        this.tweens.add({
          targets: overlay,
          alpha: 0,
          duration: 250
        });

        // Shrink and fade out dialog box
        this.tweens.add({
          targets: dialogBox,
          alpha: 0,
          scale: 0.9,
          duration: 200,
          ease: 'Power2',
          onComplete: () => {
            dialogBox.destroy();
            overlay.destroy();
            
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
      }, 150);
    };

    closeBtn.on('pointerdown', closeAction);
  }

  private createNextButton(width: number, height: number) {
    // Initial Y position off-screen
    const offscreenY = height + 100;
    this.nextBtn = this.add.container(width / 2, offscreenY);
    
    const btnWidth = 380;
    const btnHeight = 65;
    
    // Shadow
    const shadow = this.add.graphics();
    shadow.fillStyle(0x000000, 0.4);
    shadow.fillRoundedRect(-btnWidth/2 + 4, -btnHeight/2 + 6, btnWidth, btnHeight, 20);

    // Main background
    const bg = this.add.graphics();
    bg.fillStyle(0x16a34a, 1); // Green
    bg.fillRoundedRect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight, 20);
    
    // Inner light border
    bg.lineStyle(4, 0xffffff, 0.3);
    bg.strokeRoundedRect(-btnWidth/2 + 2, -btnHeight/2 + 2, btnWidth - 4, btnHeight - 4, 18);
    
    // Outer black border
    bg.lineStyle(3, 0x000000, 1);
    bg.strokeRoundedRect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight, 20);
    
    const text = this.add.text(0, 0, 'SELESAI INVESTIGASI ➔', {
      fontFamily: 'Fredoka One, Arial, sans-serif',
      fontSize: '22px',
      color: '#ffffff',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 4,
      shadow: { offsetX: 2, offsetY: 2, color: '#000000', blur: 0, fill: true }
    }).setOrigin(0.5);
    
    this.nextBtn.add([shadow, bg, text]);
    this.nextBtn.setVisible(false);
    this.nextBtn.setAlpha(0);
    
    const hitArea = new Phaser.Geom.Rectangle(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight);
    this.nextBtn.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);
    
    // Hover Effects (Physical click style)
    let isClicking = false;

    this.nextBtn.on('pointerover', () => {
      if (isClicking) return;
      this.input.setDefaultCursor('pointer');
      bg.clear();
      bg.fillStyle(0x22c55e, 1); // Lighter green
      bg.fillRoundedRect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight, 20);
      bg.lineStyle(4, 0xffffff, 0.5);
      bg.strokeRoundedRect(-btnWidth/2 + 2, -btnHeight/2 + 2, btnWidth - 4, btnHeight - 4, 18);
      bg.lineStyle(3, 0x000000, 1);
      bg.strokeRoundedRect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight, 20);
      
      this.nextBtn.y -= 2;
      shadow.y = 2;
    });
    
    this.nextBtn.on('pointerout', () => {
      if (isClicking) return;
      this.input.setDefaultCursor('default');
      bg.clear();
      bg.fillStyle(0x16a34a, 1);
      bg.fillRoundedRect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight, 20);
      bg.lineStyle(4, 0xffffff, 0.3);
      bg.strokeRoundedRect(-btnWidth/2 + 2, -btnHeight/2 + 2, btnWidth - 4, btnHeight - 4, 18);
      bg.lineStyle(3, 0x000000, 1);
      bg.strokeRoundedRect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight, 20);
      
      // Target Y when visible is (height - 100) based on line 357. 
      // Tapi kita set manual saja karena pas out dia bisa aja posisi awal/akhir. 
      // Cara teraman: shadow.y = 0 dan kembalikan y ke normal.
      // Jika button sedang aktif, y aslinya adalah height - 100.
      this.nextBtn.y = height - 100;
      shadow.y = 0;
    });
    
    this.nextBtn.on('pointerdown', () => {
      if (isClicking) return;
      isClicking = true;
      this.input.setDefaultCursor('default');
      
      this.nextBtn.y = height - 100 + 4;
      shadow.y = -4;

      setTimeout(() => {
        // Proceed to next scene depending on case
        if (this.caseId === 'kasus_halaman') {
          this.scene.start('ConclusionScene', { caseId: this.caseId });
        } else if (this.caseId === 'kasus_sampah') {
          this.scene.start('Case2AnalysisScene');
        } else if (this.caseId === 'kasus_selokan') {
          this.scene.start('Case3AnalysisScene');
        } else {
          this.scene.start('ConclusionScene', { caseId: this.caseId });
        }
      }, 200);
    });
  }
}
