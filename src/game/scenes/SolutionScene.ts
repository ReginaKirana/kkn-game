import * as Phaser from 'phaser';
import halamanKotorBg from '../../assets/backgrounds/halaman-kotor.png';
import teacherThumbUp from '../../assets/characters/teachers/thumb-up.png';
import boyIdle from '../../assets/characters/boy/boy-idle.png';
import girlIdle from '../../assets/characters/girl/girl-idle.png';

export class SolutionScene extends Phaser.Scene {
  private caseId!: string;

  constructor() {
    super('SolutionScene');
  }

  preload() {
    this.load.image('halaman_kotor_bg', halamanKotorBg);
    this.load.image('teacher_thumbup', teacherThumbUp);
    this.load.image('boy_idle', boyIdle);
    this.load.image('girl_idle', girlIdle);
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
    // Geser guru sedikit ke kiri (0.2) agar ada ruang untuk murid
    const teacher = this.add.image(width * 0.2, height, 'teacher_thumbup').setOrigin(0.5, 1);
    // Skalakan proporsional
    const teacherMaxHeight = height * 0.85;
    const teacherMaxScale = teacherMaxHeight / teacher.height;
    teacher.setScale(teacherMaxScale);
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

    // 4. Player Character (Murid)
    const gender = this.registry.get('playerGender') || 'boy';
    const playerAsset = gender === 'boy' ? 'boy_idle' : 'girl_idle';
    
    // Tempatkan murid di sisi kanan (0.8)
    const player = this.add.image(width * 0.8, height, playerAsset).setOrigin(0.5, 1);
    const playerMaxHeight = height * 0.9; // Perbesar ukuran murid
    const playerMaxScale = playerMaxHeight / player.height;
    player.setScale(playerMaxScale);
    // Murid menghadap ke kiri (menatap guru)
    player.setFlipX(false);

    // Animasi masuk murid (muncul bersamaan dengan guru)
    player.y = height + 300;
    this.tweens.add({
      targets: player,
      y: height,
      duration: 600,
      delay: 200, // Muncul sedikit setelah guru
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
    const nameText = this.add.text(-dialogWidth/2 + 130, -dialogHeight/2, 'Ibu Guru', {
      fontFamily: 'monospace',
      fontSize: '28px',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    const playerName = this.registry.get('playerName') || 'Detektif';

    // Dialog Data Array
    const dialogues = [
      {
        speaker: 'Ibu Guru',
        text: "Benar sekali! Tempat sampah masih tersedia, tetapi masih ada orang yang membuang sampah sembarangan. Akibatnya halaman menjadi kotor.",
        color: 0x3b82f6 // Blue for Teacher
      },
      {
        speaker: playerName,
        text: "Wah, kita tidak boleh membiarkan ini, Bu! Ayo teman-teman, bantu aku mengumpulkan sampah-sampah ini dan membuangnya ke tempat sampah!",
        color: 0x16a34a // Green for Player
      }
    ];
    let currentDialogIndex = 0;
    let isTyping = false;
    
    const textObj = this.add.text(-dialogWidth/2 + 50, -dialogHeight/2 + 40, '', {
      fontFamily: 'monospace',
      fontSize: '32px',
      color: '#f8fafc',
      wordWrap: { width: dialogWidth - 100 },
      lineSpacing: 10
    });

    // Animasi Text Typewriter
    let currentTextCharIndex = 0;
    let typeWriterEvent: Phaser.Time.TimerEvent;

    const startTyping = () => {
      isTyping = true;
      textObj.text = '';
      currentTextCharIndex = 0;
      
      // Update Name Tag for current speaker
      const currentDialog = dialogues[currentDialogIndex];
      const isTeacher = currentDialog.speaker === 'Ibu Guru';
      
      nameText.text = currentDialog.speaker;
      nameBg.clear();
      nameBg.fillStyle(currentDialog.color, 1);
      
      if (isTeacher) {
        nameBg.fillRoundedRect(-dialogWidth/2 + 30, -dialogHeight/2 - 25, 200, 50, 10);
        nameText.x = -dialogWidth/2 + 130;
        
        // Visual Novel Zoom
        this.tweens.add({ targets: teacher, scale: teacherMaxScale, alpha: 1, duration: 300 });
        this.tweens.add({ targets: player, scale: playerMaxScale * 0.9, alpha: 0.6, duration: 300 });
      } else {
        nameBg.fillRoundedRect(dialogWidth/2 - 230, -dialogHeight/2 - 25, 200, 50, 10);
        nameText.x = dialogWidth/2 - 130;
        
        // Visual Novel Zoom
        this.tweens.add({ targets: player, scale: playerMaxScale, alpha: 1, duration: 300 });
        this.tweens.add({ targets: teacher, scale: teacherMaxScale * 0.9, alpha: 0.6, duration: 300 });
      }

      typeWriterEvent = this.time.addEvent({
        delay: 30, // Kecepatan mengetik
        repeat: currentDialog.text.length - 1,
        callback: () => {
          textObj.text += currentDialog.text[currentTextCharIndex];
          currentTextCharIndex++;
          if (currentTextCharIndex === currentDialog.text.length) {
            isTyping = false;
          }
        }
      });
    };

    startTyping();

    // Tombol Lanjut (Gaming Style)
    const btnWidth = 240; 
    const btnHeight = 55;
    const nextBtnY = dialogHeight/2 - 45;
    const nextBtnContainer = this.add.container(dialogWidth/2 - 150, nextBtnY);

    const shadow = this.add.graphics();
    shadow.fillStyle(0x000000, 0.4);
    shadow.fillRoundedRect(-btnWidth/2 + 3, -btnHeight/2 + 4, btnWidth, btnHeight, 15);

    const nextBtnBg = this.add.graphics();
    nextBtnBg.fillStyle(0x16a34a, 1); // Green
    nextBtnBg.fillRoundedRect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight, 15);
    nextBtnBg.lineStyle(4, 0xffffff, 0.3);
    nextBtnBg.strokeRoundedRect(-btnWidth/2 + 2, -btnHeight/2 + 2, btnWidth - 4, btnHeight - 4, 13);
    nextBtnBg.lineStyle(3, 0x000000, 1);
    nextBtnBg.strokeRoundedRect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight, 15);

    const nextBtnText = this.add.text(0, 0, 'LANJUT ➔', {
      fontFamily: 'Fredoka One, Arial, sans-serif',
      fontSize: '20px',
      color: '#ffffff',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 3,
      shadow: { offsetX: 2, offsetY: 2, color: '#000000', blur: 0, fill: true }
    }).setOrigin(0.5);

    nextBtnContainer.add([shadow, nextBtnBg, nextBtnText]);
    nextBtnContainer.setAlpha(0);

    // Munculkan tombol Lanjut setelah teks pertama selesai (kasih delay sedikit)
    this.time.delayedCall(dialogues[0].text.length * 30 + 500, () => {
      this.tweens.add({
        targets: nextBtnContainer,
        alpha: 1,
        duration: 300
      });
      
      const hitArea = new Phaser.Geom.Rectangle(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight);
      nextBtnContainer.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);
    });

    // Interaksi Tombol
    let isClicking = false;

    nextBtnContainer.on('pointerover', () => {
      if (isClicking) return;
      this.input.setDefaultCursor('pointer');
      
      nextBtnBg.clear();
      nextBtnBg.fillStyle(0x22c55e, 1); // Lighter green
      nextBtnBg.fillRoundedRect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight, 15);
      nextBtnBg.lineStyle(4, 0xffffff, 0.5);
      nextBtnBg.strokeRoundedRect(-btnWidth/2 + 2, -btnHeight/2 + 2, btnWidth - 4, btnHeight - 4, 13);
      nextBtnBg.lineStyle(3, 0x000000, 1);
      nextBtnBg.strokeRoundedRect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight, 15);
      
      nextBtnContainer.y = nextBtnY - 2;
      shadow.y = 2;
    });

    nextBtnContainer.on('pointerout', () => {
      if (isClicking) return;
      this.input.setDefaultCursor('default');
      
      nextBtnBg.clear();
      nextBtnBg.fillStyle(0x16a34a, 1);
      nextBtnBg.fillRoundedRect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight, 15);
      nextBtnBg.lineStyle(4, 0xffffff, 0.3);
      nextBtnBg.strokeRoundedRect(-btnWidth/2 + 2, -btnHeight/2 + 2, btnWidth - 4, btnHeight - 4, 13);
      nextBtnBg.lineStyle(3, 0x000000, 1);
      nextBtnBg.strokeRoundedRect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight, 15);
      
      nextBtnContainer.y = nextBtnY;
      shadow.y = 0;
    });

    nextBtnContainer.on('pointerdown', () => {
      this.input.setDefaultCursor('default');
      
      // Jika teks belum selesai, skip animasi
      if (isTyping) {
        typeWriterEvent.remove();
        textObj.text = dialogues[currentDialogIndex].text;
        isTyping = false;
        this.tweens.add({ targets: nextBtnContainer, alpha: 1, duration: 100 });
        const hitArea = new Phaser.Geom.Rectangle(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight);
        nextBtnContainer.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);
      } else {
        // Jika teks sudah selesai, cek apakah ada dialog berikutnya
        if (currentDialogIndex < dialogues.length - 1) {
          currentDialogIndex++;
          startTyping();
          
          if (currentDialogIndex === dialogues.length - 1) {
            nextBtnText.text = 'BERSIHKAN ➔';
          }
        } else {
          // Lanjut ke Solusi / Misi Bersih-bersih
          if (isClicking) return;
          isClicking = true;
          
          nextBtnContainer.y = nextBtnY + 4;
          shadow.y = -4;

          setTimeout(() => {
            this.scene.start('CleanUpScene', { caseId: this.caseId });
          }, 150);
        }
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
