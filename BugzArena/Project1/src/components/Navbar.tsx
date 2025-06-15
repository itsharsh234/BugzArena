import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Bug, 
  Zap, 
  Trophy, 
  Eye, 
  Palette, 
  Home 
} from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/designer', icon: Palette, label: 'Designer' },
    { path: '/arena', icon: Zap, label: 'Arena' },
    { path: '/collection', icon: Bug, label: 'Collection' },
    { path: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
    { path: '/spectate', icon: Eye, label: 'Spectate' },
  ];

  return (
    <nav className="bg-dark-800/80 backdrop-blur-md border-b border-neon-green/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="text-neon-green"
            >
              <Bug size={32} />
            </motion.div>
            <span className="text-2xl font-cyber font-bold text-neon-green animate-glow">
              BugzArena
            </span>
          </Link>

          <div className="flex space-x-1">
            {navItems.map(({ path, icon: Icon, label }) => (
              <Link key={path} to={path}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 ${
                    location.pathname === path
                      ? 'bg-neon-green/20 text-neon-green border border-neon-green/30'
                      : 'text-gray-300 hover:text-neon-green hover:bg-neon-green/10'
                  }`}
                >
                  <Icon size={18} />
                  <span className="hidden sm:inline font-medium">{label}</span>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;