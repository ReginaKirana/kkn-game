import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Learn from './pages/Learn';
import Progress from './pages/Progress';
import About from './pages/About';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="belajar" element={<Learn />} />
          <Route path="progres" element={<Progress />} />
          <Route path="tentang" element={<About />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
