import case1ModalVoiceUrl from '../../assets/audio/case1-modal-investigasi.wav';
import * as Phaser from 'phaser';

// Auto-generated Global Asset Imports
import halamanKotorBg from '../../assets/backgrounds/halaman-kotor.png';
import surprisedTeacher from '../../assets/characters/teachers/suprised.png';
import thinkingTeacher from '../../assets/characters/teachers/thinking.png';
import boyIdle from '../../assets/characters/boy/boy-idle.png';
import boySupprised from '../../assets/characters/boy/boy-supprised.png';
import girlIdle from '../../assets/characters/girl/girl-idle.png';
import girlSupprised from '../../assets/characters/girl/girl-supprised.png';
import caseBriefingUrl from '../../assets/audio/case-briefing.mp3';
import typingAudioUrl from '../../assets/audio/keyboard-typing.mp3';
import btnClickUrl from '../../assets/audio/button_click.mp3';
import case1GameBg from '../../assets/backgrounds/case1-game.png';
import halamanKotor2Bg from '../../assets/backgrounds/Halaman-kotor2.png';
import halamanBg from '../../assets/backgrounds/halaman.png';
import teacherThumbUp from '../../assets/characters/teachers/thumb-up.png';
import teacherSmile from '../../assets/characters/teachers/smile.png';
import sparkleSound from '../../assets/audio/case1/sparkle.mp3';
import finishCase from '../../assets/audio/case1/finish-case.wav';
import bgGameplay from '../../assets/audio/case1/bg-gameplay.mp3';
import investigasiBgmUrl from '../../assets/audio/investigasi.mp3';
import karakterMunculUrl from '../../assets/audio/sfx/karakter-muncul.wav';
import wrongUrl from '../../assets/audio/case1/wrong.wav';
import correctUrl from '../../assets/audio/case1/correct.wav';
import misiMulaiUrl from '../../assets/audio/case1/misi-mulai.wav';
import binImg from '../../assets/objects/bin.png';
import modalInvestigasiUrl from '../../assets/audio/case1-modal-investigasi.wav';
import organikBin from '../../assets/objects/organik.png';
import anorganikBin from '../../assets/objects/anorganik.png';
import appleImg from '../../assets/objects/apple.png';
import botolImg from '../../assets/objects/botol.png';
import daunImg from '../../assets/objects/daun.png';
import kalengImg from '../../assets/objects/kaleng.png';
import kertasImg from '../../assets/objects/kertas.png';
import pisangImg from '../../assets/objects/pisang.png';
import binOranyeImg from '../../assets/objects/bin-oranye.png';
import selokanBg from '../../assets/backgrounds/selokan-tinngi.png';
import boyBingung from '../../assets/characters/boy/boy-bingung.png';
import girlBingung from '../../assets/characters/girl/girl-bingung.png';
import plastikImg from '../../assets/objects/plastik.png';
import gelasImg from '../../assets/objects/gelas.png';
import rantingImg from '../../assets/objects/ranting.png';
import selokanTransisi1 from '../../assets/backgrounds/selokan-transisi1.png';
import selokanTransisi3 from '../../assets/backgrounds/selokan-transisi3.png';
import selokanFinal from '../../assets/backgrounds/selokan-final.png';
import masukSampahUrl from '../../assets/audio/case1/masuk-sampah-gameplay.mp3';
import papanKasusBg from '../../assets/backgrounds/papan-kasus.png';
import papanKasus2Bg from '../../assets/backgrounds/papan-kasus2.png';
import papanKasus3Bg from '../../assets/backgrounds/papan-kasus3.png';
import padlockOpenUrl from '../../assets/audio/padlock-open.wav';
import levelUpUrl from '../../assets/audio/level-up.mp3';
import modalSfxUrl from '../../assets/audio/case1/investigation-modal.wav';
import investigationBgUrl from '../../assets/audio/case1/investigation-bg.mp3';
import coverBgAsset from '../../assets/backgrounds/cover.png';
import titleAsset from '../../assets/fonts/judul.png';
import startBtnAsset from '../../assets/button/mulai.png';
import coverAudioUrl from '../../assets/audio/cover.mp3';
import introBgAsset from '../../assets/backgrounds/intro.png';
import teacherSadAsset from '../../assets/characters/teachers/sad.png';
import teacherHappyAsset from '../../assets/characters/teachers/happy.png';
import introAudioUrl from '../../assets/audio/intro.mp3';
import binKosongBg from '../../assets/backgrounds/bin-kosong.png';
import case2InvestigationBg from '../../assets/backgrounds/case2-investigation.png';
import dingModalUrl from '../../assets/audio/case1/ding-modal.wav';
import collectUrl from '../../assets/audio/case1/investigation-collect.wav';
import outroAudioUrl from '../../assets/audio/outro.mp3';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    const { width, height } = this.cameras.main;

    // Background Loading
    this.add.rectangle(0, 0, width, height, 0x0f172a).setOrigin(0, 0);

    // Loading Text
    const loadingText = this.add.text(width / 2, height / 2 - 50, 'Loading...', {
      fontFamily: 'monospace',
      fontSize: '32px',
      color: '#f8fafc'
    }).setOrigin(0.5);

    // Progress Box
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x334155, 0.8);
    progressBox.fillRoundedRect(width / 2 - 160, height / 2, 320, 30, 15);

    // Progress Bar
    const progressBar = this.add.graphics();

    // Percent Text
    const percentText = this.add.text(width / 2, height / 2 + 15, '0%', {
      fontFamily: 'monospace',
      fontSize: '18px',
      color: '#ffffff'
    }).setOrigin(0.5);

    this.load.on('progress', (value: number) => {
      progressBar.clear();
      progressBar.fillStyle(0x3b82f6, 1);
      progressBar.fillRoundedRect(width / 2 - 155, height / 2 + 5, 310 * value, 20, 10);
      percentText.setText(Math.round(value * 100).toString() + '%');
    });

    this.load.on('complete', () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      percentText.destroy();
      
      // Small delay before starting next scene for smooth transition
      this.time.delayedCall(300, () => {
        this.scene.start('CoverScene');
      });
    });

    // Existing json load
    this.load.json('cases', '/data/cases.json');

    // Global Asset Loads
    this.load.image('halaman_kotor_bg', halamanKotorBg);
    this.load.image('teacher_surprised', surprisedTeacher);
    this.load.image('teacher_thinking', thinkingTeacher);
    this.load.image('boy_idle', boyIdle);
    this.load.image('boy_supprised', boySupprised);
    this.load.image('girl_idle', girlIdle);
    this.load.image('girl_supprised', girlSupprised);
    this.load.audio('case_briefing_bgm', caseBriefingUrl);
    this.load.audio('typing_sfx', typingAudioUrl);
    this.load.audio('btn_click', btnClickUrl);
    this.load.image('game_bg', case1GameBg);
    this.load.image('halaman_kotor2_bg', halamanKotor2Bg);
    this.load.image('halaman_bersih', halamanBg);
    this.load.image('teacher_thumbup', teacherThumbUp);
    this.load.image('teacher_smile', teacherSmile);
    this.load.audio('sparkle', sparkleSound);
    this.load.audio('keyboard_typing', typingAudioUrl);
    this.load.audio('finish_case', finishCase);
    this.load.audio('button_click', btnClickUrl);
    this.load.audio('bg_gameplay', bgGameplay);
    this.load.image('case1_game_bg', case1GameBg);
    this.load.audio('investigasi_bgm', investigasiBgmUrl);
    this.load.audio('karakter_muncul', karakterMunculUrl);
    this.load.audio('wrong', wrongUrl);
    this.load.audio('correct', correctUrl);
    this.load.audio('misi_mulai', misiMulaiUrl);
    this.load.image('brief_case1_bg', case1GameBg);
    this.load.image('brief_bin', binImg);
    this.load.audio('modal_investigasi', modalInvestigasiUrl);
    this.load.image('bin_organik', organikBin);
    this.load.image('bin_anorganik', anorganikBin);
    this.load.image('apple', appleImg);
    this.load.image('botol', botolImg);
    this.load.image('daun', daunImg);
    this.load.image('kaleng', kalengImg);
    this.load.image('kertas', kertasImg);
    this.load.image('pisang', pisangImg);
    this.load.image('selokan_bg', selokanBg);
    this.load.image('boy_bingung', boyBingung);
    this.load.image('boy_surprised', boySupprised);
    this.load.image('girl_bingung', girlBingung);
    this.load.image('plastik', plastikImg);
    this.load.image('gelas', gelasImg);
    this.load.image('ranting', rantingImg);
    this.load.image('girl_surprised', girlSupprised);
    this.load.image('selokan_transisi1', selokanTransisi1);
    this.load.image('selokan_transisi3', selokanTransisi3);
    this.load.image('selokan_final', selokanFinal);
    this.load.audio('masuk_sampah', masukSampahUrl);
    this.load.image('papan_kasus_bg', papanKasusBg);
    this.load.image('papan_kasus2_bg', papanKasus2Bg);
    this.load.image('papan_kasus3_bg', papanKasus3Bg);
    this.load.audio('padlock_open', padlockOpenUrl);
    this.load.audio('level_up', levelUpUrl);
    this.load.image('bin', binImg);
    this.load.image('clue_botol', botolImg);
    this.load.image('clue_pisang', pisangImg);
    this.load.image('clue_daun', daunImg);
    this.load.image('clue_bin', binImg);
    this.load.audio('modal_sfx', modalSfxUrl);
    this.load.audio('investigation_bgm', investigationBgUrl);
    this.load.audio('correct_sfx', correctUrl);
    this.load.audio('wrong_sfx', wrongUrl);
    this.load.image('cover_bg', coverBgAsset);
    this.load.image('game_title', titleAsset);
    this.load.image('start_btn', startBtnAsset);
    this.load.audio('cover_bgm', coverAudioUrl);
    this.load.audio('click_sfx', btnClickUrl);
    this.load.image('intro_bg', introBgAsset);
    this.load.image('teacher_sad', teacherSadAsset);
    this.load.image('teacher_happy', teacherHappyAsset);
    this.load.audio('intro_bgm', introAudioUrl);
    this.load.image('bin_kosong_bg', binKosongBg);
    this.load.audio('case1_modal_voice', case1ModalVoiceUrl);
    this.load.audio('ding_modal', dingModalUrl);
    this.load.audio('collect_sfx', collectUrl);
    this.load.image('case2_investigation_bg', case2InvestigationBg);
    this.load.image('bin_oranye', binOranyeImg);
    this.load.image('papan_kasus3', papanKasus3Bg);
    this.load.audio('outro_music', outroAudioUrl);
    this.load.audio('investigasi_bg', investigationBgUrl);
  }

  create() {
    // create is empty because transition is handled in preload complete event
  }
}
