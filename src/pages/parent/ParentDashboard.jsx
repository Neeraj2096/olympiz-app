import React, { useState } from 'react';
import { 
  Home, BarChart3, Brain, Award, ShieldAlert, Clock, Send, 
  Calendar, User, LogOut, Flame, Sparkles, TrendingUp, CheckCircle2, MessageSquare, Bell,
  AlertCircle, Video
} from 'lucide-react';

export default function ParentDashboard({ 
  user, logout, navigate,
  testHistory = [], weakTopics = [], notesList = [], parentUpdate
}) {
  const [subPage, setSubPage] = useState('home'); // 'home' | 'analytics' | 'tutor-feed' | 'goals'
  const [activeMetricModal, setActiveMetricModal] = useState(null); // null | 'xp' | 'hours' | 'streak' | 'tests'
  const [encouragementSent, setEncouragementSent] = useState(false);
  const [encouragementText, setEncouragementText] = useState('Keep up the amazing work! So proud of your streak! 🔥');

  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);
  const [notifications] = useState([
    { text: "📊 Progress Weekly Report: Your child has completed 3 Mock CBT Tests.", time: "1 hour ago", targetPage: "analytics" },
    { text: "🚨 Risk Warning: Child is lagging behind in Thermodynamics (Avg: 38%).", time: "3 hours ago", targetPage: "analytics" },
    { text: "⭐ Teacher Remarks: Child is performing exceptionally well in Calculus.", time: "1 day ago", targetPage: "tutor-feed" }
  ]);

  const handleNotificationClick = (item) => {
    if (item.targetPage) {
      setSubPage(item.targetPage);
    }
    setShowNotifications(false);
  };
  
  // Custom goal state
  const [weeklyGoal, setWeeklyGoal] = useState({ xp: 600, tests: 3 });
  const [newXpGoal, setNewXpGoal] = useState('600');
  const [newTestsGoal, setNewTestsGoal] = useState('3');
  const [isEditingGoal, setIsEditingGoal] = useState(false);

  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good morning' : currentHour < 17 ? 'Good afternoon' : 'Good evening';

  // Simulating child data (Arjun Kumar)
  const child = {
    name: 'Arjun Kumar',
    grade: 'Class 11',
    streak: 14,
    xp: 450,
    testsTaken: 6,
    studyHours: 12
  };

  const handleSendEncouragement = (e) => {
    e.preventDefault();
    setEncouragementSent(true);
    setTimeout(() => setEncouragementSent(false), 4000);
  };

  const handleSaveGoals = (e) => {
    e.preventDefault();
    setWeeklyGoal({
      xp: parseInt(newXpGoal) || 500,
      tests: parseInt(newTestsGoal) || 2
    });
    setIsEditingGoal(false);
  };

  return (
    <div className="grid-sidebar" style={{
      minHeight: '100vh',
      background: '#0D0D1A',
      color: 'white',
      fontFamily: "'Inter', sans-serif"
    }}>

      {/* Left Sidebar */}
      <aside style={{
        background: '#070712',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        padding: '24px 20px 20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100vh',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        overflow: 'hidden'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: '1 1 auto', minHeight: 0, overflowY: 'auto', paddingRight: '4px' }}>
          {/* Logo */}
          <div onClick={() => setSubPage('home')} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <div style={{
              background: 'linear-gradient(135deg, #6C63FF 0%, #00D4AA 100%)',
              borderRadius: '8px',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              color: '#0D0D1A'
            }}>O</div>
            <span style={{ fontSize: '1.25rem', fontWeight: '800' }}>Olympiz<span style={{ color: '#00D4AA' }}>.ai</span></span>
          </div>

          {/* Parent Tag */}
          <div style={{
            background: 'rgba(0, 212, 170, 0.05)',
            border: '1px solid rgba(0, 212, 170, 0.15)',
            borderRadius: '12px',
            padding: '12px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{ fontSize: '1.1rem' }}>👨‍👩‍👦</span>
            <div>
              <h4 style={{ fontSize: '0.8rem', color: '#00D4AA', fontWeight: '700' }}>Parent Portal</h4>
              <span style={{ fontSize: '0.7rem', color: '#A0A0C0' }}>Monitoring: {child.name}</span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {[
              { id: 'home', label: 'Parent Dashboard', icon: <Home size={18} /> },
              { id: 'classes', label: "Child's Attendance", icon: <Calendar size={18} />, badge: '1 MISSED' },
              { id: 'analytics', label: 'Detailed Analytics', icon: <BarChart3 size={18} /> },
              { id: 'tutor-feed', label: 'AI Tutor Feed', icon: <MessageSquare size={18} />, badge: 'LIVE' },
              { id: 'goals', label: 'Set Weekly Goals', icon: <Award size={18} /> }
            ].map(item => {
              const active = subPage === item.id;
              return (
                <div 
                  key={item.id}
                  onClick={() => setSubPage(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    background: active ? 'rgba(108, 99, 255, 0.1)' : 'transparent',
                    color: active ? 'white' : '#A0A0C0',
                    fontWeight: active ? '600' : '500',
                    fontSize: '0.9rem',
                    transition: 'all 0.15s'
                  }}
                  onMouseEnter={e => !active && (e.currentTarget.style.color = 'white')}
                  onMouseLeave={e => !active && (e.currentTarget.style.color = '#A0A0C0')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span style={{ fontSize: '0.6rem', background: '#FF6B6B', color: 'white', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>
                      {item.badge}
                    </span>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Bottom Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flexShrink: 0, paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          {/* Quick role switcher to let user review Student dashboard */}
          <button 
            onClick={() => navigate('dashboard-student')}
            className="btn btn-secondary" 
            style={{ width: '100%', padding: '8px', fontSize: '0.75rem', border: '1px dashed rgba(255,255,255,0.1)' }}
          >
            🎓 Switch to Student
          </button>

          {/* Logout */}
          <button 
            onClick={logout}
            className="btn btn-ghost" 
            style={{ width: '100%', justifyContent: 'flex-start', padding: '10px 14px', fontSize: '0.9rem' }}
          >
            <LogOut size={18} style={{ marginRight: '10px' }} /> Log Out
          </button>
        </div>
      </aside>

      {/* Main Content Pane */}
       <main style={{
        padding: '40px 5vw 80px',
        overflowY: 'auto',
        height: '100vh',
        minHeight: 0
      }}>
        {/* Header Notification Icon */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px', position: 'relative', zIndex: 100 }}>
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="btn btn-secondary btn-pill" 
              style={{ padding: '8px 14px', display: 'flex', alignItems: 'center', gap: '8px', position: 'relative' }}
            >
              <Bell size={16} />
              {unreadCount > 0 && (
                <span style={{ position: 'absolute', top: '-2px', right: '-2px', background: '#FF6B6B', width: '8px', height: '8px', borderRadius: '50%' }}></span>
              )}
            </button>

            {showNotifications && (
              <div className="glass-panel fade-in" style={{
                position: 'absolute',
                top: '40px',
                right: 0,
                width: '320px',
                padding: '16px',
                borderRadius: '16px',
                zIndex: 9999,
                background: 'linear-gradient(135deg, #13132B 0%, #070712 100%)',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                textAlign: 'left'
              }}>
                <h4 style={{ color: 'white', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: 0 }}>
                  <span>Notifications</span>
                  <button 
                    onClick={() => { setUnreadCount(0); }} 
                    style={{ background: 'transparent', border: 'none', color: '#00D4AA', fontSize: '0.7rem', cursor: 'pointer' }}
                  >
                    Mark all read
                  </button>
                </h4>
                <hr style={{ border: '0', borderTop: '1px solid rgba(255,255,255,0.06)', margin: '8px 0 12px 0' }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '240px', overflowY: 'auto' }}>
                  {notifications.map((n, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => handleNotificationClick(n)}
                      style={{ 
                        padding: '10px', 
                        background: 'rgba(255,255,255,0.02)', 
                        borderRadius: '8px', 
                        border: '1px solid rgba(255,255,255,0.04)', 
                        fontSize: '0.78rem',
                        cursor: 'pointer',
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                    >
                      <p style={{ color: 'white', margin: '0 0 4px 0', lineHeight: '1.3' }}>{n.text}</p>
                      <span style={{ fontSize: '0.65rem', color: '#626280' }}>{n.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }} className="catalog-grid-mobile">
          <div>
            <span className="badge badge-gradient" style={{ marginBottom: '8px', display: 'inline-block' }}>
              Parent Control Center
            </span>
            <h1 style={{ color: 'white', fontSize: '2rem', fontWeight: '800' }}>
              {greeting}, {user.name.split(' ')[0]}! 🌟
            </h1>
            <p style={{ color: '#A0A0C0', fontSize: '0.95rem', marginTop: '4px' }}>
              Here is the live academic status and learning analysis of your child, **{child.name}**.
            </p>
          </div>
        </div>

        {/* --- Home Page sub view --- */}
        {subPage === 'home' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }} className="fade-in">
            
            {/* Missed Class Warning Alert */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(255, 107, 107, 0.12) 0%, rgba(20, 20, 40, 0.8) 100%)',
              border: '1px solid rgba(255, 107, 107, 0.3)',
              padding: '16px 24px',
              borderRadius: '16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '1.5rem' }}>🚨</span>
                <div>
                  <h4 style={{ color: '#FF6B6B', fontSize: '0.95rem', fontWeight: 'bold', margin: 0 }}>Attendance Alert: Missed Class detected</h4>
                  <p style={{ color: '#A0A0C0', fontSize: '0.82rem', margin: '4px 0 0 0' }}>
                    Arjun missed the chemistry lecture on <strong>E1 vs E2 Elimination Mechanisms</strong> (Friday, June 5 at 02:00 PM).
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSubPage('classes')}
                className="btn btn-secondary" 
                style={{ padding: '8px 16px', fontSize: '0.8rem', color: '#FF6B6B', borderColor: 'rgba(255,107,107,0.3)' }}
              >
                Resolve Attendance Gaps
              </button>
            </div>

            {/* Child Snapshots Grid */}
            <div className="grid-5" style={{ gap: '20px' }}>
              {[
                { id: 'xp', label: "Child's Level & XP", value: `${child.xp} / ${weeklyGoal.xp} XP`, progress: (child.xp / weeklyGoal.xp) * 100, color: '#6C63FF', icon: <Sparkles size={20} style={{ color: '#6C63FF' }} /> },
                { id: 'hours', label: 'Weekly Study Hours', value: `${child.studyHours} hrs`, progress: 85, color: '#00D4AA', icon: <Clock size={20} style={{ color: '#00D4AA' }} /> },
                { id: 'classes', label: 'Classes Completed', value: '4 completed', progress: 80, color: '#05D580', icon: <Calendar size={20} style={{ color: '#05D580' }} /> },
                { id: 'streak', label: 'Current Streak', value: `${child.streak} Days`, progress: 100, color: '#FFB347', icon: <Flame size={20} style={{ color: '#FFB347' }} /> },
                { id: 'tests', label: 'Tests Completed', value: `${child.testsTaken} / ${weeklyGoal.tests}`, progress: (child.testsTaken / weeklyGoal.tests) * 100, color: '#FF6B6B', icon: <CheckCircle2 size={20} style={{ color: '#FF6B6B' }} /> }
              ].map((card, i) => (
                <div 
                  key={i} 
                  className="glass-panel" 
                  onClick={() => setActiveMetricModal(card.id)}
                  style={{ 
                    padding: '20px', 
                    borderRadius: '16px', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'space-between', 
                    minHeight: '140px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    border: '1px solid rgba(255,255,255,0.06)'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = `0 8px 24px rgba(108, 99, 255, 0.15)`;
                    e.currentTarget.style.borderColor = card.color;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.75rem', color: '#A0A0C0', fontWeight: '500' }}>{card.label}</span>
                      {card.icon}
                    </div>
                    <p style={{ fontSize: '1.4rem', fontWeight: '800', color: 'white', margin: '4px 0' }}>{card.value}</p>
                  </div>
                  <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', marginTop: '10px' }}>
                    <div style={{ width: `${Math.min(100, card.progress)}%`, height: '100%', background: card.color, borderRadius: '2px' }}></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Performance Overview & Weak Topics Alert */}
            <div className="grid-split-reverse" style={{ gap: '24px' }}>
              
              {/* Analytics preview card */}
              <div className="glass-panel" style={{ padding: '30px', borderRadius: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ color: 'white', marginBottom: '12px', fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <TrendingUp size={20} style={{ color: '#00D4AA' }} /> {parentUpdate ? "AI Session Update" : "Child's Academic Trend"}
                  </h3>
                  {parentUpdate && (
                    <span style={{ fontSize: '0.7rem', color: '#00D4AA', background: 'rgba(0,212,170,0.1)', padding: '2px 8px', borderRadius: '8px', display: 'inline-block', marginBottom: '12px' }}>
                      New Report from Educator
                    </span>
                  )}
                  <p style={{ color: '#A0A0C0', fontSize: '0.85rem', lineHeight: '1.6', marginBottom: '16px' }}>
                    {parentUpdate ? parentUpdate : `Arjun has shown an increase in activity this week, completing **${child.testsTaken} practice tests** and maintaining a healthy **${child.streak} day streak**. His average correctness across subjects is **81%**.`}
                  </p>
                  <div style={{ display: 'flex', gap: '20px', margin: '10px 0' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: '#A0A0C0' }}>Strength</span>
                      <h4 style={{ color: '#00D4AA', fontSize: '1.1rem', fontWeight: 'bold' }}>Physics (84%)</h4>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: '#A0A0C0' }}>Consistency</span>
                      <h4 style={{ color: '#6C63FF', fontSize: '1.1rem', fontWeight: 'bold' }}>Very High</h4>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setSubPage('analytics')}
                  className="btn btn-primary btn-glow btn-pill" 
                  style={{ width: 'fit-content', padding: '10px 22px', fontSize: '0.85rem', marginTop: '16px' }}
                >
                  View Performance Analytics
                </button>
              </div>

              {/* Weak Topics / Areas needing revision */}
              <div 
                className="glass-panel" 
                style={{ 
                  padding: '30px', 
                  borderRadius: '20px', 
                  background: 'linear-gradient(135deg, rgba(255, 107, 107, 0.08) 0%, rgba(20, 20, 40, 0.8) 100%)',
                  border: '1px solid rgba(255, 107, 107, 0.25)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <h4 style={{ color: '#FF6B6B', fontSize: '0.95rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                    <ShieldAlert size={16} /> Child's Syllabus Gaps
                  </h4>
                  <p style={{ color: '#A0A0C0', fontSize: '0.75rem', marginBottom: '12px' }}>
                    Our AI has identified the following concepts where Arjun requires revision or practice:
                  </p>
                  <ul style={{ color: 'white', fontSize: '0.8rem', paddingLeft: '14px', lineHeight: '1.6', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {weakTopics.length > 0 ? (
                      weakTopics.map((topic, i) => <li key={i}>{topic}</li>)
                    ) : (
                      <>
                        <li>Thermodynamics (Physics) - 34% Accuracy</li>
                        <li>Organic Halides (Chemistry) - 45% Accuracy</li>
                        <li>Probability (Maths) - 52% Accuracy</li>
                      </>
                    )}
                  </ul>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#A0A0C0', marginTop: '16px' }}>
                  💡 Auto-assigned revision cards have been delivered to his home screen.
                </div>
              </div>

            </div>

            {/* Parent Intervention / Encouragement Panel */}
            <div className="grid-split-reverse" style={{ gap: '24px' }}>
              
              {/* Send Encouragement Card */}
              <div className="glass-panel" style={{ padding: '24px', borderRadius: '18px' }}>
                <h3 style={{ color: 'white', fontSize: '1rem', fontWeight: 'bold', marginBottom: '12px' }}>
                  Send Study Motivation
                </h3>
                <p style={{ color: '#A0A0C0', fontSize: '0.8rem', marginBottom: '16px' }}>
                  Send a notification to Arjun's student dashboard to motivate him.
                </p>
                <form onSubmit={handleSendEncouragement} style={{ display: 'flex', gap: '10px' }}>
                  <input 
                    type="text" 
                    value={encouragementText}
                    onChange={(e) => setEncouragementText(e.target.value)}
                    placeholder="Type words of encouragement..."
                    className="form-input"
                    style={{ flex: 1, background: '#0D0D1A', border: '1px solid rgba(255, 255, 255, 0.1)' }}
                  />
                  <button type="submit" className="btn btn-primary btn-glow" style={{ padding: '10px 16px' }}>
                    <Send size={16} />
                  </button>
                </form>
                {encouragementSent && (
                  <div style={{ color: '#00D4AA', fontSize: '0.8rem', marginTop: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={14} /> Motivation sent successfully to Arjun!
                  </div>
                )}
              </div>

              {/* AI Doubts Solver Activity Logs */}
              <div className="glass-panel" style={{ padding: '24px', borderRadius: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ color: 'white', fontSize: '1rem', fontWeight: 'bold', marginBottom: '12px' }}>
                    AI Tutor Doubts Activity
                  </h3>
                  <p style={{ color: '#A0A0C0', fontSize: '0.8rem', marginBottom: '12px' }}>
                    See recent conceptual questions Arjun asked the AI Tutor:
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {[
                      { q: "Newton's 3rd Law boat example", subject: "Physics", time: 'Yesterday' },
                      { q: "SN2 inversion mechanism sterics", subject: "Chemistry", time: '2 days ago' }
                    ].map((chat, i) => (
                      <div key={i} style={{
                        padding: '8px 12px',
                        background: 'rgba(255,255,255,0.02)',
                        borderRadius: '8px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '0.75rem'
                      }}>
                        <span style={{ color: 'white' }}>"{chat.q}"</span>
                        <span className="badge badge-gradient" style={{ fontSize: '0.65rem' }}>{chat.subject}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <button 
                  onClick={() => setSubPage('tutor-feed')}
                  className="btn btn-secondary" 
                  style={{ width: '100%', fontSize: '0.75rem', marginTop: '16px' }}
                >
                  View All Questions
                </button>
              </div>

            </div>

          </div>
        )}

        {/* --- Attendance & Live Classes sub view --- */}
        {subPage === 'classes' && (
          <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <button onClick={() => setSubPage('home')} className="btn btn-ghost" style={{ marginBottom: '10px', width: 'fit-content' }}>← Back to Dashboard</button>
            
            {/* Header statistics */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(108, 99, 255, 0.15) 0%, rgba(255, 107, 107, 0.05) 100%)',
              border: '1px solid rgba(108, 99, 255, 0.25)',
              borderRadius: '24px',
              padding: '30px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '20px'
            }} className="catalog-grid-mobile">
              <div>
                <h2 style={{ color: 'white', fontSize: '1.5rem', fontWeight: '800', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Calendar style={{ color: '#FFB347' }} /> Attendance & Schedule Tracker
                </h2>
                <p style={{ color: '#A0A0C0', fontSize: '0.9rem', maxWidth: '500px' }}>
                  Monitor Arjun's live lecture attendance, upcoming schedules, and review recordings for missed sessions.
                </p>
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div className="glass-panel" style={{ padding: '12px 20px', borderRadius: '16px', textAlign: 'center', minWidth: '100px' }}>
                  <span style={{ fontSize: '0.75rem', color: '#A0A0C0', display: 'block' }}>Lectures Attended</span>
                  <span style={{ fontSize: '1.5rem', fontWeight: '800', color: '#00D4AA' }}>4</span>
                </div>
                <div className="glass-panel" style={{ padding: '12px 20px', borderRadius: '16px', textAlign: 'center', minWidth: '100px', border: '1px solid rgba(255, 107, 107, 0.25)' }}>
                  <span style={{ fontSize: '0.75rem', color: '#A0A0C0', display: 'block' }}>Missed Lectures</span>
                  <span style={{ fontSize: '1.5rem', fontWeight: '800', color: '#FF6B6B' }}>1</span>
                </div>
                <div className="glass-panel" style={{ padding: '12px 20px', borderRadius: '16px', textAlign: 'center', minWidth: '100px' }}>
                  <span style={{ fontSize: '0.75rem', color: '#A0A0C0', display: 'block' }}>Upcoming Classes</span>
                  <span style={{ fontSize: '1.5rem', fontWeight: '800', color: '#6C63FF' }}>3</span>
                </div>
              </div>
            </div>

            {/* Attendance Alert if any missed classes */}
            <div className="glass-panel" style={{
              padding: '24px',
              borderRadius: '18px',
              borderLeft: '4px solid #FF6B6B',
              background: 'rgba(255, 107, 107, 0.03)'
            }}>
              <h4 style={{ color: '#FF6B6B', fontSize: '0.95rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <AlertCircle size={16} /> Urgent Intervention Required
              </h4>
              <p style={{ color: '#A0A0C0', fontSize: '0.85rem', lineHeight: '1.5', margin: '0 0 16px 0' }}>
                Arjun did not attend the Chemistry class on <strong>E1 vs E2 Elimination Mechanisms</strong> (Friday, June 5, 2026). The class is critical for JEE/NEET organic foundations.
              </p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={() => alert("Callback request sent! Mentor will contact you within 2 hours.")} className="btn btn-primary btn-glow" style={{ padding: '8px 16px', fontSize: '0.8rem', color: '#0D0D1A' }}>
                  📞 Request Callback from Mentor
                </button>
                <button onClick={() => alert("Recording stream opened...")} className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>
                  📹 Review Recording with Child
                </button>
              </div>
            </div>

            {/* Visual list grids */}
            <div className="grid-2" style={{ gap: '24px' }}>
              
              {/* Upcoming Classes */}
              <div className="glass-panel" style={{ padding: '24px', borderRadius: '18px' }}>
                <h3 style={{ color: 'white', fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock size={18} style={{ color: '#6C63FF' }} /> Upcoming Class Schedule
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[
                    { subject: 'Physics', topic: 'Kinetic Theory of Gases (KTG)', instructor: 'Dr. R.K. Verma', time: 'Monday, June 8 · 10:00 AM' },
                    { subject: 'Chemistry', topic: 'Aromatic Compounds & Electrophilic Sub', instructor: 'Prof. Alok Gupta', time: 'Tuesday, June 9 · 11:30 AM' },
                    { subject: 'Mathematics', topic: 'Differential Equations - First Order', instructor: 'Sanjay Kumar', time: 'Wednesday, June 10 · 09:00 AM' }
                  ].map((cls, i) => (
                    <div key={i} style={{
                      padding: '14px',
                      background: 'rgba(255,255,255,0.01)',
                      border: '1px solid rgba(255,255,255,0.04)',
                      borderRadius: '10px',
                      fontSize: '0.8rem'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span style={{
                          fontSize: '0.7rem',
                          fontWeight: 'bold',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          background: cls.subject === 'Physics' ? 'rgba(108, 99, 255, 0.12)' : cls.subject === 'Chemistry' ? 'rgba(0, 212, 170, 0.12)' : 'rgba(255, 179, 71, 0.12)',
                          color: cls.subject === 'Physics' ? '#B88EFC' : cls.subject === 'Chemistry' ? '#00D4AA' : '#FFB347'
                        }}>{cls.subject}</span>
                        <span style={{ fontSize: '0.72rem', color: '#A0A0C0' }}>{cls.time}</span>
                      </div>
                      <h4 style={{ color: 'white', margin: '4px 0', fontSize: '0.9rem', fontWeight: 'bold' }}>{cls.topic}</h4>
                      <span style={{ fontSize: '0.75rem', color: '#626280' }}>Taught by: {cls.instructor}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Completed Classes log */}
              <div className="glass-panel" style={{ padding: '24px', borderRadius: '18px' }}>
                <h3 style={{ color: 'white', fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={18} style={{ color: '#00D4AA' }} /> Attendance Logs (Past Lectures)
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[
                    { subject: 'Physics', topic: 'Calorimetry & Phase Diagrams', time: 'Friday, June 5 · 10:00 AM', status: 'Attended' },
                    { subject: 'Mathematics', topic: 'Definite Integrals & Areas', time: 'Thursday, June 4 · 09:00 AM', status: 'Attended' },
                    { subject: 'Chemistry', topic: 'Alkyl Halides & SN2 Reaction', time: 'Wednesday, June 3 · 11:30 AM', status: 'Attended' },
                    { subject: 'Physics', topic: 'Thermodynamics & Carnot Engine', time: 'Tuesday, June 2 · 10:00 AM', status: 'Attended' }
                  ].map((cls, i) => (
                    <div key={i} style={{
                      padding: '12px 14px',
                      background: 'rgba(255,255,255,0.01)',
                      border: '1px solid rgba(255,255,255,0.04)',
                      borderRadius: '10px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '0.8rem'
                    }}>
                      <div>
                        <h4 style={{ color: 'white', fontWeight: '600', margin: 0 }}>{cls.topic}</h4>
                        <span style={{ fontSize: '0.72rem', color: '#A0A0C0' }}>{cls.time}</span>
                      </div>
                      <span style={{ color: '#00D4AA', fontWeight: 'bold', fontSize: '0.75rem' }}>Attended ✓</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* --- Detailed Analytics sub view --- */}
        {subPage === 'analytics' && (
          <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <h2 style={{ color: 'white', fontSize: '1.4rem', fontWeight: '700' }}>Child Performance Analysis</h2>
            
            {/* Test History List */}
            <div className="glass-panel" style={{ padding: '24px', borderRadius: '18px' }}>
              <h3 style={{ color: 'white', fontSize: '1rem', fontWeight: 'bold', marginBottom: '16px' }}>Mock Test History</h3>
              {testHistory.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {testHistory.map((test, i) => (
                    <div key={i} style={{
                      padding: '16px',
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.05)',
                      borderRadius: '12px',
                      display: 'grid',
                      gridTemplateColumns: '2fr 1fr 1fr 1fr',
                      alignItems: 'center',
                      gap: '10px'
                    }} className="catalog-grid-mobile">
                      <div>
                        <h4 style={{ color: 'white', fontWeight: '600' }}>{test.title}</h4>
                        <span style={{ fontSize: '0.75rem', color: '#A0A0C0' }}>Attempted: {test.date}</span>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.7rem', color: '#A0A0C0', display: 'block' }}>Score / Total</span>
                        <span style={{ color: 'white', fontWeight: 'bold' }}>{test.score} marks</span>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.7rem', color: '#A0A0C0', display: 'block' }}>Accuracy</span>
                        <span style={{ color: test.percent >= 75 ? '#00D4AA' : '#FFB347', fontWeight: 'bold' }}>{test.percent}%</span>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.7rem', color: '#A0A0C0', display: 'block' }}>Correct/Incorrect</span>
                        <span style={{ color: '#A0A0C0' }}><span style={{ color: '#00D4AA' }}>{test.correct}</span> / <span style={{ color: '#FF6B6B' }}>{test.incorrect}</span></span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: '#A0A0C0', fontSize: '0.85rem' }}>No recent test records found.</p>
              )}
            </div>

            {/* Subject-wise breakdown */}
            <div className="glass-panel" style={{ padding: '24px', borderRadius: '18px' }}>
              <h3 style={{ color: 'white', fontSize: '1rem', fontWeight: 'bold', marginBottom: '16px' }}>Subject Strength Breakdown</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { subject: 'Physics', score: 84, color: '#6C63FF' },
                  { subject: 'Chemistry', score: 79, color: '#00D4AA' },
                  { subject: 'Mathematics', score: 72, color: '#FFB347' }
                ].map((item, i) => (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                      <span style={{ color: 'white', fontWeight: '500' }}>{item.subject}</span>
                      <span style={{ color: item.color, fontWeight: 'bold' }}>{item.score}% Accuracy</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>
                      <div style={{ width: `${item.score}%`, height: '100%', background: item.color, borderRadius: '4px' }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* --- AI Tutor Feed sub view --- */}
        {subPage === 'tutor-feed' && (
          <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <h2 style={{ color: 'white', fontSize: '1.4rem', fontWeight: '700' }}>AI Tutor Doubt Interaction Feed</h2>
            <p style={{ color: '#A0A0C0', fontSize: '0.85rem' }}>
              This live log keeps you updated on what concepts and doubts Arjun is currently asking the AI assistant.
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { 
                  subject: 'Physics', 
                  doubt: "What is a real life scenario for Newton's third law of motion?", 
                  aiResponse: "A classic example is walking: when you walk, you push the ground backward with your foot (Action), and the ground pushes you forward with an equal and opposite force (Reaction).",
                  time: 'Yesterday at 4:32 PM'
                },
                { 
                  subject: 'Chemistry', 
                  doubt: "Why does SN2 inversion happen?", 
                  aiResponse: "In an SN2 mechanism, the nucleophile attacks the electrophilic carbon from the backside (180° away from the leaving group) to avoid steric hindrance and electrostatic repulsion, resulting in spatial inversion.",
                  time: '2 days ago'
                },
                { 
                  subject: 'Mathematics', 
                  doubt: "Formula for probability of independent events", 
                  aiResponse: "For two independent events A and B, the probability of both occurring is the product of their individual probabilities: P(A ∩ B) = P(A) * P(B).",
                  time: '4 days ago'
                }
              ].map((item, i) => (
                <div key={i} className="glass-panel" style={{ padding: '20px', borderRadius: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span className="badge badge-gradient" style={{ fontSize: '0.75rem' }}>{item.subject}</span>
                    <span style={{ fontSize: '0.7rem', color: '#626280' }}>{item.time}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ borderLeft: '2px solid #6C63FF', paddingLeft: '12px' }}>
                      <span style={{ fontSize: '0.7rem', color: '#A0A0C0', display: 'block', textTransform: 'uppercase' }}>Student Doubt:</span>
                      <p style={{ fontSize: '0.85rem', color: 'white', fontWeight: '500', marginTop: '2px' }}>"{item.doubt}"</p>
                    </div>
                    <div style={{ borderLeft: '2px solid #00D4AA', paddingLeft: '12px', background: 'rgba(255,255,255,0.01)', padding: '10px 12px', borderRadius: '6px' }}>
                      <span style={{ fontSize: '0.7rem', color: '#A0A0C0', display: 'block', textTransform: 'uppercase' }}>AI Solution:</span>
                      <p style={{ fontSize: '0.85rem', color: '#E0E0FF', marginTop: '2px', lineHeight: '1.5' }}>{item.aiResponse}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- Set Weekly Goals sub view --- */}
        {subPage === 'goals' && (
          <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <h2 style={{ color: 'white', fontSize: '1.4rem', fontWeight: '700' }}>Configure Weekly Academic Goals</h2>
            
            <div className="glass-panel" style={{ padding: '30px', borderRadius: '20px', maxWidth: '600px' }}>
              <h3 style={{ color: 'white', fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '20px' }}>
                Weekly Goals for Arjun Kumar
              </h3>
              
              {!isEditingGoal ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <div>
                      <h4 style={{ color: 'white', fontSize: '0.95rem', fontWeight: '600' }}>Weekly XP Target</h4>
                      <p style={{ color: '#A0A0C0', fontSize: '0.8rem', marginTop: '2px' }}>XP earned from quizzes and doubts</p>
                    </div>
                    <span style={{ fontSize: '1.2rem', fontWeight: '800', color: '#6C63FF' }}>{weeklyGoal.xp} XP</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <div>
                      <h4 style={{ color: 'white', fontSize: '0.95rem', fontWeight: '600' }}>Mock Tests Target</h4>
                      <p style={{ color: '#A0A0C0', fontSize: '0.8rem', marginTop: '2px' }}>Completing JEE/NEET mini practice tests</p>
                    </div>
                    <span style={{ fontSize: '1.2rem', fontWeight: '800', color: '#00D4AA' }}>{weeklyGoal.tests} Tests</span>
                  </div>

                  <button 
                    onClick={() => {
                      setNewXpGoal(weeklyGoal.xp.toString());
                      setNewTestsGoal(weeklyGoal.tests.toString());
                      setIsEditingGoal(true);
                    }}
                    className="btn btn-primary btn-glow"
                    style={{ width: 'fit-content', marginTop: '10px' }}
                  >
                    Adjust Target Goals
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSaveGoals} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div className="form-group">
                    <label>Weekly XP Target</label>
                    <input 
                      type="number"
                      value={newXpGoal}
                      onChange={(e) => setNewXpGoal(e.target.value)}
                      className="form-input"
                      style={{ background: '#0D0D1A', border: '1px solid rgba(255,255,255,0.1)' }}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Mock Tests Target</label>
                    <input 
                      type="number"
                      value={newTestsGoal}
                      onChange={(e) => setNewTestsGoal(e.target.value)}
                      className="form-input"
                      style={{ background: '#0D0D1A', border: '1px solid rgba(255,255,255,0.1)' }}
                      required
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <button type="submit" className="btn btn-primary btn-glow">Save Goals</button>
                    <button type="button" onClick={() => setIsEditingGoal(false)} className="btn btn-secondary">Cancel</button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

      </main>

      {/* Detailed Analysis Modal */}
      {activeMetricModal && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(7, 7, 18, 0.85)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
            animation: 'fadeIn 0.25s ease-out'
          }}
          onClick={() => setActiveMetricModal(null)}
        >
          <div 
            style={{
              background: 'linear-gradient(135deg, #13132B 0%, #070712 100%)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '24px',
              padding: '30px',
              maxWidth: '520px',
              width: '100%',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
              position: 'relative'
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={() => setActiveMetricModal(null)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#A0A0C0',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.color = '#A0A0C0'; }}
            >
              ✕
            </button>

            {/* Modal Content */}
            {activeMetricModal === 'xp' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <span style={{ fontSize: '1.75rem' }}>✨</span>
                  <div>
                    <h3 style={{ color: 'white', fontSize: '1.25rem', fontWeight: 'bold' }}>Child's Level & XP</h3>
                    <span style={{ fontSize: '0.75rem', color: '#A0A0C0' }}>XP progression toward weekly target</span>
                  </div>
                </div>
                <div style={{ margin: '20px 0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '8px' }}>
                    <span style={{ color: '#A0A0C0' }}>Weekly XP Progress</span>
                    <span style={{ color: '#6C63FF', fontWeight: 'bold' }}>{child.xp} / {weeklyGoal.xp} XP</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>
                    <div style={{ width: `${(child.xp / weeklyGoal.xp) * 100}%`, height: '100%', background: '#6C63FF', borderRadius: '4px' }}></div>
                  </div>
                </div>
                <p style={{ fontSize: '0.8rem', color: '#A0A0C0', lineHeight: '1.5' }}>
                  📈 **XP Breakdown**: Arjun earned **350 XP** from completing mock tests and **100 XP** from AI solver doubt interactions.
                </p>
              </div>
            )}

            {activeMetricModal === 'hours' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <span style={{ fontSize: '1.75rem' }}>⏳</span>
                  <div>
                    <h3 style={{ color: 'white', fontSize: '1.25rem', fontWeight: 'bold' }}>Weekly Study Hours</h3>
                    <span style={{ fontSize: '0.75rem', color: '#A0A0C0' }}>Total active time logged in dashboard</span>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', margin: '20px 0' }}>
                  {[
                    { subject: 'Physics', hours: 5, color: '#6C63FF' },
                    { subject: 'Chemistry', hours: 4, color: '#00D4AA' },
                    { subject: 'Mathematics', hours: 3, color: '#FFB347' }
                  ].map((h, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
                      <span style={{ color: '#A0A0C0' }}>{h.subject}</span>
                      <span style={{ color: h.color, fontWeight: 'bold' }}>{h.hours} hours</span>
                    </div>
                  ))}
                </div>
                <p style={{ fontSize: '0.8rem', color: '#A0A0C0', lineHeight: '1.5' }}>
                  💡 Arjun's active screen time is balanced, averaging **1.7 hours per day**.
                </p>
              </div>
            )}

            {activeMetricModal === 'streak' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <span style={{ fontSize: '1.75rem' }}>🔥</span>
                  <div>
                    <h3 style={{ color: 'white', fontSize: '1.25rem', fontWeight: 'bold' }}>Learning Streak</h3>
                    <span style={{ fontSize: '0.75rem', color: '#A0A0C0' }}>Consistency indicator</span>
                  </div>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'white', marginBottom: '16px' }}>
                  Arjun has maintained a **{child.streak} day streak** by logging in and solving revision cards daily.
                </p>
                <div style={{
                  background: 'rgba(255, 179, 71, 0.05)',
                  border: '1px solid rgba(255, 179, 71, 0.15)',
                  padding: '16px',
                  borderRadius: '12px',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(7, 1fr)',
                  gap: '8px',
                  textAlign: 'center'
                }}>
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
                    <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.65rem', color: '#A0A0C0' }}>{day}</span>
                      <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: idx < 6 ? '#FFB347' : 'rgba(255,255,255,0.03)',
                        border: idx < 6 ? 'none' : '1px solid rgba(255,255,255,0.08)',
                        color: idx < 6 ? '#0D0D1A' : '#626280',
                        fontSize: '0.7rem',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {idx < 6 ? '✓' : ''}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

             {activeMetricModal === 'tests' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <span style={{ fontSize: '1.75rem' }}>📝</span>
                  <div>
                    <h3 style={{ color: 'white', fontSize: '1.25rem', fontWeight: 'bold' }}>Tests Completed</h3>
                    <span style={{ fontSize: '0.75rem', color: '#A0A0C0' }}>Weekly target completion</span>
                  </div>
                </div>
                <div style={{ margin: '20px 0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '8px' }}>
                    <span style={{ color: '#A0A0C0' }}>Tests Submitted</span>
                    <span style={{ color: '#FF6B6B', fontWeight: 'bold' }}>{child.testsTaken} / {weeklyGoal.tests}</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>
                    <div style={{ width: `${Math.min(100, (child.testsTaken / weeklyGoal.tests) * 100)}%`, height: '100%', background: '#FF6B6B', borderRadius: '4px' }}></div>
                  </div>
                </div>
                <p style={{ fontSize: '0.8rem', color: '#A0A0C0', lineHeight: '1.5' }}>
                  🎯 Arjun exceeded his goal by completing **{child.testsTaken} mock tests** this week instead of the target {weeklyGoal.tests}!
                </p>
              </div>
            )}

            {activeMetricModal === 'classes' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <span style={{ fontSize: '1.75rem' }}>📅</span>
                  <div>
                    <h3 style={{ color: 'white', fontSize: '1.25rem', fontWeight: 'bold' }}>Classes & Attendance Summary</h3>
                    <span style={{ fontSize: '0.75rem', color: '#A0A0C0' }}>Child's weekly class participation log</span>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', margin: '20px 0' }}>
                  {[
                    { topic: 'Thermodynamics & Carnot Engine', status: 'Attended ✓', color: '#00D4AA' },
                    { topic: 'Alkyl Halides & SN2 Reaction', status: 'Attended ✓', color: '#00D4AA' },
                    { topic: 'Definite Integrals & Areas', status: 'Attended ✓', color: '#00D4AA' },
                    { topic: 'Calorimetry & Phase Diagrams', status: 'Attended ✓', color: '#00D4AA' },
                    { topic: 'E1 vs E2 Elimination Mechanisms', status: 'Missed 🚨', color: '#FF6B6B' }
                  ].map((cls, idx) => (
                    <div key={idx} style={{
                      padding: '10px 14px',
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.05)',
                      borderRadius: '10px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '0.8rem'
                    }}>
                      <span style={{ color: 'white', fontWeight: '600' }}>{cls.topic}</span>
                      <span style={{ color: cls.color, fontWeight: 'bold', fontSize: '0.75rem' }}>{cls.status}</span>
                    </div>
                  ))}
                </div>
                <p style={{ fontSize: '0.8rem', color: '#A0A0C0', lineHeight: '1.5' }}>
                  🎓 Attendance Rating: **80%**. Clean participation log except for **1 missed class** on Friday.
                </p>
              </div>
            )}

            {/* Modal Footer */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '20px', marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => setActiveMetricModal(null)}
                className="btn btn-primary"
                style={{ padding: '8px 20px', fontSize: '0.8rem' }}
              >
                Close Analysis
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
