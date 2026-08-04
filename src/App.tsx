import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Layout from './components/Layout';
import Home from './pages/Home';
import Learn from './pages/Learn';
import Progress from './pages/Progress';
import Teacher from './pages/Teacher';
import About from './pages/About';
import GameOnly from './pages/GameOnly';
import Photobooth from './pages/Photobooth';
import Poster from './pages/Poster';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="edukasi" element={<Learn />} />
          <Route path="progres" element={<Progress />} />
          <Route path="guru" element={<Teacher />} />
          <Route path="tentang" element={<About />} />
          <Route path="photobooth" element={<Photobooth />} />
          <Route path="poster" element={<Poster />} />
        </Route>
        {/* Dedicated route for the game, without navbar and footer */}
        <Route path="/game" element={<GameOnly />} />
      </Routes>
    </Router>
  );
}

export default App;
