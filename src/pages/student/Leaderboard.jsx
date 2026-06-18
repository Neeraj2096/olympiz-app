import React, { useState } from 'react';
import { Trophy, Star, ShieldAlert, Award, ArrowUp, Zap } from 'lucide-react';

export default function Leaderboard({ user, activeCourse = 'JEE Main' }) {
  const [filter, setFilter] = useState('All India');

  // Preloaded rank lists
  const leaders = [
    { rank: 1, name: "Priya Sharma", xp: 4890, tests: 12, accuracy: '91%', streak: 28, avatar: 'PS', color: '#6C63FF' },
    { rank: 2, name: "Aarav Gupta", xp: 4620, tests: 10, accuracy: '88%', streak: 18, avatar: 'AG', color: '#00D4AA' },
    { rank: 3, name: "Sneha Reddy", xp: 4310, tests: 9, accuracy: '84%', streak: 12, avatar: 'SR', color: '#FF6B6B' },
    { rank: 4, name: "Arjun Kumar", xp: user.xp, tests: user.testsTaken, accuracy: '81%', streak: user.streak, avatar: 'AK', color: 'var(--primary-color)', isUser: true },
    { rank: 5, name: "Kabir Singh", xp: 3950, tests: 8, accuracy: '78%', streak: 6, avatar: 'KS', color: '#FFB347' }
  ];

  return (
    <div className="fade-in" style={{ padding: '0px', fontFamily: "'Inter', sans-serif", position: 'relative', zIndex: 5 }}>
      
      {/* Filters row */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <h2 style={{ color: 'white', marginBottom: '6px' }}>Student Leaderboard</h2>
          <p style={{ color: '#A0A0C0', fontSize: '0.9rem' }}>Compete with top {activeCourse} aspirants across India!</p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {['My Class', 'My City', 'All India'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="btn btn-pill"
              style={{
                padding: '6px 14px',
                fontSize: '0.8rem',
                background: filter === f ? 'var(--primary-color)' : 'rgba(255,255,255,0.03)',
                color: filter === f ? '#0D0D1A' : '#A0A0C0',
                border: 'none',
                fontWeight: '600'
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Podium Top 3 visual layout */}
      <div className="grid-3" style={{
        gap: '20px',
        marginBottom: '40px'
      }}>
        
        {/* Rank 2 */}
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', height: '180px', display: 'flex', flexDirection: 'column', justify: 'center', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: leaders[1].color, display: 'flex', alignItems: 'center', justify: 'center', fontWeight: 'bold', fontSize: '1rem', color: '#0D0D1A' }}>{leaders[1].avatar}</div>
          <h4 style={{ color: 'white', fontSize: '0.9rem' }}>{leaders[1].name}</h4>
          <span style={{ fontSize: '#FFB347', fontWeight: 'bold' }}>2nd Rank</span>
          <span style={{ fontSize: '0.75rem', color: '#A0A0C0' }}>{leaders[1].xp} XP</span>
        </div>

        {/* Rank 1 (Tallest) */}
        <div className="glass-panel" style={{
          padding: '30px',
          borderRadius: '20px',
          height: '220px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '10px',
          background: 'linear-gradient(135deg, rgba(108, 99, 255, 0.15) 0%, rgba(26, 26, 53, 0.6) 100%)',
          border: '1px solid rgba(108, 99, 255, 0.3)'
        }}>
          <div style={{ position: 'relative' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: leaders[0].color, display: 'flex', alignItems: 'center', justify: 'center', fontWeight: 'bold', fontSize: '1.25rem', color: '#0D0D1A' }}>{leaders[0].avatar}</div>
            <Trophy size={18} style={{ position: 'absolute', top: '-10px', right: '-10px', color: '#FFB347' }} />
          </div>
          <h3 style={{ color: 'white', fontSize: '1rem' }}>{leaders[0].name}</h3>
          <span style={{ color: '#00D4AA', fontWeight: 'bold', fontSize: '0.95rem' }}>1st Rank</span>
          <span style={{ fontSize: '0.8rem', color: '#A0A0C0' }}>{leaders[0].xp} XP</span>
        </div>

        {/* Rank 3 */}
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', height: '160px', display: 'flex', flexDirection: 'column', justify: 'center', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: leaders[2].color, display: 'flex', alignItems: 'center', justify: 'center', fontWeight: 'bold', fontSize: '0.85rem', color: '#0D0D1A' }}>{leaders[2].avatar}</div>
          <h4 style={{ color: 'white', fontSize: '0.85rem' }}>{leaders[2].name}</h4>
          <span style={{ color: '#FF6B6B', fontWeight: 'bold', fontSize: '0.8rem' }}>3rd Rank</span>
          <span style={{ fontSize: '0.75rem', color: '#A0A0C0' }}>{leaders[2].xp} XP</span>
        </div>

      </div>

      {/* Leaderboard Rankings List Table */}
      <div className="glass-panel" style={{ padding: '20px', borderRadius: '18px', marginBottom: '30px', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ color: '#626280', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '10px', textAlign: 'left' }}>
              <th style={{ padding: '12px' }}>Rank</th>
              <th>Student</th>
              <th>XP Points</th>
              <th>Tests Taken</th>
              <th>Avg Accuracy</th>
              <th>Daily Streak</th>
            </tr>
          </thead>
          <tbody>
            {leaders.map((lead, idx) => (
              <tr 
                key={idx}
                style={{
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                  background: lead.isUser ? 'rgba(108, 99, 255, 0.08)' : 'transparent',
                  fontWeight: lead.isUser ? 'bold' : 'normal',
                  color: lead.isUser ? 'white' : 'var(--text-secondary)'
                }}
              >
                <td style={{ padding: '14px 12px', color: lead.rank <= 3 ? 'var(--secondary-color)' : '#A0A0C0' }}>#{lead.rank}</td>
                <td style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 0' }}>
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: lead.color,
                    color: '#0D0D1A',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem'
                  }}>{lead.avatar}</div>
                  <span style={{ color: lead.isUser ? 'white' : 'white' }}>{lead.name}</span>
                </td>
                <td style={{ color: 'white' }}>{lead.xp} XP</td>
                <td>{lead.tests} drills</td>
                <td>{lead.accuracy}</td>
                <td style={{ color: '#FFB347' }}>🔥 {lead.streak} Days</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Achievements Badges grid */}
      <div className="glass-panel" style={{ padding: '30px', borderRadius: '18px' }}>
        <h3 style={{ color: 'white', fontSize: '1.05rem', fontWeight: 'bold', marginBottom: '20px' }}>Your Achievements</h3>
        <div className="grid-5" style={{ gap: '16px' }}>
          {[
            { label: 'First Test', icon: '📝', unlocked: true },
            { label: '7-Day Streak', icon: '🔥', unlocked: true },
            { label: 'Speed Solver', icon: '⚡', unlocked: true },
            { label: 'Night Owl', icon: '🦉', unlocked: false },
            { label: 'Perfect Score', icon: '💯', unlocked: false }
          ].map((badge, i) => (
            <div 
              key={i} 
              className="glass-panel"
              style={{
                padding: '16px',
                borderRadius: '12px',
                textAlign: 'center',
                opacity: badge.unlocked ? 1 : 0.4,
                border: badge.unlocked ? '1px solid rgba(0,212,170,0.15)' : '1px solid rgba(255,255,255,0.06)',
                background: badge.unlocked ? 'rgba(0,212,170,0.02)' : 'rgba(255,255,255,0.01)'
              }}
            >
              <span style={{ fontSize: '1.75rem', display: 'block', marginBottom: '6px' }}>{badge.icon}</span>
              <h4 style={{ color: 'white', fontSize: '0.8rem', fontWeight: 'bold' }}>{badge.label}</h4>
              <span style={{ fontSize: '0.65rem', color: badge.unlocked ? '#00D4AA' : '#626280' }}>
                {badge.unlocked ? 'Unlocked' : 'Locked'}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
