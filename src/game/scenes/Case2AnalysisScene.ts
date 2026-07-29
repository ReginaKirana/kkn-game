import * as Phaser from 'phaser';

import case1GameBg from '../../assets/backgrounds/case1-game.png';
import thumbUpTeacher from '../../assets/characters/teachers/thumb-up.png';
import surprisedTeacher from '../../assets/characters/teachers/suprised.png';
import smileTeacher from '../../assets/characters/teachers/smile.png';
import boyIdle from '../../assets/characters/boy/boy-idle.png';
import girlIdle from '../../assets/characters/girl/girl-idle.png';
import { createBackButton } from '../utils/UIUtils';
import investigasiBgmUrl from '../../assets/audio/investigasi.mp3';
import karakterMunculUrl from '../../assets/audio/sfx/karakter-muncul.wav';
import keyboardTypingUrl from '../../assets/audio/keyboard-typing.wav';
import btnClickUrl from '../../assets/audio/button_click.mp3';
import wrongUrl from '../../assets/audio/case1/wrong.wav';
import correctUrl from '../../assets/audio/case1/correct.wav';
import misiMulaiUrl from '../../assets/audio/case1/misi-mulai.wav';

export class Case2AnalysisScene extends Phaser.Scene {
  private teacher!: Phaser.GameObjects.Image;
  private player!: Phaser.GameObjects.Image;
  private dialogContainer!: Phaser.GameObjects.Container;
  private textObj!: Phaser.GameObjects.Text;
  private optionsContainer!: Phaser.GameObjects.Container;
  private typeWriterEvent!: Phaser.Time.TimerEvent;
  private nextBtnContainer!: Phaser.GameObjects.Container;
  private nextBtnText!: Phaser.GameObjects.Text;
  
  private currentDialogIndex = 0;
  private isTyping = false;
  private isClicking = false;
  private bgMusic!: Phaser.Sound.BaseSound;
  private typingSound!: Phaser.Sound.BaseSound;
  
  private teacherMaxScale = 1;
  private playerMaxScale = 1;

  private dialogs = [
    {
      speaker: 'Ibu Guru',
      text: "Sekarang semua petunjuk sudah ditemukan.",
      color: 0x3b82f6,
      teacherKey: 'teacher_smile'
    },
    {
      speaker: 'Ibu Guru',
      text: "Menurutmu, mengapa sampah perlu dipilah?",
      color: 0x3b82f6,
      teacherKey: 'teacher_surprised',
      showOptions: true
    },
    {
      speaker: 'Detektif',
      text: "Agar dapat diolah kembali sesuai jenisnya!",
      color: 0x16a34a,
      teacherKey: 'teacher_surprised'
    },
    {
      speaker: 'Ibu Guru',
      text: "Benar! Sampah perlu dipilah agar dapat diolah sesuai jenisnya.",
      color: 0x3b82f6,
      teacherKey: 'teacher_thumbup',
      isEnd: true
    }
  ];

  constructor() {
    super('Case2AnalysisScene');
  }

  preload() {
    this.load.image('case1_game_bg', case1GameBg);
    this.load.image('teacher_thumbup', thumbUpTeacher);
    this.load.image('teacher_surprised', surprisedTeacher);
    this.load.image('teacher_smile', smileTeacher);
    this.load.image('boy_idle', boyIdle);
    this.load.image('girl_idle', girlIdle);
    this.load.audio('investigasi_bgm', investigasiBgmUrl);
    this.load.audio('karakter_muncul', karakterMunculUrl);
    this.load.audio('keyboard_typing', keyboardTypingUrl);
    this.load.audio('btn_click', btnClickUrl);
    this.load.audio('wrong', wrongUrl);
    this.load.audio('correct', correctUrl);
    this.load.audio('misi_mulai', misiMulaiUrl);
  }

  create() {
    const { width, height } = this.cameras.main;
    this.currentDialogIndex = 0;

    // Background
    const bg = this.add.image(width / 2, height / 2, 'case1_game_bg');
    bg.setScale(Math.max(width / bg.width, height / bg.height));

    // Dark Overlay
    const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.7).setOrigin(0, 0);
    overlay.setAlpha(0);
    this.tweens.add({ targets: overlay, alpha: 0.7, duration: 600 });

    // Teacher Character
    this.teacher = this.add.image(width * 0.2, height, 'teacher_smile').setOrigin(0.5, 1);
    this.teacher.setFlipX(true);
    const teacherMaxHeight = height * 0.82;
    this.teacherMaxScale = teacherMaxHeight / this.teacher.height;
    this.teacher.setScale(this.teacherMaxScale);
    this.teacher.y = height;
    this.teacher.setAlpha(0);

    // Dynamic Player Name
    const playerName = this.registry.get('playerName') || 'Detektif';
    this.dialogs[2].speaker = playerName;

    // Player Character
    const gender = this.registry.get('playerGender') || 'boy';
    const playerAsset = gender === 'boy' ? 'boy_idle' : 'girl_idle';
    this.player = this.add.image(width * 0.8, height, playerAsset).setOrigin(0.5, 1);
    const playerMaxHeight = height * 0.97;
    this.playerMaxScale = playerMaxHeight / this.player.height;
    this.player.setScale(this.playerMaxScale * 0.9); // Starts listening
    this.player.setFlipX(false);
    this.player.setAlpha(0); // Starts transparent for fade in
    this.player.y = height + 150;

    // BGM & Typing sound setup
    this.bgMusic = this.sound.add('investigasi_bgm', { loop: true, volume: 0.3 });
    this.bgMusic.play();
    this.typingSound = this.sound.add('keyboard_typing', { loop: true, volume: 1 });
    
    this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
      if (this.bgMusic) this.bgMusic.stop();
      if (this.typingSound) this.typingSound.stop();
    });

    // Animasi masuk karakter
    this.sound.play('karakter_muncul', { volume: 0.8 });
    this.tweens.add({ targets: this.teacher, alpha: 1, duration: 600, ease: 'Power2' });
    this.tweens.add({
      targets: this.player,
      alpha: 0.6,
      duration: 600,
      delay: 200,
      ease: 'Power2',
      onStart: () => {
        this.sound.play('karakter_muncul', { volume: 0.8 });
      },
      onComplete: () => {
        this.dialogContainer.y += 50;
        this.tweens.add({
          targets: this.dialogContainer,
          alpha: 1,
          y: height - 150,
          duration: 400,
          ease: 'Power2',
          onComplete: () => {
            const dWidth = this.registry.get('c2a_dWidth');
            const dHeight = this.registry.get('c2a_dHeight');
            const nBg = this.registry.get('c2a_nBg');
            const nText = this.registry.get('c2a_nText');
            this.startTyping(this.dialogs, dWidth, dHeight, nBg, nText);
          }
        });
      }
    });

    this.createDialogUI(width, height);
    this.createOptionsUI(width, height);

    createBackButton(this, 70, 70, () => {
      this.scene.start('CaseSelectScene', { case2Unlocked: true });
    });
  }

  private createDialogUI(width: number, height: number) {
    this.dialogContainer = this.add.container(width / 2, height - 150);
    this.dialogContainer.setAlpha(0);
    this.dialogContainer.setDepth(30);

    const dialogWidth = width * 0.8;
    const dialogHeight = 220;

    const dialogBg = this.add.graphics();
    dialogBg.fillStyle(0x0f172a, 0.85); // Slate 900
    dialogBg.fillRoundedRect(-dialogWidth/2, -dialogHeight/2, dialogWidth, dialogHeight, 20);
    dialogBg.lineStyle(4, 0x3b82f6, 1); // Blue border
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

    this.textObj = this.add.text(-dialogWidth/2 + 50, -dialogHeight/2 + 40, '', {
      fontFamily: 'monospace',
      fontSize: '32px',
      color: '#f8fafc',
      wordWrap: { width: dialogWidth - 100 },
      lineSpacing: 10
    });

    // Tombol Lanjut
    const btnWidth = 240; 
    const btnHeight = 55;
    const nextBtnY = dialogHeight/2 - 45;
    this.nextBtnContainer = this.add.container(dialogWidth/2 - 150, nextBtnY);

    const shadow = this.add.graphics();
    shadow.fillStyle(0x000000, 0.4);
    shadow.fillRoundedRect(-btnWidth/2 + 3, -btnHeight/2 + 4, btnWidth, btnHeight, 15);

    const nextBtnBg = this.add.graphics();
    nextBtnBg.fillStyle(0x16a34a, 1);
    nextBtnBg.fillRoundedRect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight, 15);
    nextBtnBg.lineStyle(4, 0xffffff, 0.3);
    nextBtnBg.strokeRoundedRect(-btnWidth/2 + 2, -btnHeight/2 + 2, btnWidth - 4, btnHeight - 4, 13);
    nextBtnBg.lineStyle(3, 0x000000, 1);
    nextBtnBg.strokeRoundedRect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight, 15);

    this.nextBtnText = this.add.text(0, 0, 'LANJUT ➔', {
      fontFamily: 'Fredoka One, Arial, sans-serif',
      fontSize: '20px',
      color: '#ffffff',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 3,
      shadow: { offsetX: 2, offsetY: 2, color: '#000000', blur: 0, fill: true }
    }).setOrigin(0.5);

    this.nextBtnContainer.add([shadow, nextBtnBg, this.nextBtnText]);
    this.nextBtnContainer.setAlpha(0);

    const hitArea = new Phaser.Geom.Rectangle(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight);
    
    this.nextBtnContainer.on('pointerover', () => {
      if (this.isClicking) return;
      this.input.setDefaultCursor('pointer');
      nextBtnBg.clear();
      nextBtnBg.fillStyle(0x22c55e, 1);
      nextBtnBg.fillRoundedRect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight, 15);
      nextBtnBg.lineStyle(4, 0xffffff, 0.5);
      nextBtnBg.strokeRoundedRect(-btnWidth/2 + 2, -btnHeight/2 + 2, btnWidth - 4, btnHeight - 4, 13);
      nextBtnBg.lineStyle(3, 0x000000, 1);
      nextBtnBg.strokeRoundedRect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight, 15);
      this.nextBtnContainer.y = nextBtnY - 2;
      shadow.y = 2;
    });

    this.nextBtnContainer.on('pointerout', () => {
      if (this.isClicking) return;
      this.input.setDefaultCursor('default');
      nextBtnBg.clear();
      nextBtnBg.fillStyle(0x16a34a, 1);
      nextBtnBg.fillRoundedRect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight, 15);
      nextBtnBg.lineStyle(4, 0xffffff, 0.3);
      nextBtnBg.strokeRoundedRect(-btnWidth/2 + 2, -btnHeight/2 + 2, btnWidth - 4, btnHeight - 4, 13);
      nextBtnBg.lineStyle(3, 0x000000, 1);
      nextBtnBg.strokeRoundedRect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight, 15);
      this.nextBtnContainer.y = nextBtnY;
      shadow.y = 0;
    });

    this.nextBtnContainer.on('pointerdown', () => {
      this.input.setDefaultCursor('default');
      this.sound.play('btn_click');
      if (this.isTyping) {
        if (this.typeWriterEvent) this.typeWriterEvent.remove();
        this.textObj.text = this.dialogs[this.currentDialogIndex].text;
        this.isTyping = false;
        if (this.typingSound) this.typingSound.stop();
        if (this.dialogs[this.currentDialogIndex].showOptions) {
          this.showOptions();
        }
      } else {
        if (!this.dialogs[this.currentDialogIndex].showOptions) {
          if (this.dialogs[this.currentDialogIndex].isEnd) {
            if (this.isClicking) return;
            this.isClicking = true;
            this.nextBtnContainer.y = nextBtnY + 4;
            shadow.y = -4;
            
            // Transisi Misi
            this.sound.play('misi_mulai');
            if (this.bgMusic) {
              this.tweens.add({
                targets: this.bgMusic,
                volume: 0,
                duration: 500,
                onComplete: () => this.bgMusic.stop()
              });
            }

            // Banner
            const bannerWidth = width;
            const bannerHeight = 150;
            const bannerBg = this.add.graphics();
            bannerBg.fillStyle(0x0f172a, 0.95);
            bannerBg.fillRect(0, height / 2 - bannerHeight / 2, bannerWidth, bannerHeight);
            bannerBg.lineStyle(4, 0x3b82f6, 1);
            bannerBg.strokeRect(0, height / 2 - bannerHeight / 2, bannerWidth, bannerHeight);
            bannerBg.setDepth(200);

            const bannerTextObj = this.add.text(width / 2, height / 2, 'MISI SELANJUTNYA:\nPILAH SAMPAH', {
              fontFamily: 'Fredoka One, Arial, sans-serif',
              fontSize: '48px',
              color: '#fbbf24',
              fontStyle: 'bold',
              align: 'center',
              stroke: '#000000',
              strokeThickness: 6
            }).setOrigin(0.5).setDepth(201);

            bannerBg.setAlpha(0);
            bannerTextObj.setAlpha(0);
            bannerTextObj.setScale(0.5);

            this.tweens.add({
              targets: [bannerBg, bannerTextObj],
              alpha: 1,
              duration: 400,
              ease: 'Power2'
            });

            this.tweens.add({
              targets: bannerTextObj,
              scale: 1,
              duration: 500,
              ease: 'Back.easeOut',
              onComplete: () => {
                this.time.delayedCall(1200, () => {
                  this.cameras.main.fadeOut(300, 0, 0, 0, (cam: any, progress: number) => {
                    if (progress === 1) {
                      this.scene.start('Case2SortScene');
                    }
                  });
                });
              }
            });
          } else {
            this.currentDialogIndex++;
            this.startTyping(this.dialogs, dialogWidth, dialogHeight, nameBg, nameText);
          }
        }
      }
    });

    this.dialogContainer.add([dialogBg, nameBg, nameText, this.textObj, this.nextBtnContainer]);

    // Setup closure
    this.startTyping = (dialoguesArr: any[], dWidth: number, dHeight: number, nBg: Phaser.GameObjects.Graphics, nText: Phaser.GameObjects.Text) => {
      this.isTyping = true;
      this.textObj.text = '';
      this.nextBtnContainer.setAlpha(0);
      this.nextBtnContainer.disableInteractive();
      
      const currentDialog = dialoguesArr[this.currentDialogIndex];
      const isTeacher = currentDialog.speaker === 'Ibu Guru';

      this.teacher.setTexture(currentDialog.teacherKey);

      // Dinamis menghitung ulang base scale agar ukurannya konsisten
      const teacherMaxHeight = this.cameras.main.height * 0.82;
      this.teacherMaxScale = teacherMaxHeight / this.teacher.height;
      
      // Mencegah jumping/pop: Set scale sesuai state visual saat ini sebelum tween berjalan!
      const isTeacherDimmed = this.teacher.alpha < 1;
      this.teacher.setScale(this.teacherMaxScale * (isTeacherDimmed ? 0.9 : 1));

      // Update player texture
      const gender = this.registry.get('playerGender') || 'boy';
      if (currentDialog.playerKey) {
        this.player.setTexture(currentDialog.playerKey[gender]);
      } else {
        this.player.setTexture(gender === 'boy' ? 'boy_idle' : 'girl_idle');
      }
      
      // Update player base scale sama dengan cara di atas
      const playerMaxHeight = this.cameras.main.height * 0.97;
      this.playerMaxScale = playerMaxHeight / this.player.height;
      const isPlayerDimmed = this.player.alpha < 1;
      this.player.setScale(this.playerMaxScale * (isPlayerDimmed ? 0.9 : 1));

      nText.text = currentDialog.speaker;
      nBg.clear();
      nBg.fillStyle(currentDialog.color, 1);

      if (isTeacher) {
        nBg.fillRoundedRect(-dWidth/2 + 30, -dHeight/2 - 25, 200, 50, 10);
        nText.x = -dWidth/2 + 130;
        this.sound.play('karakter_muncul', { volume: 0.5 });
        this.tweens.add({ targets: this.teacher, scale: this.teacherMaxScale, alpha: 1, duration: 300 });
        this.tweens.add({ targets: this.player, scale: this.playerMaxScale * 0.9, alpha: 0.6, duration: 300 });
      } else {
        nBg.fillRoundedRect(dWidth/2 - 230, -dHeight/2 - 25, 200, 50, 10);
        nText.x = dWidth/2 - 130;
        this.sound.play('karakter_muncul', { volume: 0.5 });
        this.tweens.add({ targets: this.player, scale: this.playerMaxScale, alpha: 1, duration: 300 });
        this.tweens.add({ targets: this.teacher, scale: this.teacherMaxScale * 0.9, alpha: 0.6, duration: 300 });
      }

      if (this.typingSound && !this.typingSound.isPlaying) {
        this.typingSound.play();
      }

      let charIndex = 0;
      this.typeWriterEvent = this.time.addEvent({
        delay: 30,
        repeat: currentDialog.text.length - 1,
        callback: () => {
          this.textObj.text += currentDialog.text[charIndex];
          charIndex++;
          if (charIndex === currentDialog.text.length) {
            this.isTyping = false;
            if (this.typingSound) this.typingSound.stop();
            if (currentDialog.showOptions) {
              this.showOptions();
            } else {
              if (currentDialog.isEnd) {
                this.nextBtnText.text = 'MISI ➔';
              } else {
                this.nextBtnText.text = 'LANJUT ➔';
              }
              this.tweens.add({ targets: this.nextBtnContainer, alpha: 1, duration: 300 });
              this.nextBtnContainer.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);
            }
          }
        }
      });
    };

    this.registry.set('c2a_dWidth', dialogWidth);
    this.registry.set('c2a_dHeight', dialogHeight);
    this.registry.set('c2a_nBg', nameBg);
    this.registry.set('c2a_nText', nameText);
  }

  private startTyping: any;

  private createOptionsUI(width: number, height: number) {
    this.optionsContainer = this.add.container(width / 2, height / 2 - 100);
    this.optionsContainer.setDepth(40);

    const options = [
      { text: "Agar lebih mudah dibakar", isCorrect: false },
      { text: "Agar dapat diolah kembali sesuai jenisnya", isCorrect: true },
      { text: "Agar baunya tidak menyebar", isCorrect: false }
    ];

    options.forEach((opt, index) => {
      const btnWidth = 550;
      const btnHeight = 70;
      const yPos = index * (btnHeight + 20);
      
      const btnContainer = this.add.container(0, yPos);

      // Shadow
      const shadow = this.add.graphics();
      shadow.fillStyle(0x000000, 0.4);
      shadow.fillRoundedRect(-btnWidth/2 + 3, -btnHeight/2 + 4, btnWidth, btnHeight, 15);

      // Button background
      const btnBg = this.add.graphics();
      btnBg.fillStyle(0x2563eb, 1); // Blue
      btnBg.fillRoundedRect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight, 15);
      btnBg.lineStyle(4, 0xffffff, 0.3);
      btnBg.strokeRoundedRect(-btnWidth/2 + 2, -btnHeight/2 + 2, btnWidth - 4, btnHeight - 4, 13);
      btnBg.lineStyle(3, 0x000000, 1);
      btnBg.strokeRoundedRect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight, 15);

      const btnText = this.add.text(0, 0, opt.text, {
        fontFamily: 'Nunito, sans-serif',
        fontSize: '22px',
        color: '#ffffff',
        fontStyle: 'bold'
      }).setOrigin(0.5);

      btnContainer.add([shadow, btnBg, btnText]);
      const hitArea = new Phaser.Geom.Rectangle(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight);
      btnContainer.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);

      btnContainer.on('pointerover', () => {
        this.input.setDefaultCursor('pointer');
        btnBg.clear();
        btnBg.fillStyle(0x3b82f6, 1);
        btnBg.fillRoundedRect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight, 15);
        btnBg.lineStyle(4, 0xffffff, 0.5);
        btnBg.strokeRoundedRect(-btnWidth/2 + 2, -btnHeight/2 + 2, btnWidth - 4, btnHeight - 4, 13);
        btnBg.lineStyle(3, 0x000000, 1);
        btnBg.strokeRoundedRect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight, 15);
        btnContainer.y = yPos - 2;
        shadow.y = 2;
      });

      btnContainer.on('pointerout', () => {
        this.input.setDefaultCursor('default');
        btnBg.clear();
        btnBg.fillStyle(0x2563eb, 1);
        btnBg.fillRoundedRect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight, 15);
        btnBg.lineStyle(4, 0xffffff, 0.3);
        btnBg.strokeRoundedRect(-btnWidth/2 + 2, -btnHeight/2 + 2, btnWidth - 4, btnHeight - 4, 13);
        btnBg.lineStyle(3, 0x000000, 1);
        btnBg.strokeRoundedRect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight, 15);
        btnContainer.y = yPos;
        shadow.y = 0;
      });

      btnContainer.on('pointerdown', () => {
        this.input.setDefaultCursor('default');
        btnContainer.y = yPos + 4;
        shadow.y = -4;

        if (opt.isCorrect) {
          // Benar
          this.sound.play('correct');
          btnBg.clear();
          btnBg.fillStyle(0x16a34a, 1); // Green
          btnBg.fillRoundedRect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight, 15);
          btnBg.lineStyle(4, 0xffffff, 0.3);
          btnBg.strokeRoundedRect(-btnWidth/2 + 2, -btnHeight/2 + 2, btnWidth - 4, btnHeight - 4, 13);
          btnBg.lineStyle(3, 0x000000, 1);
          btnBg.strokeRoundedRect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight, 15);
          
          this.registry.set('ecoPoints', (this.registry.get('ecoPoints') || 0) + 5);
          
          setTimeout(() => {
            this.hideOptions();
            this.currentDialogIndex++;
            const dWidth = this.registry.get('c2a_dWidth');
            const dHeight = this.registry.get('c2a_dHeight');
            const nBg = this.registry.get('c2a_nBg');
            const nText = this.registry.get('c2a_nText');
            this.startTyping(this.dialogs, dWidth, dHeight, nBg, nText);
          }, 600);
        } else {
          // Salah
          this.sound.play('wrong');
          btnBg.clear();
          btnBg.fillStyle(0xdc2626, 1); // Red
          btnBg.fillRoundedRect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight, 15);
          btnBg.lineStyle(4, 0xffffff, 0.3);
          btnBg.strokeRoundedRect(-btnWidth/2 + 2, -btnHeight/2 + 2, btnWidth - 4, btnHeight - 4, 13);
          btnBg.lineStyle(3, 0x000000, 1);
          btnBg.strokeRoundedRect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight, 15);
          
          this.cameras.main.shake(200, 0.01);
          setTimeout(() => {
            // Restore visual
            btnBg.clear();
            btnBg.fillStyle(0x2563eb, 1);
            btnBg.fillRoundedRect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight, 15);
            btnBg.lineStyle(4, 0xffffff, 0.3);
            btnBg.strokeRoundedRect(-btnWidth/2 + 2, -btnHeight/2 + 2, btnWidth - 4, btnHeight - 4, 13);
            btnBg.lineStyle(3, 0x000000, 1);
            btnBg.strokeRoundedRect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight, 15);
            btnContainer.y = yPos;
            shadow.y = 0;
          }, 400);
        }
      });

      this.optionsContainer.add(btnContainer);
    });

    this.optionsContainer.setAlpha(0);
    this.optionsContainer.setVisible(false);
  }

  private showOptions() {
    this.optionsContainer.setVisible(true);
    this.tweens.add({
      targets: this.optionsContainer,
      alpha: 1,
      y: this.optionsContainer.y - 20,
      duration: 500,
      ease: 'Back.easeOut'
    });
  }

  private hideOptions() {
    this.tweens.add({
      targets: this.optionsContainer,
      alpha: 0,
      y: this.optionsContainer.y + 20,
      duration: 300,
      onComplete: () => {
        this.optionsContainer.setVisible(false);
      }
    });
  }
}
