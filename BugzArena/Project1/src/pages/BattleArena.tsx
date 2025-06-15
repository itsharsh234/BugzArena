import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Eye, Users } from 'lucide-react';
import BattleCanvas from '../components/BattleCanvas';
import BugSelector from '../components/BugSelector';

const BattleArena = () => {
  const [battleState, setBattleState] = useState<'setup' | 'battle' | 'finished'>('setup');
  const [selectedBugs, setSelectedBugs] = useState<any[]>([]);
  const [spectatorCount, setSpectatorCount] = useState(12);
  const [battleData, setBattleData] = useState<any>(null);

  const handleStartBattle = () => {
    if (selectedBugs.length < 2) {
      return;
    }

    setBattleState('battle');
    setBattleData({
      bugs: selectedBugs,
      startTime: Date.now(),
      duration: 0
    });
  };

  const handleResetBattle = () => {
    setBattleState('setup');
    setBattleData(null);
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-cyber font-bold text-neon-green mb-4">
            Battle Arena
          </h1>
          <p className="text-gray-400 text-lg">
            Watch your bugs fight in epic real-time combat
          </p>
          <div className="flex items-center justify-center space-x-4 mt-4">
            <div className="flex items-center space-x-2 text-neon-blue">
              <Eye size={20} />
              <span>{spectatorCount} spectators</span>
            </div>
            <div className="flex items-center space-x-2 text-neon-pink">
              <Users size={20} />
              <span>{selectedBugs.length} fighters</span>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Battle Canvas */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-dark-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-white">Arena</h2>
                <div className="flex items-center space-x-2">
                  {battleState === 'setup' && (
                    <button
                      onClick={handleStartBattle}
                      disabled={selectedBugs.length < 2}
                      className="px-4 py-2 bg-neon-green text-dark-900 font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      <Play size={16} />
                      <span>Start Battle</span>
                    </button>
                  )}
                  {battleState === 'battle' && (
                    <button
                      onClick={handleResetBattle}
                      className="px-4 py-2 bg-neon-pink text-white font-bold rounded-lg flex items-center space-x-2"
                    >
                      <RotateCcw size={16} />
                      <span>Reset</span>
                    </button>
                  )}
                </div>
              </div>
              
              <BattleCanvas 
                battleState={battleState}
                battleData={battleData}
                onBattleEnd={() => setBattleState('finished')}
              />
            </motion.div>
          </div>

          {/* Bug Selection */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-dark-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6"
            >
              <h2 className="text-2xl font-bold text-white mb-4">Fighters</h2>
              <BugSelector
                selectedBugs={selectedBugs}
                onBugSelect={setSelectedBugs}
                battleState={battleState}
              />
            </motion.div>
          </div>
        </div>

        {/* Battle Stats */}
        {battleState !== 'setup' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 bg-dark-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6"
          >
            <h2 className="text-2xl font-bold text-white mb-4">Battle Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-dark-700 rounded-lg p-4">
                <div className="text-neon-green text-2xl font-bold">
                  {battleData?.duration || 0}s
                </div>
                <div className="text-gray-400">Battle Duration</div>
              </div>
              <div className="bg-dark-700 rounded-lg p-4">
                <div className="text-neon-blue text-2xl font-bold">
                  {selectedBugs.length}
                </div>
                <div className="text-gray-400">Active Fighters</div>
              </div>
              <div className="bg-dark-700 rounded-lg p-4">
                <div className="text-neon-pink text-2xl font-bold">
                  {spectatorCount}
                </div>
                <div className="text-gray-400">Live Spectators</div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BattleArena;