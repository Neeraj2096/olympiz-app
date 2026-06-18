import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { 
  Atom, Dna, BookOpen, Layers, Brain, Clock, Award, ArrowRight
} from 'lucide-react';

// ─── Exam Overlay rendered via Portal directly into document.body ──────────────
function ExamPortal({ selectedTest, examQuestions, onClose, onSubmit }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [markedForReview, setMarkedForReview] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [resultData, setResultData] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const durationMins = selectedTest.duration ? parseInt(selectedTest.duration.split(' ')[0]) : 10;
  const [timeLeft, setTimeLeft] = useState(durationMins * 60);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Lock body scroll when portal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // Timer
  useEffect(() => {
    if (submitting || showResult) return;
    if (timeLeft <= 0) { handleSubmit(); return; }
    const t = setInterval(() => setTimeLeft(p => p - 1), 1000);
    return () => clearInterval(t);
  }, [timeLeft, submitting, showResult]);

  const handleSubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      let correct = 0, incorrect = 0;
      examQuestions.forEach((q, idx) => {
        if (answers[idx] !== undefined) {
          answers[idx] === q.correct ? correct++ : incorrect++;
        }
      });
      const score = correct * 4 - incorrect;
      const skipped = examQuestions.length - correct - incorrect;
      const accuracy = (correct + incorrect) > 0 ? Math.round((correct / (correct + incorrect)) * 100) : 0;
      const timeTakenSecs = durationMins * 60 - timeLeft;
      setResultData({ correct, incorrect, skipped, score, accuracy, timeTakenSecs, answers });
      onSubmit({ correct, incorrect, skipped, score, accuracy });
      setSubmitting(false);
      setShowResult(true);
    }, 2000);
  };

  // ── Loading screen ──────────────────────────────────────────────
  if (submitting) {
    return ReactDOM.createPortal(
      <div style={overlayStyle}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(135deg,#6C63FF,#00D4AA)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', animation: 'spin 1.5s linear infinite' }}>Ω</div>
          <h3 style={{ color: 'white' }}>Analysing your attempt…</h3>
          <p style={{ color: '#A0A0C0', fontSize: '0.85rem' }}>AI is computing topic-wise insights.</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>,
      document.body
    );
  }

  // ── Result screen ──────────────────────────────────────────────
  if (showResult && resultData) {
    // Compute topic-wise breakdown from actual answers
    const topicMap = {};
    examQuestions.forEach((q, idx) => {
      const subj = q.subject || 'General';
      if (!topicMap[subj]) topicMap[subj] = { correct: 0, incorrect: 0, skipped: 0, total: 0, questions: [] };
      topicMap[subj].total++;
      const userAns = resultData.answers[idx];
      const isCorrect = userAns === q.correct;
      const isSkipped = userAns === undefined;
      if (isSkipped) topicMap[subj].skipped++;
      else if (isCorrect) topicMap[subj].correct++;
      else topicMap[subj].incorrect++;
      topicMap[subj].questions.push({ idx, isCorrect, isSkipped, userAns, correctAns: q.correct });
    });
    const topicEntries = Object.entries(topicMap);
    const strongTopics = topicEntries.filter(([, d]) => d.total > 0 && (d.correct / d.total) >= 0.6);
    const weakTopics = topicEntries.filter(([, d]) => d.total > 0 && (d.correct / d.total) < 0.6);

    const totalMarks = examQuestions.length * 4;
    const scorePercent = totalMarks > 0 ? Math.round((Math.max(0, resultData.score) / totalMarks) * 100) : 0;
    const timeTakenMins = Math.floor(resultData.timeTakenSecs / 60);
    const timeTakenRemSecs = resultData.timeTakenSecs % 60;
    const avgTimePerQ = examQuestions.length > 0 ? Math.round(resultData.timeTakenSecs / examQuestions.length) : 0;

    // AI analysis generation
    const generateAIVerdict = () => {
      if (resultData.accuracy >= 80) return { grade: 'Excellent', emoji: '🏆', color: '#00D4AA', message: 'Outstanding performance! You demonstrate strong conceptual clarity across subjects.' };
      if (resultData.accuracy >= 60) return { grade: 'Good', emoji: '👍', color: '#FFB347', message: 'Solid attempt with room for improvement. Focus on the weak areas identified below.' };
      if (resultData.accuracy >= 40) return { grade: 'Needs Work', emoji: '📚', color: '#FF6B6B', message: 'Foundational gaps detected. Targeted practice on weak topics will help improve your score significantly.' };
      return { grade: 'Critical', emoji: '🚨', color: '#FF6B6B', message: 'Major conceptual gaps identified. We recommend revisiting the fundamentals before attempting more tests.' };
    };
    const aiVerdict = generateAIVerdict();

    const generateRecommendations = () => {
      const recs = [];
      weakTopics.forEach(([topic, data]) => {
        recs.push({ icon: '🎯', title: `Strengthen ${topic}`, detail: `You got ${data.correct}/${data.total} correct. Practice ${topic} fundamentals with our adaptive drills.`, priority: 'High' });
      });
      if (resultData.skipped > 0) recs.push({ icon: '⏭️', title: 'Reduce Skipped Questions', detail: `You skipped ${resultData.skipped} question(s). Even educated guesses can earn marks with no negative for skipped.`, priority: 'Medium' });
      if (avgTimePerQ > 120) recs.push({ icon: '⚡', title: 'Improve Speed', detail: `Averaging ${avgTimePerQ}s per question is above the 90s target. Practice timed drills to build speed.`, priority: 'Medium' });
      if (resultData.incorrect > resultData.correct) recs.push({ icon: '🧠', title: 'Focus on Accuracy', detail: 'More incorrect than correct answers indicates guessing. Build conceptual clarity before speed.', priority: 'High' });
      if (recs.length === 0) recs.push({ icon: '✨', title: 'Keep It Up!', detail: 'No major weaknesses detected. Challenge yourself with harder tests to push your limits.', priority: 'Low' });
      return recs;
    };
    const recommendations = generateRecommendations();

    const resultStyles = {
      heroCard: {
        background: 'linear-gradient(135deg, rgba(108, 99, 255, 0.08) 0%, rgba(0, 212, 170, 0.03) 100%)',
        border: '1px solid rgba(108, 99, 255, 0.15)',
        borderRadius: '24px',
        padding: isMobile ? '24px 16px' : '32px',
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '32px',
        marginBottom: '24px',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
      },
      heroLeft: {
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        width: '100%',
      },
      statBox: {
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        borderRadius: '14px',
        padding: '12px 8px',
        textAlign: 'center',
      },
      metricCard: {
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        borderRadius: '16px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      },
      sectionCard: {
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        borderRadius: '20px',
        padding: isMobile ? '20px 16px' : '28px',
        boxShadow: '0 4px 24px 0 rgba(0, 0, 0, 0.2)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      },
      sectionTitle: {
        color: 'white',
        fontSize: '1.1rem',
        fontWeight: '700',
        marginBottom: '20px',
        marginTop: 0,
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }
    };

    const rs = resultStyles;

    return ReactDOM.createPortal(
      <div style={{ ...overlayStyle, alignItems: 'flex-start', justifyContent: 'flex-start', overflowY: 'auto' }}>
        <div style={{ width: '100%', maxWidth: '1100px', margin: '0 auto', padding: isMobile ? '20px 16px 40px' : '32px 40px 60px' }}>

          {/* Back button */}
          <button onClick={onClose} style={{ ...ghostBtn, marginBottom: '24px', fontSize: '0.9rem' }}>
            ← Back to Test Catalog
          </button>

          {/* ═══════════ HERO SCORE SECTION ═══════════ */}
          <div style={rs.heroCard}>
            <div style={rs.heroLeft}>
              <div style={badgeStyle}><Award size={12} style={{ marginRight: '6px' }} /> Test Completed · +100 XP!</div>
              <h2 style={{ color: 'white', fontSize: isMobile ? '1.5rem' : '1.8rem', margin: '16px 0 6px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {selectedTest.title}
              </h2>
              <p style={{ color: '#A0A0C0', fontSize: '0.85rem', marginBottom: '20px' }}>
                Completed in <strong style={{ color: 'white' }}>{timeTakenMins}m {timeTakenRemSecs}s</strong> &nbsp;·&nbsp; {examQuestions.length} Questions
              </p>

              {/* Score stats row */}
              <div className="grid-4" style={{ gap: '10px' }}>
                {[
                  { label: 'Score', val: `${resultData.score}/${totalMarks}`, color: '#6C63FF' },
                  { label: 'Correct', val: resultData.correct, color: '#00D4AA' },
                  { label: 'Incorrect', val: resultData.incorrect, color: '#FF6B6B' },
                  { label: 'Skipped', val: resultData.skipped, color: '#626280' }
                ].map((s, i) => (
                  <div key={i} style={rs.statBox}>
                    <span style={{ fontSize: '0.65rem', color: '#A0A0C0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</span>
                    <p style={{ fontSize: '1.3rem', fontWeight: '700', color: s.color, margin: '4px 0 0' }}>{s.val}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Circular Score Gauge */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <div style={{ position: 'relative', width: '160px', height: '160px' }}>
                <svg viewBox="0 0 120 120" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                  <circle cx="60" cy="60" r="52" stroke="rgba(255,255,255,0.06)" strokeWidth="8" fill="none" />
                  <circle cx="60" cy="60" r="52" stroke="url(#scoreGrad)" strokeWidth="8" fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${(scorePercent / 100) * 327} 327`}
                    style={{ transition: 'stroke-dasharray 1.5s ease-out' }}
                  />
                  <defs>
                    <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#6C63FF" />
                      <stop offset="100%" stopColor="#00D4AA" />
                    </linearGradient>
                  </defs>
                </svg>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                  <span style={{ fontSize: '2rem', fontWeight: '800', color: 'white', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{scorePercent}%</span>
                  <br />
                  <span style={{ fontSize: '0.65rem', color: '#A0A0C0', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Accuracy</span>
                </div>
              </div>
              <div style={{ padding: '6px 16px', borderRadius: '50px', background: `${aiVerdict.color}18`, border: `1px solid ${aiVerdict.color}44`, color: aiVerdict.color, fontSize: '0.8rem', fontWeight: '700' }}>
                {aiVerdict.emoji} {aiVerdict.grade}
              </div>
            </div>
          </div>

          {/* ═══════════ PERFORMANCE METRICS ═══════════ */}
          <div className="grid-3" style={{ marginBottom: '24px' }}>
            {[
              { icon: '⚡', label: 'Avg. Time / Question', value: `${avgTimePerQ}s`, sub: avgTimePerQ <= 90 ? 'Within target' : 'Above 90s target', subColor: avgTimePerQ <= 90 ? '#00D4AA' : '#FF6B6B' },
              { icon: '🎯', label: 'Attempt Rate', value: `${Math.round(((resultData.correct + resultData.incorrect) / examQuestions.length) * 100)}%`, sub: `${resultData.correct + resultData.incorrect} of ${examQuestions.length} attempted`, subColor: '#A0A0C0' },
              { icon: '📊', label: 'Marking Efficiency', value: `${resultData.score >= 0 ? '+' : ''}${resultData.score}`, sub: `+${resultData.correct * 4} earned, −${resultData.incorrect} penalty`, subColor: '#A0A0C0' }
            ].map((m, i) => (
              <div key={i} style={rs.metricCard}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <span style={{ fontSize: '1.3rem' }}>{m.icon}</span>
                  <span style={{ fontSize: '0.75rem', color: '#A0A0C0', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{m.label}</span>
                </div>
                <p style={{ fontSize: '1.5rem', fontWeight: '700', color: 'white', margin: '0 0 4px' }}>{m.value}</p>
                <span style={{ fontSize: '0.72rem', color: m.subColor }}>{m.sub}</span>
              </div>
            ))}
          </div>

          {/* ═══════════ TOPIC-WISE ANALYSIS ═══════════ */}
          <div className="grid-2" style={{ marginBottom: '24px' }}>
            {/* Strength & Weakness */}
            <div style={rs.sectionCard}>
              <h4 style={rs.sectionTitle}>
                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(0,212,170,0.15)', fontSize: '0.9rem' }}>📊</span>
                Topic-wise Performance
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {topicEntries.map(([topic, data], i) => {
                  const pct = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
                  const barColor = pct >= 80 ? '#00D4AA' : pct >= 50 ? '#FFB347' : '#FF6B6B';
                  return (
                    <div key={i}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.85rem', color: 'white', fontWeight: '500' }}>{topic}</span>
                        <span style={{ fontSize: '0.75rem', fontWeight: '700', color: barColor }}>{pct}% ({data.correct}/{data.total})</span>
                      </div>
                      <div style={{ width: '100%', height: '8px', borderRadius: '4px', background: 'rgba(255,255,255,0.06)' }}>
                        <div style={{ width: `${pct}%`, height: '100%', borderRadius: '4px', background: `linear-gradient(90deg, ${barColor}, ${barColor}88)`, transition: 'width 1s ease-out', minWidth: pct > 0 ? '4px' : '0' }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Strong / Weak tags */}
              <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {strongTopics.length > 0 && (
                  <div>
                    <span style={{ fontSize: '0.7rem', color: '#00D4AA', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em' }}>💪 Strong Areas</span>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '6px' }}>
                      {strongTopics.map(([t], i) => (
                        <span key={i} style={{ padding: '4px 10px', borderRadius: '50px', fontSize: '0.72rem', background: 'rgba(0,212,170,0.12)', border: '1px solid rgba(0,212,170,0.3)', color: '#00D4AA', fontWeight: '500' }}>{t}</span>
                      ))}
                    </div>
                  </div>
                )}
                {weakTopics.length > 0 && (
                  <div>
                    <span style={{ fontSize: '0.7rem', color: '#FF6B6B', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em' }}>⚠️ Needs Improvement</span>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '6px' }}>
                      {weakTopics.map(([t], i) => (
                        <span key={i} style={{ padding: '4px 10px', borderRadius: '50px', fontSize: '0.72rem', background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.3)', color: '#FF6B6B', fontWeight: '500' }}>{t}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* AI Analysis Panel */}
            <div style={{ ...rs.sectionCard, background: 'linear-gradient(135deg, rgba(108,99,255,0.08) 0%, rgba(0,212,170,0.05) 100%)', border: '1px solid rgba(108,99,255,0.2)' }}>
              <h4 style={rs.sectionTitle}>
                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(255,179,71,0.15)', fontSize: '0.9rem' }}>🤖</span>
                AI Deep Analysis
              </h4>

              {/* Verdict */}
              <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '16px' }}>
                <p style={{ fontSize: '0.85rem', color: '#E0E0F0', lineHeight: '1.65' }}>{aiVerdict.message}</p>
              </div>

              {/* Root Cause */}
              {weakTopics.length > 0 && (
                <div style={{ marginBottom: '16px' }}>
                  <h5 style={{ fontSize: '0.78rem', color: '#FFB347', fontWeight: '600', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>🔍 Root Cause Analysis</h5>
                  <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {weakTopics.map(([topic, data], i) => (
                      <li key={i} style={{ fontSize: '0.8rem', color: '#A0A0C0', lineHeight: '1.5', paddingLeft: '14px', position: 'relative' }}>
                        <span style={{ position: 'absolute', left: 0, color: '#FF6B6B' }}>•</span>
                        <strong style={{ color: '#E0E0F0' }}>{topic}:</strong> {data.incorrect} incorrect out of {data.total} — indicates conceptual gaps in core fundamentals.
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Learning Pattern */}
              <div style={{ marginBottom: '16px' }}>
                <h5 style={{ fontSize: '0.78rem', color: '#6C63FF', fontWeight: '600', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>🧠 Learning Pattern</h5>
                <p style={{ fontSize: '0.8rem', color: '#A0A0C0', lineHeight: '1.5' }}>
                  {resultData.accuracy >= 70 
                    ? 'Strong analytical thinker — your correct answers show deep conceptual understanding. Minor errors are likely due to calculation mistakes rather than knowledge gaps.'
                    : resultData.accuracy >= 40
                    ? 'Pattern suggests surface-level understanding. You recognize concepts but struggle with application in unfamiliar contexts. Focused problem-solving practice recommended.'
                    : 'Foundational knowledge gaps detected. Recommend going back to theory and building understanding step-by-step before attempting timed tests.'
                  }
                </p>
              </div>

              {/* Estimated Rank & Live Leaderboard */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ padding: '16px', borderRadius: '14px', background: 'linear-gradient(135deg, rgba(108,99,255,0.15), rgba(0,212,170,0.1))', border: '1px solid rgba(108,99,255,0.25)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div>
                      <span style={{ fontSize: '0.68rem', color: '#A0A0C0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Your Competitive Rank</span>
                      <p style={{ fontSize: '1.5rem', fontWeight: '800', color: '#00D4AA', margin: '2px 0 0', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        #{Math.max(1, Math.round((1 - resultData.accuracy / 100) * 5820 + (45 - Math.random() * 20)))} <span style={{ fontSize: '0.85rem', color: '#A0A0C0', fontWeight: '400' }}>/ 5,820</span>
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.68rem', color: '#A0A0C0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Percentile</span>
                      <p style={{ fontSize: '1.5rem', fontWeight: '800', color: 'white', margin: '2px 0 0', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        {(100 - (Math.max(1, Math.round((1 - resultData.accuracy / 100) * 5820 + (45 - Math.random() * 20))) / 5820) * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                  <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', margin: '10px 0' }} />
                  <span style={{ fontSize: '0.72rem', color: '#B88EFC', fontWeight: '600' }}>
                    🏆 You are in the top {(100 - (100 - (Math.max(1, Math.round((1 - resultData.accuracy / 100) * 5820 + (45 - Math.random() * 20))) / 5820) * 100)).toFixed(1)}% of all participants!
                  </span>
                </div>

                {/* Mini Leaderboard list */}
                <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '14px', padding: '14px' }}>
                  <h5 style={{ fontSize: '0.75rem', color: 'white', fontWeight: 'bold', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>⭐</span> Live Mock Test Leaderboard
                  </h5>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {[
                      { rank: 1, name: 'Aarav Mehta', score: `${totalMarks}/${totalMarks}`, pct: '100%', active: false },
                      { rank: 2, name: 'Neha Sharma', score: `${Math.round(totalMarks * 0.95)}/${totalMarks}`, pct: '99.8%', active: false },
                      { rank: 3, name: 'Rohan Gupta', score: `${Math.round(totalMarks * 0.90)}/${totalMarks}`, pct: '99.5%', active: false },
                      { rank: Math.max(4, Math.round((1 - resultData.accuracy / 100) * 5820 + (45 - Math.random() * 20))), name: 'You', score: `${resultData.score}/${totalMarks}`, pct: `${(100 - (Math.max(1, Math.round((1 - resultData.accuracy / 100) * 5820 + (45 - Math.random() * 20))) / 5820) * 100).toFixed(1)}%`, active: true }
                    ].sort((a,b) => a.rank - b.rank).map((lead, i) => (
                      <div key={i} style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '6px 10px', borderRadius: '8px',
                        background: lead.active ? 'rgba(0,212,170,0.1)' : 'transparent',
                        border: lead.active ? '1px solid rgba(0,212,170,0.25)' : '1px solid transparent'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{
                            width: '20px', height: '20px', borderRadius: '50%',
                            background: lead.rank === 1 ? '#FFD700' : lead.rank === 2 ? '#C0C0C0' : lead.rank === 3 ? '#CD7F32' : 'rgba(255,255,255,0.06)',
                            color: lead.rank <= 3 ? '#0D0D1A' : '#A0A0C0',
                            fontSize: '0.7rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center'
                          }}>{lead.rank}</span>
                          <span style={{ fontSize: '0.78rem', color: lead.active ? '#00D4AA' : 'white', fontWeight: lead.active ? '700' : '400' }}>
                            {lead.name} {lead.active && ' (Current User)'}
                          </span>
                        </div>
                        <div style={{ display: 'flex', gap: '12px', fontSize: '0.75rem', color: '#A0A0C0' }}>
                          <span>{lead.score} Marks</span>
                          <span style={{ color: '#00D4AA', fontWeight: '600' }}>{lead.pct}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ═══════════ AI RECOMMENDATIONS ═══════════ */}
          <div style={{ ...rs.sectionCard, marginBottom: '24px' }}>
            <h4 style={rs.sectionTitle}>
              <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(108,99,255,0.15)', fontSize: '0.9rem' }}>💡</span>
              AI Recommendations
            </h4>
            <div className="grid-2" style={{ gap: '12px' }}>
              {recommendations.map((rec, i) => (
                <div key={i} style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '1.4rem', flexShrink: 0 }}>{rec.icon}</span>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'white' }}>{rec.title}</span>
                      <span style={{ fontSize: '0.6rem', padding: '2px 8px', borderRadius: '50px', fontWeight: '600', textTransform: 'uppercase',
                        background: rec.priority === 'High' ? 'rgba(255,107,107,0.15)' : rec.priority === 'Medium' ? 'rgba(255,179,71,0.15)' : 'rgba(0,212,170,0.15)',
                        color: rec.priority === 'High' ? '#FF6B6B' : rec.priority === 'Medium' ? '#FFB347' : '#00D4AA',
                        border: `1px solid ${rec.priority === 'High' ? 'rgba(255,107,107,0.3)' : rec.priority === 'Medium' ? 'rgba(255,179,71,0.3)' : 'rgba(0,212,170,0.3)'}`
                      }}>{rec.priority}</span>
                    </div>
                    <p style={{ fontSize: '0.78rem', color: '#A0A0C0', lineHeight: '1.5' }}>{rec.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ═══════════ QUESTION-BY-QUESTION REVIEW ═══════════ */}
          <div style={{ ...rs.sectionCard, marginBottom: '24px' }}>
            <h4 style={rs.sectionTitle}>
              <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(0,212,170,0.15)', fontSize: '0.9rem' }}>📝</span>
              Detailed Question Review
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {examQuestions.map((q, idx) => {
                const userAns = resultData.answers[idx];
                const isCorrect = userAns === q.correct;
                const isSkipped = userAns === undefined;
                const statusColor = isSkipped ? '#626280' : isCorrect ? '#00D4AA' : '#FF6B6B';
                const statusBg = isSkipped ? 'rgba(98,98,128,0.08)' : isCorrect ? 'rgba(0,212,170,0.06)' : 'rgba(255,107,107,0.06)';
                return (
                  <div key={idx} style={{ padding: '18px', borderRadius: '14px', background: statusBg, border: `1px solid ${statusColor}22`, transition: 'all 0.2s' }}>
                    {/* Question header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
                        <span style={{ width: '28px', height: '28px', borderRadius: '8px', background: `${statusColor}20`, color: statusColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: '700', flexShrink: 0 }}>
                          Q{idx + 1}
                        </span>
                        <span style={{ fontSize: '0.78rem', color: '#A0A0C0', background: 'rgba(255,255,255,0.04)', padding: '3px 10px', borderRadius: '50px' }}>
                          {q.subject}
                        </span>
                      </div>
                      <span style={{ fontSize: '0.72rem', fontWeight: '700', color: statusColor, background: `${statusColor}15`, padding: '4px 12px', borderRadius: '50px', border: `1px solid ${statusColor}33`, whiteSpace: 'nowrap' }}>
                        {isSkipped ? '⏭ Skipped' : isCorrect ? '✓ Correct +4' : '✗ Wrong −1'}
                      </span>
                    </div>

                    {/* Question text */}
                    <p style={{ fontSize: '0.88rem', color: 'white', lineHeight: '1.55', marginBottom: '12px', fontWeight: '500' }}>
                      {q.q}
                    </p>

                    {/* Options */}
                    <div className="grid-2" style={{ gap: '6px', marginBottom: isCorrect ? '0' : '12px' }}>
                      {q.opts.map((opt, oi) => {
                        const isThisCorrect = oi === q.correct;
                        const isUserChoice = oi === userAns;
                        let optBg = 'rgba(255,255,255,0.02)';
                        let optBorder = 'rgba(255,255,255,0.05)';
                        let optColor = '#A0A0C0';
                        let optIcon = '';
                        if (isThisCorrect) { optBg = 'rgba(0,212,170,0.1)'; optBorder = 'rgba(0,212,170,0.3)'; optColor = '#00D4AA'; optIcon = '✓'; }
                        if (isUserChoice && !isCorrect) { optBg = 'rgba(255,107,107,0.1)'; optBorder = 'rgba(255,107,107,0.3)'; optColor = '#FF6B6B'; optIcon = '✗'; }
                        return (
                          <div key={oi} style={{ padding: '8px 12px', borderRadius: '8px', background: optBg, border: `1px solid ${optBorder}`, fontSize: '0.8rem', color: optColor, display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {optIcon && <span style={{ fontWeight: '700', fontSize: '0.75rem' }}>{optIcon}</span>}
                            <span style={{ fontSize: '0.7rem', color: '#626280', fontWeight: '600', flexShrink: 0 }}>{String.fromCharCode(65 + oi)}.</span>
                            {opt}
                          </div>
                        );
                      })}
                    </div>

                    {/* Show correct answer if wrong */}
                    {!isCorrect && !isSkipped && (
                      <div style={{ fontSize: '0.78rem', color: '#00D4AA', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontWeight: '600' }}>Correct Answer:</span>
                        <span style={{ fontWeight: '500' }}>{String.fromCharCode(65 + q.correct)}. {q.opts[q.correct]}</span>
                      </div>
                    )}
                    {isSkipped && (
                      <div style={{ fontSize: '0.78rem', color: '#FFB347', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontWeight: '600' }}>Answer:</span>
                        <span style={{ fontWeight: '500' }}>{String.fromCharCode(65 + q.correct)}. {q.opts[q.correct]}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ═══════════ ACTION BUTTONS ═══════════ */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', paddingBottom: '20px' }}>
            <button onClick={onClose} className="btn btn-primary btn-pill btn-glow" style={{ padding: '14px 32px', fontSize: '0.9rem' }}>
              Return to Test Catalog <ArrowRight size={16} />
            </button>
            <button onClick={() => { setShowResult(false); setResultData(null); setCurrentQuestion(0); setAnswers({}); setMarkedForReview({}); setTimeLeft(durationMins * 60); }}
              className="btn btn-secondary btn-pill" style={{ padding: '14px 28px', fontSize: '0.9rem' }}>
              🔄 Retake Test
            </button>
          </div>
        </div>

        <style>{`
          @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        `}</style>
      </div>,
      document.body
    );
  }

  // ── Active exam screen ─────────────────────────────────────────
  return ReactDOM.createPortal(
    <div style={{ ...overlayStyle, flexDirection: 'column' }}>
      {/* Header bar */}
      <div style={{
        height: '60px',
        flexShrink: 0,
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        background: 'rgba(255,255,255,0.02)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'linear-gradient(135deg,#6C63FF,#00D4AA)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#0D0D1A', flexShrink: 0 }}>Ω</div>
          <span style={{ color: 'white', fontWeight: 'bold', fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{selectedTest.title}</span>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          background: timeLeft < 120 ? 'rgba(255,107,107,0.15)' : 'rgba(255,255,255,0.05)',
          border: `1px solid ${timeLeft < 120 ? '#FF6B6B' : 'rgba(255,255,255,0.12)'}`,
          borderRadius: '50px', padding: '6px 14px',
          color: timeLeft < 120 ? '#FF6B6B' : 'white',
          fontWeight: 'bold', fontSize: '0.9rem', flexShrink: 0
        }}>
          <Clock size={16} />
          {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
        </div>
      </div>

      {/* Main workspace */}
      <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        flex: 1,
        overflow: 'hidden',
        width: '100%'
      }}>
        {/* ── Left: Question panel ── */}
        <div style={{
          flex: 1,
          minWidth: 0,
          overflowY: 'auto',
          padding: isMobile ? '24px 20px' : '40px 5vw',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.06)', flexWrap: 'wrap', gap: '8px' }}>
            <span style={{ color: '#6C63FF', fontWeight: 'bold', fontSize: '0.85rem' }}>
              QUESTION {currentQuestion + 1} of {examQuestions.length} &nbsp;·&nbsp; {examQuestions[currentQuestion].subject}
            </span>
            <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: '4px', color: '#A0A0C0' }}>Single Correct MCQ</span>
          </div>

          <p style={{ color: 'white', fontSize: '1.05rem', fontWeight: '500', lineHeight: '1.7', marginBottom: '28px' }}>
            {examQuestions[currentQuestion].q}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
            {examQuestions[currentQuestion].opts.map((opt, idx) => {
              const selected = answers[currentQuestion] === idx;
              return (
                <div key={idx} onClick={() => setAnswers({ ...answers, [currentQuestion]: idx })}
                  style={{
                    padding: '14px 18px',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '12px',
                    border: selected ? '1px solid #6C63FF' : '1px solid rgba(255,255,255,0.07)',
                    background: selected ? 'rgba(108,99,255,0.12)' : 'rgba(255,255,255,0.02)',
                    transition: 'all 0.15s ease'
                  }}>
                  <div style={{
                    width: '18px', height: '18px', borderRadius: '50%', flexShrink: 0,
                    border: selected ? '5px solid #6C63FF' : '2px solid rgba(255,255,255,0.25)',
                    background: 'transparent', transition: 'all 0.15s'
                  }} />
                  <span style={{ color: selected ? '#B88EFC' : 'white', fontSize: '0.9rem', lineHeight: '1.4' }}>{opt}</span>
                </div>
              );
            })}
          </div>

          {/* Nav buttons */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginTop: '32px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.06)',
            flexWrap: 'wrap', gap: '12px'
          }}>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button onClick={() => setMarkedForReview(p => ({ ...p, [currentQuestion]: !p[currentQuestion] }))}
                className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '9px 14px' }}>
                {markedForReview[currentQuestion] ? '★ Unmark' : '☆ Mark for Review'}
              </button>
              <button onClick={() => setAnswers(p => { const n = { ...p }; delete n[currentQuestion]; return n; })}
                className="btn btn-ghost" style={{ fontSize: '0.8rem', padding: '9px 14px' }}>
                Clear
              </button>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button disabled={currentQuestion === 0}
                onClick={() => setCurrentQuestion(p => p - 1)}
                className="btn btn-secondary" style={{ opacity: currentQuestion === 0 ? 0.4 : 1 }}>
                ← Prev
              </button>
              {currentQuestion < examQuestions.length - 1
                ? <button onClick={() => setCurrentQuestion(p => p + 1)} className="btn btn-primary">Next →</button>
                : <button onClick={handleSubmit} className="btn btn-primary btn-glow" style={{ background: 'linear-gradient(135deg,#6C63FF,#00D4AA)', color: '#0D0D1A', fontWeight: 'bold' }}>Submit Exam</button>
              }
            </div>
          </div>
        </div>

        {/* ── Right: Question palette ── */}
        <div style={{
          width: isMobile ? '100%' : '300px',
          flexShrink: 0,
          borderLeft: isMobile ? 'none' : '1px solid rgba(255,255,255,0.08)',
          borderTop: isMobile ? '1px solid rgba(255,255,255,0.08)' : 'none',
          background: 'rgba(0,0,0,0.25)',
          overflowY: 'auto',
          padding: '24px',
          display: 'flex', flexDirection: 'column', gap: '20px'
        }}>
          <h4 style={{ color: 'white', fontSize: '0.85rem', fontWeight: 'bold' }}>Question Palette</h4>

          <div className="grid-5" style={{ gap: '8px' }}>
            {examQuestions.map((_, idx) => {
              const answered = answers[idx] !== undefined;
              const marked = markedForReview[idx];
              const isCurrent = idx === currentQuestion;
              let bg = 'rgba(255,255,255,0.04)';
              let color = '#A0A0C0';
              let border = isCurrent ? '2px solid #6C63FF' : '1px solid rgba(255,255,255,0.08)';
              if (marked) { bg = 'rgba(255,179,71,0.2)'; color = '#FFB347'; border = isCurrent ? '2px solid #6C63FF' : '1px solid #FFB347'; }
              else if (answered) { bg = 'rgba(0,212,170,0.2)'; color = '#00D4AA'; border = isCurrent ? '2px solid #6C63FF' : '1px solid #00D4AA'; }
              return (
                <div key={idx} onClick={() => setCurrentQuestion(idx)}
                  style={{
                    aspectRatio: '1', borderRadius: '6px', background: bg, border, color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer'
                  }}>
                  {idx + 1}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '14px' }}>
            {[
              { color: '#00D4AA', label: 'Answered' },
              { color: '#FFB347', label: 'Marked for Review' },
              { color: '#626280', label: 'Unanswered' }
            ].map((l, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: '#A0A0C0' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: l.color + '33', border: `1px solid ${l.color}`, flexShrink: 0 }} />
                {l.label}
              </div>
            ))}
          </div>

          {/* Submit button in palette */}
          <button onClick={handleSubmit} className="btn btn-secondary btn-pill"
            style={{ padding: '12px', width: '100%', fontSize: '0.85rem', marginTop: 'auto' }}>
            Submit Exam
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

// ─── Shared micro-styles ──────────────────────────────────────────────────────
const overlayStyle = {
  position: 'fixed',
  top: 0, left: 0, right: 0, bottom: 0,
  width: '100vw',
  height: '100vh',
  background: '#0D0D1A',
  zIndex: 99999,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: "'Inter', sans-serif"
};

const ghostBtn = {
  background: 'transparent', border: 'none', color: '#A0A0C0',
  cursor: 'pointer', fontSize: '0.85rem', padding: '0', display: 'inline-flex', alignItems: 'center', gap: '4px'
};

const badgeStyle = {
  display: 'inline-flex', alignItems: 'center', gap: '4px',
  padding: '5px 12px', fontSize: '0.75rem', fontWeight: '600',
  borderRadius: '50px', background: 'rgba(108,99,255,0.15)',
  border: '1px solid rgba(108,99,255,0.3)', color: '#B88EFC'
};

const cardStyle = {
  background: 'rgba(255,255,255,0.02)',
  border: '1px solid rgba(255,255,255,0.06)',
  borderRadius: '18px',
  padding: '24px'
};

// ─── Exam Questions Bank ──────────────────────────────────────────────────────
const EXAM_QUESTIONS = [
  { q: "An electron moves at 3×10⁶ m/s in a 2T magnetic field. What is the maximum magnetic force?", opts: ["9.6×10⁻¹³ N", "4.8×10⁻¹³ N", "0 N", "1.6×10⁻¹³ N"], correct: 0, subject: "Physics" },
  { q: "Which statement correctly describes an SN2 reaction?", opts: ["First order kinetics", "Carbocation intermediate formed", "Inversion of stereochemistry occurs", "Two-step reaction"], correct: 2, subject: "Chemistry" },
  { q: "Find the derivative of f(x) = ln(sin x).", opts: ["tan x", "cot x", "−cot x", "1/sin x"], correct: 1, subject: "Mathematics" },
  { q: "What is the net work done in a complete cyclic thermodynamic process?", opts: ["Equal to heat added in the cycle", "Always zero", "Depends only on volume change", "Equal to change in internal energy"], correct: 0, subject: "Physics" },
  { q: "Which of the following is an aromatic compound?", opts: ["Cyclohexene", "Benzene", "Cyclooctatetraene", "Pentane"], correct: 1, subject: "Chemistry" },
  { q: "Which phase of the cell cycle involves DNA replication?", opts: ["G1 Phase", "S Phase", "G2 Phase", "M Phase"], correct: 1, subject: "Biology" }
];

// ─── Main MockTests Component ─────────────────────────────────────────────────
export default function MockTests({ user, earnXP, addTestAttempt, activeCourse = 'JEE Main' }) {
  const [selectedCategory, setSelectedCategory] = useState('ai_adaptive');
  const [activeExam, setActiveExam] = useState(null); // null or test object
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const mockCatalog = [
    { id: 'm1', title: 'JEE Main Physics Mock #04', category: 'jee_main', duration: '180 mins', qCount: 30, marks: 120, difficulty: 'Hard', attempts: 1, bestScore: '88/120', registrants: '14,850' },
    { id: 'm2', title: 'NEET Organic Chemistry Speed Drill', category: 'neet', duration: '45 mins', qCount: 45, marks: 180, difficulty: 'Medium', attempts: 0, bestScore: '—', registrants: '22,400' },
    { id: 'm3', title: 'AI Adaptive General Physics Diagnostic', category: 'ai_adaptive', duration: '10 mins', qCount: 5, marks: 20, difficulty: 'Adaptive', attempts: 2, bestScore: '16/20', registrants: '8,920' },
    { id: 'm4', title: 'CBSE Class 12 Calculus Boards Prep', category: 'boards', duration: '120 mins', qCount: 20, marks: 80, difficulty: 'Medium', attempts: 0, bestScore: '—', registrants: '5,100' },
    { id: 't1', title: 'Newton\'s Laws of Motion & Friction Drill', category: 'subject_physics', duration: '10 mins', qCount: 5, marks: 20, difficulty: 'Medium', attempts: 0, bestScore: '—', registrants: '12,450' },
    { id: 't2', title: 'Thermodynamics & Adiabatic Systems Speed Test', category: 'subject_physics', duration: '15 mins', qCount: 8, marks: 32, difficulty: 'Hard', attempts: 0, bestScore: '—', registrants: '9,810' },
    { id: 't3', title: 'SN1 vs SN2 Mechanisms & Stereochemistry', category: 'subject_chemistry', duration: '10 mins', qCount: 5, marks: 20, difficulty: 'Easy', attempts: 0, bestScore: '—', registrants: '18,200' },
    { id: 't4', title: 'Limits & Squeeze Theorem Calculus Challenge', category: 'subject_maths', duration: '10 mins', qCount: 5, marks: 20, difficulty: 'Hard', attempts: 0, bestScore: '—', registrants: '11,400' },
    { id: 't5', title: 'Genetics & Evolution Masterclass Test', category: 'subject_biology', duration: '15 mins', qCount: 10, marks: 40, difficulty: 'Medium', attempts: 0, bestScore: '—', registrants: '21,000' }
  ];

  const filteredCatalog = (selectedCategory === 'all'
    ? mockCatalog
    : mockCatalog.filter(t => t.category === selectedCategory))
    .filter(t => {
      if (activeCourse.includes('JEE') && (t.category === 'neet' || t.category === 'subject_biology')) return false;
      if (activeCourse.includes('NEET') && (t.category === 'jee_main' || t.category === 'subject_maths')) return false;
      return true;
    });

  const handleStartExam = (test) => setActiveExam(test);

  const handleExamSubmit = (result) => {
    addTestAttempt({ ...result, testId: activeExam.id, title: activeExam.title });
    earnXP(100);
  };

  const handleExamClose = () => setActiveExam(null);

  const categories = [
    { id: 'all', label: 'All Tests', icon: <Layers size={16} /> },
    { id: 'jee_main', label: 'JEE Main', icon: <Atom size={16} /> },
    { id: 'neet', label: 'NEET', icon: <Dna size={16} /> },
    { id: 'boards', label: 'Boards Prep', icon: <BookOpen size={16} /> },
    { id: 'ai_adaptive', label: 'AI Adaptive', icon: <Brain size={16} /> },
    { id: 'subject_physics', label: 'Physics Topics', icon: <Atom size={16} /> },
    { id: 'subject_chemistry', label: 'Chemistry Topics', icon: <BookOpen size={16} /> },
    { id: 'subject_maths', label: 'Mathematics Topics', icon: <Brain size={16} /> }
  ].filter(cat => {
    if (activeCourse.includes('JEE') && (cat.id === 'neet' || cat.id === 'subject_biology')) return false;
    if (activeCourse.includes('NEET') && (cat.id === 'jee_main' || cat.id === 'subject_maths')) return false;
    return true;
  });

  const difficultyColor = (d) => {
    if (d === 'Hard') return '#FF6B6B';
    if (d === 'Adaptive') return '#00D4AA';
    return '#FFB347';
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", position: 'relative', zIndex: 1 }}>

      {/* Portal-based Exam Overlay */}
      {/* Portal-based Exam Overlay */}
      {activeExam && (
        <ExamPortal
          selectedTest={activeExam}
          examQuestions={EXAM_QUESTIONS.filter(q => {
            if (activeCourse.includes('JEE') && q.subject === 'Biology') return false;
            if (activeCourse.includes('NEET') && q.subject === 'Mathematics') return false;
            return true;
          })}
          onClose={handleExamClose}
          onSubmit={handleExamSubmit}
        />
      )}

      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ color: 'white', marginBottom: '4px' }}>Mock Test Center</h2>
          <p style={{ color: '#A0A0C0', fontSize: '0.9rem' }}>National CBT standards with real-time AI gap analysis.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div className="glass-panel" style={{ padding: '10px 20px', borderRadius: '12px', textAlign: 'center' }}>
            <span style={{ fontSize: '0.7rem', color: '#A0A0C0', display: 'block' }}>Tests Done</span>
            <p style={{ fontWeight: 'bold', color: 'white', fontSize: '1.1rem' }}>{user.testsTaken}</p>
          </div>
          <div className="glass-panel" style={{ padding: '10px 20px', borderRadius: '12px', textAlign: 'center' }}>
            <span style={{ fontSize: '0.7rem', color: '#A0A0C0', display: 'block' }}>Avg Accuracy</span>
            <p style={{ fontWeight: 'bold', color: 'var(--secondary-color)', fontSize: '1.1rem' }}>81%</p>
          </div>
        </div>
      </div>

      {/* ── Category Filter ── */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: '12px', marginBottom: '28px' }}>
        {categories.map(cat => (
          <div key={cat.id} onClick={() => setSelectedCategory(cat.id)}
            className="glass-panel"
            style={{
              padding: '14px 16px', borderRadius: '14px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '10px',
              border: selectedCategory === cat.id ? '1px solid #6C63FF' : '1px solid rgba(255,255,255,0.06)',
              background: selectedCategory === cat.id ? 'rgba(108,99,255,0.1)' : 'rgba(255,255,255,0.02)'
            }}>
            <span style={{ color: selectedCategory === cat.id ? '#B88EFC' : '#A0A0C0' }}>{cat.icon}</span>
            <span style={{ fontSize: '0.85rem', fontWeight: '600', color: selectedCategory === cat.id ? 'white' : '#A0A0C0' }}>{cat.label}</span>
          </div>
        ))}
      </div>

      {/* ── Test Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {filteredCatalog.map(test => (
          <div key={test.id} className="glass-panel" style={{ padding: '24px', borderRadius: '18px', display: 'flex', flexDirection: 'column', gap: '16px', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{
                  padding: '4px 10px', borderRadius: '50px', fontSize: '0.72rem', fontWeight: '600',
                  border: `1px solid ${difficultyColor(test.difficulty)}44`,
                  color: difficultyColor(test.difficulty), background: 'transparent'
                }}>{test.difficulty}</span>
                <span style={{ fontSize: '0.78rem', color: '#626280' }}>Best: {test.bestScore}</span>
              </div>
              <h3 style={{ color: 'white', fontSize: '1rem', marginBottom: '10px', lineHeight: '1.4' }}>{test.title}</h3>
              <div style={{ display: 'flex', gap: '14px', fontSize: '0.78rem', color: '#A0A0C0', flexWrap: 'wrap' }}>
                <span>⏱ {test.duration}</span>
                <span>📝 {test.qCount} Qs</span>
                <span>🏆 {test.marks} marks</span>
              </div>
              <div style={{ fontSize: '0.72rem', color: '#00D4AA', background: 'rgba(0,212,170,0.05)', padding: '4px 10px', borderRadius: '6px', border: '1px solid rgba(0,212,170,0.15)', display: 'inline-block', marginTop: '10px' }}>
                🔥 {test.registrants || '4,500'} participants are competing
              </div>
            </div>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.72rem', color: '#626280' }}>Attempts: {test.attempts}</span>
              <button onClick={() => handleStartExam(test)} className="btn btn-primary btn-pill" style={{ padding: '8px 18px', fontSize: '0.8rem' }}>
                Start Test →
              </button>
            </div>
          </div>
        ))}
        {filteredCatalog.length === 0 && (
          <p style={{ color: '#626280', textAlign: 'center', padding: '40px', gridColumn: '1 / -1' }}>No tests in this category.</p>
        )}
      </div>
    </div>
  );
}
