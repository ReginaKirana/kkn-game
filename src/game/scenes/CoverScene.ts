import * as Phaser from 'phaser';
import coverBgAsset from '../../assets/backgrounds/cover.png';
import titleAsset from '../../assets/fonts/judul.png';
import startBtnAsset from '../../assets/button/mulai.png';
import coverAudioUrl from '../../assets/audio/cover.mp3';
import clickAudioUrl from '../../assets/audio/button_click.mp3';

export class CoverScene extends Phaser.Scene {
  private startBtn!: Phaser.GameObjects.Image;
  private baseBtnScale: number = 1;
  private bgMusic!: Phaser.Sound.BaseSound;

  constructor() {
    super('CoverScene');
  }

  preload() {
    // Load assets properly via Vite imports
    this.load.image('cover_bg', coverBgAsset);
    this.load.image('game_title', titleAsset);
    this.load.image('start_btn', startBtnAsset);
    this.load.audio('cover_bgm', coverAudioUrl);
    this.load.audio('click_sfx', clickAudioUrl);
  }

  create() {
    this.createBackground();
    this.createTitle();
    this.createStartButton();
    this.registerEvents();

    // Play background music (loops continuously)
    // Note: Browsers may block audio until the user clicks/interacts with the screen
    this.bgMusic = this.sound.add('cover_bgm', { loop: true, volume: 0.6 });
    this.bgMusic.play();
  }

  private createBackground() {
    const { width, height } = this.cameras.main;
    
    // Fallback background color
    this.add.rectangle(0, 0, width, height, 0x064e3b).setOrigin(0, 0);

    const bg = this.add.image(width / 2, height / 2, 'cover_bg');
    
    // Scale background to cover the entire screen while maintaining aspect ratio
    const scaleX = width / bg.width;
    const scaleY = height / bg.height;
    // Multiply by 1.085 to hide the white borders that exist in the original image asset
    const scale = Math.max(scaleX, scaleY) * 1.085;
    bg.setScale(scale);
  }

  private createTitle() {
    const { width, height } = this.cameras.main;
    
    const title = this.add.image(width / 2, height * 0.35, 'game_title');
    
    // Scale title so it doesn't overflow (target: 70% of screen width)
    const targetWidth = width * 0.7;
    const titleScale = targetWidth / title.width;
    title.setScale(titleScale);
    
    // Gentle floating animation
    this.tweens.add({
      targets: title,
      y: title.y - 15,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  private createStartButton() {
    const { width, height } = this.cameras.main;
    
    const startBtn = this.add.image(width / 2, height * 0.75, 'start_btn');
    startBtn.setInteractive({ useHandCursor: true });
    
    // Scale button so it's a reasonable size (target: 30% of screen width)
    const targetWidth = width * 0.3;
    this.baseBtnScale = targetWidth / startBtn.width;
    
    this.startBtn = startBtn;
    
    // Intro bounce animation
    startBtn.setScale(0);
    this.tweens.add({
      targets: startBtn,
      scaleX: this.baseBtnScale,
      scaleY: this.baseBtnScale,
      duration: 1000,
      ease: 'Elastic.easeOut'
    });
  }

  private registerEvents() {
    this.startBtn.on('pointerover', () => {
      this.tweens.add({
        targets: this.startBtn,
        scaleX: this.baseBtnScale * 1.1,
        scaleY: this.baseBtnScale * 1.1,
        duration: 200,
        ease: 'Power2'
      });
    });

    this.startBtn.on('pointerout', () => {
      this.tweens.add({
        targets: this.startBtn,
        scaleX: this.baseBtnScale,
        scaleY: this.baseBtnScale,
        duration: 200,
        ease: 'Power2'
      });
    });

    this.startBtn.on('pointerdown', () => {
      this.startBtn.disableInteractive();
      
      // Mainkan suara klik tombol
      // Parameter 'seek' melompati bagian awal audio (dalam detik). 
      // Ubah angka 0.3 jika suara kliknya masih terasa telat atau terlalu cepat.
      this.sound.play('click_sfx', { volume: 1, seek: 0.7 });
      
      this.tweens.add({
        targets: this.startBtn,
        scaleX: this.baseBtnScale * 0.9,
        scaleY: this.baseBtnScale * 0.9,
        duration: 100,
        yoyo: true,
        onComplete: () => {
          this.transitionToNextScene();
        }
      });
    });
  }

  private transitionToNextScene() {
    // Fade out background music simultaneously
    if (this.bgMusic) {
      this.tweens.add({
        targets: this.bgMusic,
        volume: 0,
        duration: 800
      });
    }

    this.cameras.main.fadeOut(800, 0, 0, 0);
    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
      if (this.bgMusic) {
        this.bgMusic.stop(); // Stop audio completely before scene change
      }
      this.scene.start('IntroScene');
    });
  }
}
