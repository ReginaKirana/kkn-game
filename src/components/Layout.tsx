import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, Star, Info } from 'lucide-react';

export default function Layout() {
  const location = useLocation();
  
  return (
    <>
      <nav className="navbar">
        <div className="container flex justify-between items-center">
          <Link to="/" style={{ textDecoration: 'none', color: 'var(--primary)' }}>
            <h1 style={{ margin: 0, fontSize: '1.8rem' }}>EcoLearn</h1>
          </Link>
          <div className="nav-links">
            <Link to="/" className={`nav-link flex items-center gap-2 ${location.pathname === '/' ? 'active' : ''}`}>
              <Home size={20} /> Game
            </Link>
            <Link to="/belajar" className={`nav-link flex items-center gap-2 ${location.pathname === '/belajar' ? 'active' : ''}`}>
              <BookOpen size={20} /> Belajar
            </Link>
            <Link to="/progres" className={`nav-link flex items-center gap-2 ${location.pathname === '/progres' ? 'active' : ''}`}>
              <Star size={20} /> Progres
            </Link>
            <Link to="/tentang" className={`nav-link flex items-center gap-2 ${location.pathname === '/tentang' ? 'active' : ''}`}>
              <Info size={20} /> Tentang
            </Link>
          </div>
        </div>
      </nav>
      <main className="container mt-8 mb-8">
        <Outlet />
      </main>
    </>
  );
}
