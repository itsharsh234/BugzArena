import React, { useRef, useEffect, useState } from 'react';

interface BattleCanvasProps {
  battleState: 'setup' | 'battle' | 'finished';
  battleData: any;
  onBattleEnd: (winner: any) => void;
}

const BattleCanvas: React.FC<BattleCanvasProps> = ({ 
  battleState, 
  battleData, 
  onBattleEnd 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [bugs, setBugs] = useState<any[]>([]);
  const [battleEvents, setBattleEvents] = useState<string[]>([]);
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    if (battleState === 'battle' && battleData) {
      // Initialize bugs with realistic stats based on traits
      const initialBugs = battleData.bugs.map((bug: any, index: number) => ({
        ...bug,
        x: 100 + index * 150,
        y: 200 + Math.random() * 100,
        vx: 0,
        vy: 0,
        health: 100,
        maxHealth: 100,
        stamina: 100,
        maxStamina: 100,
        angle: 0,
        attackCooldown: 0,
        stunned: 0,
        id: index,
        // Calculate derived stats from traits
        actualSpeed: (bug.traits?.speed || 50) / 100 * 1.4,
        actualStrength: (bug.traits?.strength || 50) / 100 * 25,
        actualDefense: (bug.traits?.defense || 50) / 100 * 0.5,
        actualIntelligence: (bug.traits?.intelligence || 50) / 100,
        criticalChance: (bug.traits?.speed || 50) / 100 * 0.2,
        dodgeChance: (bug.traits?.speed || 50) / 100 * 0.3,
        blockChance: (bug.traits?.defense || 50) / 100 * 0.4,
        lastAction: 'idle',
        actionTimer: 0
      }));
      setBugs(initialBugs);
      setBattleEvents([]);
      setParticles([]);
    }
  }, [battleState, battleData]);

  // Realistic combat calculations
  const calculateDamage = (attacker: any, defender: any) => {
    let baseDamage = attacker.actualStrength;
    
    // Critical hit chance
    const isCritical = Math.random() < attacker.criticalChance;
    if (isCritical) {
      baseDamage *= 1.5;
    }
    
    // Defender's dodge chance
    const dodged = Math.random() < defender.dodgeChance;
    if (dodged) {
      return { damage: 0, type: 'dodge', critical: false };
    }
    
    // Defender's block chance
    const blocked = Math.random() < defender.blockChance;
    if (blocked) {
      baseDamage *= 0.3;
    }
    
    // Apply defense reduction
    const finalDamage = Math.max(1, baseDamage - (baseDamage * defender.actualDefense));
    
    return { 
      damage: finalDamage, 
      type: blocked ? 'blocked' : 'hit', 
      critical: isCritical 
    };
  };

  const addBattleEvent = (event: string) => {
    setBattleEvents(prev => [...prev.slice(-4), event]);
  };

  const addParticle = (x: number, y: number, type: string, color: string) => {
    const newParticle = {
      x, y,
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 0.5) * 4,
      life: 30,
      maxLife: 30,
      type,
      color
    };
    setParticles(prev => [...prev, newParticle]);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      // Clear canvas with gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#0a0a0a');
      gradient.addColorStop(0.5, '#1a1a1a');
      gradient.addColorStop(1, '#0a0a0a');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw arena grid with glow effect
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 1;
      ctx.shadowColor = '#00ff88';
      ctx.shadowBlur = 2;
      
      for (let x = 0; x < canvas.width; x += 50) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 50) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
      ctx.shadowBlur = 0;

      if (battleState === 'setup') {
        // Draw setup message with glow
        ctx.fillStyle = '#666';
        ctx.font = '24px Orbitron';
        ctx.textAlign = 'center';
        ctx.shadowColor = '#00ff88';
        ctx.shadowBlur = 10;
        ctx.fillText('Select bugs to start battle', canvas.width / 2, canvas.height / 2);
        ctx.shadowBlur = 0;
      } else if (battleState === 'battle') {
        // Update bugs with realistic combat mechanics
        setBugs(prevBugs => {
          const updatedBugs = prevBugs.map(bug => {
            if (bug.health <= 0) return bug;

            let newBug = { ...bug };
            
            // Regenerate stamina over time
            newBug.stamina = Math.min(newBug.maxStamina, newBug.stamina + 0.2);
            
            // Reduce stun timer
            if (newBug.stunned > 0) {
              newBug.stunned--;
              return newBug;
            }

            // Find nearest enemy with intelligence-based targeting
            let targets = prevBugs.filter(otherBug => 
              otherBug.id !== bug.id && otherBug.health > 0
            );

            if (targets.length === 0) return newBug;

            // Intelligent target selection based on intelligence stat
            let target;
            if (newBug.actualIntelligence > 0.7) {
              // Smart bugs target weakest enemy
              target = targets.reduce((weakest, current) => 
                current.health < weakest.health ? current : weakest
              );
            } else if (newBug.actualIntelligence > 0.4) {
              // Average bugs target nearest enemy
              target = targets.reduce((nearest, current) => {
                const currentDist = Math.sqrt(
                  Math.pow(current.x - bug.x, 2) + Math.pow(current.y - bug.y, 2)
                );
                const nearestDist = Math.sqrt(
                  Math.pow(nearest.x - bug.x, 2) + Math.pow(nearest.y - bug.y, 2)
                );
                return currentDist < nearestDist ? current : nearest;
              });
            } else {
              // Dumb bugs attack randomly
              target = targets[Math.floor(Math.random() * targets.length)];
            }

            const dx = target.x - newBug.x;
            const dy = target.y - newBug.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Combat logic based on distance and stamina
            if (distance > 80) {
              // Move towards enemy if stamina allows
              if (newBug.stamina > 20) {
                newBug.vx = (dx / distance) * newBug.actualSpeed;
                newBug.vy = (dy / distance) * newBug.actualSpeed;
                newBug.stamina -= 0.2;
                newBug.lastAction = 'moving';
              } else {
                // Rest to recover stamina
                newBug.vx *= 0.8;
                newBug.vy *= 0.8;
                newBug.lastAction = 'resting';
              }
            } else if (distance > 40) {
              // In attack range - decide whether to attack or maneuver
              if (newBug.attackCooldown <= 0 && newBug.stamina > 30) {
                // Attack!
                const combatResult = calculateDamage(newBug, target);
                
                if (combatResult.damage > 0) {
                  target.health -= combatResult.damage;
                  target.health = Math.max(0, target.health);
                  
                  // Add visual effects
                  addParticle(target.x, target.y, 'hit', combatResult.critical ? '#ff0080' : '#ffff00');
                  
                  // Knockback effect
                  const knockbackForce = combatResult.damage / 10;
                  target.vx += (dx / distance) * knockbackForce;
                  target.vy += (dy / distance) * knockbackForce;
                  
                  // Stun chance based on damage
                  if (combatResult.damage > 15) {
                    target.stunned = Math.floor(combatResult.damage / 5);
                  }
                  
                  addBattleEvent(
                    `${newBug.name} ${combatResult.type} ${target.name} for ${Math.floor(combatResult.damage)} damage${combatResult.critical ? ' (CRITICAL!)' : ''}`
                  );
                } else {
                  addParticle(target.x, target.y, 'dodge', '#00ff88');
                  addBattleEvent(`${target.name} dodged ${newBug.name}'s attack!`);
                }
                
                newBug.attackCooldown = Math.max(60, 120 - (newBug.actualSpeed * 10));
                newBug.stamina -= 25;
                newBug.lastAction = 'attacking';
              } else {
                // Circle around enemy
                const circleAngle = Date.now() * 0.001 + newBug.id;
                newBug.vx = Math.cos(circleAngle) * newBug.actualSpeed * 0.5;
                newBug.vy = Math.sin(circleAngle) * newBug.actualSpeed * 0.5;
                newBug.lastAction = 'circling';
              }
            } else {
              // Too close - back away
              newBug.vx = -(dx / distance) * newBug.actualSpeed * 0.7;
              newBug.vy = -(dy / distance) * newBug.actualSpeed * 0.7;
              newBug.lastAction = 'retreating';
            }

            // Update position with bounds checking
            newBug.x += newBug.vx;
            newBug.y += newBug.vy;
            
            // Arena boundaries with bounce
            if (newBug.x < 30) {
              newBug.x = 30;
              newBug.vx = Math.abs(newBug.vx) * 0.5;
            }
            if (newBug.x > canvas.width - 30) {
              newBug.x = canvas.width - 30;
              newBug.vx = -Math.abs(newBug.vx) * 0.5;
            }
            if (newBug.y < 30) {
              newBug.y = 30;
              newBug.vy = Math.abs(newBug.vy) * 0.5;
            }
            if (newBug.y > canvas.height - 30) {
              newBug.y = canvas.height - 30;
              newBug.vy = -Math.abs(newBug.vy) * 0.5;
            }
            
            // Reduce attack cooldown
            if (newBug.attackCooldown > 0) {
              newBug.attackCooldown--;
            }

            return newBug;
          });

          // Update particles
          setParticles(prev => prev.map(particle => ({
            ...particle,
            x: particle.x + particle.vx,
            y: particle.y + particle.vy,
            life: particle.life - 1,
            vx: particle.vx * 0.95,
            vy: particle.vy * 0.95
          })).filter(particle => particle.life > 0));

          // Draw bugs with enhanced visuals
          updatedBugs.forEach(bug => {
            if (bug.health <= 0) {
              // Draw dead bug
              ctx.fillStyle = '#444';
              ctx.globalAlpha = 0.5;
              ctx.beginPath();
              ctx.arc(bug.x, bug.y, 15, 0, 2 * Math.PI);
              ctx.fill();
              ctx.globalAlpha = 1;
              return;
            }

            // Bug glow based on action
            let glowColor = bug.color;
            if (bug.lastAction === 'attacking') glowColor = '#ff0080';
            else if (bug.lastAction === 'moving') glowColor = '#00ff88';
            else if (bug.stunned > 0) glowColor = '#ffff00';

            // Draw bug shadow
            ctx.fillStyle = 'rgba(0,0,0,0.3)';
            ctx.beginPath();
            ctx.ellipse(bug.x + 2, bug.y + 2, 18, 12, 0, 0, 2 * Math.PI);
            ctx.fill();

            // Draw bug body with glow
            ctx.shadowColor = glowColor;
            ctx.shadowBlur = bug.stunned > 0 ? 15 : 8;
            ctx.fillStyle = bug.color;
            ctx.beginPath();
            ctx.arc(bug.x, bug.y, 15, 0, 2 * Math.PI);
            ctx.fill();
            ctx.shadowBlur = 0;

            // Draw action indicator
            if (bug.lastAction === 'attacking') {
              ctx.strokeStyle = '#ff0080';
              ctx.lineWidth = 3;
              ctx.beginPath();
              ctx.arc(bug.x, bug.y, 20, 0, 2 * Math.PI);
              ctx.stroke();
            }

            // Draw health bar with gradient
            const barWidth = 30;
            const barHeight = 4;
            const healthPercent = bug.health / bug.maxHealth;
            
            // Background
            ctx.fillStyle = '#333';
            ctx.fillRect(bug.x - barWidth/2, bug.y - 30, barWidth, barHeight);
            
            // Health gradient
            const healthGradient = ctx.createLinearGradient(
              bug.x - barWidth/2, 0, bug.x + barWidth/2, 0
            );
            if (healthPercent > 0.6) {
              healthGradient.addColorStop(0, '#00ff88');
              healthGradient.addColorStop(1, '#88ff00');
            } else if (healthPercent > 0.3) {
              healthGradient.addColorStop(0, '#ffff00');
              healthGradient.addColorStop(1, '#ff8800');
            } else {
              healthGradient.addColorStop(0, '#ff0080');
              healthGradient.addColorStop(1, '#ff0000');
            }
            
            ctx.fillStyle = healthGradient;
            ctx.fillRect(bug.x - barWidth/2, bug.y - 30, barWidth * healthPercent, barHeight);

            // Draw stamina bar
            const staminaPercent = bug.stamina / bug.maxStamina;
            ctx.fillStyle = '#0088ff';
            ctx.fillRect(bug.x - barWidth/2, bug.y - 25, barWidth * staminaPercent, 2);

            // Draw name with outline
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 2;
            ctx.font = '10px Orbitron';
            ctx.textAlign = 'center';
            ctx.strokeText(bug.name || 'Bug', bug.x, bug.y + 35);
            ctx.fillStyle = '#fff';
            ctx.fillText(bug.name || 'Bug', bug.x, bug.y + 35);
          });

          // Check for battle end
          const aliveBugs = updatedBugs.filter(bug => bug.health > 0);
          if (aliveBugs.length <= 1) {
            setTimeout(() => onBattleEnd(aliveBugs[0] || null), 2000);
          }

          return updatedBugs;
        });

        // Draw particles
        particles.forEach(particle => {
          ctx.globalAlpha = particle.life / particle.maxLife;
          ctx.fillStyle = particle.color;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, 3, 0, 2 * Math.PI);
          ctx.fill();
        });
        ctx.globalAlpha = 1;

      } else if (battleState === 'finished') {
        // Draw winner with celebration effect
        const winner = bugs.find(bug => bug.health > 0);
        if (winner) {
          ctx.fillStyle = '#00ff88';
          ctx.font = '32px Orbitron';
          ctx.textAlign = 'center';
          ctx.shadowColor = '#00ff88';
          ctx.shadowBlur = 20;
          ctx.fillText(`${winner.name} Wins!`, canvas.width / 2, canvas.height / 2);
          ctx.shadowBlur = 0;
          
          // Victory particles
          for (let i = 0; i < 5; i++) {
            addParticle(
              canvas.width / 2 + (Math.random() - 0.5) * 100,
              canvas.height / 2 + (Math.random() - 0.5) * 50,
              'victory',
              '#00ff88'
            );
          }
        }
      }

      if (battleState === 'battle') {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    if (battleState !== 'setup') {
      animate();
    } else {
      // Draw setup state with animated background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#0a0a0a');
      gradient.addColorStop(0.5, '#1a1a1a');
      gradient.addColorStop(1, '#0a0a0a');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#666';
      ctx.font = '24px Orbitron';
      ctx.textAlign = 'center';
      ctx.shadowColor = '#00ff88';
      ctx.shadowBlur = 10;
      ctx.fillText('Select bugs to start battle', canvas.width / 2, canvas.height / 2);
      ctx.shadowBlur = 0;
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [battleState, bugs, particles, onBattleEnd]);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={800}
        height={500}
        className="w-full border border-gray-600 rounded-lg bg-dark-900"
      />
      
      {/* Battle HUD */}
      {battleState === 'battle' && (
        <>
          <div className="absolute top-4 left-4 bg-dark-800/90 backdrop-blur-sm rounded-lg p-3 min-w-48">
            <div className="text-neon-green font-bold mb-2">BATTLE STATUS</div>
            <div className="text-sm text-gray-400 mb-1">
              {bugs.filter(bug => bug.health > 0).length} fighters remaining
            </div>
            <div className="text-xs text-gray-500">
              Real-time combat simulation
            </div>
          </div>

          {/* Battle Events Feed */}
          <div className="absolute top-4 right-4 bg-dark-800/90 backdrop-blur-sm rounded-lg p-3 w-80">
            <div className="text-neon-blue font-bold mb-2">BATTLE LOG</div>
            <div className="space-y-1 max-h-20 overflow-y-auto">
              {battleEvents.map((event, index) => (
                <div key={index} className="text-xs text-gray-300 animate-fade-in">
                  {event}
                </div>
              ))}
            </div>
          </div>

          {/* Fighter Stats */}
          <div className="absolute bottom-4 left-4 right-4 bg-dark-800/90 backdrop-blur-sm rounded-lg p-3">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {bugs.filter(bug => bug.health > 0).map(bug => (
                <div key={bug.id} className="text-center">
                  <div className="text-sm font-bold text-white mb-1">{bug.name}</div>
                  <div className="flex items-center space-x-2 text-xs">
                    <div className="flex-1">
                      <div className="bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-neon-green h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(bug.health / bug.maxHealth) * 100}%` }}
                        />
                      </div>
                      <div className="text-gray-400 mt-1">HP: {Math.floor(bug.health)}</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1 capitalize">{bug.lastAction}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default BattleCanvas;