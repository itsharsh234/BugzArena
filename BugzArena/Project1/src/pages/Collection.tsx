import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bug, Trophy, Target, Edit, Trash2, Plus, Zap, Shield, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Collection = () => {
  const [selectedBug, setSelectedBug] = useState<any>(null);
  const [userBugs, setUserBugs] = useState<any[]>([]);

  useEffect(() => {
    // Load bugs from localStorage
    const loadBugs = () => {
      const savedBugs = JSON.parse(localStorage.getItem('userBugs') || '[]');
      setUserBugs(savedBugs);
    };

    loadBugs();
    
    // Listen for storage changes (when new bugs are added)
    const handleStorageChange = () => {
      loadBugs();
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also check periodically for changes (in case of same-tab updates)
    const interval = setInterval(loadBugs, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const handleDeleteBug = (bugId: number) => {
    const updatedBugs = userBugs.filter(bug => bug.id !== bugId);
    localStorage.setItem('userBugs', JSON.stringify(updatedBugs));
    setUserBugs(updatedBugs);
    
    if (selectedBug?.id === bugId) {
      setSelectedBug(null);
    }
    
    toast.success('Bug deleted from collection');
  };

  const totalStats = userBugs.reduce((acc, bug) => ({
    totalWins: acc.totalWins + (bug.wins || 0),
    totalLosses: acc.totalLosses + (bug.losses || 0),
    totalBugs: acc.totalBugs + 1,
    totalDamage: acc.totalDamage + (bug.totalDamageDealt || 0)
  }), { totalWins: 0, totalLosses: 0, totalBugs: 0, totalDamage: 0 });

  const winRate = totalStats.totalWins + totalStats.totalLosses > 0 
    ? (totalStats.totalWins / (totalStats.totalWins + totalStats.totalLosses) * 100).toFixed(1)
    : 0;

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
            Your Collection
          </h1>
          <p className="text-gray-400 text-lg">
            Manage your warrior bugs and track their battle performance
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-dark-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 text-center">
            <Bug className="text-neon-green mx-auto mb-2" size={32} />
            <div className="text-2xl font-bold text-white">{totalStats.totalBugs}</div>
            <div className="text-gray-400">Total Bugs</div>
          </div>
          <div className="bg-dark-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 text-center">
            <Trophy className="text-neon-yellow mx-auto mb-2" size={32} />
            <div className="text-2xl font-bold text-white">{totalStats.totalWins}</div>
            <div className="text-gray-400">Total Wins</div>
          </div>
          <div className="bg-dark-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 text-center">
            <Target className="text-neon-pink mx-auto mb-2" size={32} />
            <div className="text-2xl font-bold text-white">{totalStats.totalLosses}</div>
            <div className="text-gray-400">Total Losses</div>
          </div>
          <div className="bg-dark-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 text-center">
            <div className="text-neon-blue text-2xl font-bold">{winRate}%</div>
            <div className="text-gray-400">Win Rate</div>
          </div>
        </motion.div>

        {userBugs.length === 0 ? (
          // Empty State
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center py-20"
          >
            <Bug className="mx-auto mb-6 text-gray-600" size={80} />
            <h2 className="text-3xl font-bold text-gray-400 mb-4">
              No Bugs in Collection
            </h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Start building your army of insect warriors! Create your first bug with custom traits and AI behavior.
            </p>
            <Link to="/designer">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-neon-green to-neon-blue text-dark-900 font-bold rounded-lg flex items-center space-x-2 mx-auto"
              >
                <Plus size={20} />
                <span>Create Your First Bug</span>
              </motion.button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Bug Grid */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Your Warriors</h2>
                <Link to="/designer">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-neon-green text-dark-900 font-bold rounded-lg flex items-center space-x-2"
                  >
                    <Plus size={16} />
                    <span>Create New</span>
                  </motion.button>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {userBugs.map((bug, index) => (
                  <motion.div
                    key={bug.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setSelectedBug(bug)}
                    className={`bg-dark-800/50 backdrop-blur-sm border rounded-xl p-6 cursor-pointer transition-all duration-300 ${
                      selectedBug?.id === bug.id 
                        ? 'border-neon-green shadow-lg shadow-neon-green/20' 
                        : 'border-gray-700 hover:border-neon-green/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-6 h-6 rounded-full"
                          style={{ backgroundColor: bug.color }}
                        />
                        <h3 className="text-lg font-bold text-white">{bug.name}</h3>
                      </div>
                      <div className="flex space-x-2">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            // TODO: Implement edit functionality
                            toast.info('Edit functionality coming soon!');
                          }}
                          className="text-neon-blue hover:text-white transition-colors"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteBug(bug.id);
                          }}
                          className="text-neon-pink hover:text-white transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                      <div className="flex items-center space-x-1">
                        <Zap className="text-neon-yellow" size={12} />
                        <span className="text-gray-400">Speed:</span>
                        <span className="text-neon-yellow font-bold">{bug.traits.speed}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Target className="text-neon-pink" size={12} />
                        <span className="text-gray-400">Strength:</span>
                        <span className="text-neon-pink font-bold">{bug.traits.strength}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Shield className="text-neon-blue" size={12} />
                        <span className="text-gray-400">Defense:</span>
                        <span className="text-neon-blue font-bold">{bug.traits.defense}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Cpu className="text-neon-purple" size={12} />
                        <span className="text-gray-400">Intelligence:</span>
                        <span className="text-neon-purple font-bold">{bug.traits.intelligence}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="text-gray-400">
                        Created: {new Date(bug.created).toLocaleDateString()}
                      </div>
                      <div className="text-neon-green font-bold">
                        {bug.wins || 0}W - {bug.losses || 0}L
                      </div>
                    </div>

                    {/* Combat Stats Preview */}
                    <div className="mt-3 pt-3 border-t border-gray-600">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="text-gray-400">
                          Est. DPS: <span className="text-neon-pink font-bold">
                            {Math.floor((bug.traits.strength / 100) * 25 * (1 + bug.traits.speed / 200))}
                          </span>
                        </div>
                        <div className="text-gray-400">
                          Crit Rate: <span className="text-neon-yellow font-bold">
                            {Math.floor((bug.traits.speed / 100) * 20)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Bug Details */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-dark-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 sticky top-24"
              >
                <h2 className="text-2xl font-bold text-white mb-4">Bug Details</h2>
                
                {selectedBug ? (
                  <div className="space-y-4">
                    <div className="text-center">
                      <div
                        className="w-16 h-16 rounded-full mx-auto mb-3 shadow-lg"
                        style={{ 
                          backgroundColor: selectedBug.color,
                          boxShadow: `0 0 20px ${selectedBug.color}40`
                        }}
                      />
                      <h3 className="text-xl font-bold text-white">{selectedBug.name}</h3>
                      <p className="text-sm text-gray-400 mt-1">
                        Created {new Date(selectedBug.created).toLocaleDateString()}
                      </p>
                    </div>

                    {/* Combat Stats */}
                    <div className="bg-dark-700 rounded-lg p-4">
                      <h4 className="text-sm font-bold text-white mb-3">Combat Stats</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Speed</span>
                          <span className="text-neon-yellow font-bold">{selectedBug.traits.speed}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Strength</span>
                          <span className="text-neon-pink font-bold">{selectedBug.traits.strength}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Defense</span>
                          <span className="text-neon-blue font-bold">{selectedBug.traits.defense}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Intelligence</span>
                          <span className="text-neon-purple font-bold">{selectedBug.traits.intelligence}</span>
                        </div>
                      </div>
                    </div>

                    {/* Calculated Combat Metrics */}
                    <div className="bg-dark-700 rounded-lg p-4">
                      <h4 className="text-sm font-bold text-white mb-3">Combat Predictions</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Est. DPS</span>
                          <span className="text-neon-pink font-bold">
                            {Math.floor((selectedBug.traits.strength / 100) * 25 * (1 + selectedBug.traits.speed / 200))}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Survivability</span>
                          <span className="text-neon-blue font-bold">
                            {Math.floor(100 + (selectedBug.traits.defense / 100) * 150)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Crit Chance</span>
                          <span className="text-neon-yellow font-bold">
                            {Math.floor((selectedBug.traits.speed / 100) * 20)}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Dodge Chance</span>
                          <span className="text-neon-green font-bold">
                            {Math.floor((selectedBug.traits.speed / 100) * 30)}%
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-600 pt-4">
                      <h4 className="text-sm font-bold text-white mb-2">Battle Record</h4>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Wins</span>
                        <span className="text-neon-green font-bold">{selectedBug.wins || 0}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Losses</span>
                        <span className="text-neon-pink font-bold">{selectedBug.losses || 0}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Win Rate</span>
                        <span className="text-white font-bold">
                          {selectedBug.wins || selectedBug.losses ? 
                            (((selectedBug.wins || 0) / ((selectedBug.wins || 0) + (selectedBug.losses || 0))) * 100).toFixed(1) + '%' :
                            'N/A'
                          }
                        </span>
                      </div>
                    </div>

                    <div className="border-t border-gray-600 pt-4">
                      <h4 className="text-sm font-bold text-white mb-2">AI Behavior</h4>
                      <p className="text-sm text-gray-400 leading-relaxed">
                        {selectedBug.behavior?.description || 'No behavior description available'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-400 py-8">
                    <Bug size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Select a bug to view details</p>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Collection;