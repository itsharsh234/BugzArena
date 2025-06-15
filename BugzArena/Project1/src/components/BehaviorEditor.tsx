import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Code, Sparkles, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface BehaviorEditorProps {
  behavior: {
    description: string;
    compiledCode: string;
  };
  onChange: (description: string, compiledCode: string) => void;
}

const BehaviorEditor: React.FC<BehaviorEditorProps> = ({ behavior, onChange }) => {
  const [isCompiling, setIsCompiling] = useState(false);

  const handleCompileBehavior = async () => {
    if (!behavior.description.trim()) {
      toast.error('Please describe your bug\'s behavior first!');
      return;
    }

    setIsCompiling(true);
    try {
      // TODO: Integrate with OpenAI API
      const mockCompiledCode = `
function bugBehavior(self, enemies, arena) {
  // Compiled from: "${behavior.description}"
  
  // Find nearest enemy
  let nearestEnemy = null;
  let minDistance = Infinity;
  
  enemies.forEach(enemy => {
    const distance = Math.sqrt(
      Math.pow(enemy.x - self.x, 2) + Math.pow(enemy.y - self.y, 2)
    );
    if (distance < minDistance) {
      minDistance = distance;
      nearestEnemy = enemy;
    }
  });
  
  if (nearestEnemy) {
    // Move towards enemy
    const dx = nearestEnemy.x - self.x;
    const dy = nearestEnemy.y - self.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > 50) {
      // Move closer
      self.vx = (dx / distance) * self.speed;
      self.vy = (dy / distance) * self.speed;
    } else {
      // Attack!
      self.attack(nearestEnemy);
    }
  }
  
  return { action: 'move', target: nearestEnemy };
}`;

      onChange(behavior.description, mockCompiledCode);
      toast.success('Behavior compiled successfully!');
    } catch (error) {
      toast.error('Failed to compile behavior. Please try again.');
    } finally {
      setIsCompiling(false);
    }
  };

  const exampleBehaviors = [
    "Aggressively attack the nearest enemy",
    "Stay defensive and only attack when enemies come close",
    "Circle around enemies and attack from behind",
    "Focus on the weakest enemy first",
    "Use hit-and-run tactics, attacking then retreating"
  ];

  return (
    <div className="bg-dark-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
      <h2 className="text-2xl font-bold text-white mb-4 flex items-center space-x-2">
        <Brain className="text-neon-purple" size={24} />
        <span>AI Behavior</span>
      </h2>

      <div className="space-y-6">
        {/* Natural Language Input */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Describe Your Bug's Behavior
          </label>
          <textarea
            value={behavior.description}
            onChange={(e) => onChange(e.target.value, behavior.compiledCode)}
            className="w-full px-4 py-3 bg-dark-700 border border-gray-600 rounded-lg text-white focus:border-neon-purple focus:outline-none transition-colors resize-none"
            rows={4}
            placeholder="Describe how your bug should behave in battle..."
          />
          <p className="text-xs text-gray-400 mt-2">
            Use natural language to describe your bug's combat strategy and behavior patterns.
          </p>
        </div>

        {/* Example Behaviors */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Example Behaviors
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {exampleBehaviors.map((example, index) => (
              <button
                key={index}
                onClick={() => onChange(example, behavior.compiledCode)}
                className="text-left p-3 bg-dark-700 hover:bg-dark-600 border border-gray-600 hover:border-neon-purple/50 rounded-lg text-sm text-gray-300 hover:text-white transition-all duration-200"
              >
                {example}
              </button>
            ))}
          </div>
        </div>

        {/* Compile Button */}
        <div className="flex justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCompileBehavior}
            disabled={isCompiling}
            className="px-6 py-3 bg-gradient-to-r from-neon-purple to-neon-pink text-white font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isCompiling ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Code size={20} />
                </motion.div>
                <span>Compiling...</span>
              </>
            ) : (
              <>
                <Sparkles size={20} />
                <span>Compile with AI</span>
              </>
            )}
          </motion.button>
        </div>

        {/* Compiled Code Preview */}
        {behavior.compiledCode && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center space-x-2">
              <Code size={16} />
              <span>Compiled Code Preview</span>
            </label>
            <div className="bg-dark-900 border border-gray-600 rounded-lg p-4 max-h-48 overflow-y-auto">
              <pre className="text-xs text-gray-300 font-mono">
                {behavior.compiledCode}
              </pre>
            </div>
            <div className="mt-2 flex items-center space-x-2 text-xs text-green-400">
              <AlertCircle size={16} />
              <span>Code compiled successfully and ready for battle!</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BehaviorEditor;