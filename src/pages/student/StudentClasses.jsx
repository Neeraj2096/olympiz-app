import React, { useState } from 'react';
import { Calendar, Clock, Video, CheckCircle, AlertCircle, ArrowRight, BookOpen, Download, HelpCircle } from 'lucide-react';

export default function StudentClasses({ earnXP, activeCourse = 'JEE Main' }) {
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' | 'history'
  const [joinedClass, setJoinedClass] = useState(null);

  const classes = {
    completed: [
      { id: 'c1', subject: 'Physics', topic: 'Thermodynamics & Carnot Engine', day: 'Tuesday', date: 'June 2, 2026', time: '10:00 AM', duration: '1.5 hrs', instructor: 'Dr. R.K. Verma' },
      { id: 'c2', subject: 'Chemistry', topic: 'Alkyl Halides & SN2 Reaction', day: 'Wednesday', date: 'June 3, 2026', time: '11:30 AM', duration: '1.2 hrs', instructor: 'Prof. Alok Gupta' },
      { id: 'c3', subject: 'Mathematics', topic: 'Definite Integrals & Areas', day: 'Thursday', date: 'June 4, 2026', time: '09:00 AM', duration: '2 hrs', instructor: 'Sanjay Kumar' },
      { id: 'c4', subject: 'Physics', topic: 'Calorimetry & Phase Diagrams', day: 'Friday', date: 'June 5, 2026', time: '10:00 AM', duration: '1.5 hrs', instructor: 'Dr. R.K. Verma' },
    ],
    missed: [
      { id: 'm1', subject: 'Chemistry', topic: 'E1 vs E2 Elimination Mechanisms', day: 'Friday', date: 'June 5, 2026', time: '02:00 PM', instructor: 'Prof. Alok Gupta' },
    ],
    upcoming: [
      { id: 'u1', subject: 'Physics', topic: 'Kinetic Theory of Gases (KTG)', day: 'Monday', date: 'June 8, 2026', time: '10:00 AM', instructor: 'Dr. R.K. Verma', canJoin: true },
      { id: 'u2', subject: 'Chemistry', topic: 'Aromatic Compounds & Electrophilic Substitution', day: 'Tuesday', date: 'June 9, 2026', time: '11:30 AM', instructor: 'Prof. Alok Gupta', canJoin: false },
      { id: 'u3', subject: 'Mathematics', topic: 'Differential Equations - First Order', day: 'Wednesday', date: 'June 10, 2026', time: '09:00 AM', instructor: 'Sanjay Kumar', canJoin: false },
      { id: 'u4', subject: 'Biology', topic: 'Human Reproduction & Embryology', day: 'Thursday', date: 'June 11, 2026', time: '10:00 AM', instructor: 'Dr. Neha Sharma', canJoin: false }
    ]
  };

  // Filter based on activeCourse
  const filteredClasses = {
    completed: classes.completed.filter(cls => {
      if (activeCourse.includes('JEE') && cls.subject === 'Biology') return false;
      if (activeCourse.includes('NEET') && cls.subject === 'Mathematics') return false;
      return true;
    }),
    missed: classes.missed.filter(cls => {
      if (activeCourse.includes('JEE') && cls.subject === 'Biology') return false;
      if (activeCourse.includes('NEET') && cls.subject === 'Mathematics') return false;
      return true;
    }),
    upcoming: classes.upcoming.filter(cls => {
      if (activeCourse.includes('JEE') && cls.subject === 'Biology') return false;
      if (activeCourse.includes('NEET') && cls.subject === 'Mathematics') return false;
      return true;
    })
  };

  const handleJoinClass = (cls) => {
    setJoinedClass(cls);
    earnXP(30); // Earn XP for attending
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(108, 99, 255, 0.15) 0%, rgba(0, 212, 170, 0.05) 100%)',
        border: '1px solid rgba(108, 99, 255, 0.2)',
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
            <Calendar style={{ color: '#00D4AA' }} /> Class Schedule & Attendance
          </h2>
          <p style={{ color: '#A0A0C0', fontSize: '0.9rem', maxWidth: '500px' }}>
            Join live digital classrooms, review recordings, and download compiled lecture notes. Keep your attendance score high!
          </p>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <div className="glass-panel" style={{ padding: '12px 20px', borderRadius: '16px', textAlign: 'center', minWidth: '100px' }}>
            <span style={{ fontSize: '0.75rem', color: '#A0A0C0', display: 'block' }}>Classes Done</span>
            <span style={{ fontSize: '1.5rem', fontWeight: '800', color: '#00D4AA' }}>{filteredClasses.completed.length}</span>
          </div>
          <div className="glass-panel" style={{ padding: '12px 20px', borderRadius: '16px', textAlign: 'center', minWidth: '100px', border: '1px solid rgba(255, 107, 107, 0.2)' }}>
            <span style={{ fontSize: '0.75rem', color: '#A0A0C0', display: 'block' }}>Missed</span>
            <span style={{ fontSize: '1.5rem', fontWeight: '800', color: '#FF6B6B' }}>{filteredClasses.missed.length}</span>
          </div>
          <div className="glass-panel" style={{ padding: '12px 20px', borderRadius: '16px', textAlign: 'center', minWidth: '100px' }}>
            <span style={{ fontSize: '0.75rem', color: '#A0A0C0', display: 'block' }}>Upcoming</span>
            <span style={{ fontSize: '1.5rem', fontWeight: '800', color: '#6C63FF' }}>{filteredClasses.upcoming.length}</span>
          </div>
        </div>
      </div>

      {/* Tab Switcher */}
      <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '16px' }}>
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`btn ${activeTab === 'upcoming' ? 'btn-primary btn-glow' : 'btn-secondary'}`}
          style={{ padding: '10px 20px', borderRadius: '30px', fontSize: '0.85rem' }}
        >
          Upcoming Lectures ({filteredClasses.upcoming.length})
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`btn ${activeTab === 'history' ? 'btn-primary btn-glow' : 'btn-secondary'}`}
          style={{ padding: '10px 20px', borderRadius: '30px', fontSize: '0.85rem' }}
        >
          Lecture History ({filteredClasses.completed.length + filteredClasses.missed.length})
        </button>
      </div>

      {/* Simulation Screen Overlay */}
      {joinedClass && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(7, 7, 18, 0.95)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px'
        }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '800px', borderRadius: '24px', overflow: 'hidden', border: '1px solid rgba(108, 99, 255, 0.3)' }}>
            {/* Header */}
            <div style={{ padding: '16px 24px', background: 'rgba(255,255,255,0.02)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#00D4AA', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>Live Digital Lecture</span>
                <h4 style={{ color: 'white', fontSize: '1.1rem', margin: '2px 0 0 0' }}>{joinedClass.subject}: {joinedClass.topic}</h4>
              </div>
              <span className="badge" style={{ background: '#FF6B6B', color: 'white' }}>REC ● LIVE</span>
            </div>
            {/* Stream window simulation */}
            <div style={{ width: '100%', aspectRatio: '16/9', background: '#070712', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px', borderBottom: '1px solid rgba(255,255,255,0.06)', position: 'relative' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #6C63FF 0%, #00D4AA 100%)', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold', color: '#0D0D1A' }}>
                {joinedClass.instructor[5]}
              </div>
              <div style={{ textAlign: 'center' }}>
                <h3 style={{ color: 'white', margin: '0 0 4px 0' }}>{joinedClass.instructor}</h3>
                <p style={{ color: '#A0A0C0', fontSize: '0.85rem', margin: 0 }}>Sharing lecture slides on Thermodynamic Laws...</p>
              </div>
              
              {/* Bottom controls */}
              <div style={{ position: 'absolute', bottom: '20px', display: 'flex', gap: '10px' }}>
                <span style={{ background: 'rgba(255,255,255,0.08)', padding: '6px 12px', borderRadius: '8px', fontSize: '0.75rem' }}>🎤 Mic Connected</span>
                <span style={{ background: 'rgba(255,255,255,0.08)', padding: '6px 12px', borderRadius: '8px', fontSize: '0.75rem' }}>📹 Cam Off</span>
              </div>
            </div>
            {/* Footer */}
            <div style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.2)' }}>
              <span style={{ fontSize: '0.8rem', color: '#00D4AA' }}>🎉 Attending this class earned you +30 XP!</span>
              <button onClick={() => setJoinedClass(null)} className="btn btn-secondary" style={{ padding: '8px 20px', fontSize: '0.8rem' }}>Leave Classroom</button>
            </div>
          </div>
        </div>
      )}

      {/* Tab Panel Content */}
      {activeTab === 'upcoming' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredClasses.upcoming.map((cls) => (
            <div
              key={cls.id}
              className="glass-panel"
              style={{
                padding: '24px',
                borderRadius: '16px',
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                alignItems: 'center',
                gap: '20px',
                border: cls.canJoin ? '1px solid rgba(0, 212, 170, 0.3)' : '1px solid rgba(255,255,255,0.06)'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    background: cls.subject === 'Physics' ? 'rgba(108, 99, 255, 0.15)' : cls.subject === 'Chemistry' ? 'rgba(0, 212, 170, 0.15)' : 'rgba(255, 179, 71, 0.15)',
                    color: cls.subject === 'Physics' ? '#B88EFC' : cls.subject === 'Chemistry' ? '#00D4AA' : '#FFB347'
                  }}>{cls.subject}</span>
                  <span style={{ fontSize: '0.75rem', color: '#A0A0C0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} /> {cls.day}, {cls.date} · {cls.time}
                  </span>
                </div>
                <h3 style={{ color: 'white', fontSize: '1.1rem', fontWeight: '700', marginBottom: '4px' }}>{cls.topic}</h3>
                <span style={{ fontSize: '0.8rem', color: '#626280' }}>Instructor: {cls.instructor}</span>
              </div>

              <div>
                {cls.canJoin ? (
                  <button
                    onClick={() => handleJoinClass(cls)}
                    className="btn btn-primary btn-glow btn-pill"
                    style={{ padding: '10px 22px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}
                  >
                    <Video size={16} /> Join Live Class
                  </button>
                ) : (
                  <span style={{
                    fontSize: '0.8rem',
                    color: '#626280',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.04)',
                    padding: '8px 16px',
                    borderRadius: '20px'
                  }}>Locked until Monday</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'history' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Missed classes highlighted first */}
          {filteredClasses.missed.map((cls) => (
            <div
              key={cls.id}
              className="glass-panel"
              style={{
                padding: '24px',
                borderRadius: '16px',
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                alignItems: 'center',
                gap: '20px',
                background: 'linear-gradient(135deg, rgba(255, 107, 107, 0.08) 0%, rgba(7, 7, 18, 0.4) 100%)',
                border: '1px solid rgba(255, 107, 107, 0.25)'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    background: 'rgba(255, 107, 107, 0.15)',
                    color: '#FF6B6B'
                  }}>{cls.subject}</span>
                  <span style={{ fontSize: '0.75rem', color: '#A0A0C0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} /> {cls.day}, {cls.date} · {cls.time}
                  </span>
                  <span style={{ fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '4px', color: '#FF6B6B', fontWeight: 'bold' }}>
                    <AlertCircle size={12} /> Missed Class
                  </span>
                </div>
                <h3 style={{ color: 'white', fontSize: '1.1rem', fontWeight: '700', marginBottom: '4px' }}>{cls.topic}</h3>
                <span style={{ fontSize: '0.8rem', color: '#A0A0C0' }}>Instructor: {cls.instructor}</span>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => alert("Simulating recording playback stream...")}
                  className="btn btn-secondary btn-pill"
                  style={{ padding: '8px 16px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Video size={14} /> Watch Recording
                </button>
                <button
                  onClick={() => alert("Notes downloading...")}
                  className="btn btn-secondary btn-pill"
                  style={{ padding: '8px 16px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Download size={14} /> Download Notes
                </button>
              </div>
            </div>
          ))}

          {/* Completed classes */}
          {filteredClasses.completed.map((cls) => (
            <div
              key={cls.id}
              className="glass-panel"
              style={{
                padding: '24px',
                borderRadius: '16px',
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                alignItems: 'center',
                gap: '20px',
                border: '1px solid rgba(255,255,255,0.06)'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    background: cls.subject === 'Physics' ? 'rgba(108, 99, 255, 0.15)' : cls.subject === 'Chemistry' ? 'rgba(0, 212, 170, 0.15)' : 'rgba(255, 179, 71, 0.15)',
                    color: cls.subject === 'Physics' ? '#B88EFC' : cls.subject === 'Chemistry' ? '#00D4AA' : '#FFB347'
                  }}>{cls.subject}</span>
                  <span style={{ fontSize: '0.75rem', color: '#A0A0C0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} /> {cls.day}, {cls.date} · {cls.time} ({cls.duration})
                  </span>
                  <span style={{ fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '4px', color: '#00D4AA', fontWeight: 'bold' }}>
                    <CheckCircle size={12} /> Attended
                  </span>
                </div>
                <h3 style={{ color: 'white', fontSize: '1.1rem', fontWeight: '700', marginBottom: '4px' }}>{cls.topic}</h3>
                <span style={{ fontSize: '0.8rem', color: '#626280' }}>Instructor: {cls.instructor}</span>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => alert("Playing recording...")}
                  className="btn btn-secondary btn-pill"
                  style={{ padding: '8px 16px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Video size={14} /> Watch Recording
                </button>
                <button
                  onClick={() => alert("Notes downloading...")}
                  className="btn btn-secondary btn-pill"
                  style={{ padding: '8px 16px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Download size={14} /> Smart Notes
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
