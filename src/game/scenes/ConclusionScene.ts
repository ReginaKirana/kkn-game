import * as Phaser from 'phaser';
import halamanKotorBg from '../../assets/backgrounds/halaman-kotor.png';
import botolImg from '../../assets/objects/botol.png';
import pisangImg from '../../assets/objects/pisang.png';
import daunImg from '../../assets/objects/daun.png';
import binImg from '../../assets/objects/bin.png';

export class ConclusionScene extends Phaser.Scene {
  private caseId!: string;

  constructor() {
    super('ConclusionScene');
  }

  preload() {
    this.load.image('halaman_kotor_bg', halamanKotorBg);
    this.load.image('clue_botol', botolImg);
    this.load.image('clue_pisang', pisangImg);
    this.load.image('clue_daun', daunImg);
    this.load.image('clue_bin', binImg);
  }

  create(data: { caseId: string }) {
    this.caseId = data.caseId || 'kasus_halaman';
    const { width, height } = this.cameras.main;

    // 1. Gambar ulang background investigasi
    const bg = this.add.image(width / 2, height / 2, 'halaman_kotor_bg');
    const scaleX = width / bg.width;
    const scaleY = height / bg.height;
    bg.setScale(Math.max(scaleX, scaleY));

    // 2. Gelapkan layar (overlay)
    this.add.rectangle(0, 0, width, height, 0x000000, 0.7).setOrigin(0, 0);

    // 3. Buat Modal "Kertas Resume"
    const modalContainer = this.add.container(width / 2, height / 2);
    
    // PERBESAR UKURAN KERTAS AGAR MUAT 2 KOLOM
    const modalWidth = 1400;
    const modalHeight = 850;

    // Bayangan kotak
    const shadow = this.add.graphics();
    shadow.fillStyle(0x000000, 0.5);
    shadow.fillRoundedRect(-modalWidth/2 + 10, -modalHeight/2 + 15, modalWidth, modalHeight, 20);

    // Latar kotak (Dark Navy Gaming Style)
    const paper = this.add.graphics();
    paper.fillStyle(0x0f172a, 0.95);
    paper.fillRoundedRect(-modalWidth/2, -modalHeight/2, modalWidth, modalHeight, 20);
    paper.lineStyle(6, 0x3b82f6, 1);
    paper.strokeRoundedRect(-modalWidth/2, -modalHeight/2, modalWidth, modalHeight, 20);

    // Judul
    const title = this.add.text(0, -modalHeight/2 + 60, 'LAPORAN INVESTIGASI', {
      fontFamily: 'Fredoka One, Arial, sans-serif',
      fontSize: '48px',
      color: '#ffffff',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 6,
      shadow: { offsetX: 2, offsetY: 2, color: '#000000', blur: 0, fill: true }
    }).setOrigin(0.5);

    // Garis pemisah atas (Neon Blue)
    const lineTop = this.add.graphics();
    lineTop.lineStyle(4, 0x3b82f6, 0.8);
    lineTop.beginPath();
    lineTop.moveTo(-modalWidth/2 + 50, -modalHeight/2 + 120);
    lineTop.lineTo(modalWidth/2 - 50, -modalHeight/2 + 120);
    lineTop.strokePath();

    // Garis pemisah tengah (Vertikal, Neon Blue)
    const lineVert = this.add.graphics();
    lineVert.lineStyle(4, 0x3b82f6, 0.8);
    lineVert.beginPath();
    lineVert.moveTo(0, -modalHeight/2 + 120);
    lineVert.lineTo(0, modalHeight/2 - 50);
    lineVert.strokePath();

    // ==========================================
    // KOLOM KIRI (CLUE & GAMBAR)
    // ==========================================
    const cluesTitle = this.add.text(-modalWidth/2 + 60, -modalHeight/2 + 150, 'Bukti Ditemukan:', {
      fontFamily: 'Fredoka One, Arial, sans-serif',
      fontSize: '32px',
      color: '#60a5fa', // Light Blue
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 4
    });

    const clueData = [
      { img: 'clue_botol', text: 'Botol plastik dibuang sembarangan di halaman.' },
      { img: 'clue_pisang', text: 'Kulit pisang dibiarkan begitu saja.' },
      { img: 'clue_daun', text: 'Daun yang gugur dari pohon hanya sedikit.' },
      { img: 'clue_bin', text: 'Tempat sampah hijau & kuning KOSONG!' }
    ];

    let clueY = -modalHeight/2 + 250;
    const leftElements: Phaser.GameObjects.GameObject[] = [cluesTitle];

    clueData.forEach((clue) => {
      // Icon gambar benda
      const img = this.add.image(-modalWidth/2 + 120, clueY, clue.img);
      // Skalakan gambar agar pas di dalam kotak clue
      const maxImgSize = 100;
      const scale = Math.min(maxImgSize / img.width, maxImgSize / img.height);
      img.setScale(scale);
      
      // Teks clue
      const text = this.add.text(-modalWidth/2 + 200, clueY, clue.text, {
        fontFamily: 'Fredoka One, Arial, sans-serif',
        fontSize: '24px',
        color: '#e2e8f0', // Light Gray
        wordWrap: { width: (modalWidth/2) - 250 },
        lineSpacing: 5
      }).setOrigin(0, 0.5);

      leftElements.push(img, text);
      clueY += 140; // Jarak antar clue (karena ada gambar, jaraknya lebih besar)
    });

    // ==========================================
    // KOLOM KANAN (KUIS)
    // ==========================================
    const question = this.add.text(modalWidth/4, -modalHeight/2 + 250, 'Berdasarkan bukti di samping,\napa penyebab utama\nhalaman sekolah ini kotor?', {
      fontFamily: 'Fredoka One, Arial, sans-serif',
      fontSize: '32px',
      color: '#facc15', // Yellow
      fontStyle: 'bold',
      align: 'center',
      wordWrap: { width: (modalWidth/2) - 100 },
      stroke: '#000000',
      strokeThickness: 4,
      shadow: { offsetX: 2, offsetY: 2, color: '#000000', blur: 0, fill: true },
      lineSpacing: 10
    }).setOrigin(0.5);

    const options = [
      { id: 'A', text: 'Tempat sampah\nterlalu penuh', isCorrect: false },
      { id: 'B', text: 'Angin kencang\nmenerbangkan sampah', isCorrect: false },
      { id: 'C', text: 'Kurangnya kesadaran\nmembuang sampah pada tempatnya', isCorrect: true }
    ];

    let optionY = -modalHeight/2 + 380;
    const optionBtns: Phaser.GameObjects.Container[] = [];

    // Teks Error (muncul jika jawaban salah)
    const errorText = this.add.text(modalWidth/4, optionY + 370, '❌ Coba perhatikan lagi petunjuk\nyang sudah kamu temukan.', {
      fontFamily: 'Fredoka One, Arial, sans-serif',
      fontSize: '24px',
      color: '#ef4444', // Red
      fontStyle: 'bold',
      align: 'center',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5);
    errorText.setAlpha(0);

    options.forEach((opt) => {
      const btn = this.createOptionButton(modalWidth/4, optionY, opt.id, opt.text, (modalWidth/2) - 120, () => {
        this.input.setDefaultCursor('default');
        
        if (opt.isCorrect) {
          // Jawaban Benar
          this.scene.start('SolutionScene', { caseId: this.caseId });
        } else {
          // Jawaban Salah
          errorText.setAlpha(1);
          // Animasi shake ringan
          this.tweens.add({
            targets: errorText,
            x: modalWidth/4 + 10,
            duration: 50,
            yoyo: true,
            repeat: 3,
            onComplete: () => {
              errorText.setX(modalWidth/4);
            }
          });
          
          // Hilangkan setelah beberapa detik
          this.time.delayedCall(3000, () => {
            this.tweens.add({
              targets: errorText,
              alpha: 0,
              duration: 300
            });
          });
        }
      });
      optionBtns.push(btn);
      optionY += 110; // Jarak antar tombol opsi
    });

    modalContainer.add([shadow, paper, title, lineTop, lineVert, ...leftElements, question, ...optionBtns, errorText]);

    // Efek Pop-in
    modalContainer.setScale(0.7);
    modalContainer.setAlpha(0);
    this.tweens.add({
      targets: modalContainer,
      scale: 1,
      alpha: 1,
      duration: 500,
      ease: 'Back.easeOut'
    });
  }

  private createOptionButton(x: number, y: number, prefix: string, text: string, width: number, onClick: () => void) {
    const container = this.add.container(x, y);
    const height = 75; // Slightly taller for gaming style

    const shadow = this.add.graphics();
    shadow.fillStyle(0x000000, 0.4);
    shadow.fillRoundedRect(-width/2 + 4, -height/2 + 6, width, height, 15);

    const bg = this.add.graphics();
    bg.fillStyle(0x1e3a8a, 1); // Dark blue button
    bg.fillRoundedRect(-width/2, -height/2, width, height, 15);
    bg.lineStyle(4, 0xffffff, 0.2); // Inner highlight
    bg.strokeRoundedRect(-width/2 + 2, -height/2 + 2, width - 4, height - 4, 13);
    bg.lineStyle(3, 0x000000, 1); // Outer border
    bg.strokeRoundedRect(-width/2, -height/2, width, height, 15);

    const prefixBg = this.add.graphics();
    prefixBg.fillStyle(0x3b82f6, 1); // Neon blue prefix
    prefixBg.fillRoundedRect(-width/2, -height/2, 70, height, { tl: 15, bl: 15, tr: 0, br: 0 });
    prefixBg.lineStyle(3, 0x000000, 1);
    prefixBg.strokeRoundedRect(-width/2, -height/2, 70, height, { tl: 15, bl: 15, tr: 0, br: 0 });

    const prefixText = this.add.text(-width/2 + 35, 0, prefix, {
      fontFamily: 'Fredoka One, Arial, sans-serif',
      fontSize: '32px',
      color: '#ffffff',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 4,
      shadow: { offsetX: 2, offsetY: 2, color: '#000000', blur: 0, fill: true }
    }).setOrigin(0.5);

    const labelText = this.add.text(-width/2 + 90, 0, text, {
      fontFamily: 'Fredoka One, Arial, sans-serif',
      fontSize: '22px',
      color: '#ffffff',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0, 0.5);

    container.add([shadow, bg, prefixBg, prefixText, labelText]);

    const hitArea = new Phaser.Geom.Rectangle(-width/2, -height/2, width, height);
    container.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);

    let isClicking = false;

    container.on('pointerover', () => {
      if (isClicking) return;
      this.input.setDefaultCursor('pointer');
      
      bg.clear();
      bg.fillStyle(0x3b82f6, 1); // Hover brighter blue
      bg.fillRoundedRect(-width/2, -height/2, width, height, 15);
      bg.lineStyle(4, 0xffffff, 0.5);
      bg.strokeRoundedRect(-width/2 + 2, -height/2 + 2, width - 4, height - 4, 13);
      bg.lineStyle(3, 0x000000, 1);
      bg.strokeRoundedRect(-width/2, -height/2, width, height, 15);
      
      container.y -= 2;
      shadow.y = 2;
    });

    container.on('pointerout', () => {
      if (isClicking) return;
      this.input.setDefaultCursor('default');
      
      bg.clear();
      bg.fillStyle(0x1e3a8a, 1);
      bg.fillRoundedRect(-width/2, -height/2, width, height, 15);
      bg.lineStyle(4, 0xffffff, 0.2);
      bg.strokeRoundedRect(-width/2 + 2, -height/2 + 2, width - 4, height - 4, 13);
      bg.lineStyle(3, 0x000000, 1);
      bg.strokeRoundedRect(-width/2, -height/2, width, height, 15);
      
      container.y = y;
      shadow.y = 0;
    });

    container.on('pointerdown', () => {
      if (isClicking) return;
      isClicking = true;
      this.input.setDefaultCursor('default');
      
      container.y = y + 4;
      shadow.y = -4;

      setTimeout(() => {
        onClick();
        // Reset state manually in case it doesn't change scene (wrong answer)
        isClicking = false;
        container.y = y;
        shadow.y = 0;
      }, 150);
    });

    return container;
  }
}
