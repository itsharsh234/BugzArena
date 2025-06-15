import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Store active battles
const activeBattles = new Map();
const connectedUsers = new Map();

// Socket connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-spectator', (battleId) => {
    socket.join(`battle-${battleId}`);
    console.log(`User ${socket.id} joined battle ${battleId} as spectator`);
    
    // Send battle state to new spectator
    const battle = activeBattles.get(battleId);
    if (battle) {
      socket.emit('battle-state', battle);
    }
  });

  socket.on('start-battle', (battleData) => {
    const battleId = Date.now().toString();
    const battle = {
      id: battleId,
      ...battleData,
      status: 'active',
      startTime: Date.now(),
      spectators: 0
    };
    
    activeBattles.set(battleId, battle);
    
    // Broadcast new battle to all clients
    io.emit('new-battle', battle);
    
    // Start battle simulation
    simulateBattle(battleId);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    connectedUsers.delete(socket.id);
  });
});

// Battle simulation
function simulateBattle(battleId) {
  const battle = activeBattles.get(battleId);
  if (!battle) return;

  const interval = setInterval(() => {
    // Update battle state
    battle.duration = Math.floor((Date.now() - battle.startTime) / 1000);
    
    // Simulate bug positions and health
    battle.bugs = battle.bugs.map(bug => ({
      ...bug,
      x: Math.max(20, Math.min(780, bug.x + (Math.random() - 0.5) * 10)),
      y: Math.max(20, Math.min(480, bug.y + (Math.random() - 0.5) * 10)),
      health: Math.max(0, bug.health - Math.random() * 2)
    }));

    // Check for battle end
    const aliveBugs = battle.bugs.filter(bug => bug.health > 0);
    if (aliveBugs.length <= 1) {
      battle.status = 'finished';
      battle.winner = aliveBugs[0];
      clearInterval(interval);
      
      // Broadcast battle end
      io.to(`battle-${battleId}`).emit('battle-ended', battle);
      
      // Remove battle after 30 seconds
      setTimeout(() => {
        activeBattles.delete(battleId);
      }, 30000);
    } else {
      // Broadcast battle update
      io.to(`battle-${battleId}`).emit('battle-update', battle);
    }
  }, 100);
}

// API Routes
app.get('/api/battles', (req, res) => {
  const battles = Array.from(activeBattles.values());
  res.json(battles);
});

app.post('/api/compile-behavior', async (req, res) => {
  const { description } = req.body;
  
  try {
    // TODO: Integrate with OpenAI API
    const compiledCode = `
function bugBehavior(self, enemies, arena) {
  // Compiled from: "${description}"
  
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
    const dx = nearestEnemy.x - self.x;
    const dy = nearestEnemy.y - self.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > 50) {
      self.vx = (dx / distance) * self.speed;
      self.vy = (dy / distance) * self.speed;
    } else {
      self.attack(nearestEnemy);
    }
  }
  
  return { action: 'move', target: nearestEnemy };
}`;

    res.json({ success: true, compiledCode });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});