import * as Phaser from 'phaser';

export class ConclusionScene extends Phaser.Scene {
  private caseId!: string;

  constructor() {
    super('ConclusionScene');
  }

  create(data: { caseId: string }) {
    this.caseId = data.caseId || 'kasus_halaman';
    const { width, height } = this.cameras.main;

    // Background
    this.add.rectangle(0, 0, width, height, 0x0f172a).setOrigin(0, 0);

    // Container for the intro animation
    const introContainer = this.add.container(width / 2, height / 2);

    // Magnifying glass icon
    const magGlass = this.add.text(0, -150, '🔍', { fontSize: '100px' }).setOrigin(0.5);
    magGlass.setAlpha(0);
    magGlass.setScale(0.5);

    // Text 1
    const text1 = this.add.text(0, 30, 'Semua petunjuk berhasil ditemukan! 🎉', {
      fontFamily: 'monospace',
      fontSize: '36px',
      color: '#4ade80', // Green
      fontStyle: 'bold'
    }).setOrigin(0.5);
    text1.setAlpha(0);

    // Text 2
    const text2 = this.add.text(0, 100, 'Sekarang, coba pikirkan penyebab\nhalaman sekolah menjadi kotor.', {
      fontFamily: 'monospace',
      fontSize: '28px',
      color: '#e2e8f0', // Light gray
      align: 'center'
    }).setOrigin(0.5);
    text2.setAlpha(0);

    // Button "Lanjutkan Analisis"
    const btnContainer = this.add.container(0, 220);
    const btnWidth = 350;
    const btnHeight = 70;

    const btnBg = this.add.graphics();
    btnBg.fillStyle(0x3b82f6, 1);
    btnBg.fillRoundedRect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight, 35);
    btnBg.lineStyle(4, 0xffffff, 1);
    btnBg.strokeRoundedRect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight, 35);

    const btnText = this.add.text(0, 0, 'Lanjutkan Analisis ➔', {
      fontFamily: 'monospace',
      fontSize: '24px',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    btnContainer.add([btnBg, btnText]);
    btnContainer.setAlpha(0);

    introContainer.add([magGlass, text1, text2, btnContainer]);

    // ANIMATION SEQUENCE
    // 1. Magnifying glass drops and bounces
    this.tweens.add({
      targets: magGlass,
      y: -100,
      alpha: 1,
      scale: 1,
      duration: 1000,
      ease: 'Bounce.easeOut',
      onComplete: () => {
        // Pop effect
        this.tweens.add({
          targets: magGlass,
          scale: 1.2,
          duration: 150,
          yoyo: true,
          ease: 'Sine.easeInOut'
        });

        // 2. Text 1 fades in
        this.tweens.add({
          targets: text1,
          alpha: 1,
          y: 20,
          duration: 500,
          ease: 'Power2',
          onComplete: () => {
            // 3. Text 2 fades in
            this.tweens.add({
              targets: text2,
              alpha: 1,
              y: 90,
              duration: 500,
              ease: 'Power2',
              delay: 300,
              onComplete: () => {
                // 4. Button fades in
                this.tweens.add({
                  targets: btnContainer,
                  alpha: 1,
                  y: 200,
                  duration: 500,
                  ease: 'Back.easeOut',
                  onComplete: () => {
                    this.enableButton(btnContainer, introContainer, btnWidth, btnHeight, btnBg);
                  }
                });
              }
            });
          }
        });
      }
    });
  }

  private enableButton(
    btnContainer: Phaser.GameObjects.Container, 
    introContainer: Phaser.GameObjects.Container, 
    btnWidth: number, 
    btnHeight: number, 
    btnBg: Phaser.GameObjects.Graphics
  ) {
    const hitArea = new Phaser.Geom.Rectangle(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight);
    btnContainer.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);

    btnContainer.on('pointerover', () => {
      this.input.setDefaultCursor('pointer');
      this.tweens.add({ targets: btnContainer, scale: 1.05, duration: 100 });
      btnBg.clear();
      btnBg.fillStyle(0x2563eb, 1);
      btnBg.fillRoundedRect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight, 35);
      btnBg.lineStyle(4, 0xffffff, 1);
      btnBg.strokeRoundedRect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight, 35);
    });

    btnContainer.on('pointerout', () => {
      this.input.setDefaultCursor('default');
      this.tweens.add({ targets: btnContainer, scale: 1, duration: 100 });
      btnBg.clear();
      btnBg.fillStyle(0x3b82f6, 1);
      btnBg.fillRoundedRect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight, 35);
      btnBg.lineStyle(4, 0xffffff, 1);
      btnBg.strokeRoundedRect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight, 35);
    });

    btnContainer.on('pointerdown', () => {
      this.input.setDefaultCursor('default');
      
      // Transition out intro container
      this.tweens.add({
        targets: introContainer,
        alpha: 0,
        y: -50,
        duration: 400,
        ease: 'Power2',
        onComplete: () => {
          introContainer.destroy();
          this.showQuiz();
        }
      });
    });
  }

  private showQuiz() {
    const { width, height } = this.cameras.main;
    
    // For now, this is the placeholder quiz logic originally in the scene.
    // It can be expanded in the next steps.
    const quizContainer = this.add.container(width / 2, height / 2);
    quizContainer.setAlpha(0);

    const bgBox = this.add.graphics();
    bgBox.fillStyle(0xfef08a, 1);
    bgBox.fillRect(-400, -300, 800, 600);
    
    const title = this.add.text(0, -200, 'Pilih Akar Masalah', { 
      fontFamily: 'monospace',
      fontSize: '32px', 
      color: '#1f2937',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    const ansBtn = this.add.container(0, 0);
    const ansBg = this.add.graphics();
    ansBg.fillStyle(0x3b82f6, 1);
    ansBg.fillRect(-250, -35, 500, 70);
    
    const ansText = this.add.text(0, 0, 'Jadwal Angkut Tidak Jelas', { 
      fontFamily: 'monospace',
      fontSize: '22px',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    ansBtn.add([ansBg, ansText]);

    const hitArea = new Phaser.Geom.Rectangle(-250, -35, 500, 70);
    ansBtn.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);

    ansBtn.on('pointerover', () => {
      this.input.setDefaultCursor('pointer');
      ansBg.clear();
      ansBg.fillStyle(0x2563eb, 1);
      ansBg.fillRect(-250, -35, 500, 70);
    });

    ansBtn.on('pointerout', () => {
      this.input.setDefaultCursor('default');
      ansBg.clear();
      ansBg.fillStyle(0x3b82f6, 1);
      ansBg.fillRect(-250, -35, 500, 70);
    });

    ansBtn.on('pointerdown', () => {
      this.input.setDefaultCursor('default');
      this.scene.start('SolutionScene', { caseId: this.caseId });
    });

    quizContainer.add([bgBox, title, ansBtn]);

    this.tweens.add({
      targets: quizContainer,
      alpha: 1,
      duration: 500,
      ease: 'Power2'
    });
  }
}
