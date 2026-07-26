import { useState } from 'react';
import { BookOpen, Leaf, Recycle, AlertTriangle, Lightbulb } from 'lucide-react';

function FlipCard({ icon, title, frontText, backContent, bgColor, textColor }: { icon: React.ReactNode, title: string, frontText: string, backContent: React.ReactNode, bgColor: string, textColor: string }) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className="flip-card-container" 
      style={{ perspective: '1000px', height: '320px', width: '100%', cursor: 'pointer' }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div 
        className="flip-card-inner" 
        style={{ 
          position: 'relative', 
          width: '100%', 
          height: '100%', 
          transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)', 
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
        }}
      >
        {/* Front */}
        <div 
          className="flip-card-front card" 
          style={{ 
            position: 'absolute', 
            width: '100%', 
            height: '100%', 
            backfaceVisibility: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '24px',
            backgroundColor: bgColor,
            color: textColor,
            border: '4px solid rgba(255,255,255,0.5)',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
          }}
        >
          <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '50%', marginBottom: '16px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
            {icon}
          </div>
          <h3 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '8px' }}>{title}</h3>
          <p style={{ fontSize: '1.1rem', fontWeight: '600', opacity: 0.9 }}>{frontText}</p>
          <div style={{ marginTop: 'auto', padding: '8px 16px', backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold' }}>
            Klik untuk membalik ↩
          </div>
        </div>

        {/* Back */}
        <div 
          className="flip-card-back card" 
          style={{ 
            position: 'absolute', 
            width: '100%', 
            height: '100%', 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '24px',
            backgroundColor: '#ffffff',
            border: `4px solid ${bgColor}`
          }}
        >
          <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '16px', color: textColor }}>{title}</h3>
          <div style={{ fontSize: '1.1rem', color: '#475569', lineHeight: 1.5, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {backContent}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Learn() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '48px', width: '100%' }}>
      <section className="text-center" style={{ backgroundColor: '#fef08a', borderRadius: '32px', padding: '48px 24px', border: '4px solid #facc15' }}>
        <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', color: '#854d0e', marginBottom: '16px', fontWeight: '900' }}>
          Belajar Yuk! 📚
        </h1>
        <p style={{ fontSize: '1.25rem', color: '#713f12', maxWidth: '600px', margin: '0 auto', fontWeight: '600' }}>
          Klik kartu di bawah ini untuk membalik dan menemukan rahasia tentang sampah!
        </p>
      </section>

      <section style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '32px', 
        width: '100%',
        maxWidth: '1000px', 
        margin: '0 auto' 
      }}>
        
        <FlipCard 
          icon={<Leaf size={48} color="#16a34a" />}
          title="Jenis Sampah"
          frontText="Apa bedanya Organik dan Anorganik?"
          bgColor="#dcfce7"
          textColor="#166534"
          backContent={
            <>
              <p>🌱 <b>Organik:</b> Mudah membusuk. <br/>Contoh: Sisa makanan, daun, kulit buah.</p>
              <p>🥤 <b>Anorganik:</b> Sulit hancur. <br/>Contoh: Plastik, kaleng, kaca.</p>
            </>
          }
        />

        <FlipCard 
          icon={<AlertTriangle size={48} color="#dc2626" />}
          title="Kenapa Dipilah?"
          frontText="Apa yang terjadi kalau sampah dicampur?"
          bgColor="#fee2e2"
          textColor="#991b1b"
          backContent={
            <>
              <p>🌊 Selokan bisa tersumbat dan bikin banjir!</p>
              <p>🦠 Jadi sarang penyakit dan bau tidak sedap.</p>
              <p>♻️ Sampah yang tercampur jadi susah didaur ulang.</p>
            </>
          }
        />

        <FlipCard 
          icon={<Recycle size={48} color="#0284c7" />}
          title="Mengenal 3R"
          frontText="Jurus andalan Pahlawan Bumi!"
          bgColor="#e0f2fe"
          textColor="#075985"
          backContent={
            <>
              <p><b>Reduce:</b> Bawa botol minum sendiri.</p>
              <p><b>Reuse:</b> Pakai kertas di kedua sisinya.</p>
              <p><b>Recycle:</b> Buat mainan dari kardus bekas.</p>
            </>
          }
        />

        <FlipCard 
          icon={<Lightbulb size={48} color="#9333ea" />}
          title="Fakta Unik!"
          frontText="Tahukah kamu tentang fakta mengejutkan ini?"
          bgColor="#f3e8ff"
          textColor="#6b21a8"
          backContent={
            <>
              <p>😱 Botol plastik butuh <b>450 tahun</b> untuk hancur di tanah!</p>
              <p>🌍 1 ton kertas yang didaur ulang bisa menyelamatkan 17 pohon!</p>
            </>
          }
        />

      </section>
    </div>
  );
}
