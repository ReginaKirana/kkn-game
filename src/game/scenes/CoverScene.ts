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
    
    // Stop music if the scene is forcefully shut down (e.g., via debug scene skip)
    this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
      if (this.bgMusic) {
        this.bgMusic.stop();
      }
    });
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

    // Tambahkan overlay gelap (alpha: 0.4) agar judul dan tombol lebih menonjol
    this.add.rectangle(0, 0, width, height, 0x000000, 0.4).setOrigin(0, 0);
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
          this.showNameInput();
        }
      });
    });
  }

  private showNameInput() {
    // Block Phaser clicks while the HTML modal is open
    const { width, height } = this.cameras.main;
    const blocker = this.add.rectangle(0, 0, width, height, 0x000000, 0.01).setOrigin(0, 0);
    blocker.setInteractive();

    // Fixed to the browser viewport so ENVELOP scale can't shift it off-center
    const wrapper = document.createElement('div');
    wrapper.id = 'name-modal-overlay';
    wrapper.innerHTML = `
      <style>
        #name-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.7);
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: auto;
        }
        #name-modal-overlay .name-dialog-panel {
          width: min(650px, 90vw);
          height: min(420px, 70vh);
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.95);
          border-radius: 40px;
          border: 6px solid #84cc16;
          box-shadow: 0 15px 35px rgba(0,0,0,0.2);
          transform: scale(0);
          transform-origin: center center;
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        #name-modal-overlay .name-dialog-title {
          color: #166534;
          font-family: 'Fredoka One', 'Varela Round', 'Nunito', sans-serif;
          font-size: clamp(1.6rem, 4vw, 2.8rem);
          margin: 0 0 30px 0;
          font-weight: 800;
          letter-spacing: 1px;
        }
        #name-modal-overlay .name-dialog-input {
          font-size: clamp(1.2rem, 3vw, 2.2rem);
          padding: 16px 24px;
          border-radius: 20px;
          border: 3px solid #cbd5e1;
          background: #f8fafc;
          color: #1e293b;
          width: min(450px, 80%);
          text-align: center;
          margin: 0 0 35px 0;
          outline: none;
          font-family: 'Nunito', 'Inter', sans-serif;
          font-weight: bold;
          transition: all 0.2s;
          box-sizing: border-box;
        }
        #name-modal-overlay .name-dialog-input:focus {
          border-color: #84cc16;
          background: #ffffff;
          box-shadow: 0 0 0 4px rgba(132, 204, 22, 0.2);
        }
        #name-modal-overlay .name-dialog-btn {
          font-size: clamp(1.2rem, 3vw, 2.2rem);
          padding: 18px 60px;
          border-radius: 40px;
          border: 4px solid #3f6212;
          background: #84cc16;
          color: #ffffff;
          cursor: pointer;
          font-family: 'Fredoka One', 'Nunito', sans-serif;
          font-weight: 900;
          box-shadow: 0 8px 0 #3f6212, 0 15px 20px rgba(0,0,0,0.2);
          text-transform: uppercase;
          letter-spacing: 2px;
          transition: all 0.1s;
          text-shadow: 2px 2px 0px #3f6212;
          margin: 0;
        }
        #name-modal-overlay .name-dialog-btn:hover {
          transform: translateY(2px);
          box-shadow: 0 6px 0 #3f6212, 0 10px 15px rgba(0,0,0,0.2);
          background: #a3e635;
        }
        #name-modal-overlay .name-dialog-btn:active {
          transform: translateY(8px);
          box-shadow: 0 0 0 #3f6212, 0 0 0 rgba(0,0,0,0.2);
        }
      </style>
      <div class="name-dialog-panel" id="modal-content">
        <h2 class="name-dialog-title">Siapa Namamu?</h2>
        <input type="text" id="playerName" class="name-dialog-input" placeholder="Ketik namamu..." autocomplete="off" />
        <button type="button" id="submitName" class="name-dialog-btn">Mulai</button>
      </div>
    `;

    document.body.appendChild(wrapper);

    // Animate in on next frame so CSS transitions apply
    requestAnimationFrame(() => {
      wrapper.style.opacity = '1';
      const panel = wrapper.querySelector('#modal-content') as HTMLElement;
      if (panel) panel.style.transform = 'scale(1)';
      const input = wrapper.querySelector('#playerName') as HTMLInputElement;
      if (input) input.focus();
    });

    const submit = () => this.submitNameForm(wrapper, blocker);

    wrapper.querySelector('#submitName')?.addEventListener('click', submit);
    wrapper.querySelector('#playerName')?.addEventListener('keydown', (event) => {
      if ((event as KeyboardEvent).key === 'Enter') submit();
    });
  }

  private submitNameForm(wrapper: HTMLElement, blocker: Phaser.GameObjects.Rectangle) {
    const input = wrapper.querySelector('#playerName') as HTMLInputElement;
    const modalContent = wrapper.querySelector('#modal-content') as HTMLElement;

    if (input && input.value.trim() !== '') {
      const playerName = input.value.trim();

      this.registry.set('playerName', playerName);
      localStorage.setItem('kkn-game-playerName', playerName);
      localStorage.setItem('kkn-game-startTime', Date.now().toString());

      this.sound.play('click_sfx', { volume: 1, seek: 0.7 });

      if (modalContent) modalContent.style.transform = 'scale(0)';
      wrapper.style.opacity = '0';

      window.setTimeout(() => {
        wrapper.remove();
        blocker.destroy();
        this.transitionToNextScene();
      }, 300);
    } else if (modalContent) {
      // Shake when empty
      modalContent.animate(
        [
          { transform: 'scale(1) translateX(0)' },
          { transform: 'scale(1) translateX(-12px)' },
          { transform: 'scale(1) translateX(12px)' },
          { transform: 'scale(1) translateX(-8px)' },
          { transform: 'scale(1) translateX(8px)' },
          { transform: 'scale(1) translateX(0)' },
        ],
        { duration: 300 }
      );
    }
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
