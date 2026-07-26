import { Link } from 'react-router-dom';
import { Gamepad2, BookOpen, Trophy, Leaf, ArrowRight, Loader2, Play, Maximize2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import heroImg from '../assets/hero.png';

export default function Home() {
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

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
      
      {/* Hero Text */}
      <section style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '0 24px', marginTop: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#ecfdf5', padding: '8px 24px', borderRadius: '32px', color: '#059669', fontWeight: '800', marginBottom: '24px', border: '2px solid #a7f3d0' }}>
          <Leaf size={18} />
          <span style={{ letterSpacing: '1px' }}>PETUALANGAN DIMULAI</span>
        </div>
        <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', color: '#0f172a', marginBottom: '16px', lineHeight: 1.1, fontWeight: '900' }}>
          Jadi Detektif Lingkungan!
        </h1>
        <p style={{ color: '#475569', fontSize: '1.25rem', maxWidth: '600px', fontWeight: '500', lineHeight: 1.6 }}>
          Bantu selesaikan misteri sampah di sekitarmu dan jadilah pahlawan bumi! 🌍✨
        </p>
      </section>

      {/* Game Section */}
      <section style={{ width: '100%', maxWidth: '900px', padding: '0 24px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <style>{`
          #game-container:-webkit-full-screen { border: none !important; border-radius: 0 !important; background-color: #000 !important; }
          #game-container:fullscreen { border: none !important; border-radius: 0 !important; background-color: #000 !important; }
          #game-container:-webkit-full-screen iframe { width: 100% !important; height: 100% !important; max-width: 177.78vh !important; max-height: 56.25vw !important; border-radius: 0 !important; }
          #game-container:fullscreen iframe { width: 100% !important; height: 100% !important; max-width: 177.78vh !important; max-height: 56.25vw !important; border-radius: 0 !important; }
        `}</style>
        
        <div id="game-container" style={{ 
          width: '100%',
          backgroundColor: '#0f172a', 
          borderRadius: '32px', 
          aspectRatio: '16/9', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          color: 'white',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
          position: 'relative',
          overflow: 'hidden',
          border: '8px solid #10b981'
        }}>
          {!isPlaying ? (
            <>
              {/* Background Pattern */}
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, #1e293b 0%, #0f172a 100%)', backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, rgba(16,185,129,0.2) 0%, transparent 70%)' }}></div>
              
              <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '32px' }}>
                <div style={{ width: '100px', height: '100px', background: 'rgba(16, 185, 129, 0.2)', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '2px solid rgba(16, 185, 129, 0.5)' }}>
                   <Gamepad2 size={48} color="#34d399" />
                </div>
                
                <button 
                  onClick={() => setIsPlaying(true)}
                  style={{
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '40px',
                    padding: '16px 40px',
                    fontSize: '1.25rem',
                    fontWeight: '900',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    cursor: 'pointer',
                    boxShadow: '0 10px 25px rgba(245, 158, 11, 0.4), inset 0 -4px 0 rgba(0,0,0,0.2)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    letterSpacing: '1px'
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.05) translateY(-2px)'; e.currentTarget.style.boxShadow = '0 15px 35px rgba(245, 158, 11, 0.5), inset 0 -4px 0 rgba(0,0,0,0.2)'; }}
                  onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1) translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(245, 158, 11, 0.4), inset 0 -4px 0 rgba(0,0,0,0.2)'; }}
                >
                  <Play size={28} fill="currentColor" />
                  MAINKAN SEKARANG
                </button>
              </div>
            </>
          ) : (
            <iframe 
              src="/game" 
              style={{ width: '100%', height: '100%', border: 'none', borderRadius: '24px', backgroundColor: 'black' }} 
              allowFullScreen 
              title="Detektif Sampah Game"
            />
          )}
        </div>
        
        {/* Fullscreen Button */}
        <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'center', gap: '16px' }}>
          {isPlaying && (
            <button 
              onClick={() => setIsPlaying(false)}
              style={{ cursor: 'pointer', color: '#ef4444', backgroundColor: '#fef2f2', border: '2px solid #fecaca', fontWeight: '800', fontSize: '1rem', padding: '12px 28px', borderRadius: '32px', transition: 'all 0.2s' }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fee2e2'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
            >
              Tutup Game
            </button>
          )}
          <button 
            onClick={() => {
              const elem = document.getElementById('game-container');
              if (elem) {
                if (elem.requestFullscreen) elem.requestFullscreen();
                else if ((elem as any).webkitRequestFullscreen) (elem as any).webkitRequestFullscreen();
                else if ((elem as any).msRequestFullscreen) (elem as any).msRequestFullscreen();
              }
              if (!isPlaying) setIsPlaying(true);
            }}
            style={{ cursor: 'pointer', color: '#047857', backgroundColor: '#ecfdf5', border: '2px solid #a7f3d0', fontWeight: '800', fontSize: '1rem', display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 28px', borderRadius: '32px', transition: 'all 0.2s' }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#d1fae5'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ecfdf5'}
          >
            <Maximize2 size={20} />
            Layar Penuh
          </button>
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
