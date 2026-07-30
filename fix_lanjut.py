import os
import glob
import re

scenes_dir = 'src/game/scenes/'
for filepath in glob.glob(os.path.join(scenes_dir, '*.ts')):
    with open(filepath, 'r') as f:
        content = f.read()

    original_content = content

    # Match `const lanjutText = ... .setOrigin(1, 1).setAlpha(0);`
    content = re.sub(
        r'(const lanjutText = .*?\.setOrigin\(1,\s*1\)(?:\.setAlpha\(0\))?;)',
        r'\1\n    lanjutText.setInteractive({ useHandCursor: true });\n    lanjutText.on("pointerover", () => lanjutText.setColor("#22c55e"));\n    lanjutText.on("pointerout", () => lanjutText.setColor("#4ade80"));',
        content,
        flags=re.DOTALL
    )

    if content != original_content:
        with open(filepath, 'w') as f:
            f.write(content)
        print(f'Fixed {filepath}')

