import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus, User, Zap, Shield, Target, Cpu } from 'lucide-react';

interface BugSelectorProps {
  selectedBugs: any[];
  onBugSelect: (bugs: any[]) => void;
  battleState: string;
}

const BugSelector: React.FC<BugSelectorProps> = ({ 
  selectedBugs, 
  onBugSelect, 
  battleState 
}) => {
  const [availableBugs, setAvailableBugs] = useState<any[]>([]);

  useEffect(() => {
    // Load user's bugs from localStorage
    const loadUserBugs = () => {
      const userBugs = JSON.parse(localStorage.getItem('userBugs') || '[]');
      
      // Add some default bugs if user has none
      const defaultBugs = [
        {
          id: 'default-1',
          name: 'Lightning Striker',
          color: '#00ff88',
          traits: { speed: 90, strength: 70, defense: 40, intelligence: 60 },
          wins: 12,
          losses: 3,
          isDefault: true
        },
        {
          id: 'default-2',
          name: 'Iron Defender',
          color: '#0088ff',
          traits: { speed: 30, strength: 50, defense: 95, intelligence: 70 },
          wins: 8,
          losses: 2,
          isDefault: true
        },
        {
          id: 'default-3',
          name: 'Shadow Assassin',
          color: '#8800ff',
          traits: { speed: 85, strength: 80, defense: 35, intelligence: 85 },
          wins: 15,
          losses: 5,
          isDefault: true
        },
        {
          id: 'default-4',
          name: 'Berserker Beetle',
          color: '#ff0080',
          traits: { speed: 60, strength: 95, defense: 60, intelligence: 30 },
          wins: 10,
          losses: 8,
          isDefault: true
        }
      ];

      // Combine user bugs with defaults, prioritizing user bugs
      const allBugs = [...userBugs, ...defaultBugs];
      setAvailableBugs(allBugs);
    };

    loadUserBugs();

    // Listen for storage changes
    const handleStorageChange = () => {
      loadUserBugs();
    };

    window.addEventListener('storage', handleStorageChange);
    const interval = setInterval(loadUserBugs, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const handleBugToggle = (bug: any) => {
    if (battleState !== 'setup') return;

    const isSelected = selectedBugs.find(b => b.id === bug.id);
    if (isSelected) {
      onBugSelect(selectedBugs.filter(b => b.id !== bug.id));
    } else {
      if (selectedBugs.length < 4) {
        onBugSelect([...selectedBugs, bug]);
      }
    }
  };

  const calculateCombatRating = (bug: any) => {
    const { speed, strength, defense, intelligence } = bug.traits;
    return Math.floor((speed + strength + defense + intelligence) / 4);
  };

  const getBugType = (bug: any) => {
    const { speed, strength, defense, intelligence } = bug.traits;
    const max = Math.max(speed, strength, defense, intelligence);
    
    if (max === speed) return { type: 'Speedster', color: 'text-neon-yellow' };
    if (max === strength) return { type: 'Bruiser', color: 'text-neon-pink' };
    if (max === defense) return { type: 'Tank', color: 'text-neon-blue' };
    return { type: 'Tactician', color: 'text-neon-purple' };
  };

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-400">
        Select 2-4 bugs for battle ({selectedBugs.length}/4 selected)
      </div>
      
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {availableBugs.map((bug) => {
          const isSelected = selectedBugs.find(b => b.id === bug.id);
          const combatRating = calculateCombatRating(bug);
          const bugType = getBugType(bug);
          
          return (
            <motion.div
              key={bug.id}
              whileHover={{ scale: battleState === 'setup' ? 1.02 : 1 }}
              whileTap={{ scale: battleState === 'setup' ? 0.98 : 1 }}
              onClick={() => handleBugToggle(bug)}
              className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                isSelected
                  ? 'bg-neon-green/20 border-neon-green shadow-lg shadow-neon-green/20'
                  : 'bg-dark-700 border-gray-600 hover:border-gray-500'
              } ${battleState !== 'setup' ? 'cursor-not-allowed opacity-50' : ''}`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div
                    className="w-4 h-4 rounded-full shadow-sm"
                    style={{ 
                      backgroundColor: bug.color,
                      boxShadow: `0 0 8px ${bug.color}40`
                    }}
                  />
                  <div>
                    <span className="font-bold text-white text-sm">{bug.name}</span>
                    {bug.isDefault && (
                      <span className="ml-2 text-xs text-gray-500 bg-gray-700 px-2 py-0.5 rounded">
                        Default
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`text-xs font-bold ${bugType.color}`}>
                    {bugType.type}
                  </span>
                  {isSelected ? (
                    <Minus size={16} className="text-neon-green" />
                  ) : (
                    <Plus size={16} className="text-gray-400" />
                  )}
                </div>
              </div>
              
              {/* Combat Rating */}
              <div className="mb-3">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-gray-400">Combat Rating</span>
                  <span className="text-white font-bold">{combatRating}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-1.5">
                  <div 
                    className="bg-gradient-to-r from-neon-green to-neon-blue h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${combatRating}%` }}
                  />
                </div>
              </div>

              {/* Trait Icons */}
              <div className="grid grid-cols-4 gap-1 text-xs mb-3">
                <div className="flex items-center space-x-1">
                  <Zap className="text-neon-yellow" size={10} />
                  <span className="text-neon-yellow font-bold">{bug.traits.speed}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Target className="text-neon-pink" size={10} />
                  <span className="text-neon-pink font-bold">{bug.traits.strength}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Shield className="text-neon-blue" size={10} />
                  <span className="text-neon-blue font-bold">{bug.traits.defense}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Cpu className="text-neon-purple" size={10} />
                  <span className="text-neon-purple font-bold">{bug.traits.intelligence}</span>
                </div>
              </div>

              {/* Combat Predictions */}
              <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                <div className="text-gray-400">
                  DPS: <span className="text-neon-pink font-bold">
                    {Math.floor((bug.traits.strength / 100) * 25 * (1 + bug.traits.speed / 200))}
                  </span>
                </div>
                <div className="text-gray-400">
                  Crit: <span className="text-neon-yellow font-bold">
                    {Math.floor((bug.traits.speed / 100) * 20)}%
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>{bug.wins || 0}W - {bug.losses || 0}L</span>
                <span>
                  {(bug.wins || 0) + (bug.losses || 0) > 0 ? 
                    (((bug.wins || 0) / ((bug.wins || 0) + (bug.losses || 0))) * 100).toFixed(0) + '%' :
                    'New'
                  }
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {selectedBugs.length < 2 && (
        <div className="text-center text-sm text-gray-500 mt-4 p-3 bg-dark-700/50 rounded-lg">
          Select at least 2 bugs to start a battle
        </div>
      )}

      {selectedBugs.length >= 2 && (
        <div className="text-center text-sm text-neon-green mt-4 p-3 bg-neon-green/10 rounded-lg border border-neon-green/30">
          ✓ Ready for battle! {selectedBugs.length} fighters selected
        </div>
      )}
    </div>
  );
};

export default BugSelector;