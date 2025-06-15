import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Palette, 
  Trophy, 
  Eye, 
  ArrowRight,
  Shield,
  Target,
  Cpu
} from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: Palette,
      title: 'Design Your Warriors',
      description: 'Create unique insect warriors with customizable traits and abilities.',
      color: 'neon-green'
    },
    {
      icon: Cpu,
      title: 'AI-Powered Behavior',
      description: 'Program your bugs using natural language, converted to intelligent AI.',
      color: 'neon-blue'
    },
    {
      icon: Zap,
      title: 'Epic Battles',
      description: 'Watch your creations battle in real-time 2D arena combat.',
      color: 'neon-pink'
    },
    {
      icon: Eye,
      title: 'Live Spectating',
      description: 'Join live battles as a spectator and watch the action unfold.',
      color: 'neon-purple'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-6xl md:text-8xl font-cyber font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-neon-green via-neon-blue to-neon-pink animate-pulse-slow">
            BugzArena
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
            Design, program, and battle with AI-powered insect warriors in the ultimate arena combat experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/designer">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-neon-green to-neon-blue text-dark-900 font-bold rounded-lg shadow-lg hover:shadow-neon-green/50 transition-all duration-300 flex items-center space-x-2"
              >
                <Palette size={20} />
                <span>Start Creating</span>
                <ArrowRight size={20} />
              </motion.button>
            </Link>
            <Link to="/spectate">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 border-2 border-neon-green text-neon-green font-bold rounded-lg hover:bg-neon-green/10 transition-all duration-300 flex items-center space-x-2"
              >
                <Eye size={20} />
                <span>Watch Battles</span>
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-cyber font-bold text-center mb-16 text-neon-green"
          >
            Arena Features
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="bg-dark-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-neon-green/50 transition-all duration-300"
              >
                <div className={`text-${feature.color} mb-4`}>
                  <feature.icon size={48} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-dark-800/30">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <div className="bg-dark-800/50 backdrop-blur-sm border border-neon-green/30 rounded-xl p-8">
              <div className="text-4xl font-cyber font-bold text-neon-green mb-2">1,337</div>
              <div className="text-gray-400">Battles Fought</div>
            </div>
            <div className="bg-dark-800/50 backdrop-blur-sm border border-neon-blue/30 rounded-xl p-8">
              <div className="text-4xl font-cyber font-bold text-neon-blue mb-2">256</div>
              <div className="text-gray-400">Warriors Created</div>
            </div>
            <div className="bg-dark-800/50 backdrop-blur-sm border border-neon-pink/30 rounded-xl p-8">
              <div className="text-4xl font-cyber font-bold text-neon-pink mb-2">42</div>
              <div className="text-gray-400">Active Spectators</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bolt Badge */}
      <a
        href="https://www.bolt.com/"
        target="_blank"
        rel="noopener"
        className="fixed bottom-4 right-4 z-50"
      >
        <img
          src="https://res.cloudinary.com/dugcmkito/image/upload/v1676418914/badge_blackbg_yellow_d976daa135.png?updated_at=2023-02-14T23:55:14.672Z"
          alt="Powered by Bolt One-Click Checkout"
          className="w-32 h-auto opacity-90 hover:opacity-100 transition-opacity"
        />
      </a>
    </div>
  );
};

export default Home;
