import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Zap, Shield, Target, Cpu, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import BugPreview from '../components/BugPreview';
import TraitSlider from '../components/TraitSlider';
import BehaviorEditor from '../components/BehaviorEditor';

const BugDesigner = () => {
  const [bugData, setBugData] = useState({
    name: '',
    color: '#00ff88',
    traits: {
      speed: 50,
      strength: 50,
      defense: 50,
      intelligence: 50
    },
    behavior: {
      description: '',
      compiledCode: ''
    }
  });

  const handleTraitChange = (trait: string, value: number) => {
    setBugData(prev => ({
      ...prev,
      traits: {
        ...prev.traits,
        [trait]: value
      }
    }));
  };

  const handleBehaviorChange = (description: string, compiledCode: string) => {
    setBugData(prev => ({
      ...prev,
      behavior: {
        description,
        compiledCode
      }
    }));
  };

  const handleSaveBug = async () => {
    if (!bugData.name.trim()) {
      toast.error('Please give your bug a name!');
      return;
    }

    if (!bugData.behavior.description.trim()) {
      toast.error('Please describe your bug\'s behavior!');
      return;
    }

    try {
      // Save to localStorage for now (replace with Supabase later)
      const existingBugs = JSON.parse(localStorage.getItem('userBugs') || '[]');
      const newBug = {
        ...bugData,
        id: Date.now(),
        wins: 0,
        losses: 0,
        created: new Date().toISOString(),
        totalDamageDealt: 0,
        totalDamageTaken: 0,
        battlesParticipated: 0
      };
      
      const updatedBugs = [...existingBugs, newBug];
      localStorage.setItem('userBugs', JSON.stringify(updatedBugs));
      
      toast.success(`${bugData.name} has been saved to your collection!`);
      
      // Reset form
      setBugData({
        name: '',
        color: '#00ff88',
        traits: {
          speed: 50,
          strength: 50,
          defense: 50,
          intelligence: 50
        },
        behavior: {
          description: '',
          compiledCode: ''
        }
      });
    } catch (error) {
      toast.error('Failed to save bug. Please try again.');
    }
  };

  const totalPoints = Object.values(bugData.traits).reduce((sum, value) => sum + value, 0);
  const maxPoints = 300;

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
            Bug Designer
          </h1>
          <p className="text-gray-400 text-lg">
            Create your ultimate insect warrior with custom traits and AI behavior
          </p>
          <div className="mt-4 text-sm text-gray-500">
            Design realistic fighters with data-driven combat mechanics
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Bug Preview */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-dark-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6"
          >
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center space-x-2">
              <Sparkles className="text-neon-green" size={24} />
              <span>Preview</span>
            </h2>
            <BugPreview bugData={bugData} />
            
            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Bug Name
                </label>
                <input
                  type="text"
                  value={bugData.name}
                  onChange={(e) => setBugData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 bg-dark-700 border border-gray-600 rounded-lg text-white focus:border-neon-green focus:outline-none transition-colors"
                  placeholder="Enter your bug's name..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Primary Color
                </label>
                <input
                  type="color"
                  value={bugData.color}
                  onChange={(e) => setBugData(prev => ({ ...prev, color: e.target.value }))}
                  className="w-full h-12 bg-dark-700 border border-gray-600 rounded-lg cursor-pointer"
                />
              </div>

              {/* Combat Predictions */}
              <div className="bg-dark-700 rounded-lg p-4">
                <h3 className="text-sm font-bold text-white mb-3">Combat Predictions</h3>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-gray-400">DPS:</span>
                    <span className="text-neon-pink ml-2 font-bold">
                      {Math.floor((bugData.traits.strength / 100) * 25 * (1 + bugData.traits.speed / 200))}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">Survivability:</span>
                    <span className="text-neon-blue ml-2 font-bold">
                      {Math.floor(100 + (bugData.traits.defense / 100) * 150)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">Crit Chance:</span>
                    <span className="text-neon-yellow ml-2 font-bold">
                      {Math.floor((bugData.traits.speed / 100) * 20)}%
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">Dodge Chance:</span>
                    <span className="text-neon-green ml-2 font-bold">
                      {Math.floor((bugData.traits.speed / 100) * 30)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Traits Configuration */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-dark-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6"
          >
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center space-x-2">
              <Target className="text-neon-blue" size={24} />
              <span>Combat Traits</span>
            </h2>
            
            <div className="mb-4 text-sm text-gray-400">
              Points Used: {totalPoints} / {maxPoints}
              <div className="w-full bg-dark-700 rounded-full h-2 mt-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    totalPoints > maxPoints ? 'bg-gradient-to-r from-neon-pink to-red-500' : 'bg-gradient-to-r from-neon-green to-neon-blue'
                  }`}
                  style={{ width: `${Math.min((totalPoints / maxPoints) * 100, 100)}%` }}
                />
              </div>
              {totalPoints > maxPoints && (
                <div className="text-neon-pink text-xs mt-1">
                  ⚠️ Over budget! Reduce some traits.
                </div>
              )}
            </div>

            <div className="space-y-6">
              <TraitSlider
                label="Speed"
                icon={Zap}
                value={bugData.traits.speed}
                onChange={(value) => handleTraitChange('speed', value)}
                color="neon-yellow"
                description="Affects movement speed, attack frequency, crit chance, and dodge chance"
              />
              <TraitSlider
                label="Strength"
                icon={Target}
                value={bugData.traits.strength}
                onChange={(value) => handleTraitChange('strength', value)}
                color="neon-pink"
                description="Determines base attack damage and knockback force"
              />
              <TraitSlider
                label="Defense"
                icon={Shield}
                value={bugData.traits.defense}
                onChange={(value) => handleTraitChange('defense', value)}
                color="neon-blue"
                description="Reduces incoming damage and increases block chance"
              />
              <TraitSlider
                label="Intelligence"
                icon={Cpu}
                value={bugData.traits.intelligence}
                onChange={(value) => handleTraitChange('intelligence', value)}
                color="neon-purple"
                description="Improves tactical decisions and target selection"
              />
            </div>

            {/* Trait Synergies */}
            <div className="mt-6 bg-dark-700 rounded-lg p-4">
              <h3 className="text-sm font-bold text-white mb-3">Trait Synergies</h3>
              <div className="space-y-2 text-xs">
                {bugData.traits.speed > 70 && bugData.traits.strength > 70 && (
                  <div className="text-neon-yellow">⚡ Glass Cannon: High damage but fragile</div>
                )}
                {bugData.traits.defense > 70 && bugData.traits.intelligence > 70 && (
                  <div className="text-neon-blue">🛡️ Tactical Tank: Smart defensive play</div>
                )}
                {bugData.traits.speed > 80 && bugData.traits.intelligence > 80 && (
                  <div className="text-neon-purple">🧠 Speed Demon: Fast and smart</div>
                )}
                {Object.values(bugData.traits).every(trait => trait >= 60 && trait <= 80) && (
                  <div className="text-neon-green">⚖️ Balanced Fighter: Well-rounded stats</div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Behavior Editor */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8"
        >
          <BehaviorEditor
            behavior={bugData.behavior}
            onChange={handleBehaviorChange}
          />
        </motion.div>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 text-center"
        >
          <button
            onClick={handleSaveBug}
            disabled={totalPoints > maxPoints}
            className="px-8 py-4 bg-gradient-to-r from-neon-green to-neon-blue text-dark-900 font-bold rounded-lg shadow-lg hover:shadow-neon-green/50 transition-all duration-300 flex items-center space-x-2 mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={20} />
            <span>Save Bug to Collection</span>
          </button>
          {totalPoints > maxPoints && (
            <p className="text-neon-pink text-sm mt-2">
              Reduce trait points to save your bug
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default BugDesigner;