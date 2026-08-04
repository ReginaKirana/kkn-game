import posterImg from '../assets/Poster.webp';
import { Image as ImageIcon } from 'lucide-react';

export default function Poster() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', width: '100%', paddingBottom: '64px', paddingTop: '24px' }}>
      <div style={{ marginBottom: '24px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
          <ImageIcon size={36} color="var(--primary)" />
          Poster Edukasi
        </h1>
        <p style={{ color: '#475569' }}>
          Lihat poster edukasi lingkungan yang sudah kami buat untuk menjaga kebersihan di sekitar kita!
        </p>
      </div>

      <section style={{ maxWidth: '800px', width: '100%', margin: '0 auto', padding: '0 24px', display: 'flex', justifyContent: 'center' }}>
        <img 
          src={posterImg} 
          alt="Poster Edukasi" 
          style={{ 
            maxWidth: '100%', 
            height: 'auto', 
            borderRadius: '16px', 
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
            border: '8px solid white'
          }} 
        />
      </section>
    </div>
  );
}
