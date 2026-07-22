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

    // Bayangan kertas
    const shadow = this.add.graphics();
    shadow.fillStyle(0x000000, 0.4);
    shadow.fillRoundedRect(-modalWidth/2 + 15, -modalHeight/2 + 15, modalWidth, modalHeight, 20);

    // Latar kertas (Warna kuning gading/kertas file)
    const paper = this.add.graphics();
    paper.fillStyle(0xfff8d6, 1);
    paper.fillRoundedRect(-modalWidth/2, -modalHeight/2, modalWidth, modalHeight, 20);
    paper.lineStyle(6, 0x333333, 1);
    paper.strokeRoundedRect(-modalWidth/2, -modalHeight/2, modalWidth, modalHeight, 20);

    // Jepitan kertas / Binder clip di atas
    const clip = this.add.graphics();
    clip.fillStyle(0x9ca3af, 1);
    clip.fillRoundedRect(-60, -modalHeight/2 - 20, 120, 40, 10);
    clip.lineStyle(4, 0x333333, 1);
    clip.strokeRoundedRect(-60, -modalHeight/2 - 20, 120, 40, 10);

    // Judul
    const title = this.add.text(0, -modalHeight/2 + 60, '📋 LAPORAN INVESTIGASI', {
      fontFamily: 'monospace',
      fontSize: '48px',
      color: '#1f2937',
      fontStyle: '900'
    }).setOrigin(0.5);

    // Garis pemisah atas
    const lineTop = this.add.graphics();
    lineTop.lineStyle(3, 0x1f2937, 0.5);
    lineTop.beginPath();
    lineTop.moveTo(-modalWidth/2 + 50, -modalHeight/2 + 120);
    lineTop.lineTo(modalWidth/2 - 50, -modalHeight/2 + 120);
    lineTop.strokePath();

    // Garis pemisah tengah (Vertikal)
    const lineVert = this.add.graphics();
    lineVert.lineStyle(3, 0x1f2937, 0.5);
    lineVert.beginPath();
    lineVert.moveTo(0, -modalHeight/2 + 120);
    lineVert.lineTo(0, modalHeight/2 - 50);
    lineVert.strokePath();

    // ==========================================
    // KOLOM KIRI (CLUE & GAMBAR)
    // ==========================================
    const cluesTitle = this.add.text(-modalWidth/2 + 60, -modalHeight/2 + 150, 'Bukti Ditemukan:', {
      fontFamily: 'monospace',
      fontSize: '32px',
      color: '#1f2937',
      fontStyle: 'bold'
    });

    const clueData = [
      { img: 'clue_botol', text: 'Botol plastik dibuang sembarangan di halaman.' },
      { img: 'clue_pisang', text: 'Kulit pisang dibiarkan begitu saja.' },
      { img: 'clue_daun', text: 'Daun yang gugur dari pohon hanya sedikit.' },
      { img: 'clue_bin', text: 'Tempat sampah hijau & kuning KOSONG!' }
    ];

    let clueY = -modalHeight/2 + 230;
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
        fontFamily: 'monospace',
        fontSize: '26px',
        color: '#4b5563',
        wordWrap: { width: (modalWidth/2) - 250 }
      }).setOrigin(0, 0.5);

      leftElements.push(img, text);
      clueY += 140; // Jarak antar clue (karena ada gambar, jaraknya lebih besar)
    });

    // ==========================================
    // KOLOM KANAN (KUIS)
    // ==========================================
    const question = this.add.text(modalWidth/4, -modalHeight/2 + 250, 'Berdasarkan bukti di samping,\napa penyebab utama\nhalaman sekolah ini kotor?', {
      fontFamily: 'monospace',
      fontSize: '32px',
      color: '#1f2937',
      fontStyle: 'bold',
      align: 'center',
      wordWrap: { width: (modalWidth/2) - 100 }
    }).setOrigin(0.5);

    const options = [
      { id: 'A', text: 'Tempat sampah\nterlalu penuh', isCorrect: false },
      { id: 'B', text: 'Angin kencang\nmenerbangkan sampah', isCorrect: false },
      { id: 'C', text: 'Kurangnya kesadaran\nmembuang sampah pada tempatnya', isCorrect: true }
    ];

    let optionY = -modalHeight/2 + 370;
    const optionBtns: Phaser.GameObjects.Container[] = [];

    // Teks Error (muncul jika jawaban salah)
    const errorText = this.add.text(modalWidth/4, optionY + 360, '❌ Coba perhatikan lagi petunjuk\nyang sudah kamu temukan.', {
      fontFamily: 'monospace',
      fontSize: '24px',
      color: '#ef4444', // Red
      fontStyle: 'bold',
      align: 'center'
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

    modalContainer.add([shadow, paper, clip, title, lineTop, lineVert, ...leftElements, question, ...optionBtns, errorText]);

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
    const height = 65;

    const bg = this.add.graphics();
    bg.fillStyle(0xffffff, 1);
    bg.fillRoundedRect(-width/2, -height/2, width, height, 15);
    bg.lineStyle(3, 0x333333, 1);
    bg.strokeRoundedRect(-width/2, -height/2, width, height, 15);

    const prefixBg = this.add.graphics();
    prefixBg.fillStyle(0x3b82f6, 1);
    prefixBg.fillRoundedRect(-width/2, -height/2, 60, height, { tl: 15, bl: 15, tr: 0, br: 0 });
    prefixBg.lineStyle(3, 0x333333, 1);
    prefixBg.strokeRoundedRect(-width/2, -height/2, 60, height, { tl: 15, bl: 15, tr: 0, br: 0 });

    const prefixText = this.add.text(-width/2 + 30, 0, prefix, {
      fontFamily: 'monospace',
      fontSize: '28px',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    const labelText = this.add.text(-width/2 + 80, 0, text, {
      fontFamily: 'monospace',
      fontSize: '24px',
      color: '#1f2937',
      fontStyle: 'bold'
    }).setOrigin(0, 0.5);

    container.add([bg, prefixBg, prefixText, labelText]);

    const hitArea = new Phaser.Geom.Rectangle(-width/2, -height/2, width, height);
    container.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);

    container.on('pointerover', () => {
      this.input.setDefaultCursor('pointer');
      this.tweens.add({ targets: container, scale: 1.02, duration: 100 });
      bg.clear();
      bg.fillStyle(0xf3f4f6, 1);
      bg.fillRoundedRect(-width/2, -height/2, width, height, 15);
      bg.lineStyle(3, 0x333333, 1);
      bg.strokeRoundedRect(-width/2, -height/2, width, height, 15);
    });

    container.on('pointerout', () => {
      this.input.setDefaultCursor('default');
      this.tweens.add({ targets: container, scale: 1, duration: 100 });
      bg.clear();
      bg.fillStyle(0xffffff, 1);
      bg.fillRoundedRect(-width/2, -height/2, width, height, 15);
      bg.lineStyle(3, 0x333333, 1);
      bg.strokeRoundedRect(-width/2, -height/2, width, height, 15);
    });

    container.on('pointerdown', onClick);

    return container;
  }
}
