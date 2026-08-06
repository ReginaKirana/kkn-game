import * as Phaser from 'phaser';

import { createBackButton } from '../utils/UIUtils';

export class Case2AnalysisScene extends Phaser.Scene {
  private teacher!: Phaser.GameObjects.Image;
  private player!: Phaser.GameObjects.Image;
  private dialogContainer!: Phaser.GameObjects.Container;
  private textObj!: Phaser.GameObjects.Text;
  private optionsContainer!: Phaser.GameObjects.Container;
  private typeWriterEvent!: Phaser.Time.TimerEvent;
  private lanjutText!: Phaser.GameObjects.Text;
  private misiBtnContainer!: Phaser.GameObjects.Container;

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
      text: "Kerja bagus! Sekarang kamu sudah tahu kalau sampah punya jenis yang berbeda.",
      color: 0x3b82f6,
      teacherKey: 'teacher_smile'
    },
    {
      speaker: 'Ibu Guru',
      text: "Menurutmu, kenapa sampah perlu dipilah?",
      color: 0x3b82f6,
      teacherKey: 'teacher_surprised',
      showOptions: true
    },
    {
      speaker: 'Detektif',
      text: "Agar dapat diolah kembali sesuai jenisnya!",
      color: 0x16a34a,
      teacherKey: 'teacher_surprised',
      playerScale: { girl: 1.0 }
    },
    {
      speaker: 'Ibu Guru',
      text: "Benar! Sampah perlu dipilah agar dapat diolah sesuai jenisnya.",
      color: 0x3b82f6,
      teacherKey: 'teacher_thumbup'
    },
    {
      speaker: 'Ibu Guru',
      text: "Sekarang saatnya kamu memilah sampah sesuai jenisnya!",
      color: 0x3b82f6,
      teacherKey: 'teacher_smile',
      isEnd: true
    }
  ];

  constructor() {
    super('Case2AnalysisScene');
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
    this.teacher = this.add.image(width * 0.25, height, 'teacher_smile').setOrigin(0.5, 1);
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
    const playerYOffset = gender === 'girl' ? 100 : 150;
    this.player = this.add.image(width * 0.8, height + playerYOffset, playerAsset).setOrigin(0.5, 1);
    const playerMaxHeight = height * 0.97;
    this.playerMaxScale = playerMaxHeight / this.player.height;
    // Initial scale reflects the 0.9 multiplier because the player starts dimmed (listening to teacher)
    const initialPlayerScale = gender === 'girl' ? 0.963 : 0.855;
    this.player.setScale(this.playerMaxScale * initialPlayerScale); // Starts listening
    this.player.setFlipX(false);
    this.player.setAlpha(0); // Starts transparent for fade in

    // BGM & Typing sound setup
    this.bgMusic = this.sound.add('investigasi_bgm', { loop: true, volume: 1.1 });
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
    dialogBg.fillRoundedRect(-dialogWidth / 2, -dialogHeight / 2, dialogWidth, dialogHeight, 20);
    dialogBg.lineStyle(4, 0x3b82f6, 1); // Blue border
    dialogBg.strokeRoundedRect(-dialogWidth / 2, -dialogHeight / 2, dialogWidth, dialogHeight, 20);

    const nameBg = this.add.graphics();
    nameBg.fillStyle(0x3b82f6, 1);
    nameBg.fillRoundedRect(-dialogWidth / 2 + 30, -dialogHeight / 2 - 25, 200, 50, 10);

    const nameText = this.add.text(-dialogWidth / 2 + 130, -dialogHeight / 2, 'Ibu Guru', {
      fontFamily: 'monospace',
      fontSize: '28px',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.textObj = this.add.text(-dialogWidth / 2 + 50, -dialogHeight / 2 + 40, '', {
      fontFamily: 'monospace',
      fontSize: '32px',
      color: '#f8fafc',
      wordWrap: { width: dialogWidth - 100 },
      lineSpacing: 10
    });

    // Tombol Lanjut (Teks saja)
    this.lanjutText = this.add.text(dialogWidth / 2 - 30, dialogHeight / 2 - 20, 'Lanjut ➔', {
      fontFamily: 'monospace',
      fontSize: '26px',
      color: '#4ade80',
      fontStyle: 'bold'
    }).setOrigin(1, 1).setAlpha(0).setInteractive({ useHandCursor: true });

    this.lanjutText.on('pointerover', () => {
      if (this.isClicking) return;
      this.lanjutText.setColor('#22c55e');
    });

    this.lanjutText.on('pointerout', () => {
      if (this.isClicking) return;
      this.lanjutText.setColor('#4ade80');
    });

    // Tombol Misi (Kotak Biru)
    this.misiBtnContainer = this.add.container(dialogWidth / 2 - 90, dialogHeight / 2 - 35);
    const misiBtnBg = this.add.graphics();
    misiBtnBg.fillStyle(0x3b82f6, 1);
    misiBtnBg.fillRoundedRect(-70, -25, 140, 50, 15);
    const misiBtnText = this.add.text(0, 0, 'Mulai ➔', {
      fontFamily: 'monospace',
      fontSize: '24px',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    this.misiBtnContainer.add([misiBtnBg, misiBtnText]);
    const misiHitArea = new Phaser.Geom.Rectangle(-70, -25, 140, 50);
    this.misiBtnContainer.setInteractive(misiHitArea, Phaser.Geom.Rectangle.Contains);
    this.misiBtnContainer.setAlpha(0);

    this.misiBtnContainer.on('pointerover', () => {
      if (this.isClicking) return;
      this.input.setDefaultCursor('pointer');
      misiBtnBg.clear();
      misiBtnBg.fillStyle(0x2563eb, 1);
      misiBtnBg.fillRoundedRect(-70, -25, 140, 50, 15);
    });

    this.misiBtnContainer.on('pointerout', () => {
      if (this.isClicking) return;
      this.input.setDefaultCursor('default');
      misiBtnBg.clear();
      misiBtnBg.fillStyle(0x3b82f6, 1);
      misiBtnBg.fillRoundedRect(-70, -25, 140, 50, 15);
    });

    const handleNext = () => {
      this.input.setDefaultCursor('default');
      if (this.isTyping) return;
      this.sound.play('btn_click', { seek: 0.8 });
        if (!this.dialogs[this.currentDialogIndex].showOptions) {
          if (this.dialogs[this.currentDialogIndex].isEnd) {
            if (this.isClicking) return;
            this.isClicking = true;

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
                this.time.delayedCall(2500, () => {
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
    };

    this.lanjutText.on('pointerdown', handleNext);
    this.misiBtnContainer.on('pointerdown', handleNext);

    this.dialogContainer.add([dialogBg, nameBg, nameText, this.textObj, this.lanjutText, this.misiBtnContainer]);

    // Setup closure
    this.startTyping = (dialoguesArr: any[], dWidth: number, dHeight: number, nBg: Phaser.GameObjects.Graphics, nText: Phaser.GameObjects.Text) => {
      this.isTyping = true;
      this.textObj.text = '';
      this.lanjutText.setAlpha(0);
      this.lanjutText.disableInteractive();
      this.misiBtnContainer.setAlpha(0);
      this.misiBtnContainer.disableInteractive();

      const currentDialog = dialoguesArr[this.currentDialogIndex];
      const isTeacher = currentDialog.speaker === 'Ibu Guru';

      this.teacher.setTexture(currentDialog.teacherKey);

      // Geser khusus untuk ekspresi surprised dan thumb-up
      const baseTeacherX = this.cameras.main.width * 0.25;
      if (currentDialog.teacherKey === 'teacher_surprised' || currentDialog.teacherKey === 'teacher_thumbup') {
        this.teacher.setX(baseTeacherX - 30);
      } else {
        this.teacher.setX(baseTeacherX);
      }

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

      let customPlayerScale = 1.0;
      if (currentDialog.playerScale !== undefined) {
        if (typeof currentDialog.playerScale === 'number') {
          customPlayerScale = currentDialog.playerScale;
        } else {
          customPlayerScale = currentDialog.playerScale[gender] || 1.0;
        }
      } else {
        customPlayerScale = (this.player.texture.key === 'girl_idle') ? 1.07 : 0.95;
      }

      const isPlayerDimmed = this.player.alpha < 1;
      this.player.setScale(this.playerMaxScale * customPlayerScale * (isPlayerDimmed ? 0.9 : 1));

      nText.text = currentDialog.speaker;
      nBg.clear();
      nBg.fillStyle(currentDialog.color, 1);

      if (isTeacher) {
        nBg.fillRoundedRect(-dWidth / 2 + 30, -dHeight / 2 - 25, 200, 50, 10);
        nText.x = -dWidth / 2 + 130;
        this.sound.play('karakter_muncul', { volume: 0.5 });
        this.tweens.add({ targets: this.teacher, scale: this.teacherMaxScale, alpha: 1, duration: 300 });
        this.tweens.add({ targets: this.player, scale: this.playerMaxScale * customPlayerScale * 0.9, alpha: 0.6, duration: 300 });
      } else {
        nBg.fillRoundedRect(dWidth / 2 - 230, -dHeight / 2 - 25, 200, 50, 10);
        nText.x = dWidth / 2 - 130;
        this.sound.play('karakter_muncul', { volume: 0.5 });
        this.tweens.add({ targets: this.player, scale: this.playerMaxScale * customPlayerScale, alpha: 1, duration: 300 });
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
                this.tweens.add({ targets: this.misiBtnContainer, alpha: 1, duration: 300 });
                this.misiBtnContainer.setInteractive();
              } else {
                this.tweens.add({ targets: this.lanjutText, alpha: 1, duration: 300 });
                this.lanjutText.setInteractive();
              }
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

    const optionBtns: Phaser.GameObjects.Container[] = [];

    options.forEach((opt, index) => {
      const btnWidth = 550;
      const btnHeight = 70;
      const yPos = index * (btnHeight + 20);

      const btnContainer = this.add.container(0, yPos);

      // Shadow
      const shadow = this.add.graphics();
      shadow.fillStyle(0x000000, 0.4);
      shadow.fillRoundedRect(-btnWidth / 2 + 3, -btnHeight / 2 + 4, btnWidth, btnHeight, 15);

      // Button background
      const btnBg = this.add.graphics();
      btnBg.fillStyle(0x2563eb, 1); // Blue
      btnBg.fillRoundedRect(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight, 15);
      btnBg.lineStyle(4, 0xffffff, 0.3);
      btnBg.strokeRoundedRect(-btnWidth / 2 + 2, -btnHeight / 2 + 2, btnWidth - 4, btnHeight - 4, 13);
      btnBg.lineStyle(3, 0x000000, 1);
      btnBg.strokeRoundedRect(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight, 15);

      const btnText = this.add.text(0, 0, opt.text, {
        fontFamily: 'Nunito, sans-serif',
        fontSize: '26px',
        color: '#ffffff',
        fontStyle: 'bold'
      }).setOrigin(0.5);

      btnContainer.add([shadow, btnBg, btnText]);
      optionBtns.push(btnContainer);
      const hitArea = new Phaser.Geom.Rectangle(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight);
      btnContainer.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);

      btnContainer.on('pointerover', () => {
        if (btnContainer.getData('locked')) return;
        this.input.setDefaultCursor('pointer');
        btnBg.clear();
        btnBg.fillStyle(0x3b82f6, 1);
        btnBg.fillRoundedRect(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight, 15);
        btnBg.lineStyle(4, 0xffffff, 0.5);
        btnBg.strokeRoundedRect(-btnWidth / 2 + 2, -btnHeight / 2 + 2, btnWidth - 4, btnHeight - 4, 13);
        btnBg.lineStyle(3, 0x000000, 1);
        btnBg.strokeRoundedRect(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight, 15);
        btnContainer.y = yPos - 2;
        shadow.y = 2;
      });

      btnContainer.on('pointerout', () => {
        if (btnContainer.getData('locked')) return;
        this.input.setDefaultCursor('default');
        btnBg.clear();
        btnBg.fillStyle(0x2563eb, 1);
        btnBg.fillRoundedRect(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight, 15);
        btnBg.lineStyle(4, 0xffffff, 0.3);
        btnBg.strokeRoundedRect(-btnWidth / 2 + 2, -btnHeight / 2 + 2, btnWidth - 4, btnHeight - 4, 13);
        btnBg.lineStyle(3, 0x000000, 1);
        btnBg.strokeRoundedRect(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight, 15);
        btnContainer.y = yPos;
        shadow.y = 0;
      });

      btnContainer.on('pointerdown', () => {
        if (btnContainer.getData('locked')) return;
        this.input.setDefaultCursor('default');
        btnContainer.y = yPos + 4;
        shadow.y = -4;

        if (opt.isCorrect) {
          optionBtns.forEach(b => b.setData('locked', true));
          // Benar
          this.sound.play('correct');
          btnBg.clear();
          btnBg.fillStyle(0x16a34a, 1); // Green
          btnBg.fillRoundedRect(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight, 15);
          btnBg.lineStyle(4, 0xffffff, 0.3);
          btnBg.strokeRoundedRect(-btnWidth / 2 + 2, -btnHeight / 2 + 2, btnWidth - 4, btnHeight - 4, 13);
          btnBg.lineStyle(3, 0x000000, 1);
          btnBg.strokeRoundedRect(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight, 15);

          this.registry.set('ecoPoints', (this.registry.get('ecoPoints') || 0) + 100);

          // UI Point Animation (+100 EP)
          const epText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 - 100 + yPos, '+100 EP', {
            fontFamily: 'Fredoka One, Arial, sans-serif',
            fontSize: '32px',
            color: '#facc15', // Yellow
            stroke: '#000000',
            strokeThickness: 5
          }).setOrigin(0.5).setDepth(100);

          this.tweens.add({
            targets: epText,
            y: '-=50',
            duration: 500,
            ease: 'Power2',
            onComplete: () => {
              this.tweens.add({
                targets: epText,
                alpha: 0,
                delay: 1500,
                duration: 500,
                onComplete: () => epText.destroy()
              });
            }
          });

          this.time.delayedCall(2500, () => {
            this.hideOptions();
            this.currentDialogIndex++;
            const dWidth = this.registry.get('c2a_dWidth');
            const dHeight = this.registry.get('c2a_dHeight');
            const nBg = this.registry.get('c2a_nBg');
            const nText = this.registry.get('c2a_nText');
            this.startTyping(this.dialogs, dWidth, dHeight, nBg, nText);
          });
        } else {
          // Salah
          this.sound.play('wrong');
          btnBg.clear();
          
          this.registry.set('ecoPoints', (this.registry.get('ecoPoints') || 0) - 100);

          // UI Point Animation (-100 EP)
          const epMinusText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 - 100 + yPos, '-100 EP', {
            fontFamily: 'Fredoka One, Arial, sans-serif',
            fontSize: '32px',
            color: '#dc2626', // Red
            stroke: '#000000',
            strokeThickness: 5
          }).setOrigin(0.5).setDepth(100);

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

          btnBg.fillStyle(0xdc2626, 1); // Red
          btnBg.fillRoundedRect(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight, 15);
          btnBg.lineStyle(4, 0xffffff, 0.3);
          btnBg.strokeRoundedRect(-btnWidth / 2 + 2, -btnHeight / 2 + 2, btnWidth - 4, btnHeight - 4, 13);
          btnBg.lineStyle(3, 0x000000, 1);
          btnBg.strokeRoundedRect(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight, 15);

          this.tweens.add({
            targets: btnContainer,
            x: 10,
            duration: 50,
            yoyo: true,
            repeat: 3,
            onComplete: () => btnContainer.setX(0)
          });
          setTimeout(() => {
            // Restore visual
            btnBg.clear();
            btnBg.fillStyle(0x2563eb, 1);
            btnBg.fillRoundedRect(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight, 15);
            btnBg.lineStyle(4, 0xffffff, 0.3);
            btnBg.strokeRoundedRect(-btnWidth / 2 + 2, -btnHeight / 2 + 2, btnWidth - 4, btnHeight - 4, 13);
            btnBg.lineStyle(3, 0x000000, 1);
            btnBg.strokeRoundedRect(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight, 15);
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
