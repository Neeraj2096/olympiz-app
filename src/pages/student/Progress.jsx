import React, { useState } from 'react';
import { 
  BarChart3, Brain, Calendar, Clock, BookOpen, 
  Award, TrendingUp, HelpCircle, AlertCircle, ArrowUpRight 
} from 'lucide-react';

export default function Progress({ user, testHistory, weakTopics, activeCourse = 'JEE Main' }) {
  const [timeRange, setTimeRange] = useState('30 days');

  const calculatePrediction = () => {
    if (activeCourse.includes('JEE')) {
      return { type: 'Predicted JEE Percentile', value: '98.4 %ile', color: '#6C63FF', rank: 'AIR ~15,200' };
    } else if (activeCourse.includes('NEET')) {
      return { type: 'Predicted NEET Rank', value: 'AIR 4,320', color: '#00D4AA', rank: 'Score ~640/720' };
    } else {
      return { type: 'Predicted Board Score', value: '94%', color: '#FFB347', rank: 'Top 5% National' };
    }
  };
  const prediction = calculatePrediction();

  // Preloaded subject scores
  const subjectScores = [
    { subject: 'Physics', percent: 78, color: '#6C63FF', mastered: 12, total: 15 },
    { subject: 'Chemistry', percent: 84, color: '#00D4AA', mastered: 14, total: 16 },
    { subject: 'Mathematics', percent: 68, color: '#FF6B6B', mastered: 9, total: 14 },
    { subject: 'Biology', percent: 92, color: '#05D580', mastered: 18, total: 20 }
  ].filter(s => {
    if (activeCourse.includes('JEE') && s.subject === 'Biology') return false;
    if (activeCourse.includes('NEET') && s.subject === 'Mathematics') return false;
    return true;
  });

  // Preloaded chapter heatmap cells
  const heatmapData = [
    { chapter: 'Kinematics', level: 'high', date: 'Yesterday', subject: 'Physics' },
    { chapter: 'Newton\'s Laws', level: 'high', date: '3 days ago', subject: 'Physics' },
    { chapter: 'Work & Power', level: 'medium', date: '5 days ago', subject: 'Physics' },
    { chapter: 'Electrostatics', level: 'medium', date: '2 days ago', subject: 'Physics' },
    { chapter: 'Thermodynamics', level: 'low', date: 'Today', subject: 'Chemistry' },
    { chapter: 'Hydrocarbons', level: 'high', date: '4 days ago', subject: 'Chemistry' },
    { chapter: 'Matrices', level: 'medium', date: 'Yesterday', subject: 'Mathematics' },
    { chapter: 'Calculus', level: 'high', date: '6 days ago', subject: 'Mathematics' },
    { chapter: 'Genetics', level: 'high', date: 'Yesterday', subject: 'Biology' },
    { chapter: 'Cell Cycle', level: 'medium', date: '3 days ago', subject: 'Biology' }
  ].filter(h => {
    if (activeCourse.includes('JEE') && h.subject === 'Biology') return false;
    if (activeCourse.includes('NEET') && h.subject === 'Mathematics') return false;
    return true;
  });

  return (
    <div className="fade-in" style={{ padding: '0px', fontFamily: "'Inter', sans-serif", position: 'relative', zIndex: 5 }}>
      
      {/* 1. Header Overview Stats Hero */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '20px',
        marginBottom: '30px'
      }} className="catalog-grid-mobile">
        {[
          { label: "Overall progress", value: "81%", desc: "Chapter mastery avg" },
          { label: "Hours studied", value: `${user.studyHours * 12} hrs`, desc: "This month total" },
          { label: "Mock tests taken", value: user.testsTaken, desc: "Across all subjects" },
          { label: "Gamified XP Rank", value: "Level 4", desc: `${user.xp} XP total` }
        ].map((stat, i) => (
          <div key={i} className="glass-panel" style={{ padding: '20px', borderRadius: '16px' }}>
            <span style={{ fontSize: '0.75rem', color: '#A0A0C0' }}>{stat.label}</span>
            <p style={{ fontSize: '1.5rem', fontWeight: '800', color: 'white', margin: '4px 0' }}>{stat.value}</p>
            <span style={{ fontSize: '0.7rem', color: '#626280' }}>{stat.desc}</span>
          </div>
        ))}
      </div>

      {/* Main progress graphs grids */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr',
        gap: '25px',
        marginBottom: '30px'
      }} className="test-grid-mobile">
        
        {/* Left: Line Graph + Heatmap */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          
          {/* Performance line graph */}
          <div className="glass-panel" style={{ padding: '30px', borderRadius: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ color: 'white', fontSize: '1.05rem', fontWeight: 'bold' }}>Accuracy over time</h3>
              
              <div style={{ display: 'flex', gap: '6px' }}>
                {['7 days', '30 days', '3 months'].map(range => (
                  <button 
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className="btn btn-pill" 
                    style={{
                      padding: '4px 10px',
                      fontSize: '0.7rem',
                      background: timeRange === range ? 'var(--primary-color)' : 'rgba(255,255,255,0.03)',
                      color: timeRange === range ? '#0D0D1A' : '#A0A0C0',
                      border: 'none'
                    }}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom SVG line chart representing mock trends */}
            <div style={{ width: '100%', height: '180px', display: 'flex', alignItems: 'flex-end', position: 'relative' }}>
              {/* Grid Lines */}
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', opacity: 0.05, pointerEvents: 'none' }}>
                {[...Array(5)].map((_, i) => <div key={i} style={{ borderTop: '1px solid white', width: '100%' }}></div>)}
              </div>
              
              {/* SVG Line representation */}
              <svg viewBox="0 0 500 150" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                {/* Gradient Fill */}
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6C63FF" stopOpacity="0.3"/>
                    <stop offset="100%" stopColor="#6C63FF" stopOpacity="0.0"/>
                  </linearGradient>
                </defs>
                <path d="M 0 100 Q 100 80 200 50 T 400 90 T 500 30" fill="transparent" stroke="#6C63FF" strokeWidth="4" strokeLinecap="round" />
                <path d="M 0 100 Q 100 80 200 50 T 400 90 T 500 30 L 500 150 L 0 150 Z" fill="url(#chartGrad)" />
                
                {/* Secondary line (Chemistry) */}
                <path d="M 0 120 Q 100 90 200 70 T 400 60 T 500 45" fill="transparent" stroke="#00D4AA" strokeWidth="3" strokeDasharray="5" />
              </svg>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#626280', marginTop: '10px' }}>
              <span>Week 1</span>
              <span>Week 2</span>
              <span>Week 3</span>
              <span>Week 4 (Current)</span>
            </div>
          </div>

          {/* Chapter Mastery heatmaps */}
          <div className="glass-panel" style={{ padding: '30px', borderRadius: '20px' }}>
            <h3 style={{ color: 'white', fontSize: '1.05rem', fontWeight: 'bold', marginBottom: '20px' }}>Chapter mastery heatmap</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }} className="catalog-grid-mobile">
              {heatmapData.map((cell, idx) => (
                <div 
                  key={idx} 
                  style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    padding: '12px',
                    borderRadius: '10px',
                    borderLeft: `4px solid ${cell.level === 'high' ? '#00D4AA' : cell.level === 'medium' ? '#FFB347' : '#FF6B6B'}`
                  }}
                >
                  <h4 style={{ color: 'white', fontSize: '0.85rem' }}>{cell.chapter}</h4>
                  <span style={{ fontSize: '0.7rem', color: '#A0A0C0' }}>{cell.date}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right: Subject Radials + AI Insights */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          
          {/* Radial grids */}
          <div className="glass-panel" style={{ padding: '30px', borderRadius: '20px' }}>
            <h3 style={{ color: 'white', fontSize: '1.05rem', fontWeight: 'bold', marginBottom: '20px' }}>Syllabus indicators</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              {subjectScores.map((sub, i) => (
                <div key={i} style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <div style={{ position: 'relative', width: '70px', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg style={{ transform: 'rotate(-90deg)', width: '70px', height: '70px' }}>
                      <circle cx="35" cy="35" r="28" stroke="rgba(255,255,255,0.04)" strokeWidth="6" fill="transparent" />
                      <circle cx="35" cy="35" r="28" stroke={sub.color} strokeWidth="6" fill="transparent" 
                        strokeDasharray="175" strokeDashoffset={175 - (175 * sub.percent) / 100} />
                    </svg>
                    <span style={{ position: 'absolute', fontSize: '0.85rem', fontWeight: 'bold', color: 'white' }}>{sub.percent}%</span>
                  </div>
                  <h4 style={{ fontSize: '0.85rem', color: 'white' }}>{sub.subject}</h4>
                  <span style={{ fontSize: '0.7rem', color: '#626280' }}>{sub.mastered}/{sub.total} Chapters mastered</span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Rank Predictor & Strategy Coach */}
          <div className="glass-panel" style={{
            padding: '24px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, rgba(108, 99, 255, 0.12) 0%, rgba(26, 26, 53, 0.6) 100%)',
            border: '1px solid rgba(108, 99, 255, 0.2)'
          }}>
            <h4 style={{ color: 'white', fontSize: '0.95rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '14px' }}>
              <TrendingUp size={16} style={{ color: prediction.color }} /> AI Rank Predictor
            </h4>
            
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', marginBottom: '16px' }}>
              <div>
                <p style={{ color: '#A0A0C0', fontSize: '0.75rem', marginBottom: '4px' }}>{prediction.type}</p>
                <h2 style={{ color: prediction.color, fontSize: '1.8rem', fontWeight: '800', lineHeight: '1' }}>{prediction.value}</h2>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '6px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <span style={{ color: 'white', fontSize: '0.85rem', fontWeight: 'bold' }}>{prediction.rank}</span>
              </div>
            </div>

            <h4 style={{ color: 'white', fontSize: '0.85rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px', marginTop: '24px' }}>
              <Brain size={16} style={{ color: '#FFB347' }} /> Strategy Coach Pointers
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.8rem', color: '#A0A0C0', lineHeight: '1.4' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span style={{ color: '#00D4AA' }}>📈</span>
                <p>Your {activeCourse.includes('JEE') ? 'Physics' : 'Biology'} accuracy is high, but your time per question is 3m 40s. Reduce this to 2m to boost your projected score by +12 marks.</p>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span style={{ color: '#FF6B6B' }}>⚠️</span>
                <p>Thermodynamics needs fundamental review — only 34% accuracy in last 5 drills.</p>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span style={{ color: '#FFB347' }}>⏱</span>
                <p>You study best on Wednesday evenings — tough concepts are automatically scheduled then.</p>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
