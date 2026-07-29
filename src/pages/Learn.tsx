import { useState } from 'react';
import { BookOpen, Leaf, Recycle, AlertTriangle, Lightbulb, Flame, Zap, Sprout, Star, Award } from 'lucide-react';

interface FlipCardProps {
  id: number;
  icon: React.ReactNode;
  title: string;
  frontText: string;
  backContent: React.ReactNode;
  bgColor: string;
  textColor: string;
  onOpen: (id: number) => void;
}

function FlipCard({ id, icon, title, frontText, backContent, bgColor, textColor, onOpen }: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (!isFlipped) onOpen(id);
    setIsFlipped(!isFlipped);
  };

  return (
    <div 
      className="flip-card-container" 
      style={{ 
        perspective: '1000px', 
        height: '280px', 
        width: '100%', 
        cursor: 'pointer',
        transition: 'transform 0.3s ease',
        transform: isHovered && !isFlipped ? 'translateY(-8px)' : 'translateY(0)'
      }}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
            padding: '20px',
            backgroundColor: bgColor,
            color: textColor,
            border: '4px solid rgba(255,255,255,0.6)',
            boxShadow: isHovered ? '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)' : '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
            borderRadius: '24px',
            transition: 'box-shadow 0.3s ease'
          }}
        >
          <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '50%', marginBottom: '16px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
            {icon}
          </div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '8px' }}>{title}</h3>
          <p style={{ fontSize: '1rem', fontWeight: '600', opacity: 0.9 }}>{frontText}</p>
          <div style={{ marginTop: 'auto', padding: '6px 14px', backgroundColor: 'rgba(255,255,255,0.4)', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>
            Klik untuk membuka ↩
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
            padding: '20px',
            backgroundColor: '#ffffff',
            border: `4px solid ${bgColor}`,
            borderRadius: '24px',
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)'
          }}
        >
          <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '12px', color: textColor }}>{title}</h3>
          <div style={{ fontSize: '1rem', color: '#475569', lineHeight: 1.4, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {backContent}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Learn() {
  const [openedCards, setOpenedCards] = useState<Set<number>>(new Set());
  const totalCards = 8;

  const handleCardOpen = (id: number) => {
    setOpenedCards(prev => {
      const newSet = new Set(prev);
      newSet.add(id);
      return newSet;
    });
  };

  const isCompleted = openedCards.size === totalCards;
  const progressPercentage = (openedCards.size / totalCards) * 100;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', width: '100%', paddingBottom: '64px' }}>
      
      {/* Hero Section */}
      <section className="text-center" style={{ backgroundColor: '#fef08a', borderRadius: '32px', padding: '40px 24px', border: '4px solid #facc15' }}>
        <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#854d0e', marginBottom: '12px', fontWeight: '900' }}>
          Belajar Yuk! 📚
        </h1>
        <p style={{ fontSize: '1.1rem', color: '#713f12', maxWidth: '600px', margin: '0 auto', fontWeight: '600' }}>
          Balik semua kartu di bawah ini untuk menemukan rahasia tentang sampah dan jadilah pahlawan bumi!
        </p>
      </section>

      {/* Progress Bar Section */}
      <section style={{ maxWidth: '800px', width: '100%', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '24px', border: '2px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ fontWeight: '800', color: '#334155', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BookOpen size={20} color="#3b82f6" /> 
              Progres Belajarmu
            </div>
            <div style={{ fontWeight: '900', color: isCompleted ? '#16a34a' : '#64748b' }}>
              {openedCards.size} / {totalCards}
            </div>
          </div>
          
          <div style={{ height: '14px', backgroundColor: '#f1f5f9', borderRadius: '8px', overflow: 'hidden' }}>
            <div style={{ 
              height: '100%', 
              backgroundColor: isCompleted ? '#22c55e' : '#3b82f6', 
              width: `${progressPercentage}%`,
              transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.5s',
              borderRadius: '8px'
            }} />
          </div>

          {isCompleted && (
            <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#dcfce7', borderRadius: '12px', color: '#166534', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', animation: 'fadeIn 0.5s ease-out' }}>
              <Award size={20} />
              Hebat! Kamu sudah mempelajari semua materi hari ini! 🎉
            </div>
          )}
        </div>
      </section>

      {/* Cards Grid */}
      <section style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '24px', 
        width: '100%',
        maxWidth: '1100px', 
        margin: '0 auto',
        padding: '0 24px'
      }}>
        
        <FlipCard id={1} onOpen={handleCardOpen}
          icon={<Leaf size={32} color="#16a34a" />} title="Jenis Sampah" frontText="Organik vs Anorganik?"
          bgColor="#dcfce7" textColor="#166534"
          backContent={<><p>🌱 <b>Organik:</b> Mudah membusuk. (Sisa makanan, daun)</p><p>🥤 <b>Anorganik:</b> Sulit hancur. (Plastik, kaleng)</p></>}
        />

        <FlipCard id={2} onOpen={handleCardOpen}
          icon={<AlertTriangle size={32} color="#dc2626" />} title="Kenapa Dipilah?" frontText="Kalau dicampur bahaya ga?"
          bgColor="#fee2e2" textColor="#991b1b"
          backContent={<><p>🌊 Selokan bisa tersumbat dan bikin banjir!</p><p>🦠 Jadi sarang penyakit dan nyamuk jahat.</p></>}
        />

        <FlipCard id={3} onOpen={handleCardOpen}
          icon={<Recycle size={32} color="#0284c7" />} title="Mengenal 3R" frontText="Jurus Pahlawan Bumi!"
          bgColor="#e0f2fe" textColor="#075985"
          backContent={<><p><b>Reduce:</b> Kurangi sampah plastik.</p><p><b>Reuse:</b> Pakai ulang barang bekas.</p><p><b>Recycle:</b> Daur ulang jadi barang baru.</p></>}
        />

        <FlipCard id={4} onOpen={handleCardOpen}
          icon={<Lightbulb size={32} color="#9333ea" />} title="Fakta Plastik" frontText="Tahukah kamu?"
          bgColor="#f3e8ff" textColor="#6b21a8"
          backContent={<><p>😱 Botol plastik butuh <b>450 tahun</b> untuk hancur di tanah lho!</p><p>⏳ Sedotan plastik butuh 200 tahun!</p></>}
        />

        <FlipCard id={5} onOpen={handleCardOpen}
          icon={<Flame size={32} color="#ea580c" />} title="Jangan Dibakar!" frontText="Bakar sampah itu bagus?"
          bgColor="#ffedd5" textColor="#9a3412"
          backContent={<><p>🔥 <b>TIDAK!</b> Asap bakaran sampah itu beracun!</p><p>😷 Bisa bikin sesak napas dan merusak lapisan ozon.</p></>}
        />

        <FlipCard id={6} onOpen={handleCardOpen}
          icon={<Zap size={32} color="#ca8a04" />} title="Sampah E-Waste" frontText="Baterai & HP Bekas"
          bgColor="#fef08a" textColor="#854d0e"
          backContent={<><p>🔋 Baterai dan alat elektronik punya zat kimia berbahaya.</p><p>⚠️ Jangan dibuang ke tempat sampah biasa!</p></>}
        />

        <FlipCard id={7} onOpen={handleCardOpen}
          icon={<Sprout size={32} color="#65a30d" />} title="Keajaiban Kompos" frontText="Sisa makanan berguna?"
          bgColor="#ecfccb" textColor="#3f6212"
          backContent={<><p>✨ Tentu! Sampah sisa sayur dan buah bisa diolah jadi <b>Kompos</b>.</p><p>🌻 Kompos ini super bagus untuk makanan tanaman!</p></>}
        />

        <FlipCard id={8} onOpen={handleCardOpen}
          icon={<Star size={32} color="#ec4899" />} title="Pahlawan Cilik" frontText="Apa yang bisa aku lakukan?"
          bgColor="#fce7f3" textColor="#9d174d"
          backContent={<><p>1️⃣ Habiskan selalu makananmu.</p><p>2️⃣ Bawa bekal & botol minum sendiri.</p><p>3️⃣ Tegur teman yang buang sampah sembarangan!</p></>}
        />

      </section>
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
