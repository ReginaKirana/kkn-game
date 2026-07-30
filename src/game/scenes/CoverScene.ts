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

    this.createSettingsAndLeaderboardButtons();
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

  private createSettingsAndLeaderboardButtons() {
    const { width, height } = this.cameras.main;

    const createIconBtn = (x: number, y: number, text: string, color: number, callback: () => void) => {
      const btn = this.add.container(x, y);
      const size = 60;
      
      const shadow = this.add.graphics();
      shadow.fillStyle(0x000000, 0.3);
      shadow.fillCircle(0, 4, size / 2);

      const bg = this.add.graphics();
      bg.fillStyle(color, 1);
      bg.fillCircle(0, 0, size / 2);
      bg.lineStyle(3, 0xffffff, 1);
      bg.strokeCircle(0, 0, size / 2);

      const txt = this.add.text(0, 0, text, {
        fontSize: '32px'
      }).setOrigin(0.5);

      btn.add([shadow, bg, txt]);

      const hitArea = new Phaser.Geom.Circle(0, 0, size / 2);
      btn.setInteractive(hitArea, Phaser.Geom.Circle.Contains);
      btn.setDepth(100);

      btn.on('pointerover', () => {
        this.input.setDefaultCursor('pointer');
        this.tweens.add({ targets: btn, scale: 1.1, duration: 100 });
      });

      btn.on('pointerout', () => {
        this.input.setDefaultCursor('default');
        this.tweens.add({ targets: btn, scale: 1, duration: 100 });
      });

      btn.on('pointerdown', () => {
        this.input.setDefaultCursor('default');
        this.sound.play('click_sfx', { volume: 0.5, seek: 0.7 });
        this.tweens.add({
          targets: btn,
          scale: 0.9,
          duration: 100,
          yoyo: true,
          onComplete: callback
        });
      });
    };

    // Tombol Settings (Kanan Atas)
    createIconBtn(width - 50, 50, '⚙️', 0x475569, () => {
      this.showSettingsModal();
    });

    // Tombol Leaderboard (Kanan Atas, sebelah Settings)
    createIconBtn(width - 130, 50, '🏆', 0xd97706, () => {
      if (this.bgMusic) this.bgMusic.stop();
      this.scene.start('LeaderboardScene', { fromHome: true });
    });
  }

  private showSettingsModal() {
    const { width, height } = this.cameras.main;
    const blocker = this.add.rectangle(0, 0, width, height, 0x000000, 0.01).setOrigin(0, 0);
    blocker.setInteractive();
    blocker.setDepth(999);

    const wrapper = document.createElement('div');
    wrapper.id = 'settings-modal-overlay';
    wrapper.innerHTML = `
      <style>
        #settings-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.7);
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: auto;
        }
        #settings-modal-overlay .settings-panel {
          width: min(500px, 90vw);
          padding: 40px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          align-items: center;
          background: #0f172a;
          border-radius: 30px;
          border: 4px solid #3b82f6;
          box-shadow: 0 0 30px rgba(59, 130, 246, 0.5), inset 0 0 20px rgba(0,0,0,0.8);
          transform: scale(0);
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        #settings-modal-overlay h2 {
          color: #60a5fa;
          font-family: 'Fredoka One', 'Nunito', monospace;
          font-size: clamp(1.8rem, 3vw, 2.5rem);
          margin: 0 0 30px 0;
          text-transform: uppercase;
          letter-spacing: 2px;
          text-shadow: 0 0 10px rgba(96,165,250,0.5);
        }
        #settings-modal-overlay .slider-container {
          width: 100%;
          margin-bottom: 40px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        #settings-modal-overlay label {
          color: #f8fafc;
          font-family: 'Nunito', sans-serif;
          font-size: 1.2rem;
          margin-bottom: 15px;
          font-weight: bold;
        }
        /* Custom Neon Range Slider */
        #settings-modal-overlay input[type=range] {
          -webkit-appearance: none;
          width: 100%;
          background: transparent;
        }
        #settings-modal-overlay input[type=range]:focus {
          outline: none;
        }
        #settings-modal-overlay input[type=range]::-webkit-slider-runnable-track {
          width: 100%;
          height: 12px;
          cursor: pointer;
          background: #1e293b;
          border-radius: 10px;
          border: 2px solid #334155;
        }
        #settings-modal-overlay input[type=range]::-webkit-slider-thumb {
          height: 30px;
          width: 30px;
          border-radius: 50%;
          background: #22c55e;
          cursor: pointer;
          -webkit-appearance: none;
          margin-top: -11px;
          box-shadow: 0 0 15px #22c55e;
          border: 3px solid #ffffff;
        }
        #settings-modal-overlay .close-btn {
          font-size: 1.2rem;
          padding: 12px 40px;
          border-radius: 30px;
          border: 3px solid #b91c1c;
          background: #ef4444;
          color: white;
          cursor: pointer;
          font-family: 'Fredoka One', monospace;
          box-shadow: 0 6px 0 #991b1b;
          transition: all 0.1s;
        }
        #settings-modal-overlay .close-btn:hover {
          transform: translateY(2px);
          box-shadow: 0 4px 0 #991b1b;
          background: #f87171;
        }
        #settings-modal-overlay .close-btn:active {
          transform: translateY(6px);
          box-shadow: 0 0 0 #991b1b;
        }
      </style>
      <div class="settings-panel" id="settings-panel">
        <h2>PENGATURAN</h2>
        <div class="slider-container">
          <label>Volume Game (<span id="vol-val">100</span>%)</label>
          <input type="range" id="volumeSlider" min="0" max="1" step="0.01" value="${this.sound.volume}">
        </div>
        <button type="button" class="close-btn" id="closeSettings">TUTUP</button>
      </div>
    `;

    document.body.appendChild(wrapper);

    // Trigger animations
    requestAnimationFrame(() => {
      wrapper.style.opacity = '1';
      const panel = document.getElementById('settings-panel');
      if (panel) panel.style.transform = 'scale(1)';
    });

    const slider = document.getElementById('volumeSlider') as HTMLInputElement;
    const volVal = document.getElementById('vol-val');
    
    // Initial value
    if (volVal) volVal.innerText = Math.round(this.sound.volume * 100).toString();

    slider?.addEventListener('input', (e) => {
      const val = parseFloat((e.target as HTMLInputElement).value);
      this.sound.volume = val;
      if (volVal) {
        volVal.innerText = Math.round(val * 100).toString();
      }
    });

    const closeBtn = document.getElementById('closeSettings');
    const closeSequence = () => {
      wrapper.style.opacity = '0';
      const panel = document.getElementById('settings-panel');
      if (panel) panel.style.transform = 'scale(0)';
      
      setTimeout(() => {
        if (wrapper.parentNode) {
          wrapper.parentNode.removeChild(wrapper);
        }
        blocker.destroy();
      }, 300);
    };

    closeBtn?.addEventListener('click', closeSequence);
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
          min-height: 420px;
          height: auto;
          padding: 40px 20px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #0f172a;
          border-radius: 40px;
          border: 4px solid #3b82f6;
          box-shadow: 0 0 30px rgba(59, 130, 246, 0.4), inset 0 0 20px rgba(59, 130, 246, 0.2);
          transform: scale(0);
          transform-origin: center center;
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        #name-modal-overlay .name-dialog-title {
          color: #4ade80;
          font-family: 'Fredoka One', 'Varela Round', 'Nunito', sans-serif;
          font-size: clamp(1.6rem, 4vw, 2.5rem);
          margin: 0 0 25px 0;
          font-weight: 800;
          letter-spacing: 2px;
          text-shadow: 0 2px 10px rgba(74, 222, 128, 0.5);
        }
        #name-modal-overlay .name-dialog-input {
          font-size: clamp(1rem, 2.5vw, 1.4rem);
          padding: 14px 20px;
          border-radius: 20px;
          border: 3px solid #334155;
          background: #1e293b;
          color: #f8fafc;
          width: min(450px, 80%);
          text-align: center;
          margin: 0 0 15px 0;
          outline: none;
          font-family: 'Nunito', 'Inter', sans-serif;
          font-weight: bold;
          transition: all 0.2s;
          box-sizing: border-box;
        }
        #name-modal-overlay .name-dialog-input::placeholder {
          color: #64748b;
        }
        #name-modal-overlay .name-dialog-input:focus {
          border-color: #3b82f6;
          background: #0f172a;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.3);
        }
        #name-modal-overlay .name-dialog-btn {
          font-size: clamp(1.2rem, 3vw, 2rem);
          padding: 16px 60px;
          border-radius: 40px;
          border: 4px solid #047857;
          background: #10b981;
          color: #ffffff;
          cursor: pointer;
          font-family: 'Fredoka One', 'Nunito', sans-serif;
          font-weight: 900;
          box-shadow: 0 8px 0 #047857, 0 15px 20px rgba(0,0,0,0.4);
          text-transform: uppercase;
          letter-spacing: 2px;
          transition: all 0.1s;
          text-shadow: 2px 2px 0px #047857;
          margin: 0;
        }
        #name-modal-overlay .name-dialog-btn:hover {
          transform: translateY(2px);
          box-shadow: 0 6px 0 #047857, 0 10px 15px rgba(0,0,0,0.4);
          background: #34d399;
        }
        #name-modal-overlay .name-dialog-btn:active {
          transform: translateY(8px);
          box-shadow: 0 0 0 #047857, 0 0 0 rgba(0,0,0,0.4);
        }
        
        /* Gender Selection Styles */
        #name-modal-overlay .gender-container {
          display: flex;
          gap: 20px;
          margin-bottom: 25px;
          width: min(450px, 80%);
        }
        #name-modal-overlay .gender-box {
          flex: 1;
          padding: 15px;
          border: 3px solid #334155;
          border-radius: 20px;
          background: #1e293b;
          color: #94a3b8;
          font-family: 'Fredoka One', sans-serif;
          font-size: clamp(1rem, 2vw, 1.4rem);
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }
        #name-modal-overlay .gender-box .icon {
          font-size: 2.5rem;
        }
        #name-modal-overlay .gender-box:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.3);
          border-color: #475569;
        }
        #name-modal-overlay .gender-box.selected[data-gender="boy"] {
          border-color: #3b82f6;
          background: #1e3a8a;
          color: #93c5fd;
          box-shadow: 0 0 15px rgba(59, 130, 246, 0.4);
        }
        #name-modal-overlay .gender-box.selected[data-gender="girl"] {
          border-color: #ec4899;
          background: #831843;
          color: #f9a8d4;
          box-shadow: 0 0 15px rgba(236, 72, 153, 0.4);
        }
      </style>
      <div class="name-dialog-panel" id="modal-content">
        <h2 class="name-dialog-title">DATA DETEKTIF</h2>
        <input type="text" id="playerName" class="name-dialog-input" placeholder="Nama Panggilanmu..." autocomplete="off" />
        <input type="text" id="schoolName" class="name-dialog-input" style="margin-bottom: 15px;" placeholder="Asal Sekolah" autocomplete="off" />
        
        <div class="gender-container" id="genderSelect">
          <div class="gender-box selected" data-gender="boy">
            <span class="icon">👦</span>
            <span>Laki-laki</span>
          </div>
          <div class="gender-box" data-gender="girl">
            <span class="icon">👧</span>
            <span>Perempuan</span>
          </div>
        </div>

        <button type="button" id="submitName" class="name-dialog-btn">MULAI MISI</button>
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
    wrapper.querySelector('#schoolName')?.addEventListener('keydown', (event) => {
      if ((event as KeyboardEvent).key === 'Enter') submit();
    });

    // Gender Selection Logic
    const genderBoxes = wrapper.querySelectorAll('.gender-box');
    genderBoxes.forEach(box => {
      box.addEventListener('click', () => {
        genderBoxes.forEach(b => b.classList.remove('selected'));
        box.classList.add('selected');
      });
    });
  }

  private submitNameForm(wrapper: HTMLElement, blocker: Phaser.GameObjects.Rectangle) {
    const inputName = wrapper.querySelector('#playerName') as HTMLInputElement;
    const inputSchool = wrapper.querySelector('#schoolName') as HTMLInputElement;
    const modalContent = wrapper.querySelector('#modal-content') as HTMLElement;

    if (inputName && inputName.value.trim() !== '' && inputSchool && inputSchool.value.trim() !== '') {
      // Dapatkan gender yang dipilih
      let selectedGender = 'boy'; // default
      const selectedBox = wrapper.querySelector('.gender-box.selected');
      if (selectedBox) {
        selectedGender = selectedBox.getAttribute('data-gender') || 'boy';
      }

      // Simpan data di global registry
      this.registry.set('playerName', inputName.value.trim());
      this.registry.set('playerSchool', inputSchool.value.trim());
      this.registry.set('playerGender', selectedGender);
      localStorage.setItem('kkn-game-playerName', inputName.value.trim());
      localStorage.setItem('kkn-game-schoolName', inputSchool.value.trim());
      localStorage.setItem('kkn-game-startTime', Date.now().toString());
      // Reset unlocks and progress for a fresh start
      localStorage.removeItem('kkn-game-unlocks');
      localStorage.removeItem('detektif_progress');

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
