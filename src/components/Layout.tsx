import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, Leaf, Star, Info, Users } from 'lucide-react';

export default function Layout() {
  const location = useLocation();
  
  return (
    <>
      <nav className="navbar">
        <div className="container flex justify-between items-center">
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Leaf size={28} className="text-primary" />
            <h1 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--primary)' }}>Sahabat Bumi</h1>
          </Link>
          <div className="nav-links">
            <Link to="/" className={`nav-link flex items-center gap-2 ${location.pathname === '/' ? 'active' : ''}`}>
              <Home size={18} /> Beranda
            </Link>
            <Link to="/edukasi" className={`nav-link flex items-center gap-2 ${location.pathname === '/edukasi' ? 'active' : ''}`}>
              <BookOpen size={18} /> Belajar Yuk!
            </Link>
          </div>
        </div>
      </nav>
      <main className="container mt-8 mb-12">
        <Outlet />
      </main>
      <footer style={{ backgroundColor: '#ffffff', color: '#475569', padding: '64px 24px 32px 24px', marginTop: '64px', borderTop: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '48px' }}>
          
          {/* Top Section: Brand & Links */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px' }}>
            
            {/* Brand */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#16a34a', fontWeight: '900', fontSize: '1.75rem', marginBottom: '16px' }}>
                <Leaf size={32} /> Sahabat Bumi
              </div>
              <p style={{ color: '#64748b', lineHeight: 1.6, fontSize: '1.05rem' }}>
                Media edukasi interaktif untuk mengenalkan pentingnya menjaga kebersihan lingkungan kepada anak sejak dini.
              </p>
            </div>

            {/* Navigasi */}
            <div>
              <h3 style={{ color: '#1e293b', fontWeight: '800', fontSize: '1.25rem', marginBottom: '20px' }}>Navigasi</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <Link to="/" style={{ color: '#64748b', textDecoration: 'none', fontWeight: '600', transition: 'color 0.2s', display: 'inline-flex', alignItems: 'center', gap: '8px' }} onMouseOver={(e) => e.currentTarget.style.color = '#16a34a'} onMouseOut={(e) => e.currentTarget.style.color = '#64748b'}>
                  <Home size={16} /> Beranda
                </Link>
                <Link to="/edukasi" style={{ color: '#64748b', textDecoration: 'none', fontWeight: '600', transition: 'color 0.2s', display: 'inline-flex', alignItems: 'center', gap: '8px' }} onMouseOver={(e) => e.currentTarget.style.color = '#16a34a'} onMouseOut={(e) => e.currentTarget.style.color = '#64748b'}>
                  <BookOpen size={16} /> Belajar Yuk!
                </Link>
                <Link to="/guru" style={{ color: '#64748b', textDecoration: 'none', fontWeight: '600', transition: 'color 0.2s', display: 'inline-flex', alignItems: 'center', gap: '8px' }} onMouseOver={(e) => e.currentTarget.style.color = '#16a34a'} onMouseOut={(e) => e.currentTarget.style.color = '#64748b'}>
                  <Users size={16} /> Guru & Orang Tua
                </Link>
                <Link to="/tentang" style={{ color: '#64748b', textDecoration: 'none', fontWeight: '600', transition: 'color 0.2s', display: 'inline-flex', alignItems: 'center', gap: '8px' }} onMouseOver={(e) => e.currentTarget.style.color = '#16a34a'} onMouseOut={(e) => e.currentTarget.style.color = '#64748b'}>
                  <Info size={16} /> Tentang Kami
                </Link>
              </div>
            </div>

            {/* Tim KKN */}
            <div>
              <h3 style={{ color: '#1e293b', fontWeight: '800', fontSize: '1.25rem', marginBottom: '20px' }}>Tim KKN Cibelok 2026</h3>
              <div style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: 1.8 }}>
                <div style={{ marginBottom: '12px' }}>
                  <span style={{ color: '#16a34a', fontWeight: '800' }}>Tim Pengembang Game & Web:</span><br/>
                  Regina & Kathrina
                </div>
                <div>
                  <span style={{ color: '#16a34a', fontWeight: '800' }}>Anggota Tim Lainnya:</span><br/>
                  Haidar, Dea, Fina, Nakkita, Syadza, Erick, Hana, Alifia
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Section */}
          <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '32px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem', fontWeight: '600', margin: 0 }}>
              &copy; 2026 KKN Universitas Diponegoro - Desa Cibelok.
            </p>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem', fontWeight: '600', margin: 0 }}>
              Dibuat dengan ❤️ untuk Bumi.
            </p>
          </div>

        </div>
      </footer>
    </>
  );
}
