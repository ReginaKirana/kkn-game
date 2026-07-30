import * as Phaser from 'phaser';

import selokanBg from '../../assets/backgrounds/selokan-tinngi.png';
import botolImg from '../../assets/objects/botol.png';
import pisangImg from '../../assets/objects/pisang.png';
import kalengImg from '../../assets/objects/kaleng.png';
import plastikImg from '../../assets/objects/plastik.png';
import appleImg from '../../assets/objects/apple.png';
import daunImg from '../../assets/objects/daun.png';
import gelasImg from '../../assets/objects/gelas.png';
import kertasImg from '../../assets/objects/kertas.png';
import rantingImg from '../../assets/objects/ranting.png';
import thumbUpTeacher from '../../assets/characters/teachers/thumb-up.png';
import smileTeacher from '../../assets/characters/teachers/smile.png';
import surprisedTeacher from '../../assets/characters/teachers/suprised.png';
import thinkingTeacher from '../../assets/characters/teachers/thinking.png';
import boyIdle from '../../assets/characters/boy/boy-idle.png';
import girlIdle from '../../assets/characters/girl/girl-idle.png';
import { createBackButton } from '../utils/UIUtils';
import boyBingung from '../../assets/characters/boy/boy-bingung.png';
import boySurprised from '../../assets/characters/boy/boy-supprised.png';
import girlBingung from '../../assets/characters/girl/girl-bingung.png';

import investigasiBgmUrl from '../../assets/audio/investigasi.mp3';
import karakterMunculUrl from '../../assets/audio/sfx/karakter-muncul.wav';
import keyboardTypingUrl from '../../assets/audio/keyboard-typing.wav';
import btnClickUrl from '../../assets/audio/button_click.mp3';

import { Case3TrashConfig } from '../config/Case3TrashConfig';

export class Case3BriefingScene extends Phaser.Scene {
  private bg!: Phaser.GameObjects.Image;
  private overlay!: Phaser.GameObjects.Rectangle;
  private teacher!: Phaser.GameObjects.Image;
  private player!: Phaser.GameObjects.Image;
  private dialogContainer!: Phaser.GameObjects.Container;
  private textObj!: Phaser.GameObjects.Text;
  private typeWriterEvent!: Phaser.Time.TimerEvent;
  private lanjutText!: Phaser.GameObjects.Text;
  private misiBtnContainer!: Phaser.GameObjects.Container;
  private nextBtnText!: Phaser.GameObjects.Text;

  private currentDialogIndex = 0;
  private isTyping = false;
  private isClicking = false;

  private teacherMaxScale = 1;
  private playerMaxScale = 1;

  private bgMusic!: Phaser.Sound.BaseSound;
  private typingSound!: Phaser.Sound.BaseSound;

  constructor() {
    super('Case3BriefingScene');
  }

  preload() {
    this.load.image('selokan_bg', selokanBg);
    this.load.image('botol', botolImg);
    this.load.image('pisang', pisangImg);
    this.load.image('kaleng', kalengImg);
    this.load.image('plastik', plastikImg);
    this.load.image('apple', appleImg);
    this.load.image('daun', daunImg);
    this.load.image('gelas', gelasImg);
    this.load.image('kertas', kertasImg);
    this.load.image('ranting', rantingImg);

    this.load.image('teacher_thumbup', thumbUpTeacher);
    this.load.image('teacher_smile', smileTeacher);
    this.load.image('teacher_surprised', surprisedTeacher);
    this.load.image('teacher_thinking', thinkingTeacher);
    this.load.image('boy_idle', boyIdle);
    this.load.image('girl_idle', girlIdle);
    this.load.image('boy_bingung', boyBingung);
    this.load.image('boy_surprised', boySurprised);
    this.load.image('girl_bingung', girlBingung);
    
    this.load.audio('investigasi_bgm', investigasiBgmUrl);
    this.load.audio('karakter_muncul', karakterMunculUrl);
    this.load.audio('keyboard_typing', keyboardTypingUrl);
    this.load.audio('btn_click', btnClickUrl);
  }

  create() {
    const { width, height } = this.cameras.main;
    this.currentDialogIndex = 0;

    // Background (selokan-tinngi.png)
    this.bg = this.add.image(width / 2, height / 2, 'selokan_bg');
    this.bg.setScale(Math.max(width / this.bg.width, height / this.bg.height));

    // Render Sampah di background agar terlihat saat briefing
    Case3TrashConfig.distractors.forEach(d => {
      const img = this.add.image(width * d.x, height * d.y, d.asset);
      const maxDim = d.maxDim || 120;
      img.setScale(maxDim / Math.max(img.width, img.height));
      img.setTint(0x4a4a4a); // Di-overlay gelap
    });

    Case3TrashConfig.clues.forEach(c => {
      const img = this.add.image(width * c.x, height * c.y, c.asset);
      const maxDim = c.maxDim || 150;
      if (img.width > maxDim || img.height > maxDim) {
        img.setScale(maxDim / Math.max(img.width, img.height));
      }
      // Clue tidak digelapkan agar menonjol
    });

    // Overlay gelap - hidden initially
    this.overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.6).setOrigin(0, 0);
    this.overlay.setAlpha(0);
    this.overlay.setDepth(10);

    // Teacher
    this.teacher = this.add.image(width * 0.2, height + 15, 'teacher_thumbup').setOrigin(0.5, 1);
    const teacherMaxHeight = height * 0.82;
    this.teacherMaxScale = teacherMaxHeight / this.teacher.height;
    this.teacher.setScale(this.teacherMaxScale);
    this.teacher.setFlipX(true);
    this.teacher.setDepth(20);
    this.teacher.setAlpha(0);

    // Player
    const gender = this.registry.get('playerGender') || 'boy';
    const playerAsset = gender === 'boy' ? 'boy_idle' : 'girl_idle';
    this.player = this.add.image(width * 0.8, height + 180, playerAsset).setOrigin(0.5, 1);
    const playerMaxHeight = height * 0.97;
    this.playerMaxScale = playerMaxHeight / this.player.height;
    this.player.setScale(this.playerMaxScale);
    this.player.setFlipX(false);
    this.player.setDepth(20);
    this.player.setAlpha(0);
    this.player.y = height + 135;

    this.bgMusic = this.sound.add('investigasi_bgm', { loop: true, volume: 0.3 });
    this.bgMusic.play();
    this.typingSound = this.sound.add('keyboard_typing', { loop: true, volume: 1 });

    this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
      if (this.bgMusic) this.bgMusic.stop();
      if (this.typingSound) this.typingSound.stop();
    });

    this.createDialogUI(width, height);

    // Start Sequence
    this.time.delayedCall(1500, () => {
      this.tweens.add({
        targets: this.overlay,
        alpha: 1,
        duration: 800
      });
      this.showCharactersAndDialog();
    });

    createBackButton(this, 70, 70, () => {
      this.sound.play('btn_click', { seek: 0.8 });
      this.scene.start('CaseSelectScene', { case3Unlocked: true });
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
        text: "Hebat! Kamu sudah berhasil menyelesaikan dua misi sebelumnya.",
        color: 0x3b82f6, // Blue
        teacherKey: 'teacher_thumbup',
        playerKey: 'boy_idle',
        teacherScale: 1.0
      },
      {
        speaker: playerName,
        text: "Berarti tugas kita sudah selesai ya, Bu?",
        color: 0x16a34a, // Green
        teacherKey: 'teacher_thumbup',
        playerKey: 'boy_bingung',
        teacherScale: 1.0
      },
      {
        speaker: 'Ibu Guru',
        text: "Belum, masih ada satu misi terakhir. Coba lihat selokan di samping sekolah itu.",
        color: 0x3b82f6,
        teacherKey: 'teacher_surprised',
        playerKey: 'boy_bingung',
        teacherScale: 1.0
      },
      {
        speaker: playerName,
        text: "Wah, ada banyak sampah yang menyumbat aliran airnya!",
        color: 0x16a34a,
        teacherKey: 'teacher_surprised',
        playerKey: 'boy_surprised',
        teacherScale: 1.0
      },
      {
        speaker: 'Ibu Guru',
        text: "Tepat sekali. Sekarang giliranmu untuk selidiki apa penyebabnya",
        color: 0x3b82f6,
        teacherKey: 'teacher_thinking',
        playerKey: 'boy_idle',
        teacherScale: 1.0
      }
    ];

    this.lanjutText = this.add.text(dialogWidth / 2 - 30, dialogHeight / 2 - 20, 'Lanjut ➔', {
      fontFamily: 'monospace',
      fontSize: '26px',
      color: '#4ade80',
      fontStyle: 'bold'
    }).setOrigin(1, 1).setAlpha(0).setInteractive({ useHandCursor: true });
    this.lanjutText.on("pointerover", () => this.lanjutText.setColor("#22c55e"));
    this.lanjutText.on("pointerout", () => this.lanjutText.setColor("#4ade80"));

    // Tombol Misi (Kotak Biru)
    this.misiBtnContainer = this.add.container(dialogWidth / 2 - 100, dialogHeight / 2 - 35);
    const misiBtnBg = this.add.graphics();
    misiBtnBg.fillStyle(0x3b82f6, 1);
    misiBtnBg.fillRoundedRect(-100, -25, 200, 50, 15);
    const misiBtnText = this.add.text(0, 0, 'Investigasi ➔', {
      fontFamily: 'monospace',
      fontSize: '24px',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    this.misiBtnContainer.add([misiBtnBg, misiBtnText]);
    const misiHitArea = new Phaser.Geom.Rectangle(-100, -25, 200, 50);
    this.misiBtnContainer.setInteractive(misiHitArea, Phaser.Geom.Rectangle.Contains);
    this.misiBtnContainer.setVisible(false);

    this.misiBtnContainer.on('pointerover', () => {
      if (this.isClicking) return;
      this.input.setDefaultCursor('pointer');
      misiBtnBg.clear();
      misiBtnBg.fillStyle(0x2563eb, 1);
      misiBtnBg.fillRoundedRect(-100, -25, 200, 50, 15);
    });

    this.misiBtnContainer.on('pointerout', () => {
      if (this.isClicking) return;
      this.input.setDefaultCursor('default');
      misiBtnBg.clear();
      misiBtnBg.fillStyle(0x3b82f6, 1);
      misiBtnBg.fillRoundedRect(-100, -25, 200, 50, 15);
    });

    this.misiBtnContainer.on('pointerdown', () => {
      if (this.isClicking) return;
      this.input.setDefaultCursor('default');
      this.sound.play('btn_click', { seek: 0.8 });
      this.isClicking = true;
      setTimeout(() => {
        this.scene.start('InvestigationScene', { caseId: 'kasus_selokan' });
      }, 150);
    });

    const clickArea = this.add.zone(0, 0, width, height).setOrigin(0).setInteractive();
    const handleNextDialog = () => {
      if (this.isClicking) return;
      if (this.isTyping) {
        if (this.typeWriterEvent) this.typeWriterEvent.remove();
        this.textObj.text = dialogues[this.currentDialogIndex].text;
        this.isTyping = false;
        if (this.typingSound) this.typingSound.stop();
        if (this.currentDialogIndex === dialogues.length - 1) {
            this.misiBtnContainer.setVisible(true);
            this.lanjutText.setVisible(false);
        } else {
            this.lanjutText.setAlpha(1);
        }
      } else {
        if (this.currentDialogIndex < dialogues.length - 1) {
          this.currentDialogIndex++;
          this.startTyping(dialogues, dialogWidth, dialogHeight, nameBg, nameText);
        }
      }
    };
    clickArea.on('pointerdown', handleNextDialog);
    this.lanjutText.on('pointerdown', handleNextDialog);

    this.dialogContainer.add([dialogBg, nameBg, nameText, this.textObj, this.lanjutText, this.misiBtnContainer]);

    // Setup startTyping closure
    this.startTyping = (dialoguesArr: any[], dWidth: number, dHeight: number, nBg: Phaser.GameObjects.Graphics, nText: Phaser.GameObjects.Text) => {
      this.isTyping = true;
      this.lanjutText.setAlpha(0);
      this.misiBtnContainer.setVisible(false);
      this.textObj.text = '';
      const currentDialog = dialoguesArr[this.currentDialogIndex];
      const isTeacher = currentDialog.speaker === 'Ibu Guru';

      // Update teacher texture
      this.teacher.setTexture(currentDialog.teacherKey);
      const teacherMaxHeight = this.cameras.main.height * 0.82;
      this.teacherMaxScale = teacherMaxHeight / this.teacher.height;

      // Update player texture
      if (currentDialog.playerKey) {
        let actualKey = currentDialog.playerKey;
        const gender = this.registry.get('playerGender') || 'boy';
        if (gender === 'girl') {
          if (actualKey === 'boy_bingung') actualKey = 'girl_bingung';
          if (actualKey === 'boy_surprised') actualKey = 'girl_bingung'; // fallback
          if (actualKey === 'boy_idle') actualKey = 'girl_idle';
        }
        this.player.setTexture(actualKey);
        const playerMaxHeight = this.cameras.main.height * 0.97;
        this.playerMaxScale = playerMaxHeight / this.player.height;
      }

      nText.text = currentDialog.speaker;
      nBg.clear();
      nBg.fillStyle(currentDialog.color, 1);

      if (isTeacher) {
        nBg.fillRoundedRect(-dWidth / 2 + 30, -dHeight / 2 - 25, 200, 50, 10);
        nText.x = -dWidth / 2 + 130;
        this.tweens.add({ targets: this.teacher, scale: this.teacherMaxScale, alpha: 1, duration: 300 });
        this.tweens.add({ targets: this.player, scale: this.playerMaxScale * 0.9, alpha: 0.6, duration: 300 });
      } else {
        nBg.fillRoundedRect(dWidth / 2 - 230, -dHeight / 2 - 25, 200, 50, 10);
        nText.x = dWidth / 2 - 130;
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
            if (this.currentDialogIndex === dialoguesArr.length - 1) {
              this.misiBtnContainer.setVisible(true);
            } else {
              this.lanjutText.setAlpha(1);
            }
          }
        }
      });
    };

    // Stash dialogues for startTyping closure
    this.registry.set('c3b_dialogues', dialogues);
    this.registry.set('c3b_dWidth', dialogWidth);
    this.registry.set('c3b_dHeight', dialogHeight);
    this.registry.set('c3b_nBg', nameBg);
    this.registry.set('c3b_nText', nameText);
  }

  // To be overwritten by the closure above
  private startTyping: any;

  private showCharactersAndDialog() {
    this.sound.play('karakter_muncul', { volume: 0.8 });
    this.tweens.add({
      targets: this.teacher,
      alpha: 1,
      duration: 800,
      ease: 'Power2'
    });

    this.tweens.add({
      targets: this.player,
      scale: this.playerMaxScale * 0.9,
      alpha: 0.6,
      duration: 800,
      ease: 'Power2',
      onStart: () => {
        this.sound.play('karakter_muncul', { volume: 0.8 });
      },
      onComplete: () => {
        this.dialogContainer.y += 50;
        this.tweens.add({
          targets: this.dialogContainer,
          alpha: 1,
          y: this.cameras.main.height - 150,
          duration: 400,
          ease: 'Power2',
          onComplete: () => {
            const dialogues = this.registry.get('c3b_dialogues');
            const dWidth = this.registry.get('c3b_dWidth');
            const dHeight = this.registry.get('c3b_dHeight');
            const nBg = this.registry.get('c3b_nBg');
            const nText = this.registry.get('c3b_nText');
            this.startTyping(dialogues, dWidth, dHeight, nBg, nText);

          }
        });
      }
    });
  }
}
