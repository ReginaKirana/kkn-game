import { Link } from 'react-router-dom';
import { Gamepad2, BookOpen, Trophy, Leaf, ArrowRight, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Home() {
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const { data, error } = await supabase
          .from('leaderboard')
          .select('name, school_name, score')
          .order('score', { ascending: false })
          .limit(5); // Ambil Top 5
        
        if (error) throw error;
        setLeaderboardData(data || []);
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchLeaderboard();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '64px', paddingBottom: '64px' }}>
      
      {/* Hero / Game Section */}
      <section style={{ 
        margin: '0 24px', 
        padding: '64px 24px', 
        background: 'linear-gradient(145deg, #064e3b 0%, #022c22 100%)',
        borderRadius: '32px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        {/* Subtle decorative glow */}
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)', pointerEvents: 'none' }}></div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '20px', position: 'relative', zIndex: 1, width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(0,0,0,0.3)', padding: '6px 16px', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)' }}>
            <Gamepad2 size={16} color="#6ee7b7" />
            <span style={{ fontWeight: '800', fontSize: '0.75rem', letterSpacing: '1.5px', color: '#a7f3d0' }}>GAME EDUKASI</span>
          </div>

          <div style={{ width: '100%', maxWidth: '720px', marginTop: '16px' }}>
            <div style={{ 
              backgroundColor: '#000000', 
              border: '1px solid rgba(255,255,255,0.15)', 
              borderRadius: '24px', 
              aspectRatio: '16/9', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center', 
              color: 'white',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.7)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Inner subtle glow for the game box */}
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, rgba(16,185,129,0.08) 0%, transparent 60%)' }}></div>
              <Gamepad2 size={48} style={{ color: '#059669', marginBottom: '16px', opacity: 0.8 }} />
              <h2 style={{ fontSize: '1.25rem', marginBottom: '8px', color: '#e2e8f0', fontWeight: '700' }}>Frame Game (16:9)</h2>
              <p style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 'normal' }}>Area placeholder game</p>
            </div>
            
            <div style={{ marginTop: '24px' }}>
              <Link to="/game" target="_blank" style={{ color: '#6ee7b7', textDecoration: 'none', fontWeight: '700', fontSize: '0.95rem', display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 20px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.1)' }}>
                Buka Path Khusus Game ↗
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section style={{ display: 'flex', flexWrap: 'wrap', gap: '48px', alignItems: 'center', maxWidth: '1000px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ flex: '1 1 400px' }}>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', marginBottom: '24px', color: '#1f2937' }}>
            Bersama Kelola Sampah, <br /> Wujudkan <span style={{ color: 'var(--primary)' }}>Sahabat Bumi</span> & Sehat
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem', marginBottom: '32px', lineHeight: 1.6 }}>
            Website dan game edukasi untuk membangun kebiasaan baik dalam pengelolaan sampah demi lingkungan yang lebih bersih dan masa depan yang lebih hijau.
          </p>
          <button className="btn btn-primary" onClick={() => window.scrollTo(0, 0)} style={{ fontSize: '1.1rem', padding: '14px 28px', borderRadius: '32px' }}>
            <Gamepad2 size={22} /> Mulai Bermain
          </button>
        </div>
        
        <div style={{ flex: '1 1 400px', display: 'flex', justifyContent: 'center' }}>
          {/* Simple illustration to replace the complex tailwind one */}
          <div style={{ position: 'relative', width: '280px', height: '280px', backgroundColor: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'inset 0 4px 20px rgba(0,0,0,0.05)' }}>
             <Leaf size={140} style={{ color: 'var(--primary)', zIndex: 2 }} className="animate-float" />
             <Leaf size={40} style={{ color: '#22c55e', position: 'absolute', top: '40px', right: '40px', transform: 'rotate(15deg)' }} />
             <Leaf size={30} style={{ color: '#16a34a', position: 'absolute', bottom: '50px', left: '50px', transform: 'rotate(-30deg)' }} />
          </div>
        </div>
      </section>

      {/* Feature Cards Grid (Side-by-side) */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px', maxWidth: '700px', margin: '0 auto', padding: '0 24px' }}>
        
        {/* Card 1: Game Edukatif */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '40px 24px', border: '2px solid #e5e7eb' }}>
          <div style={{ width: '80px', height: '80px', backgroundColor: '#16a34a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
            <Gamepad2 size={40} color="white" />
          </div>
          <h3 style={{ fontSize: '1.5rem', color: '#1f2937', marginBottom: '16px' }}>Game Edukatif</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', flexGrow: 1, marginBottom: '24px' }}>
            Belajar sambil bermain tentang sampah dan lingkungan.
          </p>
          <button style={{ background: 'none', border: 'none', color: '#16a34a', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }} onClick={() => window.scrollTo(0, 0)}>
            <ArrowRight size={24} />
          </button>
        </div>

        {/* Card 2: Edukasi Sampah */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '40px 24px', border: '2px solid #e5e7eb' }}>
          <div style={{ width: '80px', height: '80px', backgroundColor: '#f59e0b', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
            <BookOpen size={40} color="white" />
          </div>
          <h3 style={{ fontSize: '1.5rem', color: '#1f2937', marginBottom: '16px' }}>Edukasi Sampah</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', flexGrow: 1, marginBottom: '24px' }}>
            Materi menarik untuk semua usia.
          </p>
          <Link to="/edukasi" style={{ color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', textDecoration: 'none' }}>
            <ArrowRight size={24} />
          </Link>
        </div>

      </section>
      
      {/* Leaderboard Section */}
      <section style={{ maxWidth: '700px', margin: '32px auto 0 auto', width: '100%', padding: '0 24px' }}>
        <div style={{ backgroundColor: '#ffffff', border: '2px solid #e5e7eb', borderRadius: '32px', padding: '40px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', position: 'relative', overflow: 'hidden' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px', textAlign: 'center' }}>
            <Trophy size={48} style={{ color: '#16a34a', marginBottom: '16px' }} />
            <h2 style={{ fontSize: '2rem', color: '#1f2937', margin: '0 0 8px 0' }}>Papan Peringkat</h2>
            <p style={{ color: 'var(--text-muted)', margin: 0 }}>Siapa detektif sampah terbaik minggu ini?</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {isLoading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
                <Loader2 className="animate-spin" size={32} color="#16a34a" />
              </div>
            ) : leaderboardData.length > 0 ? (
              leaderboardData.map((player, idx) => {
                let color = '#64748b';
                let bg = '#f1f5f9';
                if (idx === 0) { color = '#f59e0b'; bg = '#fef3c7'; }
                else if (idx === 1) { color = '#4b5563'; bg = '#f3f4f6'; }
                else if (idx === 2) { color = '#b45309'; bg = '#ffedd5'; }
                
                const school = player.school_name ? `(${player.school_name})` : '';

                return (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', backgroundColor: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: bg, color: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.1rem' }}>
                        {idx + 1}
                      </div>
                      <div style={{ fontWeight: 'bold', color: '#334155', fontSize: '1.1rem' }}>{player.name} {school}</div>
                    </div>
                    <div style={{ fontWeight: '900', color: '#16a34a', fontSize: '1.25rem' }}>{player.score.toLocaleString('id-ID')}</div>
                  </div>
                );
              })
            ) : (
              <div style={{ textAlign: 'center', color: '#ef4444', padding: '20px', fontWeight: 'bold' }}>
                Belum ada data detektif.
              </div>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}
