import * as Phaser from 'phaser';

export function createBackButton(scene: Phaser.Scene, x: number, y: number, onClick: () => void) {
  const btnRadius = 35;
  const backBtn = scene.add.container(x, y);

  const shadow = scene.add.graphics();
  shadow.fillStyle(0x000000, 0.4);
  shadow.fillCircle(3, 4, btnRadius);

  const btnBg = scene.add.graphics();
  btnBg.fillStyle(0x8B4513, 1);
  btnBg.fillCircle(0, 0, btnRadius);
  btnBg.lineStyle(4, 0x5C4033, 1);
  btnBg.strokeCircle(0, 0, btnRadius);

  const icon = scene.add.text(0, 0, '⬅️', {
    fontSize: '32px'
  }).setOrigin(0.5);

  backBtn.add([shadow, btnBg, icon]);
  backBtn.setDepth(2000);

  const hitArea = new Phaser.Geom.Circle(0, 0, btnRadius);
  backBtn.setInteractive(hitArea, Phaser.Geom.Circle.Contains);

  backBtn.on('pointerover', () => {
    scene.input.setDefaultCursor('pointer');
    backBtn.y = y - 2;
    shadow.y = 2;
    btnBg.clear();
    btnBg.fillStyle(0xA0522D, 1);
    btnBg.fillCircle(0, 0, btnRadius);
    btnBg.lineStyle(4, 0x5C4033, 1);
    btnBg.strokeCircle(0, 0, btnRadius);
  });

  backBtn.on('pointerout', () => {
    scene.input.setDefaultCursor('default');
    backBtn.y = y;
    shadow.y = 0;
    btnBg.clear();
    btnBg.fillStyle(0x8B4513, 1);
    btnBg.fillCircle(0, 0, btnRadius);
    btnBg.lineStyle(4, 0x5C4033, 1);
    btnBg.strokeCircle(0, 0, btnRadius);
  });

  backBtn.on('pointerdown', () => {
    scene.input.setDefaultCursor('default');
    backBtn.y = y + 4;
    shadow.y = -4;
    setTimeout(() => onClick(), 150);
  });

  return backBtn;
}
