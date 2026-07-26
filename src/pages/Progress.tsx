import { useState, useEffect } from 'react';
import { Star, Award, Shield, CheckCircle } from 'lucide-react';
import heroImg from '../assets/hero.png';

export default function Progress() {
  const [playerName, setPlayerName] = useState('Detektif Misterius');
  const [completedCases, setCompletedCases] = useState<string[]>([]);

  useEffect(() => {
    // Read from localStorage
    const name = localStorage.getItem('kkn-game-playerName');
    if (name) setPlayerName(name);

    const progressObjStr = localStorage.getItem('detektif_progress');
    if (progressObjStr) {
      try {
        const progressObj = JSON.parse(progressObjStr);
        // progressObj might be like { 'kasus_halaman': true, 'kasus_sampah': true }
        const cases = Object.keys(progressObj).filter(key => progressObj[key]);
        setCompletedCases(cases);
      } catch (e) {
        console.error('Error parsing progress', e);
      }
    }
  }, []);

  const totalCases = completedCases.length;
  
  // Determine Badge
  let badgeIcon = <Shield size={64} color="#94a3b8" />; // Default: Pemula (Silver/Gray)
  let badgeName = "Detektif Pemula";
  let badgeColor = "bg-gray-100 text-gray-700 border-gray-300";

  if (totalCases === 3) {
    badgeIcon = <Award size={64} color="#f59e0b" />; // Ahli (Gold)
    badgeName = "Detektif Ahli";
    badgeColor = "bg-yellow-100 text-yellow-800 border-yellow-400";
  } else if (totalCases >= 1) {
    badgeIcon = <Star size={64} color="#3b82f6" />; // Menengah (Blue)
    badgeName = "Detektif Menengah";
    badgeColor = "bg-blue-100 text-blue-800 border-blue-400";
  }

  return (
    <div className="flex flex-col gap-8 align-center items-center">
      
      {/* Header Profile */}
      <section className="w-full max-w-2xl bg-white rounded-3xl p-8 border-4 border-primary shadow-lg text-center relative overflow-hidden mt-8">
        <div style={{ position: 'absolute', top: '-20px', left: '-20px', opacity: 0.1 }}>
          <Star size={150} color="#16a34a" />
        </div>
        
        <img 
          src={heroImg} 
          alt="Avatar" 
          style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '50%', margin: '0 auto 16px auto', border: '4px solid #16a34a', backgroundColor: '#dcfce7' }} 
        />
        <h2 style={{ fontSize: '2rem', fontWeight: '900', color: '#1f2937', marginBottom: '8px' }}>
          Halo, {playerName}!
        </h2>
        <p style={{ color: '#64748b', fontSize: '1.2rem', fontWeight: '600' }}>
          Terus semangat menjaga bumi kita ya! 🌍
        </p>
      </section>

      {/* Badge Section */}
      <section className="w-full max-w-2xl">
        <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1f2937', marginBottom: '16px', textAlign: 'center' }}>
          Lencana Kamu 🏅
        </h3>
        <div className={`rounded-3xl p-8 border-4 shadow-md flex flex-col items-center justify-center text-center gap-4 ${badgeColor}`}>
          <div style={{ padding: '16px', backgroundColor: 'white', borderRadius: '50%', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
            {badgeIcon}
          </div>
          <h4 style={{ fontSize: '1.75rem', fontWeight: '900' }}>{badgeName}</h4>
          <p style={{ fontSize: '1.1rem', fontWeight: '600', opacity: 0.8 }}>
            Telah menyelesaikan {totalCases} dari 3 kasus!
          </p>
        </div>
      </section>

      {/* Cases List */}
      <section className="w-full max-w-2xl">
        <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1f2937', marginBottom: '16px', textAlign: 'center' }}>
          Riwayat Kasus 🕵️‍♂️
        </h3>
        
        <div className="flex flex-col gap-4">
          <CaseItem 
            title="Kasus 1: Misteri Halaman Kotor" 
            isCompleted={completedCases.includes('kasus_halaman')} 
          />
          <CaseItem 
            title="Kasus 2: Misi Pemilahan Sampah" 
            isCompleted={completedCases.includes('kasus_sampah')} 
          />
          <CaseItem 
            title="Kasus 3: Selokan Tersumbat" 
            isCompleted={completedCases.includes('kasus_selokan')} 
          />
        </div>
      </section>

    </div>
  );
}

function CaseItem({ title, isCompleted }: { title: string, isCompleted: boolean }) {
  return (
    <div 
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        padding: '20px 24px',
        backgroundColor: 'white',
        borderRadius: '20px',
        border: '3px solid',
        borderColor: isCompleted ? '#22c55e' : '#e2e8f0',
        boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
        opacity: isCompleted ? 1 : 0.6
      }}
    >
      <span style={{ fontSize: '1.25rem', fontWeight: '700', color: isCompleted ? '#15803d' : '#64748b' }}>
        {title}
      </span>
      {isCompleted ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#16a34a', fontWeight: 'bold' }}>
          <CheckCircle size={28} />
          <span>Selesai</span>
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', fontWeight: 'bold' }}>
          <span>Belum Tuntas</span>
        </div>
      )}
    </div>
  );
}
