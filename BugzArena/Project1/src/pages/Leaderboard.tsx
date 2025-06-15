import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award, Crown, TrendingUp, Users } from 'lucide-react';

const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState<'bugs' | 'players'>('bugs');

  const topBugs = [
    {
      id: 1,
      name: 'Apex Predator',
      owner: 'BugMaster2024',
      wins: 47,
      losses: 3,
      winRate: 94.0,
      color: '#ff0080',
      rank: 1
    },
    {
      id: 2,
      name: 'Lightning Striker',
      owner: 'ThunderBug',
      wins: 42,
      losses: 8,
      winRate: 84.0,
      color: '#00ff88',
      rank: 2
    },
    {
      id: 3,
      name: 'Iron Fortress',
      owner: 'DefenseKing',
      wins: 38,
      losses: 7,
      winRate: 84.4,
      color: '#0088ff',
      rank: 3
    },
    {
      id: 4,
      name: 'Shadow Assassin',
      owner: 'NinjaWarrior',
      wins: 35,
      losses: 10,
      winRate: 77.8,
      color: '#8800ff',
      rank: 4
    },
    {
      id: 5,
      name: 'Berserker Beast',
      owner: 'RageMode',
      wins: 33,
      losses: 12,
      winRate: 73.3,
      color: '#ffff00',
      rank: 5
    }
  ];

  const topPlayers = [
    {
      id: 1,
      username: 'BugMaster2024',
      totalWins: 127,
      totalLosses: 23,
      winRate: 84.7,
      bugsCreated: 8,
      rank: 1
    },
    {
      id: 2,
      username: 'ThunderBug',
      totalWins: 98,
      totalLosses: 32,
      winRate: 75.4,
      bugsCreated: 6,
      rank: 2
    },
    {
      id: 3,
      username: 'DefenseKing',
      totalWins: 85,
      totalLosses: 25,
      winRate: 77.3,
      bugsCreated: 5,
      rank: 3
    },
    {
      id: 4,
      username: 'NinjaWarrior',
      totalWins: 76,
      totalLosses: 34,
      winRate: 69.1,
      bugsCreated: 7,
      rank: 4
    },
    {
      id: 5,
      username: 'RageMode',
      totalWins: 71,
      totalLosses: 29,
      winRate: 71.0,
      bugsCreated: 4,
      rank: 5
    }
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="text-yellow-400" size={24} />;
      case 2:
        return <Medal className="text-gray-400" size={24} />;
      case 3:
        return <Award className="text-orange-400" size={24} />;
      default:
        return <Trophy className="text-gray-600" size={20} />;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'from-yellow-400 to-orange-500';
      case 2:
        return 'from-gray-300 to-gray-500';
      case 3:
        return 'from-orange-400 to-red-500';
      default:
        return 'from-gray-600 to-gray-800';
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-cyber font-bold text-neon-green mb-4">
            Leaderboard
          </h1>
          <p className="text-gray-400 text-lg">
            Top performing bugs and players in the arena
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex justify-center mb-8"
        >
          <div className="bg-dark-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-1 flex">
            <button
              onClick={() => setActiveTab('bugs')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                activeTab === 'bugs'
                  ? 'bg-neon-green text-dark-900'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Trophy size={20} />
              <span>Top Bugs</span>
            </button>
            <button
              onClick={() => setActiveTab('players')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                activeTab === 'players'
                  ? 'bg-neon-green text-dark-900'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Users size={20} />
              <span>Top Players</span>
            </button>
          </div>
        </motion.div>

        {/* Top 3 Podium */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex justify-center items-end space-x-4 mb-8">
            {/* 2nd Place */}
            <div className="text-center">
              <div className="bg-gradient-to-b from-gray-300 to-gray-500 rounded-lg p-6 mb-4 relative h-32 flex flex-col justify-end">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Medal className="text-gray-400" size={32} />
                </div>
                <div className="text-white font-bold text-lg">
                  {activeTab === 'bugs' ? topBugs[1]?.name : topPlayers[1]?.username}
                </div>
                <div className="text-gray-200 text-sm">
                  {activeTab === 'bugs' 
                    ? `${topBugs[1]?.winRate}% win rate`
                    : `${topPlayers[1]?.totalWins} wins`
                  }
                </div>
              </div>
              <div className="text-xl font-bold text-gray-400">#2</div>
            </div>

            {/* 1st Place */}
            <div className="text-center">
              <div className="bg-gradient-to-b from-yellow-400 to-orange-500 rounded-lg p-6 mb-4 relative h-40 flex flex-col justify-end">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Crown className="text-yellow-400" size={36} />
                </div>
                <div className="text-dark-900 font-bold text-xl">
                  {activeTab === 'bugs' ? topBugs[0]?.name : topPlayers[0]?.username}
                </div>
                <div className="text-dark-800 text-sm">
                  {activeTab === 'bugs' 
                    ? `${topBugs[0]?.winRate}% win rate`
                    : `${topPlayers[0]?.totalWins} wins`
                  }
                </div>
              </div>
              <div className="text-2xl font-bold text-yellow-400">#1</div>
            </div>

            {/* 3rd Place */}
            <div className="text-center">
              <div className="bg-gradient-to-b from-orange-400 to-red-500 rounded-lg p-6 mb-4 relative h-28 flex flex-col justify-end">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Award className="text-orange-400" size={28} />
                </div>
                <div className="text-white font-bold">
                  {activeTab === 'bugs' ? topBugs[2]?.name : topPlayers[2]?.username}
                </div>
                <div className="text-gray-200 text-sm">
                  {activeTab === 'bugs' 
                    ? `${topBugs[2]?.winRate}% win rate`
                    : `${topPlayers[2]?.totalWins} wins`
                  }
                </div>
              </div>
              <div className="text-lg font-bold text-orange-400">#3</div>
            </div>
          </div>
        </motion.div>

        {/* Full Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-dark-800/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden"
        >
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
              <TrendingUp className="text-neon-blue" size={24} />
              <span>{activeTab === 'bugs' ? 'Bug Rankings' : 'Player Rankings'}</span>
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-dark-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    {activeTab === 'bugs' ? 'Bug' : 'Player'}
                  </th>
                  {activeTab === 'bugs' && (
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Owner
                    </th>
                  )}
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Wins
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Losses
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Win Rate
                  </th>
                  {activeTab === 'players' && (
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Bugs Created
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {(activeTab === 'bugs' ? topBugs : topPlayers).map((item, index) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="hover:bg-dark-700/50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {getRankIcon(item.rank)}
                        <span className="font-bold text-white">#{item.rank}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        {activeTab === 'bugs' && (
                          <div 
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: (item as any).color }}
                          />
                        )}
                        <span className="font-medium text-white">
                          {activeTab === 'bugs' ? item.name : (item as any).username}
                        </span>
                      </div>
                    </td>
                    {activeTab === 'bugs' && (
                      <td className="px-6 py-4 whitespace-nowrap text-gray-400">
                        {(item as any).owner}
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap text-neon-green font-bold">
                      {activeTab === 'bugs' ? item.wins : (item as any).totalWins}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-neon-pink font-bold">
                      {activeTab === 'bugs' ? item.losses : (item as any).totalLosses}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-neon-blue font-bold">
                      {item.winRate}%
                    </td>
                    {activeTab === 'players' && (
                      <td className="px-6 py-4 whitespace-nowrap text-gray-400">
                        {(item as any).bugsCreated}
                      </td>
                    )}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Leaderboard;