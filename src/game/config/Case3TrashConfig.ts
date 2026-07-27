export const Case3TrashConfig = {
  // Koordinat dihitung berdasarkan persentase dari lebar (width) dan tinggi (height) layar
  // Contoh: x: 0.5 berarti di tengah layar secara horizontal
  clues: [
    { id: 'botol_plastik', asset: 'botol', x: 0.33, y: 0.47, maxDim: 250, text: 'Botol plastik ini menyumbat aliran air, bisa menyebabkan banjir!' },
    { id: 'kantong_plastik', asset: 'plastik', x: 0.49, y: 0.41, maxDim: 310, text: 'Kantong plastik sulit terurai dan menumpuk di saluran air.' },
    { id: 'kaleng_bekas', asset: 'kaleng', x: 0.61, y: 0.5, maxDim: 250, text: 'Kaleng bekas dapat menjadi sarang nyamuk jika terisi genangan air.' }
  ],
  distractors: [
    { asset: 'apple', x: 0.32, y: 0.40, maxDim: 250 },
    { asset: 'daun', x: 0.38, y: 0.41, maxDim: 250 },
    { asset: 'gelas', x: 0.44, y: 0.40, maxDim: 300 },
    { asset: 'kertas', x: 0.55, y: 0.41, maxDim: 250 },
    { asset: 'ranting', x: 0.65, y: 0.40, maxDim: 250 }
  ]
};
