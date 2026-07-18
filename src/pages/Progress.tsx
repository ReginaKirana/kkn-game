import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';

export default function Progress() {
  const [progress, setProgress] = useState<Record<string, { stars: number }>>({});

  useEffect(() => {
    const saved = localStorage.getItem('detektif_progress');
    if (saved) {
      setProgress(JSON.parse(saved));
    }
  }, []);

  const totalCases = Object.keys(progress).length;
  let badge = 'Belum Ada';
  if (totalCases >= 1) badge = 'Detektif Pemula';
  if (totalCases >= 3) badge = 'Detektif Madya';
  if (totalCases >= 5) badge = 'Detektif Ahli';

  return (
    <div className="flex flex-col items-center">
      <h2 style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '24px' }}>Progres Aku</h2>
      
      <div className="card text-center mb-8" style={{ width: '100%', maxWidth: '600px', backgroundColor: 'var(--secondary)', color: '#fff' }}>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Lencana Saat Ini</h3>
        <div style={{ fontSize: '2.5rem', fontWeight: 'bold', fontFamily: 'Baloo 2' }}>{badge}</div>
        <p style={{ marginTop: '8px' }}>Selesaikan kasus untuk naik tingkat!</p>
      </div>

      <div style={{ width: '100%', maxWidth: '600px' }}>
        <h3 style={{ fontSize: '1.8rem', marginBottom: '16px' }}>Riwayat Kasus</h3>
        {totalCases === 0 ? (
          <p className="text-center" style={{ color: 'var(--text-muted)' }}>Belum ada kasus yang diselesaikan. Ayo mainkan gamenya!</p>
        ) : (
          <div className="flex flex-col gap-4">
            {Object.entries(progress).map(([caseId, data]) => (
              <div key={caseId} className="card flex justify-between items-center" style={{ padding: '16px' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                  {caseId.replace('kasus_', 'Kasus ').toUpperCase()}
                </div>
                <div className="flex gap-2 text-warning">
                  {[...Array(data.stars)].map((_, i) => (
                    <Star key={i} size={24} fill="var(--secondary)" color="var(--secondary)" />
                  ))}
                  {[...Array(3 - data.stars)].map((_, i) => (
                    <Star key={i + data.stars} size={24} color="var(--text-muted)" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
