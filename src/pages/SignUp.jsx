import React, { useState } from 'react';
import { 
  Sparkles, Star, Award, Shield, Check, 
  GraduationCap, Users, User, Phone, Mail, Lock, Eye, EyeOff
} from 'lucide-react';

export default function SignUp({ navigate, loginUser }) {
  const [role, setRole] = useState('student'); // 'student' | 'educator' | 'parent'
  
  // Basic Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Student specific
  const [studentGrade, setStudentGrade] = useState('Class 11');
  const [targetExams, setTargetExams] = useState(['JEE Main']);
  const [selectedSubjects, setSelectedSubjects] = useState(['Physics', 'Chemistry', 'Mathematics']);

  // Educator specific
  const [educatorSubjects, setEducatorSubjects] = useState(['Physics']);
  const [experience, setExperience] = useState('3-5 years');

  // Parent specific
  const [childGrade, setChildGrade] = useState('Class 9');

  // Password strength logic
  const getPasswordStrength = () => {
    if (!password) return { label: 'Empty', score: 0, color: '#626280' };
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    if (score <= 1) return { label: 'Weak 🔴', score, color: '#FF6B6B' };
    if (score === 2 || score === 3) return { label: 'Medium 🟡', score, color: '#FFB347' };
    return { label: 'Strong 🔥', score, color: '#00D4AA' };
  };

  const handleTargetExamToggle = (exam) => {
    if (targetExams.includes(exam)) {
      setTargetExams(targetExams.filter(e => e !== exam));
    } else {
      setTargetExams([...targetExams, exam]);
    }
  };

  const handleSubjectToggle = (sub) => {
    if (selectedSubjects.includes(sub)) {
      setSelectedSubjects(selectedSubjects.filter(s => s !== sub));
    } else {
      setSelectedSubjects([...selectedSubjects, sub]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !phone || !password) {
      alert("Please fill in all core fields!");
      return;
    }

    const userData = {
      name,
      email,
      phone,
      role,
      details: role === 'student' ? { studentGrade, targetExams, selectedSubjects } : 
               role === 'educator' ? { educatorSubjects, experience } : { childGrade }
    };
    
    loginUser(userData);

    // Dynamic routing
    if (role === 'student') {
      navigate('onboarding');
    } else if (role === 'parent') {
      navigate('dashboard-parent');
    } else {
      navigate('dashboard-educator'); // Educators go straight to their dashboard
    }
  };

  const strength = getPasswordStrength();

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1.2fr',
      minHeight: 'calc(100vh - 76px)',
      position: 'relative',
      zIndex: 5,
      fontFamily: "'Inter', sans-serif"
    }} className="signup-grid-desktop">

      {/* Left Panel: Highlights */}
      <div style={{
        background: 'linear-gradient(135deg, #0D0D1A 0%, #1A0533 100%)',
        padding: '60px 4vw',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderRight: '1px solid rgba(255, 255, 255, 0.05)',
        position: 'relative',
        overflow: 'hidden'
      }} className="signup-left-panel">
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          <div className="badge badge-gradient">
            <Sparkles size={14} style={{ marginRight: '6px', color: '#6C63FF' }} />
            <span>Smart AI Study Partnership</span>
          </div>

          <h2 style={{ color: 'white', fontSize: '2.5rem', lineHeight: '1.2' }}>
            Unlock Your <br />
            Potential with <br />
            Personalised AI
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
            {[
              { title: '24/7 Live Tutor doubts clearing', desc: 'Never get stuck on any equations or diagrams.' },
              { title: 'Self-adapting diagnostic syllabus gaps', desc: 'Dynamic revisions generated for your lagged lessons.' },
              { title: 'Structured flashcards and auto notes', desc: 'Automatically compiled logs for easy revision.' }
            ].map((f, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px' }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: 'rgba(0, 212, 170, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#00D4AA',
                  flexShrink: 0
                }}>
                  <Check size={14} />
                </div>
                <div>
                  <h4 style={{ color: 'white', fontSize: '0.95rem', fontWeight: '600' }}>{f.title}</h4>
                  <p style={{ color: '#A0A0C0', fontSize: '0.85rem', marginTop: '2px' }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Testimonial */}
        <div className="glass-panel" style={{
          padding: '20px',
          borderRadius: '16px',
          background: 'rgba(255, 255, 255, 0.02)',
          marginTop: '40px'
        }}>
          <p style={{ fontSize: '0.8rem', color: 'white', fontStyle: 'italic', marginBottom: '12px' }}>
            "The personalized revision cards and streak points changed how I studied. I cleared my Physics backlog in just 2 weeks!"
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#6C63FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 'bold' }}>PS</div>
            <div>
              <h5 style={{ fontSize: '0.8rem', color: 'white' }}>Priya Sharma</h5>
              <span style={{ fontSize: '0.7rem', color: '#A0A0C0' }}>JEE Aspirant, Delhi</span>
            </div>
          </div>
        </div>

        {/* Ambient background decoration */}
        <div style={{
          position: 'absolute',
          width: '200px',
          height: '200px',
          background: '#6C63FF',
          filter: 'blur(100px)',
          opacity: 0.1,
          bottom: '-50px',
          left: '-50px'
        }}></div>
      </div>

      {/* Right Panel: Scrollable Form */}
      <div style={{
        padding: '50px 5vw',
        background: '#0D0D1A',
        overflowY: 'auto'
      }} className="signup-right-panel">
        
        <div style={{ maxWidth: '440px', margin: '0 auto' }}>
          <h2 style={{ color: 'white', fontSize: '1.75rem', marginBottom: '6px' }}>Create Your Account</h2>
          <p style={{ color: '#A0A0C0', fontSize: '0.9rem', marginBottom: '32px' }}>Free forever. No credit card needed.</p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* 1. Name */}
            <div className="form-group">
              <label>Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: '14px', top: '16px', color: '#626280' }} />
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Arjun Kumar" 
                  required 
                  className="form-input" 
                  style={{ paddingLeft: '44px', width: '100%' }}
                />
              </div>
            </div>

            {/* 2. Email */}
            <div className="form-group">
              <label>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '14px', top: '16px', color: '#626280' }} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com" 
                  required 
                  className="form-input" 
                  style={{ paddingLeft: '44px', width: '100%' }}
                />
              </div>
            </div>

            {/* 3. Phone */}
            <div className="form-group">
              <label>Phone Number</label>
              <div style={{ position: 'relative' }}>
                <Phone size={16} style={{ position: 'absolute', left: '14px', top: '16px', color: '#626280' }} />
                <input 
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 9876543210" 
                  required 
                  className="form-input" 
                  style={{ paddingLeft: '44px', width: '100%' }}
                />
              </div>
            </div>

            {/* 4. Password */}
            <div className="form-group">
              <label>Create Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '14px', top: '16px', color: '#626280' }} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters" 
                  required 
                  className="form-input" 
                  style={{ paddingLeft: '44px', paddingRight: '44px', width: '100%' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '14px',
                    top: '16px',
                    background: 'transparent',
                    border: 'none',
                    color: '#626280',
                    cursor: 'pointer'
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              
              {/* Strength meter */}
              {password && (
                <div style={{ marginTop: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
                    <span style={{ color: '#A0A0C0' }}>Password Strength:</span>
                    <span style={{ color: strength.color, fontWeight: 'bold' }}>{strength.label}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '4px', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px' }}>
                    {[...Array(4)].map((_, i) => (
                      <div key={i} style={{
                        flex: 1,
                        height: '100%',
                        borderRadius: '2px',
                        background: i < strength.score ? strength.color : 'transparent'
                      }}></div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 5. Role Selector */}
            <div className="form-group">
              <label>I am a</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                {[
                  { value: 'student', label: 'Student', icon: '🎓' },
                  { value: 'educator', label: 'Educator', icon: '🏫' },
                  { value: 'parent', label: 'Parent', icon: '🏠' }
                ].map((option) => (
                  <div 
                    key={option.value}
                    onClick={() => setRole(option.value)}
                    style={{
                      background: role === option.value ? 'rgba(108, 99, 255, 0.1)' : 'rgba(255,255,255,0.02)',
                      border: role === option.value ? '1px solid #6C63FF' : '1px solid rgba(255, 255, 255, 0.06)',
                      borderRadius: '12px',
                      padding: '14px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'all 0.2s'
                    }}
                  >
                    <span style={{ fontSize: '1.25rem' }}>{option.icon}</span>
                    <span style={{ fontSize: '0.8rem', fontWeight: '600', color: role === option.value ? '#white' : '#A0A0C0' }}>{option.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* --- Conditional Form Fields --- */}
            
            {/* Student Options */}
            {role === 'student' && (
              <div style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                padding: '20px',
                borderRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                animation: 'fadeIn 0.3s ease'
              }}>
                <h4 style={{ color: '#00D4AA', fontSize: '0.9rem', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '8px' }}>Student Profile Details</h4>
                
                <div className="form-group">
                  <label>Current Grade / Class</label>
                  <select 
                    value={studentGrade} 
                    onChange={(e) => setStudentGrade(e.target.value)} 
                    className="form-input"
                    style={{ width: '100%', background: '#13132B' }}
                  >
                    {["Class 9", "Class 10", "Class 11", "Class 12", "Dropper"].map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Target Exam(s)</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {["JEE Main", "JEE Advanced", "NEET", "Class 10 Boards", "Class 12 Boards"].map((exam) => {
                      const isSelected = targetExams.includes(exam);
                      return (
                        <div 
                          key={exam}
                          onClick={() => handleTargetExamToggle(exam)}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '50px',
                            background: isSelected ? 'rgba(0, 212, 170, 0.15)' : 'rgba(255,255,255,0.03)',
                            border: isSelected ? '1px solid #00D4AA' : '1px solid rgba(255,255,255,0.08)',
                            fontSize: '0.75rem',
                            color: isSelected ? '#00D4AA' : '#A0A0C0',
                            cursor: 'pointer',
                            userSelect: 'none'
                          }}
                        >
                          {exam}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="form-group">
                  <label>Subjects</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {["Physics", "Chemistry", "Mathematics", "Biology (Botany)", "Biology (Zoology)", "English"].map((sub) => {
                      const isSelected = selectedSubjects.includes(sub);
                      return (
                        <div 
                          key={sub}
                          onClick={() => handleSubjectToggle(sub)}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '50px',
                            background: isSelected ? 'rgba(108, 99, 255, 0.15)' : 'rgba(255,255,255,0.03)',
                            border: isSelected ? '1px solid #6C63FF' : '1px solid rgba(255,255,255,0.08)',
                            fontSize: '0.75rem',
                            color: isSelected ? '#B88EFC' : '#A0A0C0',
                            cursor: 'pointer',
                            userSelect: 'none'
                          }}
                        >
                          {sub}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Educator Options */}
            {role === 'educator' && (
              <div style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                padding: '20px',
                borderRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                animation: 'fadeIn 0.3s ease'
              }}>
                <h4 style={{ color: '#00D4AA', fontSize: '0.9rem', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '8px' }}>Teaching Preferences</h4>
                
                <div className="form-group">
                  <label>Subject You Teach</label>
                  <select 
                    multiple
                    value={educatorSubjects}
                    onChange={(e) => setEducatorSubjects(Array.from(e.target.selectedOptions, option => option.value))}
                    className="form-input"
                    style={{ width: '100%', minHeight: '80px', background: '#13132B' }}
                  >
                    {["Physics", "Chemistry", "Mathematics", "Biology (Botany)", "Biology (Zoology)", "English", "Computer Science"].map((sub) => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                  <span style={{ fontSize: '0.7rem', color: '#626280' }}>Hold Ctrl/Cmd to select multiple.</span>
                </div>

                <div className="form-group">
                  <label>Experience</label>
                  <select 
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="form-input"
                    style={{ width: '100%', background: '#13132B' }}
                  >
                    {["0-2 years", "3-5 years", "6-10 years", "10+ years"].map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Parent Options */}
            {role === 'parent' && (
              <div style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                padding: '20px',
                borderRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                animation: 'fadeIn 0.3s ease'
              }}>
                <h4 style={{ color: '#00D4AA', fontSize: '0.9rem', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '8px' }}>Child Details</h4>
                
                <div className="form-group">
                  <label>Child's Grade</label>
                  <select 
                    value={childGrade}
                    onChange={(e) => setChildGrade(e.target.value)}
                    className="form-input"
                    style={{ width: '100%', background: '#13132B' }}
                  >
                    {["Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12"].map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Submit */}
            <button 
              type="submit" 
              className="btn btn-primary btn-glow btn-large"
              style={{ width: '100%', marginTop: '10px' }}
            >
              Create My Account →
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '24px 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }}></div>
            <span style={{ fontSize: '0.75rem', color: '#626280' }}>OR CONTINUE WITH</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }}></div>
          </div>

          {/* OAuth options */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <button 
              onClick={() => {
                loginUser({ name: 'Arjun Kumar', role: 'student', streak: 14, xp: 450 });
                navigate('onboarding');
              }}
              className="btn btn-secondary" 
              style={{ fontSize: '0.85rem', width: '100%' }}
            >
              Google
            </button>
            <button 
              onClick={() => {
                loginUser({ name: 'Rohit Mehta', role: 'educator' });
                navigate('dashboard-educator');
              }}
              className="btn btn-secondary" 
              style={{ fontSize: '0.85rem', width: '100%' }}
            >
              Apple
            </button>
          </div>

          <p style={{ textAlign: 'center', color: '#A0A0C0', fontSize: '0.85rem', marginTop: '30px' }}>
            Already have an account? <span onClick={() => {
              loginUser({ name: 'Arjun Kumar', role: 'student', streak: 14, xp: 450 });
              navigate('dashboard-student');
            }} style={{ color: 'var(--primary-color)', cursor: 'pointer', fontWeight: '600' }}>Log In</span>
          </p>
        </div>

      </div>

    </div>
  );
}
