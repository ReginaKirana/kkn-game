import * as Phaser from 'phaser';

import { createBackButton } from '../utils/UIUtils';

export class Case1BriefingScene extends Phaser.Scene {
  private bg1!: Phaser.GameObjects.Image;
  private overlay!: Phaser.GameObjects.Rectangle;
  private teacher!: Phaser.GameObjects.Image;
  private player!: Phaser.GameObjects.Image;
  private dialogContainer!: Phaser.GameObjects.Container;
  private textObj!: Phaser.GameObjects.Text;
  private typeWriterEvent!: Phaser.Time.TimerEvent;
  private nextBtn!: Phaser.GameObjects.Text;
  private investigasiBtn!: Phaser.GameObjects.Container;

  private currentDialogIndex = 0;
  private isTyping = false;
  private isClicking = false;
  private bgMusic!: Phaser.Sound.BaseSound;
  private typingSound!: Phaser.Sound.BaseSound;

  private teacherMaxScale = 1;
  private playerMaxScale = 1;

  constructor() {
    super('Case1BriefingScene');
  }

  init() {
    this.currentDialogIndex = 0;
    this.isTyping = false;
    this.isClicking = false;
  }

  create() {
    const { width, height } = this.cameras.main;

    // Background
    this.bg1 = this.add.image(width / 2, height / 2, 'halaman_kotor_bg');
    this.bg1.setScale(Math.max(width / this.bg1.width, height / this.bg1.height));

    // Overlay gelap - hidden initially
    this.overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.6).setOrigin(0, 0);
    this.overlay.setAlpha(0);
    this.overlay.setDepth(10);

    // Teacher
    this.teacher = this.add.image(width * 0.2, height, 'teacher_surprised').setOrigin(0.5, 1);
    const teacherMaxHeight = height * 0.82;
    this.teacherMaxScale = teacherMaxHeight / this.teacher.height;
    this.teacher.setScale(this.teacherMaxScale);
    this.teacher.setFlipX(true);
    this.teacher.setAlpha(0);
    this.teacher.setDepth(20);
    this.teacher.y = height;

    // Player
    const gender = this.registry.get('playerGender') || 'boy';
    const playerAsset = gender === 'boy' ? 'boy_idle' : 'girl_idle';
    this.player = this.add.image(width * 0.8, height, playerAsset).setOrigin(0.5, 1);
    const playerMaxHeight = height * 0.97;
    this.playerMaxScale = playerMaxHeight / this.player.height;
    const initialPlayerScale = gender === 'girl' ? 0.98 : 0.97;
    this.player.setScale(this.playerMaxScale * initialPlayerScale * 1.0);
    this.player.setFlipX(false);
    this.player.setAlpha(0);
    this.player.setDepth(20);
    const playerYOffset = gender === 'girl' ? 85 : 150;
    this.player.y = height + playerYOffset;

    this.createDialogUI(width, height);

    // Start Sequence
    this.bgMusic = this.sound.add('case_briefing_bgm', { loop: true, volume: 1.0 });
    this.bgMusic.play();
    this.typingSound = this.sound.add('typing_sfx', { loop: true, volume: 1 });

    this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
      if (this.bgMusic) {
        this.bgMusic.stop();
      }
      if (this.typingSound) {
        this.typingSound.stop();
      }
    });

    this.time.delayedCall(1000, () => {
      this.tweens.add({
        targets: this.overlay,
        alpha: 1,
        duration: 800
      });
      this.showCharactersAndDialog();
    });

    createBackButton(this, 70, 70, () => {
      this.sound.play('btn_click', { seek: 0.8 });
      this.scene.start('CaseSelectScene');
    });
  }

  private createDialogUI(width: number, height: number) {
    this.dialogContainer = this.add.container(width / 2, height - 150);
    this.dialogContainer.setDepth(30);
    this.dialogContainer.setAlpha(0);

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

    const playerName = this.registry.get('playerName') || 'Detektif';

    const dialogues = [
      {
        speaker: 'Ibu Guru',
        text: "Ya ampun! Lihatlah halaman sekolah kita, berantakan sekali banyak sampah berserakan.",
        color: 0x3b82f6, // Blue
        teacherKey: 'teacher_surprised',
        teacherScale: 1.0,
        playerScale: { boy: 0.97, girl: 0.98 }
      },
      {
        speaker: playerName,
        text: "Wah, benar Bu! Pasti ada yang membuang sampah sembarangan di sini.",
        color: 0x16a34a, // Green
        teacherKey: 'teacher_surprised',
        teacherScale: 1.0,
        playerKey: { boy: 'boy_supprised', girl: 'girl_supprised' },
        playerScale: { boy: 1.0, girl: 0.9 }
      },
      {
        speaker: 'Ibu Guru',
        text: "Ayo Detektif, selidiki benda apa saja yang dibuang sembarangan di halaman ini!",
        color: 0x3b82f6,
        teacherKey: 'teacher_thinking',
        teacherScale: 1.0,
        playerScale: { boy: 0.97, girl: 0.87 }
      }
    ];

    // Tombol Lanjut (Simple Text)
    this.nextBtn = this.add.text(dialogWidth / 2 - 30, dialogHeight / 2 - 20, 'Lanjut ➔', {
      fontFamily: 'monospace',
      fontSize: '26px',
      color: '#4ade80',
      fontStyle: 'bold'
    }).setOrigin(1, 1).setInteractive({ useHandCursor: true }).setAlpha(0);

    // Investigasi Button
    this.investigasiBtn = this.add.container(dialogWidth / 2 - 110, dialogHeight / 2 - 40);
    const btnBg = this.add.graphics();
    btnBg.fillStyle(0x3b82f6, 1);
    btnBg.fillRoundedRect(-90, -25, 180, 50, 15);

    const btnText = this.add.text(0, 0, 'INVESTIGASI', {
      fontFamily: 'monospace',
      fontSize: '20px',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.investigasiBtn.add([btnBg, btnText]);

    const btnHitArea = new Phaser.Geom.Rectangle(-90, -25, 180, 50);
    this.investigasiBtn.setInteractive(btnHitArea, Phaser.Geom.Rectangle.Contains);

    this.investigasiBtn.on('pointerover', () => {
      this.input.setDefaultCursor('pointer');
      btnBg.clear();
      btnBg.fillStyle(0x2563eb, 1);
      btnBg.fillRoundedRect(-90, -25, 180, 50, 15);
    });

    this.investigasiBtn.on('pointerout', () => {
      this.input.setDefaultCursor('default');
      btnBg.clear();
      btnBg.fillStyle(0x3b82f6, 1);
      btnBg.fillRoundedRect(-90, -25, 180, 50, 15);
    });

    this.investigasiBtn.setVisible(false);
    this.investigasiBtn.setAlpha(0);

    this.nextBtn.on('pointerdown', () => {
      this.sound.play('btn_click', { seek: 0.8 });
      if (this.isTyping) {
        if (this.typeWriterEvent) this.typeWriterEvent.remove();
        this.textObj.text = dialogues[this.currentDialogIndex].text;
        this.isTyping = false;
        if (this.typingSound) this.typingSound.stop();
        this.nextBtn.setAlpha(1); // Pastikan tombol muncul
      } else {
        if (this.currentDialogIndex < dialogues.length - 1) {
          this.currentDialogIndex++;
          this.startTyping(dialogues, dialogWidth, dialogHeight, nameBg, nameText);
          if (this.currentDialogIndex === dialogues.length - 1) {
            this.nextBtn.setVisible(false);
            this.investigasiBtn.setVisible(true);
            this.investigasiBtn.setAlpha(1);
          }
        }
      }
    });

    this.investigasiBtn.on('pointerdown', () => {
      this.sound.play('btn_click', { seek: 0.8 });
      if (this.isTyping) {
        if (this.typeWriterEvent) this.typeWriterEvent.remove();
        this.textObj.text = dialogues[this.currentDialogIndex].text;
        this.isTyping = false;
        if (this.typingSound) this.typingSound.stop();
        this.investigasiBtn.setAlpha(1);
      } else {
        if (this.currentDialogIndex === dialogues.length - 1) {
          if (this.isClicking) return;
          this.isClicking = true;
          this.input.setDefaultCursor('default');
          this.cameras.main.fadeOut(500, 0, 0, 0);
          setTimeout(() => {
            this.scene.start('InvestigationScene', { caseId: 'kasus_halaman' });
          }, 150);
        }
      }
    });

    this.nextBtn.on('pointerover', () => this.nextBtn.setColor('#22c55e'));
    this.nextBtn.on('pointerout', () => this.nextBtn.setColor('#4ade80'));

    this.dialogContainer.add([dialogBg, nameBg, nameText, this.textObj, this.nextBtn, this.investigasiBtn]);

    // Setup startTyping closure
    this.startTyping = (dialoguesArr: any[], dWidth: number, dHeight: number, nBg: Phaser.GameObjects.Graphics, nText: Phaser.GameObjects.Text) => {
      this.isTyping = true;
      this.textObj.text = '';
      const currentDialog = dialoguesArr[this.currentDialogIndex];
      const isTeacher = currentDialog.speaker === 'Ibu Guru';

      // Update teacher texture
      this.teacher.setTexture(currentDialog.teacherKey);

      // Update player texture
      const gender = this.registry.get('playerGender') || 'boy';
      if (currentDialog.playerKey) {
        this.player.setTexture(currentDialog.playerKey[gender]);
      }

      // Recalculate max scale in case the new texture has different dimensions
      const playerMaxHeight = this.cameras.main.height * 0.97;
      this.playerMaxScale = playerMaxHeight / this.player.height;

      nText.text = currentDialog.speaker;
      nBg.clear();
      nBg.fillStyle(currentDialog.color, 1);

      let customPlayerScale = 1.0;
      if (currentDialog.playerScale !== undefined) {
        if (typeof currentDialog.playerScale === 'number') {
          customPlayerScale = currentDialog.playerScale;
        } else {
          customPlayerScale = currentDialog.playerScale[gender] || 1.0;
        }
      } else {
        // Fallback based on texture if not specified
        customPlayerScale = (this.player.texture.key === 'girl_idle') ? 0.98 : 1.0;
      }

      if (isTeacher) {
        nBg.fillRoundedRect(-dWidth / 2 + 30, -dHeight / 2 - 25, 200, 50, 10);
        nText.x = -dWidth / 2 + 130;
        this.tweens.add({ targets: this.teacher, scale: this.teacherMaxScale * currentDialog.teacherScale, alpha: 1, duration: 300 });
        this.tweens.add({ targets: this.player, scale: this.playerMaxScale * customPlayerScale * 1.0, alpha: 0.6, duration: 300 });
      } else {
        nBg.fillRoundedRect(dWidth / 2 - 230, -dHeight / 2 - 25, 200, 50, 10);
        nText.x = dWidth / 2 - 130;
        this.tweens.add({ targets: this.player, scale: this.playerMaxScale * customPlayerScale, alpha: 1, duration: 300 });
        this.tweens.add({ targets: this.teacher, scale: this.teacherMaxScale * 0.95, alpha: 0.6, duration: 300 });
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
          }
        }
      });
    };

    // Stash dialogues for startTyping closure
    this.registry.set('c1b_dialogues', dialogues);
    this.registry.set('c1b_dWidth', dialogWidth);
    this.registry.set('c1b_dHeight', dialogHeight);
    this.registry.set('c1b_nBg', nameBg);
    this.registry.set('c1b_nText', nameText);
  }

  // To be overwritten by the closure above
  private startTyping: any;

  private showCharactersAndDialog() {
    this.tweens.add({
      targets: this.teacher,
      alpha: 1,
      duration: 800,
      ease: 'Power2'
    });

    this.tweens.add({
      targets: this.player,
      alpha: 0.6,
      duration: 800,
      delay: 300,
      ease: 'Power2',
      onComplete: () => {
        this.dialogContainer.y += 50;
        this.tweens.add({
          targets: this.dialogContainer,
          alpha: 1,
          y: this.cameras.main.height - 150,
          duration: 400,
          ease: 'Power2',
          onComplete: () => {
            const dialogues = this.registry.get('c1b_dialogues');
            const dWidth = this.registry.get('c1b_dWidth');
            const dHeight = this.registry.get('c1b_dHeight');
            const nBg = this.registry.get('c1b_nBg');
            const nText = this.registry.get('c1b_nText');
            this.startTyping(dialogues, dWidth, dHeight, nBg, nText);

            // Show next btn
            this.time.delayedCall(dialogues[0].text.length * 30 + 500, () => {
              this.tweens.add({ targets: this.nextBtn, alpha: 1, duration: 300 });
            });
          }
        });
      }
    });
  }
}
