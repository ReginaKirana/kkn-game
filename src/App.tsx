import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Learn from './pages/Learn';
import GameOnly from './pages/GameOnly';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="edukasi" element={<Learn />} />
        </Route>
        {/* Dedicated route for the game, without navbar and footer */}
        <Route path="/game" element={<GameOnly />} />
      </Routes>
    </Router>
  );
}

export default App;
