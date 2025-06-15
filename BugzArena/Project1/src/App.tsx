import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import BugDesigner from './pages/BugDesigner';
import BattleArena from './pages/BattleArena';
import Collection from './pages/Collection';
import Leaderboard from './pages/Leaderboard';
import Spectate from './pages/Spectate';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
        <div className="absolute inset-0 bg-gradient-to-r from-neon-green/5 via-transparent to-neon-pink/5"></div>
        <div className="relative z-10">
          <Navbar />
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/designer" element={<BugDesigner />} />
              <Route path="/arena" element={<BattleArena />} />
              <Route path="/collection" element={<Collection />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/spectate" element={<Spectate />} />
            </Routes>
          </motion.main>
        </div>
        <Toaster 
          position="top-right"
          toastOptions={{
            className: 'bg-dark-800 text-white border border-neon-green/30',
            duration: 4000,
          }}
        />
      </div>
    </Router>
  );
}

export default App;