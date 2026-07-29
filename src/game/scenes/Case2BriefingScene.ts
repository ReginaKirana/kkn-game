import * as Phaser from 'phaser';

import case1GameBg from '../../assets/backgrounds/case1-game.png';
import halamanBg from '../../assets/backgrounds/halaman.png';
import binImg from '../../assets/objects/bin.png';
import thumbUpTeacher from '../../assets/characters/teachers/thumb-up.png';
import surprisedTeacher from '../../assets/characters/teachers/suprised.png';
import thinkingTeacher from '../../assets/characters/teachers/thinking.png';
import boyIdle from '../../assets/characters/boy/boy-idle.png';
import girlIdle from '../../assets/characters/girl/girl-idle.png';
import { createBackButton } from '../utils/UIUtils';
import investigasiBgmUrl from '../../assets/audio/investigasi.mp3';
import karakterMunculUrl from '../../assets/audio/sfx/karakter-muncul.wav';
import keyboardTypingUrl from '../../assets/audio/keyboard-typing.wav';
import btnClickUrl from '../../assets/audio/button_click.mp3';
import modalInvestigasiUrl from '../../assets/audio/case1-modal-investigasi.wav';

export class Case2BriefingScene extends Phaser.Scene {
  private bg1!: Phaser.GameObjects.Image;
  private bin!: Phaser.GameObjects.Image;
  private overlay!: Phaser.GameObjects.Rectangle;
  private teacher!: Phaser.GameObjects.Image;
  private player!: Phaser.GameObjects.Image;
  private dialogContainer!: Phaser.GameObjects.Container;
  private textObj!: Phaser.GameObjects.Text;
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

  constructor() {
    super('Case2BriefingScene');
  }

  preload() {
    this.load.image('brief_case1_bg', case1GameBg);
    this.load.image('brief_bin', binImg);
    this.load.image('teacher_thumbup', thumbUpTeacher);
    this.load.image('teacher_surprised', surprisedTeacher);
    this.load.image('teacher_thinking', thinkingTeacher);
    this.load.image('boy_idle', boyIdle);
    this.load.image('girl_idle', girlIdle);
    this.load.audio('investigasi_bgm', investigasiBgmUrl);
    this.load.audio('karakter_muncul', karakterMunculUrl);
    this.load.audio('keyboard_typing', keyboardTypingUrl);
    this.load.audio('btn_click', btnClickUrl);
    this.load.audio('modal_investigasi', modalInvestigasiUrl);
  }

  create() {
    const { width, height } = this.cameras.main;

    // Background 1 (case1-game.png)
    this.bg1 = this.add.image(width / 2, height / 2, 'brief_case1_bg');
    this.bg1.setScale(Math.max(width / this.bg1.width, height / this.bg1.height));

    // Tempat sampah
    this.bin = this.add.image(width * 0.5, height * 0.45, 'brief_bin');
    this.bin.setScale(0.8);

    // Overlay gelap - hidden initially
    this.overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.6).setOrigin(0, 0);
    this.overlay.setAlpha(0);
    this.overlay.setDepth(10);

    // Teacher
    this.teacher = this.add.image(width * 0.2, height, 'teacher_thumbup').setOrigin(0.5, 1);
    const teacherMaxHeight = height * 0.85;
    this.teacherMaxScale = teacherMaxHeight / this.teacher.height;
    this.teacher.setScale(this.teacherMaxScale);
    this.teacher.setFlipX(true);
    this.teacher.setDepth(20);
    this.teacher.setAlpha(0);

    // Player
    const gender = this.registry.get('playerGender') || 'boy';
    const playerAsset = gender === 'boy' ? 'boy_idle' : 'girl_idle';
    this.player = this.add.image(width * 0.8, height, playerAsset).setOrigin(0.5, 1);
    const playerMaxHeight = height * 0.97;
    this.playerMaxScale = playerMaxHeight / this.player.height;
    this.player.setScale(this.playerMaxScale * 0.9); // Zoomed out
    this.player.setFlipX(false);
    this.player.setDepth(20);
    this.player.setAlpha(0);
    this.player.y = height + 150;

    this.createDialogUI(width, height);

    // Start Sequence
    this.bgMusic = this.sound.add('investigasi_bgm', { loop: true, volume: 0.3 });
    this.bgMusic.play();
    this.typingSound = this.sound.add('keyboard_typing', { loop: true, volume: 1 });
    
    this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
      if (this.bgMusic) this.bgMusic.stop();
      if (this.typingSound) this.typingSound.stop();
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
      this.sound.play('btn_click');
      this.scene.start('CaseSelectScene', { case2Unlocked: true });
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
    dialogBg.fillRoundedRect(-dialogWidth/2, -dialogHeight/2, dialogWidth, dialogHeight, 20);
    dialogBg.lineStyle(4, 0x3b82f6, 1); // Blue border
    dialogBg.strokeRoundedRect(-dialogWidth/2, -dialogHeight/2, dialogWidth, dialogHeight, 20);

    const nameBg = this.add.graphics();
    nameBg.fillStyle(0x3b82f6, 1);
    nameBg.fillRoundedRect(-dialogWidth / 2 + 30, -dialogHeight / 2 - 25, 200, 50, 10);
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

    const playerName = this.registry.get('playerName') || 'Detektif';

    const dialogues = [
      {
        speaker: 'Ibu Guru',
        text: "Hebat! Halaman sekolah sudah bersih.",
        color: 0x3b82f6, // Blue
        teacherKey: 'teacher_thumbup',
        teacherScale: 1.0
      },
      {
        speaker: playerName,
        text: "Tetapi… semua sampah yang terkumpul ini masih tercampur ya, Bu?",
        color: 0x16a34a, // Green
        teacherKey: 'teacher_thumbup', // Jangan berubah sebelum ngomong
        teacherScale: 1.0
      },
      {
        speaker: 'Ibu Guru',
        text: "Benar sekali. Menurutmu, apakah semua sampah ini boleh dibuang ke tempat yang sama?",
        color: 0x3b82f6,
        teacherKey: 'teacher_thinking',
        teacherScale: 0.85 // Dikecilin ukurannya
      }
    ];

    // Tombol Lanjut (Gaming Style)
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
        this.textObj.text = dialogues[this.currentDialogIndex].text;
        this.isTyping = false;
        if (this.typingSound) this.typingSound.stop();
      } else {
        if (this.currentDialogIndex < dialogues.length - 1) {
          this.currentDialogIndex++;
          this.startTyping(dialogues, dialogWidth, dialogHeight, nameBg, nameText);
          if (this.currentDialogIndex === dialogues.length - 1) {
            this.nextBtnText.text = 'INVESTIGASI ➔';
          }
        } else {
          if (this.isClicking) return;
          this.isClicking = true;
          this.nextBtnContainer.y = nextBtnY + 4;
          shadow.y = -4;
          this.tweens.add({
            targets: [this.dialogContainer, this.teacher, this.player],
            alpha: 0,
            duration: 300,
            onComplete: () => {
              this.showInvestigationModal();
            }
          });
        }
      }
    });

    this.dialogContainer.add([dialogBg, nameBg, nameText, this.textObj, this.nextBtnContainer]);

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
      } else {
        this.player.setTexture(gender === 'boy' ? 'boy_idle' : 'girl_idle');
      }

      nText.text = currentDialog.speaker;
      nBg.clear();
      nBg.fillStyle(currentDialog.color, 1);

      if (isTeacher) {
        nBg.fillRoundedRect(-dWidth/2 + 30, -dHeight/2 - 25, 200, 50, 10);
        nText.x = -dWidth/2 + 130;
        this.sound.play('karakter_muncul', { volume: 0.5 });
        this.tweens.add({ targets: this.teacher, scale: this.teacherMaxScale * currentDialog.teacherScale, alpha: 1, duration: 300 });
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
          }
        }
      });
    };

    // Stash dialogues for startTyping closure
    this.registry.set('c2b_dialogues', dialogues);
    this.registry.set('c2b_dWidth', dialogWidth);
    this.registry.set('c2b_dHeight', dialogHeight);
    this.registry.set('c2b_nBg', nameBg);
    this.registry.set('c2b_nText', nameText);
  }

  // To be overwritten by the closure above
  private startTyping: any;

  private showInvestigationModal() {
    const { width, height } = this.cameras.main;
    const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.6).setOrigin(0, 0);
    overlay.setDepth(100);

    const boxContainer = this.add.container(width / 2, height / 2);
    boxContainer.setDepth(101);
    boxContainer.setScale(0);

    const boxWidth = 700;
    const boxHeight = 150;
    const boxBg = this.add.graphics();
    boxBg.fillStyle(0x0f172a, 1);
    boxBg.fillRoundedRect(-boxWidth/2, -boxHeight/2, boxWidth, boxHeight, 20);
    boxBg.lineStyle(6, 0x3b82f6, 1);
    boxBg.strokeRoundedRect(-boxWidth/2, -boxHeight/2, boxWidth, boxHeight, 20);

    const text = this.add.text(0, 0, `Periksa Sampah yang Tercampur!`, {
      fontFamily: 'Fredoka One, Arial, sans-serif',
      fontSize: '36px',
      color: '#ffffff',
      fontStyle: 'bold',
      align: 'center',
      wordWrap: { width: boxWidth - 40 }
    }).setOrigin(0.5);

    boxContainer.add([boxBg, text]);

    overlay.setAlpha(0);
    this.tweens.add({
      targets: overlay,
      alpha: 1,
      duration: 150,
      onComplete: () => {
        this.sound.play('modal_investigasi', { volume: 0.8 });
        this.tweens.add({
          targets: boxContainer,
          scale: 1,
          duration: 300,
          ease: 'Back.easeOut',
          onComplete: () => {
            this.time.delayedCall(1500, () => {
              this.tweens.add({
                targets: [overlay, boxContainer],
                alpha: 0,
                duration: 200,
                onComplete: () => {
                  this.scene.start('InvestigationScene', { caseId: 'kasus_sampah' });
                }
              });
            });
          }
        });
      }
    });
  }

  private showCharactersAndDialog() {
    this.sound.play('karakter_muncul', { volume: 0.8 });
    this.tweens.add({
      targets: this.teacher,
      alpha: 1,
      duration: 600,
      ease: 'Power2'
    });

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
          y: this.cameras.main.height - 150,
          duration: 400,
          ease: 'Power2',
          onComplete: () => {
            const dialogues = this.registry.get('c2b_dialogues');
            const dWidth = this.registry.get('c2b_dWidth');
            const dHeight = this.registry.get('c2b_dHeight');
            const nBg = this.registry.get('c2b_nBg');
            const nText = this.registry.get('c2b_nText');
            this.startTyping(dialogues, dWidth, dHeight, nBg, nText);
            
            // Show next btn
            this.time.delayedCall(dialogues[0].text.length * 30 + 500, () => {
              this.tweens.add({ targets: this.nextBtnContainer, alpha: 1, duration: 300 });
              const hitArea = new Phaser.Geom.Rectangle(-120, -27.5, 240, 55);
              this.nextBtnContainer.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);
            });
          }
        });
      }
    });
  }
}
