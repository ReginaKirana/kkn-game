import * as Phaser from 'phaser';
import { supabase } from '../../lib/supabaseClient';

export class LeaderboardScene extends Phaser.Scene {
  constructor() {
    super('LeaderboardScene');
  }

  create() {
    const { width, height } = this.cameras.main;

    // Latar belakang gelap elegan
    const bg = this.add.rectangle(0, 0, width, height, 0x0f172a).setOrigin(0, 0);
    
    // Pola dekoratif (opsional, lingkaran memudar)
    const circle1 = this.add.circle(width * 0.1, height * 0.2, 300, 0x3b82f6, 0.1);
    const circle2 = this.add.circle(width * 0.9, height * 0.8, 400, 0x10b981, 0.1);

    // Judul
    this.add.text(width / 2, 80, '🏆 PAPAN PERINGKAT 🏆', {
      fontFamily: 'monospace',
      fontSize: '48px',
      color: '#fef08a',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 6
    }).setOrigin(0.5);

    this.add.text(width / 2, 140, 'Siapa detektif sampah terbaik minggu ini?', {
      fontFamily: 'monospace',
      fontSize: '28px',
      color: '#cbd5e1',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Kotak kontainer untuk list
    const listWidth = 800;
    const listHeight = 550;
    const listBg = this.add.graphics();
    listBg.fillStyle(0x1e293b, 0.8);
    listBg.fillRoundedRect(width/2 - listWidth/2, 200, listWidth, listHeight, 20);
    listBg.lineStyle(4, 0x3b82f6, 1);
    listBg.strokeRoundedRect(width/2 - listWidth/2, 200, listWidth, listHeight, 20);

    // Teks Loading
    const loadingText = this.add.text(width / 2, 200 + listHeight / 2, 'Mengambil data dari markas...', {
      fontFamily: 'monospace',
      fontSize: '24px',
      color: '#94a3b8',
      fontStyle: 'italic'
    }).setOrigin(0.5);

    // Fetch data
    this.fetchLeaderboard(width, listWidth, loadingText);

    // Tombol Navigasi di bawah
    this.createActionButtons(width, height);
  }

  private async fetchLeaderboard(width: number, listWidth: number, loadingText: Phaser.GameObjects.Text) {
    try {
      const { data, error } = await supabase
        .from('leaderboard')
        .select('name, school_name, score')
        .order('score', { ascending: false })
        .limit(7); // Ambil Top 7 saja agar pas di layar

      loadingText.destroy(); // Hapus tulisan loading

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        this.renderList(data, width, listWidth);
      } else {
        this.add.text(width / 2, 450, 'Belum ada detektif yang menyelesaikan misi.', {
          fontFamily: 'monospace',
          fontSize: '24px',
          color: '#ef4444'
        }).setOrigin(0.5);
      }

    } catch (err) {
      loadingText.setText('Gagal mengambil data. Cek koneksi internetmu!');
      loadingText.setColor('#ef4444');
      console.error(err);
    }
  }

  private renderList(players: any[], width: number, listWidth: number) {
    const startY = 240;
    const rowHeight = 70;

    players.forEach((player, index) => {
      const y = startY + (index * rowHeight);
      
      // Warna untuk 3 besar
      let rankColor = '#94a3b8'; // Abu-abu default
      let bgRowColor = 0x334155; // Gelap default
      if (index === 0) { rankColor = '#facc15'; bgRowColor = 0x713f12; } // Emas
      else if (index === 1) { rankColor = '#cbd5e1'; bgRowColor = 0x334155; } // Perak
      else if (index === 2) { rankColor = '#b45309'; bgRowColor = 0x451a03; } // Perunggu

      // Latar belang-belang agar mudah dibaca
      const rowBg = this.add.graphics();
      rowBg.fillStyle(bgRowColor, index % 2 === 0 ? 0.6 : 0.3);
      rowBg.fillRoundedRect(width/2 - listWidth/2 + 20, y - 25, listWidth - 40, 50, 10);

      // Peringkat
      this.add.text(width/2 - listWidth/2 + 50, y, `#${index + 1}`, {
        fontFamily: 'monospace',
        fontSize: '28px',
        color: rankColor,
        fontStyle: 'bold'
      }).setOrigin(0, 0.5);

      // Nama (Asal Sekolah)
      const schoolName = player.school_name ? `(${player.school_name})` : '';
      this.add.text(width/2 - listWidth/2 + 130, y, `${player.name} ${schoolName}`, {
        fontFamily: 'monospace',
        fontSize: '26px',
        color: '#ffffff',
        fontStyle: 'bold'
      }).setOrigin(0, 0.5);

      // Skor
      this.add.text(width/2 + listWidth/2 - 50, y, `${player.score.toLocaleString('id-ID')}`, {
        fontFamily: 'monospace',
        fontSize: '28px',
        color: '#4ade80',
        fontStyle: 'bold'
      }).setOrigin(1, 0.5);
    });
  }

  private createActionButtons(width: number, height: number) {
    const yPos = height - 120;
    
    const createBtn = (x: number, y: number, text: string, color: number, hoverColor: number, callback: () => void) => {
      const btn = this.add.container(x, y);
      
      const btnWidth = 320;
      const btnHeight = 65;
      
      // Shadow (Drop shadow gaming style)
      const shadow = this.add.graphics();
      shadow.fillStyle(0x000000, 0.4);
      shadow.fillRoundedRect(-btnWidth/2 + 4, -btnHeight/2 + 6, btnWidth, btnHeight, 20);

      // Main background
      const bg = this.add.graphics();
      bg.fillStyle(color, 1);
      bg.fillRoundedRect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight, 20);
      
      // Inner stroke for depth
      bg.lineStyle(4, 0xffffff, 0.3);
      bg.strokeRoundedRect(-btnWidth/2 + 2, -btnHeight/2 + 2, btnWidth - 4, btnHeight - 4, 18);
      
      // Outer border
      bg.lineStyle(3, 0x000000, 1);
      bg.strokeRoundedRect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight, 20);

      const txt = this.add.text(0, 0, text, {
        fontFamily: 'Fredoka One, Arial, sans-serif',
        fontSize: '24px',
        color: '#ffffff',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 4,
        shadow: { offsetX: 2, offsetY: 2, color: '#000000', blur: 0, fill: true }
      }).setOrigin(0.5);

      btn.add([shadow, bg, txt]);

      const hitArea = new Phaser.Geom.Rectangle(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight);
      btn.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);

      btn.on('pointerover', () => {
        this.input.setDefaultCursor('pointer');
        bg.clear();
        bg.fillStyle(hoverColor, 1);
        bg.fillRoundedRect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight, 20);
        bg.lineStyle(4, 0xffffff, 0.5);
        bg.strokeRoundedRect(-btnWidth/2 + 2, -btnHeight/2 + 2, btnWidth - 4, btnHeight - 4, 18);
        bg.lineStyle(3, 0x000000, 1);
        bg.strokeRoundedRect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight, 20);
        btn.y = y - 2;
        shadow.y = 2; // Keep shadow grounded
      });

      btn.on('pointerout', () => {
        this.input.setDefaultCursor('default');
        bg.clear();
        bg.fillStyle(color, 1);
        bg.fillRoundedRect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight, 20);
        bg.lineStyle(4, 0xffffff, 0.3);
        bg.strokeRoundedRect(-btnWidth/2 + 2, -btnHeight/2 + 2, btnWidth - 4, btnHeight - 4, 18);
        bg.lineStyle(3, 0x000000, 1);
        bg.strokeRoundedRect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight, 20);
        btn.y = y;
        shadow.y = 0;
      });

      btn.on('pointerdown', () => {
        this.input.setDefaultCursor('default');
        btn.y = y + 4;
        shadow.y = -4;
        setTimeout(() => callback(), 150);
      });
    };

    // Tombol Beranda di Kiri
    createBtn(width / 2 - 180, yPos, 'KEMBALI KE BERANDA', 0x3b82f6, 0x60a5fa, () => {
      this.scene.start('CoverScene');
    });

    // Tombol Main Lagi di Kanan
    createBtn(width / 2 + 180, yPos, 'MAIN LAGI', 0x10b981, 0x34d399, () => {
      this.scene.start('CaseSelectScene', { case2Unlocked: true, case3Unlocked: true });
    });
  }
}
