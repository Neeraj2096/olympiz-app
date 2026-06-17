import React, { useState } from 'react';
import { 
  ArrowRight, PlayCircle, MessageSquare, ClipboardCheck, 
  Notebook, Sun, BarChart3, Users, Heart, Trophy, 
  Sparkles, Brain, Check, ShieldAlert, Star
} from 'lucide-react';

export default function Landing({ navigate }) {
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'annual'
  const [activeTab, setActiveTab] = useState('tab_doubt');
  const [activeRole, setActiveRole] = useState('student_role');
  const [showDemoVideo, setShowDemoVideo] = useState(false);
  
  // Interactive mini-chat in bento grid
  const [miniChatInput, setMiniChatInput] = useState('');
  const [miniChatMessages, setMiniChatMessages] = useState([
    { role: 'user', text: "What is photosynthesis?" },
    { role: 'ai', text: "Photosynthesis is how plants make food using sunlight, water, and CO₂! 🌱" }
  ]);

  const handleMiniChatSubmit = (e) => {
    e.preventDefault();
    if (!miniChatInput.trim()) return;
    const newMsgs = [...miniChatMessages, { role: 'user', text: miniChatInput }];
    setMiniChatMessages(newMsgs);
    setMiniChatInput('');
    
    setTimeout(() => {
      setMiniChatMessages([...newMsgs, { 
        role: 'ai', 
        text: "That's a smart question! Let me break it down step-by-step in our full Ask AI panel." 
      }]);
    }, 1000);
  };

  return (
    <div className="fade-in" style={{ zIndex: 1, position: 'relative' }}>
      
      {/* Background Floating Orbs */}
      <div className="orb-container">
        <div className="glowing-orb orb-1"></div>
        <div className="glowing-orb orb-2"></div>
        <div className="glowing-orb orb-3"></div>
      </div>

      {/* 1. Hero Section */}
      <section style={{
        padding: '120px 5vw 80px',
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr',
        gap: '40px',
        maxWidth: '1280px',
        margin: '0 auto',
        minHeight: '85vh',
        alignItems: 'center'
      }} className="hero-grid-desktop">
        
        {/* Hero Left Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="badge badge-gradient">
            <Sparkles size={14} style={{ marginRight: '6px', color: '#00D4AA' }} />
            <span>AI-Powered Learning Platform</span>
          </div>
          
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5.5vw, 4.2rem)',
            fontWeight: '800',
            lineHeight: '1.15',
            letterSpacing: '-1.5px',
            color: 'white'
          }}>
            Your AI Study <br />
            <span style={{
              background: 'var(--gradient-primary)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              position: 'relative'
            }}>Partner That</span> <br />
            Actually Gets You
          </h1>
          
          <p style={{
            fontSize: '1.15rem',
            color: 'var(--text-secondary)',
            maxWidth: '520px',
            lineHeight: '1.7'
          }}>
            Personalised learning journeys, real-time doubt solving, AI mock tests and smart notes — built for the way Gen Z actually learns.
          </p>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '12px' }}>
            <button 
              onClick={() => navigate('signup')} 
              className="btn btn-primary btn-glow btn-large btn-pill"
            >
              Start Learning Free <ArrowRight size={18} />
            </button>
            <button 
              onClick={() => setShowDemoVideo(true)} 
              className="btn btn-secondary btn-large btn-pill"
            >
              <PlayCircle size={18} /> Watch Demo
            </button>
          </div>

          {/* Social Proof */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginTop: '32px',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            paddingTop: '24px'
          }}>
            <div style={{ display: 'flex', marginLeft: '5px' }}>
              {[...Array(5)].map((_, i) => (
                <div 
                  key={i} 
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: `hsl(${140 + i * 40}, 70%, 60%)`,
                    border: '2px solid #0D0D1A',
                    marginLeft: i > 0 ? '-10px' : '0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.65rem',
                    fontWeight: 'bold',
                    color: '#0D0D1A'
                  }}
                >
                  {String.fromCharCode(65 + i * 2)}
                </div>
              ))}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill="#FFB347" stroke="#FFB347" />
                ))}
                <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'white', marginLeft: '4px' }}>4.9/5</span>
              </div>
              <span style={{ fontSize: '0.85rem', color: '#A0A0C0' }}>Join 50,000+ students studying smarter</span>
            </div>
          </div>
        </div>

        {/* Hero Right Dashboard Preview */}
        <div style={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }} className="hero-right-animation">
          <div className="glass-panel" style={{
            padding: '24px',
            width: '100%',
            maxWidth: '460px',
            borderRadius: '24px',
            boxShadow: 'var(--shadow-premium)',
            background: 'rgba(25, 20, 50, 0.4)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            position: 'relative',
            zIndex: 2,
            minHeight: '380px'
          }}>
            {/* Custom Interactive Elements inside simulated Dashboard card */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', gap: '6px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#FF6B6B' }}></span>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#FFB347' }}></span>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#00D4AA' }}></span>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>olympiz_workspace_v1</span>
            </div>

            {/* Chat Bubble card */}
            <div style={{
              background: 'rgba(108, 99, 255, 0.08)',
              border: '1px solid rgba(108, 99, 255, 0.2)',
              borderRadius: '16px',
              padding: '16px',
              marginBottom: '16px',
              transform: 'translateY(0px)',
              boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem' }}>⚡</div>
                <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'white' }}>Ask AI Solver</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'white', marginBottom: '6px' }}>"Explain Newton's 3rd Law with a real-life example"</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--secondary-color)', lineHeight: '1.4' }}>
                <strong>AI Response:</strong> Action and reaction are equal and opposite. When you jump off a boat, you push the boat backward (action), pushing yourself forward (reaction)! 🚣
              </p>
            </div>

            {/* Metric Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '12px' }}>
              {/* Progress Ring card */}
              <div className="glass-panel" style={{ padding: '14px', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <div style={{ position: 'relative', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg style={{ transform: 'rotate(-90deg)', width: '60px', height: '60px' }}>
                    <circle cx="30" cy="30" r="24" stroke="rgba(255,255,255,0.05)" strokeWidth="6" fill="transparent" />
                    <circle cx="30" cy="30" r="24" stroke="var(--primary-color)" strokeWidth="6" fill="transparent" 
                      strokeDasharray="150" strokeDashoffset="33" />
                  </svg>
                  <span style={{ position: 'absolute', fontSize: '0.85rem', fontWeight: 'bold', color: 'white' }}>78%</span>
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Physics Mastery</span>
              </div>

              {/* Badges Stack */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{
                  background: 'rgba(255, 179, 71, 0.1)',
                  border: '1px solid rgba(255, 179, 71, 0.25)',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#FFB347',
                  fontSize: '0.85rem',
                  fontWeight: '700'
                }}>
                  <span>🔥</span> 14 Day Streak
                </div>
                
                <div style={{
                  background: 'rgba(0, 212, 170, 0.1)',
                  border: '1px solid rgba(0, 212, 170, 0.25)',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  color: '#00D4AA',
                  fontSize: '0.85rem',
                  fontWeight: '700'
                }}>
                  <span style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>Mock Test</span>
                  <span>87/100</span>
                </div>
              </div>
            </div>

            {/* Glowing floating orbs decor inside dashboard */}
            <div style={{
              position: 'absolute',
              width: '120px',
              height: '120px',
              background: 'var(--secondary-color)',
              filter: 'blur(50px)',
              top: '50%',
              right: '-10%',
              opacity: 0.15,
              pointerEvents: 'none'
            }}></div>
          </div>
        </div>
      </section>

      {/* 2. Stats ticker Bar */}
      <section style={{
        background: 'var(--surface-bg)',
        borderY: '1px solid rgba(255, 255, 255, 0.05)',
        padding: '30px 5vw',
        position: 'relative',
        zIndex: 5
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '30px'
        }} className="ticker-flex">
          {[
            { value: "50,000+", label: "Active Students" },
            { value: "1,200+", label: "Expert Educators" },
            { value: "98%", label: "Doubt Solve Rate" },
            { value: "4.9★", label: "Student Rating" },
            { value: "10M+", label: "AI Answers" }
          ].map((stat, i) => (
            <div key={i} style={{ textAlign: 'center', display: 'flex', flexDirection: 'column' }}>
              <span style={{
                fontSize: '1.75rem',
                fontWeight: '800',
                background: 'linear-gradient(135deg, #FFFFFF 0%, #A0A0C0 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontFamily: 'var(--font-heading)'
              }}>{stat.value}</span>
              <span style={{ fontSize: '0.8rem', color: '#A0A0C0', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '4px' }}>{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Features Bento Grid */}
      <section id="features" style={{
        padding: '100px 5vw',
        maxWidth: '1280px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 5
      }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ color: 'white', marginBottom: '16px' }}>Everything You Need to Excel</h2>
          <p style={{ color: '#A0A0C0', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
            Powerful AI tools built specifically for students, educators and parents
          </p>
        </div>

        <div className="bento-grid">
          
          {/* F1: Ask AI Bento (Large) */}
          <div className="glass-panel col-8" style={{
            padding: '30px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '24px',
            overflow: 'hidden',
            minHeight: '320px',
            background: 'linear-gradient(135deg, rgba(108, 99, 255, 0.1) 0%, rgba(26, 26, 53, 0.4) 100%)'
          }} className="col-8 bento-sub-grid">
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '16px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(108, 99, 255, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6C63FF' }}>
                <MessageSquare size={20} />
              </div>
              <h3 style={{ color: 'white' }}>Ask AI Anytime</h3>
              <p style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
                Get instant, personalised doubt resolution during or after class. Our AI understands context, complex equations, and handwritten diagrams.
              </p>
              <span className="badge" style={{ marginTop: '8px' }}>Most Loved</span>
            </div>
            
            {/* Interactive Mini Chat Simulator in Bento */}
            <div style={{
              background: 'rgba(13, 13, 26, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              maxHeight: '260px'
            }}>
              <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, marginBottom: '10px' }}>
                {miniChatMessages.map((msg, idx) => (
                  <div key={idx} style={{
                    alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    background: msg.role === 'user' ? 'var(--primary-color)' : 'rgba(255, 255, 255, 0.04)',
                    color: msg.role === 'user' ? '#0D0D1A' : 'white',
                    padding: '8px 12px',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    maxWidth: '85%'
                  }}>
                    {msg.text}
                  </div>
                ))}
              </div>
              <form onSubmit={handleMiniChatSubmit} style={{ display: 'flex', gap: '6px' }}>
                <input 
                  type="text" 
                  value={miniChatInput}
                  onChange={(e) => setMiniChatInput(e.target.value)}
                  placeholder="Ask a quick doubt..." 
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    color: 'white',
                    fontSize: '0.75rem',
                    flex: 1
                  }}
                />
                <button type="submit" className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.75rem', borderRadius: '8px' }}>Send</button>
              </form>
            </div>
          </div>

          {/* F2: AI Mock Tests (Medium) */}
          <div className="glass-panel col-4" style={{
            padding: '30px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            background: 'linear-gradient(135deg, rgba(0, 212, 170, 0.1) 0%, rgba(26, 26, 53, 0.4) 100%)'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(0, 212, 170, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00D4AA' }}>
                <ClipboardCheck size={20} />
              </div>
              <h3 style={{ color: 'white' }}>AI Mock Tests</h3>
              <p style={{ fontSize: '0.9rem' }}>
                Adaptive tests targeting your exact weak areas. Experience realistic CBT dashboards with predictive ranking.
              </p>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              background: 'rgba(255,255,255,0.02)',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.05)',
              marginTop: '20px'
            }}>
              <span style={{ fontSize: '0.75rem', color: '#A0A0C0' }}>Chapter Proficiency</span>
              <span style={{ fontSize: '0.75rem', color: '#00D4AA', fontWeight: 'bold' }}>+12% Mastered</span>
            </div>
          </div>

          {/* F3: Smart AI Notes (Medium) */}
          <div className="glass-panel col-4" style={{ padding: '30px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                <Notebook size={20} />
              </div>
              <h3 style={{ color: 'white' }}>Smart AI Notes</h3>
              <p style={{ fontSize: '0.9rem' }}>
                Auto-generates structured notes, formula compilers, summary sheets, and interactive study flashcards during live classes.
              </p>
            </div>
            <div style={{ marginTop: '20px', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#626280' }}>
              {"[notes] Compiling Thermodynamics.pdf..."}
            </div>
          </div>

          {/* F4: Daily Revision Questions (Medium) */}
          <div className="glass-panel col-4" style={{
            padding: '30px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            background: 'linear-gradient(135deg, rgba(255, 179, 71, 0.1) 0%, rgba(26, 26, 53, 0.4) 100%)'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255, 179, 71, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFB347' }}>
                <Sun size={20} />
              </div>
              <h3 style={{ color: 'white' }}>Daily Questions</h3>
              <p style={{ fontSize: '0.9rem' }}>
                20 personalised revision cards every morning focusing on your backlog topics to lock in core retention.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '4px', marginTop: '20px' }}>
              {[...Array(10)].map((_, i) => (
                <div key={i} style={{ flex: 1, height: '6px', borderRadius: '3px', background: i < 6 ? '#FFB347' : 'rgba(255,255,255,0.1)' }}></div>
              ))}
            </div>
          </div>

          {/* F5: Progress Heatmap (Medium) */}
          <div className="glass-panel col-4" style={{ padding: '30px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                <BarChart3 size={20} />
              </div>
              <h3 style={{ color: 'white' }}>Live Tracking</h3>
              <p style={{ fontSize: '0.9rem' }}>
                Full heatmaps represent your continuous progress in chapters, specific subjects, and board standards.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '20px' }}>
              {[...Array(18)].map((_, i) => (
                <div key={i} style={{ width: '12px', height: '12px', borderRadius: '2px', background: i % 4 === 0 ? '#6C63FF' : i % 5 === 0 ? '#00D4AA' : 'rgba(255,255,255,0.06)' }}></div>
              ))}
            </div>
          </div>

          {/* F6: Mentors (Small) */}
          <div className="glass-panel col-4" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255, 107, 107, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FF6B6B' }}>
              <Users size={18} />
            </div>
            <div>
              <h4 style={{ color: 'white', fontSize: '0.95rem' }}>Mentor Matching</h4>
              <p style={{ fontSize: '0.8rem', color: '#A0A0C0' }}>AI matches you with the ideal verified guide.</p>
            </div>
          </div>

          {/* F7: Parents (Small) */}
          <div className="glass-panel col-4" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
              <Heart size={18} />
            </div>
            <div>
              <h4 style={{ color: 'white', fontSize: '0.95rem' }}>Parent Insights</h4>
              <p style={{ fontSize: '0.8rem', color: '#A0A0C0' }}>Weekly plain-language digests without complex jargon.</p>
            </div>
          </div>

          {/* F8: Gamified (Small) */}
          <div className="glass-panel col-4" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(5, 213, 128, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#05D580' }}>
              <Trophy size={18} />
            </div>
            <div>
              <h4 style={{ color: 'white', fontSize: '0.95rem' }}>Gamification</h4>
              <p style={{ fontSize: '0.8rem', color: '#A0A0C0' }}>Streaks, leaderboards, and rewards for consistency.</p>
            </div>
          </div>

        </div>
      </section>

      {/* 4. Steps Section (How it Works) */}
      <section id="how-it-works" style={{
        padding: '80px 5vw',
        background: '#0a0a14',
        borderTop: '1px solid rgba(255, 255, 255, 0.04)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
        position: 'relative',
        zIndex: 5
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ color: 'white', marginBottom: '16px' }}>Get Started in 3 Steps</h2>
            <p style={{ color: '#A0A0C0' }}>Your personalized study companion up and running in minutes</p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '40px'
          }} className="steps-grid-desktop">
            {[
              { num: '01', title: 'Create Your Profile', desc: 'Tell us your grade, subjects, goals and learning style. Our AI builds your personalised plan in 60 seconds.' },
              { num: '02', title: 'AI Analyses Your Gaps', desc: 'Take a quick diagnostic. AI identifies exactly where you are strong and where you need help most.' },
              { num: '03', title: 'Learn, Practice, Grow', desc: 'Follow your daily AI plan, ask doubts anytime, take mock tests and watch your rank climb.' }
            ].map((step, idx) => (
              <div key={idx} className="glass-panel" style={{
                padding: '40px 30px',
                borderRadius: '20px',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}>
                <span style={{
                  fontSize: '3rem',
                  fontWeight: '900',
                  background: 'var(--gradient-primary)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontFamily: 'var(--font-heading)',
                  opacity: 0.8
                }}>{step.num}</span>
                <h3 style={{ color: 'white', fontSize: '1.25rem' }}>{step.title}</h3>
                <p style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. AI Features Deep Tab Showcases */}
      <section style={{
        padding: '100px 5vw',
        maxWidth: '1280px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 5
      }}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h2 style={{ color: 'white', marginBottom: '16px' }}>AI That Works While You Learn</h2>
          <p style={{ color: '#A0A0C0' }}>Dive deep into our four core intelligence modules</p>
        </div>

        {/* Tab Buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '12px',
          marginBottom: '40px',
          flexWrap: 'wrap'
        }}>
          {[
            { id: 'tab_doubt', label: 'AI Doubt Solver' },
            { id: 'tab_mock', label: 'AI Mock Tests' },
            { id: 'tab_notes', label: 'Smart AI Notes' },
            { id: 'tab_daily', label: 'Daily Questions' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="btn btn-pill"
              style={{
                padding: '12px 24px',
                background: activeTab === tab.id ? 'var(--gradient-primary)' : 'rgba(255,255,255,0.03)',
                color: activeTab === tab.id ? '#0D0D1A' : 'white',
                border: activeTab === tab.id ? 'none' : '1px solid rgba(255,255,255,0.08)',
                fontWeight: '600'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content Display */}
        <div className="glass-panel" style={{
          padding: '40px',
          borderRadius: '24px',
          display: 'grid',
          gridTemplateColumns: '1.1fr 1fr',
          gap: '40px',
          alignItems: 'center',
          background: 'rgba(25, 20, 50, 0.2)'
        }} className="tab-grid-desktop">
          {activeTab === 'tab_doubt' && (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <span className="badge">Available 24/7</span>
                <h3 style={{ color: 'white', fontSize: '1.75rem' }}>Ask any question, instantly resolved</h3>
                <p style={{ fontSize: '0.95rem', lineHeight: '1.7' }}>
                  Ask any question in text, voice or by uploading a photo of your notebook. The AI explains step by step, adapting to your language and conceptual pace.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {['Supports text, voice and image inputs', 'Step-by-step custom explanations', 'Available 24/7 with zero latency', 'Translates answers to 10+ Indian languages'].map((f, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                      <Check size={16} style={{ color: '#00D4AA' }} />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => navigate('signup')} className="btn btn-primary btn-pill" style={{ width: 'fit-content', marginTop: '10px' }}>Try Doubt Solver Now</button>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{
                  background: 'rgba(13, 13, 26, 0.8)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '16px',
                  padding: '20px',
                  width: '100%',
                  maxWidth: '380px',
                  boxShadow: 'var(--shadow-premium)'
                }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '10px', marginBottom: '14px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#00D4AA' }}></div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>AI Doubt Solver (Active)</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '10px', padding: '10px', fontSize: '0.8rem' }}>
                      <strong>User:</strong> Show me the formula for kinetic energy.
                    </div>
                    <div style={{ background: 'rgba(108, 99, 255, 0.1)', border: '1px solid rgba(108, 99, 255, 0.2)', borderRadius: '10px', padding: '10px', fontSize: '0.8rem', color: '#B88EFC', lineHeight: '1.4' }}>
                      <strong>AI Tutor:</strong> Kinetic Energy (KE) is the energy of motion: <br />
                      <code style={{ background: '#0D0D1A', color: 'white', padding: '2px 6px', display: 'inline-block', margin: '4px 0' }}>KE = ½mv²</code> <br />
                      where <i>m</i> is mass and <i>v</i> is velocity. Let's practice with an example!
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'tab_mock' && (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <span className="badge">Adaptive Learning</span>
                <h3 style={{ color: 'white', fontSize: '1.75rem' }}>Tests that get smarter with you</h3>
                <p style={{ fontSize: '0.95rem', lineHeight: '1.7' }}>
                  Target weak chapters dynamically. Detailed AI insights prediction maps out chapter-wise proficiency levels and JEE/NEET rank forecasts.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {['National exams CBT formats (JEE, NEET, Boards)', 'Adaptive testing based on real performance', 'Accuracy heatmaps and detailed analytical summaries', 'Simulated rough-work panels'].map((f, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                      <Check size={16} style={{ color: '#00D4AA' }} />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => navigate('signup')} className="btn btn-primary btn-pill" style={{ width: 'fit-content', marginTop: '10px' }}>Start Mock Test</button>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div className="glass-panel" style={{ padding: '20px', width: '100%', maxWidth: '380px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#A0A0C0', marginBottom: '14px' }}>
                    <span>JEE Mock Test #04</span>
                    <span style={{ color: '#FF6B6B' }}>12:45 remaining</span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'white', fontWeight: '500', marginBottom: '12px' }}>Q14: An object moves with constant acceleration. What is the displacement?</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {['s = ut + ½at²', 's = vt + at', 's = u + at', 'None of these'].map((opt, i) => (
                      <div key={i} style={{
                        padding: '10px',
                        background: i === 0 ? 'rgba(0, 212, 170, 0.1)' : 'rgba(255,255,255,0.02)',
                        border: i === 0 ? '1px solid #00D4AA' : '1px solid rgba(255,255,255,0.06)',
                        borderRadius: '8px',
                        fontSize: '0.75rem',
                        color: i === 0 ? '#00D4AA' : 'white'
                      }}>
                        {opt}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'tab_notes' && (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <span className="badge">Smart Capturing</span>
                <h3 style={{ color: 'white', fontSize: '1.75rem' }}>Auto-notes generated during classes</h3>
                <p style={{ fontSize: '0.95rem', lineHeight: '1.7' }}>
                  Join dynamic classes and let AI transcribe lectures, detect key definitions, index formulas, and compile flashcards in real time.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {['Real-time audio-to-text lectures summary', 'Formulas indexed and auto-highlighted', 'One-click Flashcards compilation', 'Export directly to PDF, Notion or Docs'].map((f, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                      <Check size={16} style={{ color: '#00D4AA' }} />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => navigate('signup')} className="btn btn-primary btn-pill" style={{ width: 'fit-content', marginTop: '10px' }}>View Notes Panel</button>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div className="glass-panel" style={{ padding: '20px', width: '100%', maxWidth: '380px' }}>
                  <div style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '8px', marginBottom: '12px' }}>
                    <span style={{ fontSize: '0.75rem', color: '#00D4AA', fontWeight: 'bold' }}>Live Capturing...</span>
                  </div>
                  <div style={{ fontStyle: 'italic', fontSize: '0.8rem', color: '#A0A0C0', marginBottom: '10px' }}>
                    "...momentum is conserved in all closed systems..."
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '8px', fontSize: '0.75rem', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <span style={{ color: '#6C63FF', fontWeight: 'bold' }}>AI Auto-Highlight:</span> <br />
                    <strong>Law of Conservation of Momentum:</strong> Total momentum remains constant within an isolated system.
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'tab_daily' && (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <span className="badge">Daily Habit</span>
                <h3 style={{ color: 'white', fontSize: '1.75rem' }}>10 targeted questions every morning</h3>
                <p style={{ fontSize: '0.95rem', lineHeight: '1.7' }}>
                  Every morning at 7:00 AM, get exactly 10 cards selected from chapters where you had low scores. Solve them in 20 minutes to claim streak rewards.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {['Targeted gap revision based on test results', 'Solve questions within 20 mins to save streak', 'Dynamic hints with dynamic XP currency', 'Instant step-by-step reveals'].map((f, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                      <Check size={16} style={{ color: '#00D4AA' }} />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => navigate('signup')} className="btn btn-primary btn-pill" style={{ width: 'fit-content', marginTop: '10px' }}>Review Revision Cards</button>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div className="glass-panel" style={{ padding: '20px', width: '100%', maxWidth: '320px', borderLeft: '3px solid #FFB347' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '8px' }}>
                    <span style={{ color: '#FFB347', fontWeight: 'bold' }}>Card 03/10</span>
                    <span>Physics: Waves</span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'white', marginBottom: '10px' }}>What is the velocity of sound in a vacuum?</p>
                  <span style={{ fontSize: '0.75rem', color: '#00D4AA', background: 'rgba(0, 212, 170, 0.1)', padding: '4px 8px', borderRadius: '4px' }}>0 m/s (Sound needs a medium!)</span>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* 6. Dashboards Preview with Role Switcher */}
      <section id="educators" style={{
        padding: '80px 5vw',
        background: 'rgba(255,255,255,0.01)',
        borderTop: '1px solid rgba(255,255,255,0.04)',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        position: 'relative',
        zIndex: 5
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 style={{ color: 'white', marginBottom: '16px' }}>Built for Everyone in the Journey</h2>
            <p style={{ color: '#A0A0C0' }}>Select your role to preview custom interfaces and dashboards</p>
          </div>

          {/* Role selector */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '16px',
            marginBottom: '40px'
          }}>
            {[
              { id: 'student_role', label: 'For Students', icon: '🎓' },
              { id: 'educator_role', label: 'For Educators', icon: '🏫' },
              { id: 'parent_role', label: 'For Parents', icon: '🏠' }
            ].map((role) => (
              <button
                key={role.id}
                onClick={() => setActiveRole(role.id)}
                className="btn"
                style={{
                  background: activeRole === role.id ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                  border: activeRole === role.id ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid transparent',
                  borderRadius: '12px',
                  color: 'white',
                  padding: '12px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontWeight: '600'
                }}
              >
                <span>{role.icon}</span> {role.label}
              </button>
            ))}
          </div>

          {/* Role Preview Card */}
          <div className="glass-panel" style={{
            padding: '40px',
            borderRadius: '24px',
            display: 'grid',
            gridTemplateColumns: '1fr 1.2fr',
            gap: '40px',
            alignItems: 'center'
          }} className="role-grid-desktop">
            
            {/* Left explanation */}
            {activeRole === 'student_role' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h3 style={{ color: 'white', fontSize: '1.5rem' }}>Personal AI learning companion</h3>
                <p style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
                  A clean, gamified home interface detailing active progress, revision tasks, and test results.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {['Progress Heatmap', 'AI Doubt solver', 'Mock Scores', 'Daily Streak', 'Leaderboard'].map((tag, idx) => (
                    <span key={idx} style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.03)', padding: '6px 12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.08)' }}>{tag}</span>
                  ))}
                </div>
                <button onClick={() => navigate('signup')} className="btn btn-primary btn-pill" style={{ width: 'fit-content' }}>Join as Student</button>
              </div>
            )}

            {activeRole === 'educator_role' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h3 style={{ color: 'white', fontSize: '1.5rem' }}>Complete class performance hub</h3>
                <p style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
                  Gain instant insights into which students are lagging in specific chapters. Autograde assignments using custom AI engines.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {['Class Analytics', 'Lagging Student alert', 'AI Question Generator', 'Auto grading'].map((tag, idx) => (
                    <span key={idx} style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.03)', padding: '6px 12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.08)' }}>{tag}</span>
                  ))}
                </div>
                <button onClick={() => navigate('signup')} className="btn btn-primary btn-pill" style={{ width: 'fit-content' }}>Join as Educator</button>
              </div>
            )}

            {activeRole === 'parent_role' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h3 style={{ color: 'white', fontSize: '1.5rem' }}>Plain-language student summaries</h3>
                <p style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
                  Understand your child's milestones without educational jargon. Receive reports, attendance timelines, and upcoming mocks directly.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {['Simple English reports', 'Attendance timeline', 'Test countdowns', 'Direct Educator message'].map((tag, idx) => (
                    <span key={idx} style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.03)', padding: '6px 12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.08)' }}>{tag}</span>
                  ))}
                </div>
                <button onClick={() => navigate('signup')} className="btn btn-primary btn-pill" style={{ width: 'fit-content' }}>Join as Parent</button>
              </div>
            )}

            {/* Right Screen Preview (High Fidelity Mockup image/visual) */}
            <div style={{
              background: '#0D0D1A',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '20px',
              boxShadow: 'var(--shadow-premium)',
              minHeight: '280px'
            }}>
              {activeRole === 'student_role' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '10px', marginBottom: '16px' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>🎓 Student Dashboard</span>
                    <span style={{ fontSize: '0.75rem', color: '#00D4AA' }}>🔥 14-Day Streak</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '16px' }}>
                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <span style={{ fontSize: '0.65rem', color: '#A0A0C0' }}>XP Earned</span>
                      <p style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'white' }}>4,250</p>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <span style={{ fontSize: '0.65rem', color: '#A0A0C0' }}>Doubts Solved</span>
                      <p style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'white' }}>24</p>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <span style={{ fontSize: '0.65rem', color: '#A0A0C0' }}>Accuracy</span>
                      <p style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'white' }}>81%</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', background: 'rgba(108, 99, 255, 0.08)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(108, 99, 255, 0.2)' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#6C63FF' }}></div>
                    <span style={{ fontSize: '0.75rem' }}>AI Insight: "Thermodynamics improved by 15% this week!"</span>
                  </div>
                </div>
              )}

              {activeRole === 'educator_role' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '10px', marginBottom: '16px' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>🏫 Class Performance Hub</span>
                    <span style={{ fontSize: '0.75rem', color: '#FFB347' }}>⚠️ 3 Actions Required</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', background: 'rgba(255, 107, 107, 0.08)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255, 107, 107, 0.2)', fontSize: '0.75rem' }}>
                      <span>🚨 At Risk: 4 students scoring below 40% in Electrostatics</span>
                      <span style={{ color: '#FF6B6B', fontWeight: 'bold', cursor: 'pointer' }}>Review</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', fontSize: '0.75rem' }}>
                      <span>📝 Assignment #08 Graded with AI</span>
                      <span style={{ color: '#00D4AA', fontWeight: 'bold' }}>Completed</span>
                    </div>
                  </div>
                </div>
              )}

              {activeRole === 'parent_role' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '10px', marginBottom: '16px' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>🏠 Parent Portal</span>
                    <span style={{ fontSize: '0.75rem', color: '#00D4AA' }}>Active Monitoring</span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'white', fontWeight: '500', marginBottom: '8px' }}>Weekly Simple Report:</p>
                  <p style={{ fontSize: '0.75rem', color: '#A0A0C0', lineHeight: '1.4', marginBottom: '12px' }}>
                    "Arjun excelled in Physics waves revision today, completing all 10 cards. Overall conceptual health is high (84%). Consider letting him practice Maths Mock #02 this weekend."
                  </p>
                  <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>
                    <div style={{ width: '84%', height: '100%', background: '#00D4AA', borderRadius: '4px' }}></div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </section>

      {/* 7. Testimonials Section */}
      <section style={{
        padding: '100px 5vw',
        maxWidth: '1280px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 5
      }}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h2 style={{ color: 'white', marginBottom: '16px' }}>What Students & Teachers Say</h2>
          <p style={{ color: '#A0A0C0' }}>Stories of success from all over India</p>
        </div>

        <div style={{
          display: 'flex',
          gap: '24px',
          overflowX: 'auto',
          paddingBottom: '20px',
          scrollSnapType: 'x mandatory'
        }} className="scroll-horizontal-snap">
          {[
            { name: "Priya Sharma", role: "JEE Aspirant, Delhi", color: "#6C63FF", text: "The AI doubt solver is insane. I asked a question at 2 AM before my exam and got a perfect step-by-step answer. No human tutor could do that!" },
            { name: "Rohit Mehta", role: "Physics Teacher, Mumbai", color: "#00D4AA", text: "The educator dashboard shows me exactly which students are struggling in which chapter. I can now focus my attention where it actually matters." },
            { name: "Sunita Agarwal", role: "Parent, Jaipur", color: "#FF6B6B", text: "Finally a platform that tells me in simple words how my daughter is doing. No jargon, just clear weekly updates. I trust this platform completely." },
            { name: "Arjun Singh", role: "NEET Aspirant, Lucknow", color: "#FFB347", text: "The daily 10 questions are a game changer. I used to skip revision but now it's just 20 mins every morning and my score jumped by 15 marks." }
          ].map((t, i) => (
            <div key={i} className="glass-panel" style={{
              flex: '0 0 300px',
              padding: '30px',
              borderRadius: '20px',
              scrollSnapAlign: 'start',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '20px'
            }}>
              <p style={{ fontSize: '0.85rem', lineHeight: '1.6', color: 'white', fontStyle: 'italic' }}>"{t.text}"</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: t.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  color: '#0D0D1A',
                  fontSize: '0.85rem'
                }}>
                  {t.name.split(' ').map(x=>x[0]).join('')}
                </div>
                <div>
                  <h4 style={{ fontSize: '0.85rem', color: 'white' }}>{t.name}</h4>
                  <span style={{ fontSize: '0.75rem', color: '#A0A0C0' }}>{t.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Pricing Section */}
      <section id="pricing" style={{
        padding: '80px 5vw 100px',
        background: '#070712',
        borderTop: '1px solid rgba(255, 255, 255, 0.04)',
        position: 'relative',
        zIndex: 5
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 style={{ color: 'white', marginBottom: '16px' }}>Simple, Honest Pricing</h2>
            <p style={{ color: '#A0A0C0', marginBottom: '30px' }}>Start free, upgrade when you need higher computational capacities.</p>

            {/* Toggle */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              padding: '6px',
              borderRadius: '50px',
              gap: '4px'
            }}>
              <button
                onClick={() => setBillingCycle('monthly')}
                className="btn btn-pill"
                style={{
                  padding: '8px 20px',
                  fontSize: '0.85rem',
                  background: billingCycle === 'monthly' ? 'var(--primary-color)' : 'transparent',
                  color: billingCycle === 'monthly' ? '#0D0D1A' : 'white',
                  border: 'none'
                }}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className="btn btn-pill"
                style={{
                  padding: '8px 20px',
                  fontSize: '0.85rem',
                  background: billingCycle === 'annual' ? 'var(--primary-color)' : 'transparent',
                  color: billingCycle === 'annual' ? '#0D0D1A' : 'white',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                Annual <span style={{ fontSize: '0.7rem', background: '#0D0D1A', color: 'var(--secondary-color)', padding: '2px 6px', borderRadius: '10px' }}>Save 40%</span>
              </button>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '30px'
          }} className="pricing-grid-desktop">
            
            {/* Plan 1 */}
            <div className="glass-panel" style={{ padding: '40px 30px', borderRadius: '24px', display: 'flex', flexDirection: 'column', justifyBetween: 'space-between', gap: '30px' }}>
              <div>
                <h3 style={{ color: 'white', marginBottom: '8px' }}>Explorer</h3>
                <p style={{ fontSize: '0.85rem', color: '#A0A0C0' }}>Kickstart your AI-assisted growth</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', margin: '24px 0 10px' }}>
                  <span style={{ fontSize: '2.5rem', fontWeight: '800', color: 'white' }}>₹0</span>
                  <span style={{ color: '#A0A0C0', fontSize: '0.85rem' }}>/ forever</span>
                </div>
                <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', margin: '10px 0 20px' }}></div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {['5 AI doubt questions / day', '2 AI mock tests / month', 'Basic progress heatmap', 'Daily 5 practice cards'].map((feat, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '8px', fontSize: '0.85rem', color: '#A0A0C0' }}>
                      <Check size={16} style={{ color: '#A0A0C0' }} />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
              <button onClick={() => navigate('signup')} className="btn btn-secondary btn-pill" style={{ width: '100%' }}>Get Started</button>
            </div>

            {/* Plan 2 */}
            <div className="glass-panel" style={{
              padding: '40px 30px',
              borderRadius: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyBetween: 'space-between',
              gap: '30px',
              background: 'linear-gradient(135deg, rgba(108, 99, 255, 0.15) 0%, rgba(13, 13, 26, 0.8) 100%)',
              border: '1px solid rgba(108, 99, 255, 0.3)',
              position: 'relative'
            }}>
              <span className="badge" style={{ position: 'absolute', top: '20px', right: '20px', background: 'var(--primary-color)', color: '#0D0D1A', border: 'none' }}>Most Popular</span>
              <div>
                <h3 style={{ color: 'white', marginBottom: '8px' }}>Achiever</h3>
                <p style={{ fontSize: '0.85rem', color: '#A0A0C0' }}>Perfect computational power for serious exam cracking</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', margin: '24px 0 10px' }}>
                  <span style={{ fontSize: '2.5rem', fontWeight: '800', color: 'white' }}>
                    ₹{billingCycle === 'monthly' ? '499' : '299'}
                  </span>
                  <span style={{ color: '#A0A0C0', fontSize: '0.85rem' }}>/ month</span>
                </div>
                <div style={{ borderBottom: '1px solid rgba(108, 99, 255, 0.2)', margin: '10px 0 20px' }}></div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {['Unlimited AI doubt solving', 'Unlimited adaptive mock tests', 'Smart AI Notes real-time compiler', 'Daily 10 revision questions', 'Full analytics & progress dashboard', 'Mentor matching (2 sessions / mo)'].map((feat, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '8px', fontSize: '0.85rem', color: 'white' }}>
                      <Check size={16} style={{ color: 'var(--secondary-color)' }} />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
              <button onClick={() => navigate('signup')} className="btn btn-primary btn-glow btn-pill" style={{ width: '100%' }}>Start 7-Day Trial</button>
            </div>

            {/* Plan 3 */}
            <div className="glass-panel" style={{ padding: '40px 30px', borderRadius: '24px', display: 'flex', flexDirection: 'column', justifyBetween: 'space-between', gap: '30px' }}>
              <div>
                <h3 style={{ color: 'white', marginBottom: '8px' }}>Champion</h3>
                <p style={{ fontSize: '0.85rem', color: '#A0A0C0' }}>Complete ultimate personal support</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', margin: '24px 0 10px' }}>
                  <span style={{ fontSize: '2.5rem', fontWeight: '800', color: 'white' }}>
                    ₹{billingCycle === 'monthly' ? '999' : '599'}
                  </span>
                  <span style={{ color: '#A0A0C0', fontSize: '0.85rem' }}>/ month</span>
                </div>
                <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', margin: '10px 0 20px' }}></div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {['Everything in Achiever', 'Unlimited mentor sessions 1:1', '1:1 custom AI syllabus scheduler', 'Dedicated student success manager', 'Offline study notes compilation packs'].map((feat, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '8px', fontSize: '0.85rem', color: '#A0A0C0' }}>
                      <Check size={16} style={{ color: '#A0A0C0' }} />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
              <button onClick={() => navigate('signup')} className="btn btn-secondary btn-pill" style={{ width: '100%' }}>Upgrade to Champion</button>
            </div>

          </div>
        </div>
      </section>

      {/* 9. CTA Section Banner */}
      <section style={{
        padding: '100px 5vw',
        background: 'var(--gradient-primary)',
        textAlign: 'center',
        position: 'relative',
        zIndex: 5
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
          <h2 style={{ color: '#0D0D1A', fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: '800' }}>Ready to Study Smarter?</h2>
          <p style={{ color: 'rgba(13, 13, 26, 0.75)', fontSize: '1.15rem', fontWeight: '500', maxWidth: '560px' }}>
            Join 50,000+ Indian students already ahead in their JEE, NEET, and Boards prep. Start free today.
          </p>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '10px' }}>
            <button onClick={() => navigate('signup')} className="btn btn-pill" style={{ background: '#0D0D1A', color: 'white', padding: '16px 36px', fontSize: '1rem', fontWeight: '700' }}>Create Free Account</button>
            <button onClick={() => navigate('signup')} className="btn btn-pill btn-ghost" style={{ color: '#0D0D1A', border: '1px solid rgba(13,13,26,0.3)', padding: '16px 36px', fontSize: '1rem', fontWeight: '700' }}>Talk to Us</button>
          </div>
        </div>
      </section>

      {/* Demo Video Modal */}
      {showDemoVideo && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(13, 13, 26, 0.9)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1100,
          padding: '24px'
        }}>
          <div className="glass-panel" style={{
            width: '100%',
            maxWidth: '700px',
            padding: '30px',
            borderRadius: '24px',
            position: 'relative'
          }}>
            <button 
              onClick={() => setShowDemoVideo(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'transparent',
                border: 'none',
                color: 'white',
                fontSize: '1.25rem',
                cursor: 'pointer'
              }}
            >
              ✕
            </button>
            <h3 style={{ color: 'white', marginBottom: '20px' }}>Watch Olympiz.ai in Action ⚡</h3>
            <div style={{
              width: '100%',
              aspectRatio: '16/9',
              background: '#0D0D1A',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px'
            }}>
              <PlayCircle size={48} style={{ color: 'var(--primary-color)' }} />
              <p style={{ color: '#A0A0C0', fontSize: '0.85rem' }}>Simulated Video Stream - Learn Smarter. Grow Faster.</p>
            </div>
            <p style={{ marginTop: '20px', fontSize: '0.9rem', color: '#A0A0C0', lineHeight: '1.5' }}>
              In this demo, see how easy it is to ask AI doubts directly by uploading photos, generate custom mock tests, and review weekly parent reports.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
