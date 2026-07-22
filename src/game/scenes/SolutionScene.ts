import * as Phaser from 'phaser';
import halamanKotorBg from '../../assets/backgrounds/halaman-kotor.png';
import teacherThumbUp from '../../assets/characters/teachers/thumb-up.png';

export class SolutionScene extends Phaser.Scene {
  private caseId!: string;

  constructor() {
    super('SolutionScene');
  }

  preload() {
    this.load.image('halaman_kotor_bg', halamanKotorBg);
    this.load.image('teacher_thumbup', teacherThumbUp);
  }

  create(data: { caseId: string }) {
    this.caseId = data.caseId || 'kasus_halaman';
    const { width, height } = this.cameras.main;

    // 1. Background
    const bg = this.add.image(width / 2, height / 2, 'halaman_kotor_bg');
    const scaleX = width / bg.width;
    const scaleY = height / bg.height;
    bg.setScale(Math.max(scaleX, scaleY));

    // 2. Dark Overlay
    this.add.rectangle(0, 0, width, height, 0x000000, 0.6).setOrigin(0, 0);

    // 3. Teacher Character
    const teacher = this.add.image(width * 0.25, height, 'teacher_thumbup').setOrigin(0.5, 1);
    // Skalakan proporsional
    const teacherMaxHeight = height * 0.85;
    teacher.setScale(teacherMaxHeight / teacher.height);
    // Balik gambar guru secara horizontal (flip X)
    teacher.setFlipX(true);
    
    // Animasi masuk guru dari bawah
    teacher.y = height + 300;
    this.tweens.add({
      targets: teacher,
      y: height,
      duration: 600,
      ease: 'Back.easeOut'
    });

    // 4. Kotak Dialog (Gaming Style)
    const dialogContainer = this.add.container(width / 2, height - 150);
    const dialogWidth = width * 0.8;
    const dialogHeight = 220;

    // Background Dialog Box (Semi-transparent dark blue/black)
    const dialogBg = this.add.graphics();
    dialogBg.fillStyle(0x0f172a, 0.85); // Slate 900
    dialogBg.fillRoundedRect(-dialogWidth/2, -dialogHeight/2, dialogWidth, dialogHeight, 20);
    dialogBg.lineStyle(4, 0x3b82f6, 1); // Blue border
    dialogBg.strokeRoundedRect(-dialogWidth/2, -dialogHeight/2, dialogWidth, dialogHeight, 20);

    // Name Tag
    const nameBg = this.add.graphics();
    nameBg.fillStyle(0x3b82f6, 1);
    nameBg.fillRoundedRect(-dialogWidth/2 + 30, -dialogHeight/2 - 25, 200, 50, 10);
    const nameText = this.add.text(-dialogWidth/2 + 130, -dialogHeight/2, 'Ibu Guru', {
      fontFamily: 'monospace',
      fontSize: '28px',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Dialog Text
    const dialogTextContent = "Benar sekali! Tempat sampah masih tersedia, tetapi masih ada orang yang membuang sampah sembarangan. Akibatnya halaman menjadi kotor.";
    
    const textObj = this.add.text(-dialogWidth/2 + 50, -dialogHeight/2 + 40, '', {
      fontFamily: 'monospace',
      fontSize: '32px',
      color: '#f8fafc',
      wordWrap: { width: dialogWidth - 100 },
      lineSpacing: 10
    });

    // Animasi Text Typewriter
    let currentTextIndex = 0;
    const typeWriterEvent = this.time.addEvent({
      delay: 30, // Kecepatan mengetik
      repeat: dialogTextContent.length - 1,
      callback: () => {
        textObj.text += dialogTextContent[currentTextIndex];
        currentTextIndex++;
      }
    });

    // Tombol Lanjut
    const nextBtnContainer = this.add.container(dialogWidth/2 - 120, dialogHeight/2 - 40);
    const nextBtnBg = this.add.graphics();
    nextBtnBg.fillStyle(0x22c55e, 1); // Green
    nextBtnBg.fillRoundedRect(-75, -25, 150, 50, 15);
    nextBtnBg.lineStyle(2, 0xffffff, 1);
    nextBtnBg.strokeRoundedRect(-75, -25, 150, 50, 15);

    const nextBtnText = this.add.text(0, 0, 'LANJUT ➔', {
      fontFamily: 'monospace',
      fontSize: '22px',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    nextBtnContainer.add([nextBtnBg, nextBtnText]);
    nextBtnContainer.setAlpha(0);

    // Munculkan tombol Lanjut setelah teks selesai
    this.time.delayedCall(dialogTextContent.length * 30 + 500, () => {
      this.tweens.add({
        targets: nextBtnContainer,
        alpha: 1,
        duration: 300
      });
      
      const hitArea = new Phaser.Geom.Rectangle(-75, -25, 150, 50);
      nextBtnContainer.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);
    });

    // Interaksi Tombol
    nextBtnContainer.on('pointerover', () => {
      this.input.setDefaultCursor('pointer');
      this.tweens.add({ targets: nextBtnContainer, scale: 1.05, duration: 100 });
    });

    nextBtnContainer.on('pointerout', () => {
      this.input.setDefaultCursor('default');
      this.tweens.add({ targets: nextBtnContainer, scale: 1, duration: 100 });
    });

    nextBtnContainer.on('pointerdown', () => {
      this.input.setDefaultCursor('default');
      
      // Jika teks belum selesai, skip animasi
      if (currentTextIndex < dialogTextContent.length) {
        typeWriterEvent.remove();
        textObj.text = dialogTextContent;
        currentTextIndex = dialogTextContent.length;
        this.tweens.add({ targets: nextBtnContainer, alpha: 1, duration: 100 });
        const hitArea = new Phaser.Geom.Rectangle(-75, -25, 150, 50);
        nextBtnContainer.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);
      } else {
        // Lanjut ke Solusi / Misi Bersih-bersih
        this.scene.start('CleanUpScene', { caseId: this.caseId });
      }
    });

    dialogContainer.add([dialogBg, nameBg, nameText, textObj, nextBtnContainer]);

    // Efek Pop in dialog
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
  }
}
