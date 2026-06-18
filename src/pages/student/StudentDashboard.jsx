import React, { useState } from 'react';
import { 
  Home, MessageSquare, ClipboardCheck, Notebook, Sun, 
  BarChart3, Trophy, Flame, LogOut, Sparkles, BookOpen, Clock,
  ArrowRight, Brain, AlertTriangle, Users, Bell, Calendar
} from 'lucide-react';

// Sub Page Imports
import AskAI from './AskAI';
import MockTests from './MockTests';
import DailyQuestions from './DailyQuestions';
import SmartNotes from './SmartNotes';
import Progress from './Progress';
import Leaderboard from './Leaderboard';
import StudentClasses from './StudentClasses';

export default function StudentDashboard({ 
  user, logout, navigate, 
  notesList, addNote, deleteNote, 
  testHistory, addTestAttempt,
  weakTopics, earnXP, deductXP, updateUserData,
  activeCourse, setActiveCourse, sessionDiagnosis
}) {
  const [subPage, setSubPage] = useState('home'); // 'home' | 'ai-chat' | 'mock-tests' | 'daily-questions' | 'notes' | 'progress' | 'leaderboard'
  const [activeMetricModal, setActiveMetricModal] = useState(null); // null | 'accuracy' | 'streak' | 'tests' | 'doubts'
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);
  const [notifications] = useState([
    { text: "⚡ Surprise Test: Physics Thermodynamics Quiz launched by Mentor!", time: "10 mins ago", targetPage: "mock-tests" },
    { text: "📝 Assignment Graded: Thermodynamics Calorimetry Sheet (Score: 84%)", time: "2 hours ago", targetPage: "progress" },
    { text: "🎉 Streak Maintained: You are on a 14-day study streak!", time: "1 day ago", targetPage: "progress" }
  ]);

  const handleNotificationClick = (item) => {
    if (item.targetPage) {
      setSubPage(item.targetPage);
    }
    setShowNotifications(false);
  };

  // Preloaded dynamic snapshots
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good morning' : currentHour < 17 ? 'Good afternoon' : 'Good evening';

  // Live progress heat cell trigger
  const heatmapData = [
    { name: 'Kinetics', solved: 40, status: 'high', subject: 'Chemistry' },
    { name: 'Rotational', solved: 20, status: 'medium', subject: 'Physics' },
    { name: 'Thermodynamics', solved: 5, status: 'low', subject: 'Physics' },
    { name: 'Equilibrium', solved: 30, status: 'high', subject: 'Chemistry' },
    { name: 'Calculus', solved: 50, status: 'high', subject: 'Maths' },
    { name: 'Matrix', solved: 15, status: 'medium', subject: 'Maths' },
    { name: 'Genetics', solved: 30, status: 'high', subject: 'Biology' },
    { name: 'Cell Cycle', solved: 10, status: 'low', subject: 'Biology' }
  ].filter(topic => {
    if (activeCourse.includes('JEE') && topic.subject === 'Biology') return false;
    if (activeCourse.includes('NEET') && topic.subject === 'Maths') return false;
    return true;
  });

  const filteredWeakTopics = weakTopics.filter(topic => {
    if (activeCourse.includes('JEE') && topic.includes('Biology')) return false;
    if (activeCourse.includes('NEET') && topic.includes('Maths')) return false;
    return true;
  });

  return (
    <div className="grid-sidebar" style={{
      minHeight: '100vh',
      background: '#0D0D1A',
      color: 'white',
      fontFamily: "'Inter', sans-serif"
    }}>

      {/* 1. Left Sidebar */}
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
        {/* Top brand */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: '1 1 auto', minHeight: 0, overflowY: 'auto', paddingRight: '4px' }}>
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

          {/* User profile details in sidebar */}
          <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '16px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'var(--primary-color)',
                color: '#0D0D1A',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.85rem'
              }}>{user.name ? user.name[0].toUpperCase() : 'U'}</div>
              <div>
                <h4 style={{ fontSize: '0.85rem', color: 'white' }}>{user.name.split(' ')[0]}</h4>
                <span style={{ fontSize: '0.7rem', color: '#A0A0C0' }}>{user.details?.studentGrade || 'Class 11'}</span>
              </div>
            </div>
            {/* XP bar */}
            <div style={{ marginTop: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', marginBottom: '4px', color: '#A0A0C0' }}>
                <span>Level 4</span>
                <span>{user.xp} / 500 XP</span>
              </div>
              <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px' }}>
                <div style={{ width: `${(user.xp / 500) * 100}%`, height: '100%', background: 'var(--primary-color)', borderRadius: '2px' }}></div>
              </div>
            </div>
          </div>

          {/* Course Switcher */}
          {user?.details?.targetExams?.length > 1 && (
            <div style={{ padding: '0 4px', marginBottom: '10px' }}>
              <label style={{ fontSize: '0.7rem', color: '#A0A0C0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Active Course</label>
              <select 
                value={activeCourse} 
                onChange={e => setActiveCourse(e.target.value)}
                style={{ 
                  width: '100%', padding: '8px 12px', background: 'rgba(255,255,255,0.03)', 
                  border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', 
                  color: 'white', fontSize: '0.85rem', marginTop: '4px', outline: 'none' 
                }}
              >
                {user.details.targetExams.map(exam => (
                  <option key={exam} value={exam} style={{ background: '#0D0D1A' }}>{exam}</option>
                ))}
              </select>
            </div>
          )}

          {/* Sidebar Nav Items */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {[
              { id: 'home', label: 'Home', icon: <Home size={18} /> },
              { id: 'ai-chat', label: 'Ask AI', icon: <MessageSquare size={18} />, badge: 'NEW' },
              { id: 'classes', label: 'My Classes', icon: <Calendar size={18} />, badge: 'LIVE' },
              { id: 'mock-tests', label: 'Mock Tests', icon: <ClipboardCheck size={18} /> },
              { id: 'daily-questions', label: 'Daily Questions', icon: <Sun size={18} /> },
              { id: 'notes', label: 'My Notes', icon: <Notebook size={18} /> },
              { id: 'progress', label: 'My Progress', icon: <BarChart3 size={18} /> },
              { id: 'leaderboard', label: 'Leaderboard', icon: <Trophy size={18} /> }
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
                    <span style={{ fontSize: '0.6rem', background: 'var(--secondary-color)', color: '#0D0D1A', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>
                      {item.badge}
                    </span>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Bottom items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flexShrink: 0, paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          {/* Day Streak Widget */}
          <div style={{
            background: 'rgba(255, 179, 71, 0.05)',
            border: '1px solid rgba(255, 179, 71, 0.15)',
            padding: '12px 16px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: '#FFB347',
            fontSize: '0.85rem',
            fontWeight: '700'
          }}>
            <Flame size={18} fill="#FFB347" />
            <div>
              <span style={{ display: 'block', fontSize: '0.85rem' }}>{user.streak} Day Streak!</span>
              <span style={{ fontSize: '0.65rem', color: '#A0A0C0', fontWeight: 'normal' }}>Revising daily</span>
            </div>
          </div>

          {/* Quick role switcher to let user review dashboards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <button 
              onClick={() => navigate('dashboard-educator')}
              className="btn btn-secondary" 
              style={{ width: '100%', padding: '8px', fontSize: '0.75rem', border: '1px dashed rgba(255,255,255,0.1)' }}
            >
              🏫 Switch to Educator
            </button>
            <button 
              onClick={() => navigate('dashboard-parent')}
              className="btn btn-secondary" 
              style={{ width: '100%', padding: '8px', fontSize: '0.75rem', border: '1px dashed rgba(255,255,255,0.1)' }}
            >
              👨‍👩‍👦 Switch to Parent
            </button>
          </div>

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

      {/* 2. Main Work Content Pane */}
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
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
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
        
        {/* DYNAMIC HEADER */}
        {subPage === 'home' && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }} className="catalog-grid-mobile">
            <div>
              <h1 style={{ color: 'white', fontSize: '2rem', fontWeight: '800' }}>
                {greeting}, {user.name.split(' ')[0]}! ⚡
              </h1>
              <p style={{ color: '#A0A0C0', fontSize: '0.95rem', marginTop: '4px' }}>Here is your learning snapshot for today</p>
            </div>

            {/* Quick Actions */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setSubPage('ai-chat')} className="btn btn-primary btn-pill btn-glow" style={{ padding: '10px 20px', fontSize: '0.85rem' }}>
                Ask AI solver
              </button>
              <button onClick={() => setSubPage('daily-questions')} className="btn btn-secondary btn-pill" style={{ padding: '10px 20px', fontSize: '0.85rem' }}>
                Solve Daily quiz
              </button>
            </div>
          </div>
        )}

        {/* DYNAMIC SUB PAGE SWITCHER */}
        
        {subPage === 'home' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }} className="fade-in">
            
            {/* Stats metric Cards Row */}
            <div className="grid-5" style={{ gap: '20px' }}>
              {[
                { id: 'accuracy', label: 'Overall score accuracy', value: '81%', color: '#6C63FF', icon: '🎯' },
                { id: 'streak', label: 'Day Streak count', value: `${user.streak} Days`, color: '#FFB347', icon: '🔥' },
                { id: 'classes_done', label: 'Completed classes', value: '4 attended', color: '#05D580', icon: '📅' },
                { id: 'tests', label: 'Mock tests completed', value: user.testsTaken, color: '#00D4AA', icon: '📝' },
                { id: 'doubts', label: 'AI doubts resolved', value: '24 solved', color: '#FF6B6B', icon: '🤖' }
              ].map((card, i) => (
                <div 
                  key={i} 
                  className="glass-panel" 
                  onClick={() => setActiveMetricModal(card.id)}
                  style={{ 
                    padding: '20px', 
                    borderRadius: '16px',
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.75rem', color: '#A0A0C0' }}>{card.label}</span>
                    <span style={{ fontSize: '1.25rem' }}>{card.icon}</span>
                  </div>
                  <p style={{ fontSize: '1.4rem', fontWeight: '800', color: 'white' }}>{card.value}</p>
                </div>
              ))}
            </div>

            {/* Row 2: Today's Daily + Chapters Progress heatmaps */}
            <div className="grid-split-reverse" style={{ gap: '24px' }}>
              
              {/* Daily questions widget preview */}
              <div 
                className="glass-panel" 
                style={{ 
                  padding: '30px', 
                  borderRadius: '20px', 
                  borderLeft: '4px solid var(--primary-color)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '260px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <span className="badge badge-gradient">Earn 50 XP</span>
                    <span style={{ fontSize: '0.75rem', color: '#A0A0C0' }}>{activeCourse.includes('JEE') ? 'Physics · Chemistry · Mathematics' : 'Physics · Chemistry · Biology'}</span>
                  </div>
                  <h3 style={{ color: 'white', marginBottom: '8px', fontSize: '1.15rem' }}>Today's revision questions</h3>
                  <p style={{ color: '#A0A0C0', fontSize: '0.85rem', lineHeight: '1.6' }}>
                    AI preloaded 20 targeted conceptual review cards focusing on your thermodynamics backlog. Clear them before 11 PM to lock streak!
                  </p>
                </div>
                <button 
                  onClick={() => setSubPage('daily-questions')}
                  className="btn btn-primary btn-glow btn-pill" 
                  style={{ width: 'fit-content', padding: '10px 22px', fontSize: '0.85rem', marginTop: '16px' }}
                >
                  Solve Revision Cards now <ArrowRight size={16} />
                </button>
              </div>

              {/* Weak areas alert card */}
              <div 
                className="glass-panel" 
                style={{ 
                  padding: '30px', 
                  borderRadius: '20px', 
                  background: 'linear-gradient(135deg, rgba(255, 179, 71, 0.08) 0%, rgba(20, 20, 40, 0.8) 100%)',
                  border: '1px solid rgba(255, 179, 71, 0.25)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <h4 style={{ color: '#FFB347', fontSize: '0.95rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <Brain size={16} /> AI Syllabus Gap Alert!
                  </h4>
                  {sessionDiagnosis && (
                    <span style={{ fontSize: '0.7rem', color: 'white', background: 'rgba(255,179,71,0.2)', padding: '2px 8px', borderRadius: '8px', display: 'inline-block', marginBottom: '14px' }}>
                      From Your Last Reviewed Session
                    </span>
                  )}
                  {!sessionDiagnosis && <div style={{ marginBottom: '14px' }}></div>}

                  <ul style={{ color: 'white', fontSize: '0.8rem', paddingLeft: '14px', lineHeight: '1.6', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {sessionDiagnosis 
                      ? sessionDiagnosis.map((topic, i) => <li key={i}>{topic}</li>)
                      : filteredWeakTopics.map((topic, i) => <li key={i}>{topic}</li>)
                    }
                  </ul>
                </div>
                <button 
                  onClick={() => setSubPage('ai-chat')}
                  className="btn btn-secondary btn-pill" 
                  style={{ width: 'fit-content', padding: '8px 16px', fontSize: '0.8rem', color: '#FFB347', borderColor: 'rgba(255,179,71,0.3)', marginTop: '16px' }}
                >
                  Clear concept doubts
                </button>
              </div>

            </div>

            {/* Row 3: Upcoming classes + tests list + recent AI chats previews */}
            <div className="grid-3" style={{ gap: '24px' }}>
              
              {/* Upcoming Live Classes */}
              <div className="glass-panel" style={{ padding: '24px', borderRadius: '18px', borderLeft: '3px solid #00D4AA' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ color: 'white', fontSize: '1rem', fontWeight: 'bold' }}>Upcoming Classes</h3>
                  <span onClick={() => setSubPage('classes')} style={{ fontSize: '0.75rem', color: '#00D4AA', cursor: 'pointer', fontWeight: 'bold' }}>View All</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[
                    { topic: 'Kinetic Theory of Gases (KTG)', date: 'Mon, 10:00 AM', subject: 'Physics' },
                    { topic: 'Aromatic Compounds', date: 'Tue, 11:30 AM', subject: 'Chemistry' },
                    { topic: 'Integration Techniques', date: 'Wed, 4:00 PM', subject: 'Maths' },
                    { topic: 'Human Physiology Basics', date: 'Thu, 5:00 PM', subject: 'Biology' }
                  ].filter(cls => {
                    if (activeCourse.includes('JEE') && cls.subject === 'Biology') return false;
                    if (activeCourse.includes('NEET') && cls.subject === 'Maths') return false;
                    return true;
                  }).slice(0, 2).map((cls, i) => (
                    <div key={i} style={{
                      padding: '12px 16px',
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.05)',
                      borderRadius: '10px',
                      fontSize: '0.8rem'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <h4 style={{ color: 'white', fontWeight: '600', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '160px' }}>{cls.topic}</h4>
                        <span style={{ fontSize: '0.65rem', background: cls.subject === 'Physics' ? 'rgba(108, 99, 255, 0.15)' : 'rgba(0, 212, 170, 0.15)', color: cls.subject === 'Physics' ? '#B88EFC' : '#00D4AA', padding: '2px 6px', borderRadius: '4px' }}>{cls.subject}</span>
                      </div>
                      <span style={{ fontSize: '0.72rem', color: '#A0A0C0' }}>{cls.date}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upcoming tests */}
              <div className="glass-panel" style={{ padding: '24px', borderRadius: '18px' }}>
                <h3 style={{ color: 'white', fontSize: '1rem', fontWeight: 'bold', marginBottom: '16px' }}>Upcoming Mock Exams</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[
                    { title: 'JEE Physics adaptive revision', date: 'Tomorrow, 9:00 AM', countdown: '1 day left', course: 'JEE Main' },
                    { title: 'Organic Chemistry compound drill', date: 'Saturday, 2:00 PM', countdown: '3 days left', course: 'NEET' },
                    { title: 'Advanced Calculus Test', date: 'Sunday, 10:00 AM', countdown: '4 days left', course: 'JEE Advanced' }
                  ].filter(test => activeCourse.includes('Boards') || test.course === activeCourse).slice(0, 2).map((test, i) => (
                    <div key={i} style={{
                      padding: '12px 16px',
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.05)',
                      borderRadius: '10px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '0.8rem'
                    }}>
                      <div>
                        <h4 style={{ color: 'white' }}>{test.title}</h4>
                        <span style={{ fontSize: '0.75rem', color: '#A0A0C0' }}>{test.date}</span>
                      </div>
                      <span style={{ color: 'var(--secondary-color)', fontWeight: 'bold', fontSize: '0.75rem' }}>{test.countdown}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent AI Chats preview */}
              <div className="glass-panel" style={{ padding: '24px', borderRadius: '18px' }}>
                <h3 style={{ color: 'white', fontSize: '1rem', fontWeight: 'bold', marginBottom: '16px' }}>Recent AI Solver Chats</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[
                    { q: "Newton's 3rd Law boat example", date: 'Yesterday' },
                    { q: "SN2 inversion mechanism sterics", date: '2 days ago' }
                  ].map((chat, i) => (
                    <div key={i} style={{
                      padding: '12px 16px',
                      background: 'rgba(255,255,255,0.02)',
                      borderRadius: '10px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '0.8rem',
                      cursor: 'pointer'
                    }} onClick={() => setSubPage('ai-chat')}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: 'var(--primary-color)' }}>💬</span>
                        <span style={{ color: 'white' }}>"{chat.q}"</span>
                      </div>
                      <span style={{ fontSize: '0.75rem', color: '#626280' }}>{chat.date}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* Dynamic sub components injection */}
        {subPage === 'ai-chat' && (
          <AskAI user={user} addNote={addNote} earnXP={earnXP} activeCourse={activeCourse} />
        )}

        {subPage === 'mock-tests' && (
          <MockTests user={user} earnXP={earnXP} addTestAttempt={addTestAttempt} activeCourse={activeCourse} />
        )}

        {subPage === 'daily-questions' && (
          <DailyQuestions user={user} earnXP={earnXP} deductXP={deductXP} navigate={setSubPage} activeCourse={activeCourse} />
        )}

        {subPage === 'notes' && (
          <SmartNotes notesList={notesList} addNote={addNote} deleteNote={deleteNote} earnXP={earnXP} activeCourse={activeCourse} />
        )}

        {subPage === 'classes' && (
          <StudentClasses earnXP={earnXP} activeCourse={activeCourse} />
        )}

        {subPage === 'progress' && (
          <Progress user={user} testHistory={testHistory} weakTopics={weakTopics} activeCourse={activeCourse} />
        )}

        {subPage === 'leaderboard' && (
          <Leaderboard user={user} activeCourse={activeCourse} />
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
            {activeMetricModal === 'accuracy' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <span style={{ fontSize: '1.75rem' }}>🎯</span>
                  <div>
                    <h3 style={{ color: 'white', fontSize: '1.25rem', fontWeight: 'bold' }}>Overall Score Accuracy</h3>
                    <span style={{ fontSize: '0.75rem', color: '#A0A0C0' }}>Performance metrics by topic accuracy</span>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', margin: '20px 0' }}>
                  {[
                    { sub: 'Physics', accuracy: 84, color: '#6C63FF' },
                    { sub: 'Chemistry', accuracy: 79, color: '#00D4AA' },
                    { sub: 'Mathematics', accuracy: 72, color: '#FFB347' }
                  ].map((s, idx) => (
                    <div key={idx}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '6px' }}>
                        <span style={{ color: '#A0A0C0' }}>{s.sub}</span>
                        <span style={{ color: s.color, fontWeight: 'bold' }}>{s.accuracy}%</span>
                      </div>
                      <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px' }}>
                        <div style={{ width: `${s.accuracy}%`, height: '100%', background: s.color, borderRadius: '3px' }}></div>
                      </div>
                    </div>
                  ))}
                </div>
                <p style={{ fontSize: '0.8rem', color: '#A0A0C0', lineHeight: '1.5', marginTop: '16px' }}>
                  💡 **AI Recommendation**: Your accuracy in Physics is outstanding! Focus on improving Mathematics integration rules to boost your overall diagnostic score.
                </p>
              </div>
            )}

            {activeMetricModal === 'streak' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <span style={{ fontSize: '1.75rem' }}>🔥</span>
                  <div>
                    <h3 style={{ color: 'white', fontSize: '1.25rem', fontWeight: 'bold' }}>Active Day Streak</h3>
                    <span style={{ fontSize: '0.75rem', color: '#A0A0C0' }}>Daily consistency progress log</span>
                  </div>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'white', marginBottom: '12px' }}>
                  You have successfully logged in and completed studies for **{user.streak} consecutive days**. Keep it up!
                </p>
                <div style={{
                  background: 'rgba(255, 179, 71, 0.05)',
                  border: '1px solid rgba(255, 179, 71, 0.15)',
                  padding: '16px',
                  borderRadius: '12px',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(7, 1fr)',
                  gap: '8px',
                  textAlign: 'center',
                  margin: '16px 0'
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
                <p style={{ fontSize: '0.8rem', color: '#A0A0C0', lineHeight: '1.5' }}>
                  🔥 Next Milestone: **15-Day Streak**. Complete today's daily revision questions to lock in your streak multiplier!
                </p>
              </div>
            )}

            {activeMetricModal === 'tests' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <span style={{ fontSize: '1.75rem' }}>📝</span>
                  <div>
                    <h3 style={{ color: 'white', fontSize: '1.25rem', fontWeight: 'bold' }}>Mock Tests Completed</h3>
                    <span style={{ fontSize: '0.75rem', color: '#A0A0C0' }}>Recent diagnostic attempts log</span>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', margin: '20px 0' }}>
                  {testHistory && testHistory.slice(0, 3).map((test, idx) => (
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
                      <div>
                        <h4 style={{ color: 'white', fontWeight: '600' }}>{test.title}</h4>
                        <span style={{ fontSize: '0.7rem', color: '#A0A0C0' }}>{test.date}</span>
                      </div>
                      <span style={{ color: '#00D4AA', fontWeight: 'bold' }}>{test.percent}%</span>
                    </div>
                  ))}
                </div>
                <p style={{ fontSize: '0.8rem', color: '#A0A0C0', lineHeight: '1.5' }}>
                  📈 Overall practice activity: **{user.testsTaken} tests completed** across physics, chemistry, and mathematics.
                </p>
              </div>
            )}

            {activeMetricModal === 'doubts' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <span style={{ fontSize: '1.75rem' }}>🤖</span>
                  <div>
                    <h3 style={{ color: 'white', fontSize: '1.25rem', fontWeight: 'bold' }}>AI Doubts Resolved</h3>
                    <span style={{ fontSize: '0.75rem', color: '#A0A0C0' }}>AI Tutor query interactions feed</span>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', margin: '20px 0' }}>
                  {[
                    { topic: 'Thermodynamics', count: 10, color: '#6C63FF' },
                    { topic: 'Organic Halides', count: 8, color: '#00D4AA' },
                    { topic: 'Integration', count: 6, color: '#FFB347' }
                  ].map((d, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
                      <span style={{ color: '#A0A0C0' }}>{d.topic}</span>
                      <span style={{ color: d.color, fontWeight: 'bold' }}>{d.count} questions</span>
                    </div>
                  ))}
                </div>
                 <p style={{ fontSize: '0.8rem', color: '#A0A0C0', lineHeight: '1.5' }}>
                  🧠 Resolving doubts dynamically expands your concept accuracy index. You have earned **+360 XP** total from AI doubts this month.
                </p>
              </div>
            )}

            {activeMetricModal === 'classes_done' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <span style={{ fontSize: '1.75rem' }}>📅</span>
                  <div>
                    <h3 style={{ color: 'white', fontSize: '1.25rem', fontWeight: 'bold' }}>Completed Classes</h3>
                    <span style={{ fontSize: '0.75rem', color: '#A0A0C0' }}>This week's lecture attendance logs</span>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', margin: '20px 0' }}>
                  {[
                    { topic: 'Thermodynamics & Carnot Engine', sub: 'Physics', date: 'June 2' },
                    { topic: 'Alkyl Halides & SN2 Reaction', sub: 'Chemistry', date: 'June 3' },
                    { topic: 'Definite Integrals & Areas', sub: 'Maths', date: 'June 4' },
                    { topic: 'Calorimetry & Phase Diagrams', sub: 'Physics', date: 'June 5' }
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
                      <div>
                        <h4 style={{ color: 'white', fontWeight: '600' }}>{cls.topic}</h4>
                        <span style={{ fontSize: '0.7rem', color: '#A0A0C0' }}>{cls.sub} · {cls.date}</span>
                      </div>
                      <span style={{ color: '#00D4AA', fontWeight: 'bold', fontSize: '0.75rem' }}>Attended ✓</span>
                    </div>
                  ))}
                </div>
                <p style={{ fontSize: '0.8rem', color: '#A0A0C0', lineHeight: '1.5' }}>
                  🎓 Consistency: **4 classes attended** and **1 class missed** this week. Overall attendance rate: **80%**.
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
