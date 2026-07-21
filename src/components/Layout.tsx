import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, Leaf } from 'lucide-react';

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
              <BookOpen size={18} /> Edukasi
            </Link>
          </div>
        </div>
      </nav>
      <main className="container mt-8 mb-12">
        <Outlet />
      </main>
      <footer className="footer text-center mt-12 py-8 bg-white border-t border-gray-100">
        <div className="container flex-col items-center gap-2">
          <div className="flex justify-center items-center gap-2 text-primary font-bold text-xl mb-4">
            <Leaf size={24} /> Sahabat Bumi
          </div>
          
          <div className="text-gray-600 font-medium mb-4">
            <p>Software Engineer: Regina</p>
            <p>Naration Development: Kathrina</p>
          </div>
          
          <p className="text-muted text-sm font-bold">
            KKN Universitas Diponegoro - Desa Cibelok 2026
          </p>
        </div>
      </footer>
    </>
  );
}
