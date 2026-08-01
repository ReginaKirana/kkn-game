import * as Phaser from 'phaser';

export class SolutionScene extends Phaser.Scene {
  private caseId!: string;

  constructor() {
    super('SolutionScene');
  }

  create(data: { caseId: string }) {
    this.caseId = data.caseId || 'kasus_halaman';
    const { width, height } = this.cameras.main;

    if (!this.sound.get('investigasi_bg')?.isPlaying) {
      this.sound.stopAll();
      const bgm = this.sound.add('investigasi_bg', { loop: true, volume: 0.4 });
      bgm.play();
    }

    // 1. Background
    const bg = this.add.image(width / 2, height / 2, 'halaman_kotor_bg');
    const scaleX = width / bg.width;
    const scaleY = height / bg.height;
    bg.setScale(Math.max(scaleX, scaleY));

    // 2. Dark Overlay
    this.add.rectangle(0, 0, width, height, 0x000000, 0.6).setOrigin(0, 0);

    // 3. Teacher Character
    const teacher = this.add.image(width * 0.2, height, 'teacher_thumbup').setOrigin(0.5, 1);
    const teacherMaxHeight = height * 0.82;
    const teacherMaxScale = teacherMaxHeight / teacher.height;
    teacher.setScale(teacherMaxScale);
    teacher.setFlipX(true);
    teacher.setAlpha(0);
    teacher.y = height;
    
    // Animasi fade in guru
    this.tweens.add({
      targets: teacher,
      alpha: 1,
      duration: 800,
      ease: 'Power2'
    });

    // 4. Player Character (Murid)
    const gender = this.registry.get('playerGender') || 'boy';
    const playerAsset = gender === 'boy' ? 'boy_idle' : 'girl_idle';
    
    const player = this.add.image(width * 0.8, height, playerAsset).setOrigin(0.5, 1);
    const playerMaxHeight = height * 0.97; 
    const playerMaxScale = playerMaxHeight / player.height;
    const initialPlayerScale = gender === 'girl' ? 0.98 : 1.0;
    player.setScale(playerMaxScale * initialPlayerScale * 1.0);
    player.setFlipX(false);
    player.setAlpha(0);
    const playerYOffset = gender === 'girl' ? 100 : 150;
    player.y = height + playerYOffset;

    // Animasi fade in murid
    this.tweens.add({
      targets: player,
      alpha: 0.6,
      duration: 800,
      delay: 300, // Muncul sedikit setelah guru
      ease: 'Power2'
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
        color: 0x3b82f6, // Blue for Teacher
        playerScale: { girl: 1.09 }
      },
      {
        speaker: playerName,
        text: "Wah, kita tidak boleh membiarkan ini, Bu! Ayo teman-teman, bantu aku mengumpulkan sampah-sampah ini dan membuangnya ke tempat sampah!",
        color: 0x16a34a, // Green for Player
        playerScale: { girl: 1.05 }
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
    let typingSound: Phaser.Sound.BaseSound | null = null;

    const startTyping = () => {
      isTyping = true;
      typingSound = this.sound.add('keyboard_typing', { loop: true, volume: 0.5 });
      typingSound.play();
      textObj.text = '';
      currentTextCharIndex = 0;
      
      // Update Name Tag for current speaker
      const currentDialog = dialogues[currentDialogIndex];
      const isTeacher = currentDialog.speaker === 'Ibu Guru';
      
      let customPlayerScale = 1.0;
      if (currentDialog.playerScale !== undefined) {
        if (typeof currentDialog.playerScale === 'number') {
          customPlayerScale = currentDialog.playerScale;
        } else {
          customPlayerScale = (currentDialog.playerScale as any)[gender] || 1.0;
        }
      } else {
        customPlayerScale = (gender === 'girl') ? 0.98 : 1.0;
      }
      
      nameText.text = currentDialog.speaker;
      nameBg.clear();
      nameBg.fillStyle(currentDialog.color, 1);
      
      if (isTeacher) {
        nameBg.fillRoundedRect(-dialogWidth/2 + 30, -dialogHeight/2 - 25, 200, 50, 10);
        nameText.x = -dialogWidth/2 + 130;
        
        // Visual Novel Zoom
        this.tweens.add({ targets: teacher, scale: teacherMaxScale, alpha: 1, duration: 300 });
        this.tweens.add({ targets: player, scale: playerMaxScale * customPlayerScale * 0.9, alpha: 0.6, duration: 300 });
      } else {
        nameBg.fillRoundedRect(dialogWidth/2 - 230, -dialogHeight/2 - 25, 200, 50, 10);
        nameText.x = dialogWidth/2 - 130;
        
        // Visual Novel Zoom
        this.tweens.add({ targets: player, scale: playerMaxScale * customPlayerScale, alpha: 1, duration: 300 });
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
            if (typingSound) typingSound.stop();
          }
        }
      });
    };

    startTyping();

    // Tombol Lanjut (Teks Saja)
    const nextBtnText = this.add.text(dialogWidth / 2 - 30, dialogHeight / 2 - 20, 'Lanjut ➔', {
      fontFamily: 'monospace',
      fontSize: '26px',
      color: '#4ade80',
      fontStyle: 'bold'
    }).setOrigin(1, 1).setAlpha(0).setInteractive({ useHandCursor: true });

    // Munculkan tombol Lanjut setelah teks pertama selesai (kasih delay sedikit)
    this.time.delayedCall(dialogues[0].text.length * 30 + 500, () => {
      this.tweens.add({
        targets: nextBtnText,
        alpha: 1,
        duration: 300
      });
    });

    // Tombol Bersihkan (Gaming Style, Blue)
    const bersihkanBtn = this.add.container(dialogWidth / 2 - 110, dialogHeight / 2 - 40);
    const bersihkanBg = this.add.graphics();
    bersihkanBg.fillStyle(0x3b82f6, 1);
    bersihkanBg.fillRoundedRect(-85, -25, 170, 50, 15);
    
    const bersihkanText = this.add.text(0, 0, 'Bersihkan', {
      fontFamily: 'monospace',
      fontSize: '22px',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    bersihkanBtn.add([bersihkanBg, bersihkanText]);
    bersihkanBtn.setAlpha(0);
    
    const bersihkanHitArea = new Phaser.Geom.Rectangle(-85, -25, 170, 50);
    bersihkanBtn.setInteractive(bersihkanHitArea, Phaser.Geom.Rectangle.Contains);
    
    bersihkanBtn.on('pointerover', () => {
      this.input.setDefaultCursor('pointer');
      bersihkanBg.clear();
      bersihkanBg.fillStyle(0x2563eb, 1);
      bersihkanBg.fillRoundedRect(-85, -25, 170, 50, 15);
    });
    
    bersihkanBtn.on('pointerout', () => {
      this.input.setDefaultCursor('default');
      bersihkanBg.clear();
      bersihkanBg.fillStyle(0x3b82f6, 1);
      bersihkanBg.fillRoundedRect(-85, -25, 170, 50, 15);
    });

    // Interaksi Tombol Lanjut (Teks Saja)
    let isClicking = false;

    nextBtnText.on('pointerover', () => {
      if (isClicking) return;
      nextBtnText.setColor('#22c55e');
    });

    nextBtnText.on('pointerout', () => {
      if (isClicking) return;
      nextBtnText.setColor('#4ade80');
    });

    // Klik dimana saja di dalam dialog untuk lanjut/skip
    const hitArea = new Phaser.Geom.Rectangle(-dialogWidth / 2, -dialogHeight / 2, dialogWidth, dialogHeight);
    const interactiveBg = this.add.zone(0, 0, dialogWidth, dialogHeight);
    interactiveBg.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);
    
    interactiveBg.on('pointerover', () => {
      this.input.setDefaultCursor('pointer');
    });
    
    interactiveBg.on('pointerout', () => {
      this.input.setDefaultCursor('default');
    });

    const handleNextDialog = () => {
      if (isClicking) return;
      this.sound.play('button_click', { volume: 0.9, seek: 0.8 });
      
      // Jika teks belum selesai, skip animasi
      if (isTyping) {
        typeWriterEvent.destroy();
        textObj.text = dialogues[currentDialogIndex].text;
        isTyping = false;
        if (typingSound) typingSound.stop();
        
        if (currentDialogIndex === dialogues.length - 1) {
          this.tweens.add({ targets: bersihkanBtn, alpha: 1, duration: 100 });
        } else {
          this.tweens.add({ targets: nextBtnText, alpha: 1, duration: 100 });
        }
      } else {
        // Jika teks sudah selesai, cek apakah ada dialog berikutnya
        if (currentDialogIndex < dialogues.length - 1) {
          currentDialogIndex++;
          startTyping();
          nextBtnText.setAlpha(0); // Sembunyikan lagi saat mengetik
          
          this.time.delayedCall(dialogues[currentDialogIndex].text.length * 30 + 500, () => {
            if (currentDialogIndex === dialogues.length - 1) {
              this.tweens.add({ targets: bersihkanBtn, alpha: 1, duration: 300 });
            } else {
              this.tweens.add({ targets: nextBtnText, alpha: 1, duration: 300 });
            }
          });
        }
      }
    };

    interactiveBg.on('pointerdown', handleNextDialog);
    nextBtnText.on('pointerdown', handleNextDialog);

    bersihkanBtn.on('pointerdown', () => {
      if (isClicking) return;
      isClicking = true;
      this.input.setDefaultCursor('default');
      this.sound.play('button_click', { volume: 0.9, seek: 0.8 });
      
      setTimeout(() => {
        this.scene.start('CleanUpScene', { caseId: this.caseId });
      }, 150);
    });

    dialogContainer.add([dialogBg, interactiveBg, nameBg, nameText, textObj, nextBtnText, bersihkanBtn]);

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
