import { useState } from 'react';

function FlipCard({ front, back }: { front: string, back: string }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div 
      className="card text-center" 
      style={{ 
        cursor: 'pointer', 
        minHeight: '200px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: flipped ? 'var(--primary)' : 'var(--surface)',
        color: flipped ? '#fff' : 'var(--text-main)',
        transition: 'all 0.3s ease'
      }}
      onClick={() => setFlipped(!flipped)}
    >
      <h3 style={{ margin: 0, fontSize: '1.5rem' }}>{flipped ? back : front}</h3>
    </div>
  );
}

export default function Learn() {
  return (
    <div className="flex flex-col items-center">
      <h2 style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '24px' }}>Belajar Yuk!</h2>
      <p className="mb-8" style={{ fontSize: '1.2rem', textAlign: 'center' }}>Klik kartu di bawah ini untuk melihat penjelasannya!</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', width: '100%' }}>
        <FlipCard 
          front="Apa itu Sampah Organik?" 
          back="Sampah yang bisa membusuk, seperti sisa makanan, daun, dan ranting." 
        />
        <FlipCard 
          front="Apa itu Sampah Anorganik?" 
          back="Sampah yang sulit hancur, seperti plastik, kaleng, dan kaca." 
        />
        <FlipCard 
          front="Kenapa harus dipilah?" 
          back="Agar sampah yang bisa didaur ulang tidak kotor dan bau, serta mencegah penyakit." 
        />
        <FlipCard 
          front="Apa itu 3R?" 
          back="Reduce (Kurangi), Reuse (Gunakan kembali), Recycle (Daur ulang)." 
        />
      </div>
    </div>
  );
}
