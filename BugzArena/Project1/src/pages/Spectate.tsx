import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, Users, Play, Clock, Trophy, Zap, Shield, Target } from 'lucide-react';
import BattleCanvas from '../components/BattleCanvas';

const Spectate = () => {
  const [activeBattles, setActiveBattles] = useState([
    {
      id: 1,
      fighters: [
        { name: 'Lightning Striker', color: '#00ff88', traits: { speed: 90, strength: 70, defense: 40, intelligence: 60 } },
        { name: 'Iron Defender', color: '#0088ff', traits: { speed: 30, strength: 50, defense: 95, intelligence: 70 } }
      ],
      spectators: 15,
      duration: 45,
      status: 'active'
    },
    {
      id: 2,
      fighters: [
        { name: 'Shadow Assassin', color: '#8800ff', traits: { speed: 85, strength: 80, defense: 35, intelligence: 85 } },
        { name: 'Berserker Beast', color: '#ff0080', traits: { speed: 60, strength: 95, defense: 60, intelligence: 30 } },
        { name: 'Cyber Mantis', color: '#ffff00', traits: { speed: 75, strength: 65, defense: 55, intelligence: 90 } }
      ],
      spectators: 23,
      duration: 120,
      status: 'active'
    },
    {
      id: 3,
      fighters: [
        { name: 'Acid Spitter', color: '#00ff00', traits: { speed: 55, strength: 85, defense: 45, intelligence: 75 } },
        { name: 'Steel Claw', color: '#888888', traits: { speed: 40, strength: 90, defense: 80, intelligence: 50 } }
      ],
      spectators: 8,
      duration: 30,
      status: 'starting'
    }
  ]);

  const [selectedBattle, setSelectedBattle] = useState<any>(null);
  const [battleState, setBattleState] = useState<'setup' | 'battle' | 'finished'>('setup');
  const [chatMessages, setChatMessages] = useState([
    { user: 'BugMaster', message: 'Lightning Striker looking strong!', time: '2:34' },
    { user: 'SpectatorX', message: 'Iron Defender has better defense though', time: '2:35' },
    { user: 'ArenaFan', message: 'This is going to be epic!', time: '2:36' }
  ]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    // Mock real-time updates
    const interval = setInterval(() => {
      setActiveBattles(prev => prev.map(battle => ({
        ...battle,
        duration: battle.status === 'active' ? battle.duration + 1 : battle.duration,
        spectators: Math.max(1, battle.spectators + Math.floor(Math.random() * 3) - 1)
      })));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleJoinBattle = (battle: any) => {
    setSelectedBattle(battle);
    setBattleState(battle.status === 'active' ? 'battle' : 'setup');
  };

  const handleStartSpectating = () => {
    if (selectedBattle) {
      setBattleState('battle');
    }
  };

  const handleBattleEnd = (winner: any) => {
    setBattleState('finished');
    if (winner) {
      setChatMessages(prev => [...prev, {
        user: 'System',
        message: `🏆 ${winner.name} wins the battle!`,
        time: new Date().toLocaleTimeString().slice(0, 5)
      }]);
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setChatMessages(prev => [...prev, {
        user: 'You',
        message: newMessage,
        time: new Date().toLocaleTimeString().slice(0, 5)
      }]);
      setNewMessage('');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
            Live Arena Spectating
          </h1>
          <p className="text-gray-400 text-lg">
            Watch epic bug battles unfold in real-time with advanced combat mechanics
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Battle List */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-dark-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6"
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
                <Eye className="text-neon-blue" size={24} />
                <span>Live Battles</span>
              </h2>

              <div className="space-y-4">
                {activeBattles.map((battle, index) => (
                  <motion.div
                    key={battle.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    onClick={() => handleJoinBattle(battle)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                      selectedBattle?.id === battle.id
                        ? 'bg-neon-green/20 border-neon-green'
                        : 'bg-dark-700 border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className={`px-2 py-1 rounded text-xs font-bold ${
                        battle.status === 'active' 
                          ? 'bg-neon-green/20 text-neon-green'
                          : 'bg-neon-yellow/20 text-neon-yellow'
                      }`}>
                        {battle.status === 'active' ? 'LIVE' : 'STARTING'}
                      </div>
                      <div className="flex items-center space-x-3 text-xs text-gray-400">
                        <div className="flex items-center space-x-1">
                          <Users size={12} />
                          <span>{battle.spectators}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock size={12} />
                          <span>{formatTime(battle.duration)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 mb-3">
                      {battle.fighters.map((fighter, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: fighter.color }}
                          />
                          <span className="text-sm text-white font-medium">{fighter.name}</span>
                        </div>
                      ))}
                    </div>

                    <div className="text-center">
                      <button className="w-full px-3 py-2 bg-neon-blue text-white text-sm font-bold rounded-lg hover:bg-neon-blue/80 transition-colors">
                        {selectedBattle?.id === battle.id ? 'Watching' : 'Join Spectators'}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Battle Viewer */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-dark-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6"
            >
              {selectedBattle ? (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">
                      Battle #{selectedBattle.id}
                    </h2>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2 text-neon-green">
                        <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse" />
                        <span className="font-bold">LIVE</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-400">
                        <Users size={16} />
                        <span>{selectedBattle.spectators} watching</span>
                      </div>
                    </div>
                  </div>

                  {/* Battle Arena */}
                  <div className="mb-6">
                    <BattleCanvas 
                      battleState={battleState}
                      battleData={{ bugs: selectedBattle.fighters }}
                      onBattleEnd={handleBattleEnd}
                    />
                  </div>

                  {battleState === 'setup' && (
                    <div className="text-center">
                      <button
                        onClick={handleStartSpectating}
                        className="px-6 py-3 bg-neon-green text-dark-900 font-bold rounded-lg hover:bg-neon-green/80 transition-colors flex items-center space-x-2 mx-auto"
                      >
                        <Play size={20} />
                        <span>Start Spectating</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-20">
                  <Eye className="mx-auto mb-4 text-gray-600" size={64} />
                  <h2 className="text-2xl font-bold text-gray-400 mb-2">
                    Select a Battle to Watch
                  </h2>
                  <p className="text-gray-500">
                    Choose from the live battles on the left to start spectating
                  </p>
                </div>
              )}
            </motion.div>
          </div>

          {/* Chat & Fighter Stats */}
          <div className="lg:col-span-1 space-y-6">
            {/* Fighter Stats */}
            {selectedBattle && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-dark-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6"
              >
                <h3 className="text-lg font-bold text-white mb-4">Fighter Stats</h3>
                <div className="space-y-4">
                  {selectedBattle.fighters.map((fighter: any, index: number) => (
                    <div key={index} className="bg-dark-700 rounded-lg p-3">
                      <div className="flex items-center space-x-2 mb-2">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: fighter.color }}
                        />
                        <span className="font-bold text-white text-sm">{fighter.name}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center space-x-1">
                          <Zap className="text-neon-yellow" size={12} />
                          <span className="text-gray-400">SPD:</span>
                          <span className="text-neon-yellow">{fighter.traits.speed}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Target className="text-neon-pink" size={12} />
                          <span className="text-gray-400">STR:</span>
                          <span className="text-neon-pink">{fighter.traits.strength}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Shield className="text-neon-blue" size={12} />
                          <span className="text-gray-400">DEF:</span>
                          <span className="text-neon-blue">{fighter.traits.defense}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="text-neon-purple">🧠</span>
                          <span className="text-gray-400">INT:</span>
                          <span className="text-neon-purple">{fighter.traits.intelligence}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Live Chat */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-dark-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6"
            >
              <h3 className="text-lg font-bold text-white mb-4">Live Chat</h3>
              
              <div className="bg-dark-700 rounded-lg p-3 h-48 overflow-y-auto mb-3">
                <div className="space-y-2">
                  {chatMessages.map((msg, index) => (
                    <div key={index} className="text-sm">
                      <span className="text-neon-green font-bold">{msg.user}</span>
                      <span className="text-gray-400 text-xs ml-2">{msg.time}</span>
                      <div className="text-gray-300">{msg.message}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-3 py-2 bg-dark-700 border border-gray-600 rounded-lg text-white text-sm focus:border-neon-green focus:outline-none"
                />
                <button
                  onClick={handleSendMessage}
                  className="px-4 py-2 bg-neon-green text-dark-900 font-bold rounded-lg text-sm hover:bg-neon-green/80 transition-colors"
                >
                  Send
                </button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Recent Battle Results */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-8 bg-dark-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6"
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
            <Trophy className="text-neon-yellow" size={24} />
            <span>Recent Battle Results</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { winner: 'Lightning Striker', loser: 'Iron Defender', duration: '2:34', damage: '1,247' },
              { winner: 'Shadow Assassin', loser: 'Berserker Beast', duration: '1:45', damage: '892' },
              { winner: 'Cyber Mantis', loser: 'Acid Spitter', duration: '3:12', damage: '1,456' },
              { winner: 'Steel Claw', loser: 'Plasma Bug', duration: '2:01', damage: '1,103' },
            ].map((result, index) => (
              <div key={index} className="bg-dark-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <Trophy className="text-neon-yellow" size={16} />
                  <span className="text-xs text-gray-400">{result.duration}</span>
                </div>
                <div className="text-sm space-y-1">
                  <div className="text-neon-green font-bold">{result.winner}</div>
                  <div className="text-gray-400">defeated</div>
                  <div className="text-neon-pink">{result.loser}</div>
                  <div className="text-xs text-gray-500 mt-2">
                    Total damage: {result.damage}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Spectate;