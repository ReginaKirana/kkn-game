import * as Phaser from 'phaser';

// New imports for teacher

export class ConclusionScene extends Phaser.Scene {
  private caseId!: string;
  private bgMusic!: Phaser.Sound.BaseSound;
  private typingSound!: Phaser.Sound.BaseSound;

  constructor() {
    super('ConclusionScene');
  }

  create(data: { caseId: string }) {
    this.caseId = data.caseId || 'kasus_halaman';
    const { width, height } = this.cameras.main;

    this.bgMusic = this.sound.add('investigation_bgm', { loop: true, volume: 0.4 });
    this.bgMusic.play();
    this.typingSound = this.sound.add('typing_sfx', { loop: true, volume: 1 });

    this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
      if (this.bgMusic) this.bgMusic.stop();
      if (this.typingSound) this.typingSound.stop();
    });

    // Background
    const bg = this.add.image(width / 2, height / 2, 'halaman_kotor_bg');
    const scaleX = width / bg.width;
    const scaleY = height / bg.height;
    bg.setScale(Math.max(scaleX, scaleY));

    // Overlay
    this.add.rectangle(0, 0, width, height, 0x000000, 0.7).setOrigin(0, 0);

    // ==========================================
    // TEACHER SETUP (Left Side)
    // ==========================================
    const teacher = this.add.image(width * 0.18, height, 'teacher_surprised').setOrigin(0.5, 1);
    const teacherMaxHeight = height * 0.85;
    teacher.setScale(teacherMaxHeight / teacher.height);
    teacher.setFlipX(true);
    teacher.setAlpha(0);

    // Dialog Box for Teacher
    const dialogContainer = this.add.container(width * 0.18, height * 0.15);
    dialogContainer.setAlpha(0);

    const dialogW = width * 0.32;
    const dialogH = 180;

    const dialogBg = this.add.graphics();
    dialogBg.fillStyle(0x0f172a, 0.9);
    dialogBg.fillRoundedRect(-dialogW / 2, -dialogH / 2, dialogW, dialogH, 20);
    dialogBg.lineStyle(4, 0x3b82f6, 1);
    dialogBg.strokeRoundedRect(-dialogW / 2, -dialogH / 2, dialogW, dialogH, 20);

    // Tail
    dialogBg.fillStyle(0x0f172a, 0.9);
    dialogBg.beginPath();
    dialogBg.moveTo(0, dialogH / 2);
    dialogBg.lineTo(20, dialogH / 2 + 30);
    dialogBg.lineTo(40, dialogH / 2);
    dialogBg.fillPath();
    dialogBg.lineStyle(4, 0x3b82f6, 1);
    dialogBg.beginPath();
    dialogBg.moveTo(0, dialogH / 2);
    dialogBg.lineTo(20, dialogH / 2 + 30);
    dialogBg.lineTo(40, dialogH / 2);
    dialogBg.strokePath();

    const dialogText = this.add.text(0, -15, '', {
      fontFamily: 'monospace',
      fontSize: '24px',
      color: '#ffffff',
      wordWrap: { width: dialogW - 60 },
      lineSpacing: 8,
      align: 'center'
    }).setOrigin(0.5);

    const nextBtn = this.add.text(dialogW / 2 - 20, dialogH / 2 - 15, 'Lanjut ➔', {
      fontFamily: 'monospace',
      fontSize: '22px',
      color: '#4ade80',
      fontStyle: 'bold'
    }).setOrigin(1, 1).setInteractive({ useHandCursor: true });

    nextBtn.on('pointerover', () => nextBtn.setColor('#22c55e'));
    nextBtn.on('pointerout', () => nextBtn.setColor('#4ade80'));

    nextBtn.setVisible(false);

    dialogContainer.add([dialogBg, dialogText, nextBtn]);

    // ==========================================
    // MODAL LAPORAN (Right Side)
    // ==========================================
    // Posisi di kanan
    const modalContainer = this.add.container(width * 0.65, height / 2);

    const modalWidth = 1200;
    const modalHeight = 850;

    const shadow = this.add.graphics();
    shadow.fillStyle(0x000000, 0.5);
    shadow.fillRoundedRect(-modalWidth / 2 + 10, -modalHeight / 2 + 15, modalWidth, modalHeight, 20);

    const paper = this.add.graphics();
    paper.fillStyle(0x0f172a, 0.95);
    paper.fillRoundedRect(-modalWidth / 2, -modalHeight / 2, modalWidth, modalHeight, 20);
    paper.lineStyle(6, 0x3b82f6, 1);
    paper.strokeRoundedRect(-modalWidth / 2, -modalHeight / 2, modalWidth, modalHeight, 20);

    const title = this.add.text(0, -modalHeight / 2 + 60, 'LAPORAN INVESTIGASI', {
      fontFamily: 'Fredoka One, Arial, sans-serif',
      fontSize: '42px',
      color: '#ffffff',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 6,
      shadow: { offsetX: 2, offsetY: 2, color: '#000000', blur: 0, fill: true }
    }).setOrigin(0.5);

    const lineTop = this.add.graphics();
    lineTop.lineStyle(4, 0x3b82f6, 0.8);
    lineTop.beginPath();
    lineTop.moveTo(-modalWidth / 2 + 50, -modalHeight / 2 + 120);
    lineTop.lineTo(modalWidth / 2 - 50, -modalHeight / 2 + 120);
    lineTop.strokePath();

    const lineVert = this.add.graphics();
    lineVert.lineStyle(4, 0x3b82f6, 0.8);
    lineVert.beginPath();
    lineVert.moveTo(0, -modalHeight / 2 + 120);
    lineVert.lineTo(0, modalHeight / 2 - 50);
    lineVert.strokePath();
    lineVert.setAlpha(0); // Hide initially

    // Kolom Kiri
    const leftColumn = this.add.container(0, 0);
    const cluesTitle = this.add.text(-modalWidth / 2 + 50, -modalHeight / 2 + 150, 'Bukti Ditemukan:', {
      fontFamily: 'Fredoka One, Arial, sans-serif',
      fontSize: '28px',
      color: '#60a5fa',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 4
    });
    leftColumn.add(cluesTitle);

    const clueData = [
      { img: 'clue_botol', text: 'Botol plastik dibuang sembarangan di halaman.' },
      { img: 'clue_pisang', text: 'Kulit pisang dibiarkan begitu saja.' },
      { img: 'clue_daun', text: 'Daun gugur itu alami dan bisa menyatu dengan tanah.' },
      { img: 'clue_bin', text: 'Tempat sampah masih tersedia, tapi KOSONG!' }
    ];

    let clueY = -modalHeight / 2 + 250;
    const clueContainers: Phaser.GameObjects.Container[] = [];

    clueData.forEach((clue) => {
      const clueCont = this.add.container(0, 0);
      const img = this.add.image(-modalWidth / 2 + 110, clueY, clue.img);
      const maxImgSize = 90;
      const scale = Math.min(maxImgSize / img.width, maxImgSize / img.height);
      img.setScale(scale);

      const text = this.add.text(-modalWidth / 2 + 180, clueY, clue.text, {
        fontFamily: 'Fredoka One, Arial, sans-serif',
        fontSize: '28px',
        color: '#e2e8f0',
        wordWrap: { width: (modalWidth / 2) - 210 },
        lineSpacing: 8
      }).setOrigin(0, 0.5);

      clueCont.add([img, text]);
      clueCont.setAlpha(0); // Hide initially
      clueContainers.push(clueCont);
      leftColumn.add(clueCont);
      clueY += 150;
    });

    // Kolom Kanan
    const rightColumn = this.add.container(0, 0);
    const question = this.add.text(modalWidth / 4, -modalHeight / 2 + 220, 'Dari bukti-bukti tersebut,\napa yang dapat kamu\nsimpulkan?', {
      fontFamily: 'Fredoka One, Arial, sans-serif',
      fontSize: '34px',
      color: '#facc15',
      fontStyle: 'bold',
      align: 'center',
      wordWrap: { width: (modalWidth / 2) - 80 },
      stroke: '#000000',
      strokeThickness: 5,
      shadow: { offsetX: 2, offsetY: 2, color: '#000000', blur: 0, fill: true },
      lineSpacing: 10
    }).setOrigin(0.5);

    const options = [
      { id: 'A', text: 'Tempat sampah\nterlalu penuh', isCorrect: false },
      { id: 'B', text: 'Angin kencang\nmenerbangkan sampah', isCorrect: false },
      { id: 'C', text: 'Ada orang yang membuang\nsampah sembarangan', isCorrect: true }
    ];

    let optionY = -modalHeight / 2 + 370;
    const optionBtns: Phaser.GameObjects.Container[] = [];

    const errorText = this.add.text(modalWidth / 4, optionY + 360, '❌ Perhatikan lagi petunjuk\nyang sudah kamu temukan.', {
      fontFamily: 'Fredoka One, Arial, sans-serif',
      fontSize: '25px',
      color: '#ef4444',
      fontStyle: 'bold',
      align: 'center',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5);
    errorText.setAlpha(0);

    options.forEach((opt) => {
      const btnW = (modalWidth / 2) - 80;
      const btn = this.createOptionButton(modalWidth / 4, optionY, opt.id, opt.text, btnW, (bg, prefixBg) => {
        this.input.setDefaultCursor('default');
        this.sound.play('btn_click', { seek: 0.8 });

        if (opt.isCorrect) {
          this.sound.play('correct_sfx');
          
          this.tweens.killTweensOf(errorText);
          errorText.setAlpha(0);

          // Visual Feedback: Ubah warna tombol jadi Hijau
          bg.clear();
          bg.fillStyle(0x22c55e, 1);
          bg.fillRoundedRect(-btnW / 2, -55, btnW, 110, 15);
          bg.lineStyle(4, 0xffffff, 0.8);
          bg.strokeRoundedRect(-btnW / 2 + 2, -55 + 2, btnW - 4, 110 - 4, 13);

          prefixBg.clear();
          prefixBg.fillStyle(0x16a34a, 1);
          prefixBg.fillRoundedRect(-btnW / 2, -55, 60, 110, { tl: 15, bl: 15, tr: 0, br: 0 });

          // Visual Feedback: Teks BENAR popup
          const correctText = this.add.text(modalWidth / 4, optionY, 'BENAR!', {
            fontFamily: 'Fredoka One, Arial, sans-serif',
            fontSize: '42px',
            color: '#4ade80',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 6,
            shadow: { offsetX: 3, offsetY: 3, color: '#000000', blur: 0, fill: true }
          }).setOrigin(0.5).setScale(0);

          rightColumn.add(correctText);

          this.tweens.add({
            targets: correctText,
            scale: 1.2,
            y: optionY - 10,
            duration: 400,
            ease: 'Back.easeOut',
            onComplete: () => {
              this.tweens.add({
                targets: correctText,
                scale: 1,
                duration: 200
              });
            }
          });

          // Lock all buttons to prevent hover state resetting the green color
          optionBtns.forEach(b => b.setData('locked', true));

          // Jeda sebentar sebelum pindah scene agar user bisa melihat feedback
          this.time.delayedCall(2000, () => {
            if (this.bgMusic) this.bgMusic.stop();
            this.scene.start('SolutionScene', { caseId: this.caseId });
          });

        } else {
          // Extra volume for wrong sound as requested
          this.sound.play('wrong_sfx', { volume: 2.0 });
          errorText.setAlpha(1);

          this.registry.set('ecoPoints', (this.registry.get('ecoPoints') || 0) - 100);

          const epMinusText = this.add.text(modalWidth / 4, optionY, '-100 EP', {
            fontFamily: 'Fredoka One, Arial, sans-serif',
            fontSize: '32px',
            color: '#dc2626',
            stroke: '#000000',
            strokeThickness: 5
          }).setOrigin(0.5);
          
          rightColumn.add(epMinusText);

          this.tweens.add({
            targets: epMinusText,
            y: '-=50',
            duration: 500,
            ease: 'Power2',
            onComplete: () => {
              this.tweens.add({
                targets: epMinusText,
                alpha: 0,
                delay: 1500,
                duration: 500,
                onComplete: () => epMinusText.destroy()
              });
            }
          });

          this.tweens.add({
            targets: errorText,
            x: modalWidth / 4 + 10,
            duration: 50,
            yoyo: true,
            repeat: 3,
            onComplete: () => errorText.setX(modalWidth / 4)
          });
          this.time.delayedCall(3000, () => {
            this.tweens.add({ targets: errorText, alpha: 0, duration: 300 });
          });
        }
      });
      optionBtns.push(btn);
      optionY += 125;
    });

    rightColumn.add([question, ...optionBtns, errorText]);
    rightColumn.setAlpha(0); // Hide initially

    modalContainer.add([shadow, paper, title, lineTop, lineVert, leftColumn, rightColumn]);

    const targetScale = 0.82;
    modalContainer.setScale(targetScale);
    modalContainer.setAlpha(0);

    // ==========================================
    // SEQUENCE ANIMATION
    // ==========================================
    let currentStep = 0;
    let typeWriterEvent: Phaser.Time.TimerEvent;

    const startTyping = (text: string) => {
      dialogText.text = '';
      let charIndex = 0;
      nextBtn.setVisible(false);

      if (this.typingSound && !this.typingSound.isPlaying) {
        this.typingSound.play();
      }

      typeWriterEvent = this.time.addEvent({
        delay: 35,
        repeat: text.length - 1,
        callback: () => {
          dialogText.text += text[charIndex];
          charIndex++;
          if (charIndex === text.length) {
            if (this.typingSound) this.typingSound.stop();
            nextBtn.setVisible(true);
          }
        }
      });
    };

    const runStep = () => {
      if (currentStep === 0) {
        // Step 0: Show teacher and first dialog
        this.tweens.add({
          targets: [teacher, dialogContainer],
          alpha: 1,
          duration: 500,
          onComplete: () => {
            startTyping("Kamu sudah mengumpulkan 4 bukti. Sekarang, cermati semua bukti yang kamu temukan.");
          }
        });
      }
      else if (currentStep === 1) {
        // Step 1: Show modal and clues one by one
        nextBtn.setVisible(false);
        this.sound.play('modal_sfx', { seek: 0.651 });

        this.tweens.add({
          targets: modalContainer,
          alpha: 1,
          scale: { from: 0.5, to: targetScale },
          ease: 'Back.easeOut',
          duration: 500,
          onComplete: () => {
            // Animate clues popping in one by one
            clueContainers.forEach((clueC, index) => {
              this.time.delayedCall(index * 700, () => {
                this.sound.play('btn_click', { seek: 0.8, volume: 0.5 });
                this.tweens.add({
                  targets: clueC,
                  alpha: 1,
                  x: { from: -50, to: 0 },
                  duration: 400,
                  ease: 'Power2'
                });
              });
            });

            // Proceed to next teacher dialog after clues are shown
            this.time.delayedCall(clueContainers.length * 700 + 500, () => {
              currentStep++;
              runStep();
            });
          }
        });
      }
      else if (currentStep === 2) {
        // Step 2: Teacher changes expression and says next line
        teacher.setTexture('teacher_smile');
        startTyping("Sekarang isi laporan investigasimu!");
      }
      else if (currentStep === 3) {
        // Step 3: Show right column (Quiz)
        nextBtn.setVisible(false); // Hide it permanently as they need to answer the quiz
        this.sound.play('btn_click', { seek: 0.8, volume: 0.7 });
        this.tweens.add({
          targets: [lineVert, rightColumn],
          alpha: 1,
          duration: 500
        });
      }
    };

    nextBtn.on('pointerover', () => nextBtn.setColor('#22c55e'));
    nextBtn.on('pointerout', () => nextBtn.setColor('#4ade80'));
    nextBtn.on('pointerdown', () => {
      this.sound.play('btn_click', { seek: 0.8 });

      // If typing, finish typing immediately
      if (typeWriterEvent && typeWriterEvent.getProgress() < 1) {
        typeWriterEvent.remove();
        if (this.typingSound) this.typingSound.stop();

        if (currentStep === 0) {
          dialogText.text = "Kamu sudah mengumpulkan 4 bukti. Sekarang, cermati semua bukti yang kamu temukan.";
        } else if (currentStep === 2) {
          dialogText.text = "Sekarang isi laporan investigasimu!";
        }
        nextBtn.setVisible(true);
      } else {
        // proceed to next step
        currentStep++;
        runStep();
      }
    });

    // Start Sequence
    this.time.delayedCall(500, () => runStep());
  }

  private createOptionButton(x: number, y: number, prefix: string, text: string, width: number, onClick: (bg: Phaser.GameObjects.Graphics, prefixBg: Phaser.GameObjects.Graphics) => void) {
    const container = this.add.container(x, y);
    const height = 110;

    const shadow = this.add.graphics();
    shadow.fillStyle(0x000000, 0.4);
    shadow.fillRoundedRect(-width / 2 + 4, -height / 2 + 6, width, height, 15);

    const bg = this.add.graphics();
    bg.fillStyle(0x1e3a8a, 1);
    bg.fillRoundedRect(-width / 2, -height / 2, width, height, 15);
    bg.lineStyle(4, 0xffffff, 0.2);
    bg.strokeRoundedRect(-width / 2 + 2, -height / 2 + 2, width - 4, height - 4, 13);
    bg.lineStyle(3, 0x000000, 1);
    bg.strokeRoundedRect(-width / 2, -height / 2, width, height, 15);

    const prefixBg = this.add.graphics();
    prefixBg.fillStyle(0x3b82f6, 1);
    prefixBg.fillRoundedRect(-width / 2, -height / 2, 60, height, { tl: 15, bl: 15, tr: 0, br: 0 });
    prefixBg.lineStyle(3, 0x000000, 1);
    prefixBg.strokeRoundedRect(-width / 2, -height / 2, 60, height, { tl: 15, bl: 15, tr: 0, br: 0 });

    const prefixText = this.add.text(-width / 2 + 30, 0, prefix, {
      fontFamily: 'Fredoka One, Arial, sans-serif',
      fontSize: '32px',
      color: '#ffffff',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 4,
      shadow: { offsetX: 2, offsetY: 2, color: '#000000', blur: 0, fill: true }
    }).setOrigin(0.5);

    const labelText = this.add.text(-width / 2 + 75, 0, text, {
      fontFamily: 'Fredoka One, Arial, sans-serif',
      fontSize: '26px',
      color: '#ffffff',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 3,
      lineSpacing: 5
    }).setOrigin(0, 0.5);

    container.add([shadow, bg, prefixBg, prefixText, labelText]);

    const hitArea = new Phaser.Geom.Rectangle(-width / 2, -height / 2, width, height);
    container.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);

    let isClicking = false;

    container.on('pointerover', () => {
      if (isClicking || container.getData('locked')) return;
      this.input.setDefaultCursor('pointer');
      bg.clear();
      bg.fillStyle(0x3b82f6, 1);
      bg.fillRoundedRect(-width / 2, -height / 2, width, height, 15);
      bg.lineStyle(4, 0xffffff, 0.5);
      bg.strokeRoundedRect(-width / 2 + 2, -height / 2 + 2, width - 4, height - 4, 13);
      bg.lineStyle(3, 0x000000, 1);
      bg.strokeRoundedRect(-width / 2, -height / 2, width, height, 15);
      container.y -= 2;
      shadow.y = 2;
    });

    container.on('pointerout', () => {
      if (isClicking || container.getData('locked')) return;
      this.input.setDefaultCursor('default');
      bg.clear();
      bg.fillStyle(0x1e3a8a, 1);
      bg.fillRoundedRect(-width / 2, -height / 2, width, height, 15);
      bg.lineStyle(4, 0xffffff, 0.2);
      bg.strokeRoundedRect(-width / 2 + 2, -height / 2 + 2, width - 4, height - 4, 13);
      bg.lineStyle(3, 0x000000, 1);
      bg.strokeRoundedRect(-width / 2, -height / 2, width, height, 15);
      container.y = y;
      shadow.y = 0;
    });

    container.on('pointerdown', () => {
      if (isClicking || container.getData('locked')) return;
      isClicking = true;
      this.input.setDefaultCursor('default');
      container.y = y + 4;
      shadow.y = -4;

      setTimeout(() => {
        onClick(bg, prefixBg);
        isClicking = false;
        container.y = y;
        shadow.y = 0;
      }, 150);
    });

    return container;
  }
}
