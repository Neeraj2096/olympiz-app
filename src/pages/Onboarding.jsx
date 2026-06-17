import React, { useState } from 'react';
import { Sparkles, Brain, Clock, ChevronRight, Check, ArrowRight, Loader } from 'lucide-react';

export default function Onboarding({ navigate, updateUserData }) {
  const [step, setStep] = useState(1);
  
  // Step 1 States
  const [learningGoal, setLearningGoal] = useState('Crack JEE/NEET');
  const [studyHours, setStudyHours] = useState(4);

  // Step 2 States (Diagnostic Questions)
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [analyzing, setAnalyzing] = useState(false);

  const diagnosticQuestions = [
    {
      id: 'q1',
      subject: 'Physics',
      q: 'Which of the following describes the relation between velocity, displacement, and time for constant acceleration?',
      opts: ['v = u + at', 's = ut + ½at²', 'v² = u² + 2as', 'All of the above'],
      correct: 3
    },
    {
      id: 'q2',
      subject: 'Mathematics',
      q: 'What is the limit of (sin x) / x as x approaches 0?',
      opts: ['0', '1', 'Infinity', 'Undefined'],
      correct: 1
    },
    {
      id: 'q3',
      subject: 'Chemistry',
      q: 'Which of the following organic reaction mechanisms typically results in the inversion of configuration (Walden Inversion)?',
      opts: ['SN1 mechanism', 'SN2 mechanism', 'E1 elimination', 'Electrophilic addition'],
      correct: 1
    },
    {
      id: 'q4',
      subject: 'Physics',
      q: 'The second law of thermodynamics implies that:',
      opts: ['Energy is conserved', 'Entropy of an isolated system always increases', 'Absolute zero is achievable', 'Heat can flow spontaneously from cold to hot'],
      correct: 1
    },
    {
      id: 'q5',
      subject: 'Mathematics',
      q: 'If matrices A and B are of order 3x4 and 4x3 respectively, what is the order of AB?',
      opts: ['3x3', '4x4', '3x4', 'Undefined'],
      correct: 0
    }
  ];

  const handleSelectAnswer = (qIdx, optIdx) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [qIdx]: optIdx
    });
  };

  const handleDiagnosticNext = () => {
    if (activeQuestion < diagnosticQuestions.length - 1) {
      setActiveQuestion(activeQuestion + 1);
    } else {
      // Diagnostic complete, analyze
      setAnalyzing(true);
      setTimeout(() => {
        setAnalyzing(false);
        setStep(3);
      }, 3000);
    }
  };

  const finishOnboarding = () => {
    // Save onboarding outputs to App state
    const onboardingDetails = {
      learningGoal,
      studyHours,
      diagnosticScore: Object.keys(selectedAnswers).filter(
        qIdx => selectedAnswers[qIdx] === diagnosticQuestions[qIdx].correct
      ).length * 20, // percentage score
      weakChapters: ['Thermodynamics (Physics) - Low accuracy (25%)', 'SN1 mechanisms (Chemistry) - Partial mastery (50%)']
    };
    updateUserData(onboardingDetails);
    navigate('dashboard-student');
  };

  return (
    <div style={{
      maxWidth: '680px',
      margin: '40px auto 80px',
      padding: '0 20px',
      position: 'relative',
      zIndex: 5,
      fontFamily: "'Inter', sans-serif"
    }}>
      
      {/* Progress Indicator */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '40px'
      }}>
        {[1, 2, 3].map((s) => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: s < 3 ? 1 : 'none' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: step === s ? 'var(--primary-color)' : step > s ? 'var(--secondary-color)' : 'rgba(255,255,255,0.04)',
              color: step >= s ? '#0D0D1A' : '#A0A0C0',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.85rem'
            }}>
              {step > s ? '✓' : s}
            </div>
            {s < 3 && (
              <div style={{
                height: '2px',
                flex: 1,
                background: step > s ? 'var(--secondary-color)' : 'rgba(255,255,255,0.06)',
                marginRight: '8px'
              }}></div>
            )}
          </div>
        ))}
      </div>

      {/* --- Step 1: Persona details --- */}
      {step === 1 && (
        <div className="glass-panel fade-in" style={{ padding: '40px', borderRadius: '24px' }}>
          <div className="badge badge-gradient" style={{ marginBottom: '16px' }}>
            <Sparkles size={12} style={{ marginRight: '6px', color: 'var(--primary-color)' }} />
            <span>Onboarding · Step 1</span>
          </div>

          <h2 style={{ color: 'white', marginBottom: '12px', fontSize: '1.75rem' }}>
            Hey! Let's personalise your learning 🎯
          </h2>
          <p style={{ color: '#A0A0C0', fontSize: '0.9rem', marginBottom: '32px' }}>
            Our AI customizes question selections, notes highlighting, and schedules to your goals.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            
            {/* Goal Select */}
            <div className="form-group">
              <label style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>What is your primary study goal?</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                {[
                  { title: "Crack JEE/NEET", desc: "Adaptive prep for engineering & medical entrances" },
                  { title: "Score 90%+ in Boards", desc: "Structured syllabus coverage & CBSE PYQs" },
                  { title: "Build a Study Habit", desc: "Streaks, regular daily revision check-ins" },
                  { title: "Clear Backlogs", desc: "Diagnostic checks on weak old topics" }
                ].map((g) => (
                  <div 
                    key={g.title}
                    onClick={() => setLearningGoal(g.title)}
                    style={{
                      background: learningGoal === g.title ? 'rgba(108, 99, 255, 0.08)' : 'rgba(255,255,255,0.02)',
                      border: learningGoal === g.title ? '1px solid #6C63FF' : '1px solid rgba(255,255,255,0.06)',
                      borderRadius: '12px',
                      padding: '16px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div>
                      <h4 style={{ color: 'white', fontSize: '0.95rem' }}>{g.title}</h4>
                      <p style={{ color: '#A0A0C0', fontSize: '0.8rem', marginTop: '2px' }}>{g.desc}</p>
                    </div>
                    {learningGoal === g.title && <div style={{ color: '#6C63FF', fontWeight: 'bold' }}>✓</div>}
                  </div>
                ))}
              </div>
            </div>

            {/* Study Hours Slider */}
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>How many hours can you study daily?</label>
                <span style={{ color: 'var(--secondary-color)', fontWeight: 'bold', fontSize: '1rem' }}>{studyHours} Hours</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="12"
                value={studyHours}
                onChange={(e) => setStudyHours(Number(e.target.value))}
                style={{
                  width: '100%',
                  height: '6px',
                  background: 'rgba(255,255,255,0.08)',
                  borderRadius: '3px',
                  outline: 'none',
                  cursor: 'pointer',
                  accentColor: 'var(--primary-color)',
                  marginTop: '10px'
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#626280', marginTop: '4px' }}>
                <span>1 hr</span>
                <span>6 hrs</span>
                <span>12 hrs</span>
              </div>
            </div>

            <button 
              onClick={() => setStep(2)}
              className="btn btn-primary btn-glow btn-large"
              style={{ width: '100%', marginTop: '10px' }}
            >
              Continue to Diagnostic Exam <ChevronRight size={18} />
            </button>

          </div>
        </div>
      )}

      {/* --- Step 2: Diagnostic Exam --- */}
      {step === 2 && (
        <div className="glass-panel fade-in" style={{ padding: '40px', borderRadius: '24px' }}>
          {analyzing ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '300px',
              gap: '20px'
            }}>
              <Loader size={48} className="shimmer" style={{ color: 'var(--primary-color)', animation: 'spin 2s linear infinite' }} />
              <h3 style={{ color: 'white' }}>AI Analyzing Gaps...</h3>
              <p style={{ color: '#A0A0C0', fontSize: '0.85rem', textAlign: 'center', maxWidth: '300px' }}>
                Assessing diagnostic answers to outline chapter proficiency levels.
              </p>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                  <span className="badge" style={{ marginBottom: '8px' }}>Diagnostic Test</span>
                  <h2 style={{ color: 'white', fontSize: '1.5rem' }}>Assess Your Gaps 🧠</h2>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#A0A0C0' }}>
                  <Clock size={14} />
                  <span>Question {activeQuestion + 1} of {diagnosticQuestions.length}</span>
                </div>
              </div>

              <div style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '16px',
                padding: '24px',
                marginBottom: '20px'
              }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--primary-color)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>
                  {diagnosticQuestions[activeQuestion].subject}
                </span>
                <p style={{ color: 'white', fontSize: '1rem', fontWeight: '500', marginTop: '8px', lineHeight: '1.5' }}>
                  {diagnosticQuestions[activeQuestion].q}
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {diagnosticQuestions[activeQuestion].opts.map((opt, idx) => {
                  const isSelected = selectedAnswers[activeQuestion] === idx;
                  return (
                    <div 
                      key={idx}
                      onClick={() => handleSelectAnswer(activeQuestion, idx)}
                      style={{
                        background: isSelected ? 'rgba(0, 212, 170, 0.1)' : 'rgba(255,255,255,0.02)',
                        border: isSelected ? '1px solid #00D4AA' : '1px solid rgba(255,255,255,0.06)',
                        borderRadius: '12px',
                        padding: '14px 20px',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        color: isSelected ? '#00D4AA' : 'white',
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                      }}
                    >
                      <div style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        border: isSelected ? '5px solid #00D4AA' : '2px solid rgba(255,255,255,0.2)',
                        background: 'transparent'
                      }}></div>
                      <span>{opt}</span>
                    </div>
                  );
                })}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: '#626280' }}>* Answer carefully to calibrate AI recommendations.</span>
                <button
                  onClick={handleDiagnosticNext}
                  disabled={selectedAnswers[activeQuestion] === undefined}
                  className="btn btn-primary btn-glow"
                  style={{
                    opacity: selectedAnswers[activeQuestion] === undefined ? 0.5 : 1,
                    cursor: selectedAnswers[activeQuestion] === undefined ? 'not-allowed' : 'pointer'
                  }}
                >
                  {activeQuestion === diagnosticQuestions.length - 1 ? 'Analyze Gaps' : 'Next Question'}
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* --- Step 3: Reveal Plan --- */}
      {step === 3 && (
        <div className="glass-panel fade-in" style={{ padding: '40px', borderRadius: '24px' }}>
          <div className="badge badge-gradient" style={{ marginBottom: '16px', background: 'rgba(0, 212, 170, 0.1)', color: '#00D4AA', borderColor: 'rgba(0, 212, 170, 0.3)' }}>
            <Sparkles size={12} style={{ marginRight: '6px' }} />
            <span>Diagnostic Complete</span>
          </div>

          <h2 style={{ color: 'white', marginBottom: '12px', fontSize: '1.75rem' }}>
            Your AI Learning Plan is Ready! 🚀
          </h2>
          <p style={{ color: '#A0A0C0', fontSize: '0.9rem', marginBottom: '32px' }}>
            Based on your diagnostics, our AI engines have optimized the ideal study roadmap.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
            
            {/* Weak Areas */}
            <div style={{
              background: 'rgba(255, 179, 71, 0.08)',
              border: '1px solid rgba(255, 179, 71, 0.2)',
              borderRadius: '16px',
              padding: '16px 20px',
              display: 'flex',
              gap: '12px'
            }}>
              <Brain size={24} style={{ color: '#FFB347', flexShrink: 0 }} />
              <div>
                <h4 style={{ color: '#FFB347', fontSize: '0.9rem', fontWeight: 'bold' }}>Identified Syllabus Gaps</h4>
                <ul style={{ color: 'white', fontSize: '0.85rem', marginTop: '6px', paddingLeft: '14px' }}>
                  <li>Thermodynamics (Physics) - Need fundamental review</li>
                  <li>SN2 reaction stereochemistry (Chemistry) - Mixed up configuration rules</li>
                </ul>
              </div>
            </div>

            {/* Target schedule */}
            <div style={{
              background: 'rgba(108, 99, 255, 0.08)',
              border: '1px solid rgba(108, 99, 255, 0.2)',
              borderRadius: '16px',
              padding: '16px 20px',
              display: 'flex',
              gap: '12px'
            }}>
              <Clock size={24} style={{ color: '#B88EFC', flexShrink: 0 }} />
              <div>
                <h4 style={{ color: '#B88EFC', fontSize: '0.9rem', fontWeight: 'bold' }}>Personal Study Routine</h4>
                <p style={{ color: 'white', fontSize: '0.85rem', marginTop: '4px', lineHeight: '1.4' }}>
                  <strong>{studyHours} Hours Daily Plan:</strong> 2 hrs syllabus coverage, 1 hr adaptive practice cards, 1 hr Ask AI doubt clearance sessions. First dynamic Mock Test scheduled for <strong>this Saturday</strong>.
                </p>
              </div>
            </div>

            {/* Estimated improvement */}
            <div style={{
              background: 'rgba(0, 212, 170, 0.08)',
              border: '1px solid rgba(0, 212, 170, 0.2)',
              borderRadius: '16px',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}>
              <div style={{
                fontSize: '1.75rem',
                fontWeight: 'bold',
                color: '#00D4AA',
                fontFamily: 'var(--font-heading)'
              }}>
                +15%
              </div>
              <div>
                <h4 style={{ color: '#00D4AA', fontSize: '0.9rem', fontWeight: 'bold' }}>Estimated Score Increase</h4>
                <p style={{ color: '#A0A0C0', fontSize: '0.8rem' }}>Predicted JEE score improvement after 30 days of consistent dynamic checks.</p>
              </div>
            </div>

          </div>

          <button 
            onClick={finishOnboarding}
            className="btn btn-primary btn-glow btn-large btn-pill"
            style={{ width: '100%' }}
          >
            Start Learning Now! <ArrowRight size={18} />
          </button>
        </div>
      )}

      {/* Embedded CSS for spins */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
      
    </div>
  );
}
