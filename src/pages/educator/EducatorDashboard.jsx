import React, { useState, useEffect } from 'react';
import { 
  Users, BarChart3, Activity, ClipboardList, Brain, 
  Video, Database, FileText, MessageSquare, Settings, LogOut, ArrowRight,
  Zap, ChevronDown, ChevronUp, CheckCircle, Target, Clock, BookOpen, AlertCircle,
  TrendingUp, TrendingDown, Calendar, Lightbulb, RefreshCw, Send, Check, Bell,
  Sparkles
} from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import KnowledgeBase from './KnowledgeBase';
import SessionInsights from './SessionInsights';

export default function EducatorDashboard({ user, logout, navigate, setSessionDiagnosis, setParentUpdate, addNote }) {
  const [subPage, setSubPage] = useState('overview'); // 'overview' | 'analytics' | 'insights'
  const [activeClass, setActiveClass] = useState('JEE Main - Batch A');
  const [gradingAssignment, setGradingAssignment] = useState(null);
  const [analyzingStudent, setAnalyzingStudent] = useState(null);
  const [studentAnalysisDetails, setStudentAnalysisDetails] = useState({});
  const [activeMetricModal, setActiveMetricModal] = useState(null); // null | 'students' | 'accuracy' | 'engagement' | 'assignments'

  // AI Doubt states
  const [studentDoubts, setStudentDoubts] = useState([
    { id: 'sd_1', student: "Rohan Das", question: "If dW is negative during gas compression, why does internal energy increase if no heat is added?", time: "5 mins ago", tag: "Thermodynamics", resolved: false },
    { id: 'sd_2', student: "Simran Kaur", question: "In a substitution like u = x^2, why do we change the integration limits? Can we just substitute x back at the end?", time: "12 mins ago", tag: "Calculus", resolved: false },
    { id: 'sd_3', student: "Varun Verma", question: "Why is SN2 concerted backside attack inhibited by bulky groups when SN1 is not?", time: "18 mins ago", tag: "Organic Chemistry", resolved: true }
  ]);
  const [generatingDoubtReport, setGeneratingDoubtReport] = useState(false);
  const [doubtReport, setDoubtReport] = useState(null);
  const [solvingDoubtId, setSolvingDoubtId] = useState(null);
  const [solvedDoubtAnswers, setSolvedDoubtAnswers] = useState({});
  const [writingManualId, setWritingManualId] = useState(null);
  const [manualAnswerText, setManualAnswerText] = useState("");

  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);
  const [notifications] = useState([
    { text: "🚨 Doubt Alert: Rohan Das asked a doubt about Thermodynamics work signs.", time: "5 mins ago", targetPage: "doubts" },
    { text: "📈 Class Activity: Average accuracy increased by 4% in Calculus.", time: "1 hour ago", targetPage: "analytics" },
    { text: "📝 Homework Submissions: 12 new submissions pending grading.", time: "1 day ago", targetPage: "overview" }
  ]);

  const handleNotificationClick = (item) => {
    if (item.targetPage) {
      setSubPage(item.targetPage);
    }
    setShowNotifications(false);
  };

  // Preloaded class metrics
  const classPerformance = [
    { chapter: "Electrostatics", average: 82, color: '#00D4AA' },
    { chapter: "Kinematics", average: 75, color: '#FFB347' },
    { chapter: "Thermodynamics", average: 38, color: '#FF6B6B' }, // lagging
    { chapter: "Calculus", average: 88, color: '#00D4AA' },
    { chapter: "Chemical Bonding", average: 64, color: '#FFB347' }
  ];

  // At-risk vs toppers lists
  const toppers = [
    { id: 1, rank: 1, name: "Priya Sharma", score: "94%", trend: "+2%" },
    { id: 2, rank: 2, name: "Aarav Gupta", score: "91%", trend: "+1%" },
    { id: 3, rank: 3, name: "Arjun Kumar", score: "87%", trend: "+4%" }
  ];

  const atRisk = [
    { id: 28, rank: 28, name: "Varun Verma", score: "42%", lag: "Thermodynamics" },
    { id: 29, rank: 29, name: "Rohan Das", score: "38%", lag: "Thermodynamics" },
    { id: 30, rank: 30, name: "Simran Kaur", score: "35%", lag: "Calculus" }
  ];

  // Doubts Compiler aggregators
  const [compiledDoubts, setCompiledDoubts] = useState([
    { 
      id: 1, 
      topic: "Thermodynamics Adiabatic work calculations", 
      frequency: 18, 
      detailedContext: "Students are consistently using incorrect sign conventions (+/-) when substituting work done by the gas vs work done on the gas in the First Law equation. Specifically struggling with PV^gamma = constant derivations.",
      addedToRevision: false,
      expanded: false
    },
    { 
      id: 2, 
      topic: "SN2 Backside attack steric hindrance rules", 
      frequency: 14, 
      detailedContext: "Confusion between primary and secondary carbocation intermediates versus concerted transition states. Students are picking SN1 pathways for secondary halides in aprotic solvents instead of SN2.",
      addedToRevision: false,
      expanded: false
    },
    { 
      id: 3, 
      topic: "Integration Limits for cyclical orbits", 
      frequency: 9, 
      detailedContext: "Setting up the definite integral boundaries from 0 to 2π versus 0 to π when calculating the area under polar curves. Many forgot the symmetry multiplier.",
      addedToRevision: true,
      expanded: false
    }
  ]);

  const generateDoubtAIReport = async () => {
    setGeneratingDoubtReport(true);
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
    const doubtsText = studentDoubts.map(d => `${d.student} asks under tag [${d.tag}]: "${d.question}"`).join("\n") +
      "\n" + compiledDoubts.map(c => `Topic: ${c.topic} (Frequency: ${c.frequency}). Context: ${c.detailedContext}`).join("\n");

    const fallbackReport = {
      overview: "Class exhibits a highly focused doubt cluster surrounding sign conventions in Thermodynamics and coordinate transformations/boundary tracking in Calculus. Concept doubts are rising 15% week-over-week.",
      struggles: [
        { topic: "Thermodynamics Sign Convention", issue: "Students consistently invert the sign for compression work (-dW in First Law expansion cases), leading to incorrect internal energy estimations.", recommendation: "Dedicate the first 10 minutes of next lecture to a P-V work direction walkthrough." },
        { topic: "Calculus Limits Substitution", issue: "Students skip converting limits of integration when changing variables, leading to wrong definite integrals.", recommendation: "Run a short drill session on definite boundary translations." },
        { topic: "Organic SN2 Steric Hindrance", issue: "Weak mental models of concerted bimolecular state spatial requirements. Students default to SN1.", recommendation: "Present 3D stereochemical inversion animations to class." }
      ],
      plan: [
        "Conduct a 15-minute quick diagnostic exam at the start of tomorrow's class.",
        "Deploy the 'Calculus substitution cheatsheet' via Student Notes.",
        "Pair lagging students with toppers for weekly peer review session."
      ]
    };

    if (!apiKey) {
      setTimeout(() => {
        setDoubtReport(fallbackReport);
        setGeneratingDoubtReport(false);
      }, 2000);
      return;
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const jsonModel = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        generationConfig: { responseMimeType: "application/json" }
      });
      const prompt = `Analyze these student doubts and topics asked during class:
      ${doubtsText}
      
      Generate a detailed educational cohort diagnostic report.
      You must return exactly in this JSON structure:
      {
        "overview": "Short summary of the batch's core conceptual weakness and doubt trend.",
        "struggles": [
          {
            "topic": "Topic Name",
            "issue": "Specific conceptual gap or misunderstanding.",
            "recommendation": "Suggested classroom action or explanation strategy."
          },
          ...
        ],
        "plan": [
          "Action item 1 for educator",
          "Action item 2 for educator",
          ...
        ]
      }`;
      const result = await jsonModel.generateContent(prompt);
      const report = JSON.parse(result.response.text());
      setDoubtReport(report);
    } catch (err) {
      console.error("Gemini report error, using fallback: ", err);
      setDoubtReport(fallbackReport);
    } finally {
      setGeneratingDoubtReport(false);
    }
  };

  const resolveDoubtWithAI = async (doubtId, questionText) => {
    setSolvingDoubtId(doubtId);
    // Clear previous resolution attempt for this doubt specifically
    setSolvedDoubtAnswers(prev => ({ ...prev, [doubtId]: "" }));
    
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
    
    // Define a smart default answer in case of network/key failures
    let fallbackText = "In this process, please review the core conservation laws and ensure we represent each variable with the proper sign convention. Work done by the system is positive, and work done on the system is negative.";
    if (questionText.toLowerCase().includes("dw is negative") || questionText.toLowerCase().includes("compression")) {
      fallbackText = "In thermodynamic compression, work is done ON the gas, meaning dW is negative (if defined as energy leaving the system). According to the first law dQ = dU + dW, if dQ = 0 (adiabatic compression) and dW is negative, then dU = -dW. Since dW is negative, -dW is positive, so dU is positive. This increase in internal energy directly leads to a rise in temperature.";
    } else if (questionText.toLowerCase().includes("substitution") || questionText.toLowerCase().includes("limits")) {
      fallbackText = "When performing integration by substitution (e.g. u = g(x)), the limits of integration must be changed to match the new variable u. If you do not change the limits and evaluate using the original limits, you will get an incorrect value. Changing the limits ensures mathematically sound transformations throughout the definite integral evaluation.";
    } else if (questionText.toLowerCase().includes("sn2")) {
      fallbackText = "SN2 is a concerted nucleophilic substitution which occurs via a backside attack in a single step. Bulky groups around the electrophilic carbon create severe steric hindrance, blocking the path of the incoming nucleophile. In SN1, the reaction proceeds via a stable carbocation intermediate after the leaving group departs, so steric hindrance is not a barrier for the attack itself.";
    }

    if (!apiKey) {
      setTimeout(() => {
        setSolvedDoubtAnswers(prev => ({ ...prev, [doubtId]: fallbackText }));
        setSolvingDoubtId(null);
      }, 1500);
      return;
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `Provide a clear, brief, and highly educational explanation for an educator to resolve this student doubt during a live class: "${questionText}"`;
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      setSolvedDoubtAnswers(prev => ({ ...prev, [doubtId]: text }));
    } catch (err) {
      console.error("Gemini doubt resolution error, using fallback: ", err);
      setSolvedDoubtAnswers(prev => ({ ...prev, [doubtId]: fallbackText }));
    } finally {
      setSolvingDoubtId(null);
    }
  };

  const submitManualAnswer = (doubtId) => {
    if (!manualAnswerText.trim()) return;
    setSolvedDoubtAnswers(prev => ({ ...prev, [doubtId]: `[Educator] ${manualAnswerText}` }));
    setStudentDoubts(prev => prev.map(d => d.id === doubtId ? { ...d, resolved: true } : d));
    setWritingManualId(null);
    setManualAnswerText("");
  };

  const handleGradeWithAI = (assignName) => {
    setGradingAssignment(assignName);
    setTimeout(() => {
      setGradingAssignment(null);
      alert(`AI autograding for ${assignName} finished successfully! 40 submissions graded, notifications dispatched to parents. 📝`);
    }, 2500);
  };

  const handleLaunchSurpriseTest = () => {
    if (window.confirm("Are you sure you want to launch a Surprise 10-Min Quiz to all active students in this batch right now?")) {
      alert("Surprise quiz deployed! ⚡ Students will receive a pop-up notification instantly.");
    }
  };

  const toggleDoubtExpanded = (id) => {
    setCompiledDoubts(prev => prev.map(d => d.id === id ? { ...d, expanded: !d.expanded } : d));
  };

  const toggleAddToRevision = (id) => {
    setCompiledDoubts(prev => prev.map(d => {
      if (d.id === id) {
        const isAdding = !d.addedToRevision;
        if (isAdding) alert(`"${d.topic}" has been added to your upcoming class revision agenda!`);
        return { ...d, addedToRevision: isAdding };
      }
      return d;
    }));
  };

  const handleAnalyzeStudent = (studentId, studentName) => {
    setAnalyzingStudent(studentId);
    
    setTimeout(() => {
      let analysisData = {};

      if (studentName === "Varun Verma" || studentName === "Rohan Das") {
        analysisData = {
          diagnosis: "Shows severe gaps in foundational Thermodynamics concepts. Fails to differentiate between Isothermal and Adiabatic curves in P-V indicator diagrams.",
          rootCause: "Core conceptual misunderstanding of the First Law sign conventions. Confuses 'work done BY gas' with 'work done ON gas'.",
          learningStyle: "Visual Learner (Needs more diagrammatic explanation)",
          efficiency: "Low (Spends 15 mins/question on Thermo)",
          topicBreakdown: [
            { name: '1st Law of Thermo', score: 20 },
            { name: 'Calorimetry', score: 65 },
            { name: 'Heat Transfer', score: 45 }
          ],
          recommendedPlan: [
            "Assign the 'First Law Sign Conventions' interactive 3D module.",
            "Conduct a 10-min 1-on-1 focused purely on P-V diagram reading.",
            "Lock advanced problem sets until foundational quiz score > 70%."
          ]
        };
      } else if (studentName === "Simran Kaur") {
        analysisData = {
          diagnosis: "Calculus integration limits are weak. Misses substitution method boundaries when converting from dx to du.",
          rootCause: "Procedural skips. Student rushes through the substitution step without updating the upper and lower limits on the integral.",
          learningStyle: "Kinesthetic Learner (Learns by doing drills)",
          efficiency: "Medium (Fast but error-prone)",
          topicBreakdown: [
            { name: 'Indefinite Integrals', score: 85 },
            { name: 'Definite Limits', score: 30 },
            { name: 'Area under Curve', score: 35 }
          ],
          recommendedPlan: [
            "Assign the 'Basic Integration by Substitution' practice worksheet.",
            "Enable 'Step-by-Step Mode' strictly on the AI Solver to force procedural checks.",
            "Review past mistakes in the 'Smart Notes' compiler."
          ]
        };
      } else {
        analysisData = {
          diagnosis: "Performing exceptionally well across most domains. Makes occasional silly errors in time-constrained physics mock tests.",
          rootCause: "Test anxiety leading to calculation mistakes under time pressure. Conceptual understanding is flawless.",
          learningStyle: "Auditory Learner (Highly engaged in live lectures)",
          efficiency: "High (Completes assignments 20% faster than batch avg)",
          topicBreakdown: [
            { name: 'Electrostatics', score: 95 },
            { name: 'Kinematics', score: 92 },
            { name: 'Mock CBTs', score: 80 }
          ],
          recommendedPlan: [
            "Assign advanced 'HOTS' (High Order Thinking Skills) problem sets.",
            "Introduce mock tests with tighter time constraints (-10% time).",
            "Pair them up to peer-tutor Varun Verma on Thermodynamics."
          ]
        };
      }
      
      setStudentAnalysisDetails(prev => ({ ...prev, [studentId]: analysisData }));
      setAnalyzingStudent(null);
    }, 2500);
  };

  return (
    <div className="grid-sidebar" style={{
      minHeight: '100vh',
      background: '#0D0D1A',
      color: 'white',
      fontFamily: "'Inter', sans-serif"
    }}>

      {/* 1. Left Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="dashboard-sidebar-top">
          <div onClick={() => setSubPage('overview')} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
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

          {/* Educator identity */}
          <div className="dashboard-sidebar">
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'var(--secondary-color)',
              color: '#0D0D1A',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.85rem'
            }}>{user.name ? user.name[0].toUpperCase() : 'E'}</div>
            <div>
              <h4 style={{ fontSize: '0.85rem', color: 'white' }}>{user.name.split(' ')[0]}</h4>
              <span style={{ fontSize: '0.7rem', color: '#A0A0C0' }}>Physics Mentor</span>
            </div>
          </div>

          <nav className="dashboard-nav">
            {[
              { id: 'overview', label: 'Overview', icon: <Users size={18} /> },
              { id: 'classes', label: 'My Lectures', icon: <Calendar size={18} />, badge: 'LIVE' },
              { id: 'session-insights', label: 'AI Session Insights', icon: <Sparkles size={18} />, badge: 'NEW' },
              { id: 'analytics', label: 'Student Analytics', icon: <BarChart3 size={18} /> },
              { id: 'insights', label: 'AI Class Insights', icon: <Brain size={18} /> },
              { id: 'doubts', label: 'AI Doubt Analytics', icon: <MessageSquare size={18} />, badge: 'LIVE' },
              { id: 'knowledge', label: 'Knowledge Base', icon: <Database size={18} />, badge: 'RAG' }
            ].map(item => {
              const active = subPage === item.id;
              return (
                <div 
                  key={item.id}
                  onClick={() => setSubPage(item.id)}
                  className="dashboard-nav-item"
                  style={{
                    background: active ? 'rgba(108, 99, 255, 0.1)' : 'transparent',
                    color: active ? 'white' : '#A0A0C0',
                    fontWeight: active ? '600' : '500',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span style={{ fontSize: '0.6rem', background: 'var(--primary-color)', color: 'white', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>
                      {item.badge}
                    </span>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button 
            onClick={() => navigate('dashboard-student')}
            className="btn btn-primary btn-pill" 
            style={{ width: '100%', padding: '8px', fontSize: '0.75rem', color: '#0D0D1A' }}
          >
            🎓 Switch to Student
          </button>
          <button 
            onClick={() => navigate('dashboard-parent')}
            className="btn btn-secondary btn-pill" 
            style={{ width: '100%', padding: '8px', fontSize: '0.75rem', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            👨‍👩‍👦 Switch to Parent
          </button>
          
          <button 
            onClick={logout}
            className="btn btn-ghost" 
            style={{ width: '100%', justifyContent: 'flex-start', padding: '10px 14px', fontSize: '0.9rem' }}
          >
            <LogOut size={18} style={{ marginRight: '10px' }} /> Log Out
          </button>
        </div>
      </aside>

      {/* 2. Main content area */}
      <main className="dashboard-main" style={{ overflowY: 'auto', height: '100vh' }}>
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '16px' }} className="catalog-grid-mobile">
          <div>
            <h1 style={{ color: 'white', fontSize: '2rem' }}>Welcome, {user.name.split(' ')[0]}! 🏫</h1>
            <p style={{ color: '#A0A0C0', fontSize: '0.95rem', marginTop: '4px' }}>Here is your classroom overview for <strong>{activeClass}</strong></p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={handleLaunchSurpriseTest} className="btn btn-pill" style={{ padding: '10px 20px', background: 'rgba(255, 179, 71, 0.1)', color: '#FFB347', border: '1px solid rgba(255, 179, 71, 0.3)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Zap size={16} /> Launch Surprise Test
            </button>
            <button onClick={() => alert("Simulated: Starting live audio transcribing stream class!")} className="btn btn-primary btn-glow btn-pill" style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Video size={16} /> Start Live Class
            </button>
          </div>
        </div>

        {subPage === 'overview' && (
          <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            
            {/* Metric Row */}
            <div className="grid-5" style={{ gap: '20px' }}>
              {[
                { id: 'students', label: 'Total Students active', value: '38 students', color: '#6C63FF', icon: <Users size={16} /> },
                { id: 'accuracy', label: 'Avg Class accuracy', value: '74%', color: '#00D4AA', icon: <BarChart3 size={16} /> },
                { id: 'lectures_conducted', label: 'Total Lectures Conducted', value: '12 done', color: '#05D580', icon: <Calendar size={16} /> },
                { id: 'engagement', label: 'Engaged today', value: '32 online', color: '#FFB347', icon: <Activity size={16} /> },
                { id: 'assignments', label: 'Assignments Due', value: '1 pending', color: '#FF6B6B', icon: <ClipboardList size={16} /> }
              ].map((m, i) => (
                <div 
                  key={i} 
                  className="glass-panel" 
                  onClick={() => setActiveMetricModal(m.id)}
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
                    e.currentTarget.style.borderColor = m.color;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', color: '#A0A0C0' }}>
                    <span style={{ fontSize: '0.75rem' }}>{m.label}</span>
                    {m.icon}
                  </div>
                  <p style={{ fontSize: '1.4rem', fontWeight: '800', color: 'white' }}>{m.value}</p>
                </div>
              ))}
            </div>

            {/* AI intelligence reports panel */}
            <div className="glass-panel" style={{
              padding: '30px',
              borderRadius: '24px',
              background: 'linear-gradient(135deg, rgba(108, 99, 255, 0.12) 0%, rgba(26, 26, 53, 0.6) 100%)',
              border: '1px solid rgba(108, 99, 255, 0.25)',
              cursor: 'pointer'
            }} onClick={() => setSubPage('insights')}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ color: 'white', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Brain size={18} style={{ color: '#FFB347' }} /> AI Class Intelligence Summary
                </h3>
                <span style={{ fontSize: '0.75rem', color: '#6C63FF', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  View Full Report <ArrowRight size={14} />
                </span>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', color: '#A0A0C0', lineHeight: '1.5' }}>
                <p>⚠️ <strong>Thermodynamics Alert:</strong> 8 students scored below 40% in thermodynamics work cycles. Consider running a quick revision drill.</p>
                <p>🏆 <strong>Toppers highlight:</strong> Priya Sharma and Aarav Gupta are excelling consistently in maths limits. Consider adding advanced challenges.</p>
                <p>📊 <strong>Engagement insight:</strong> Student involvement rises by 18% when using spaced repetition flashcard widgets.</p>
              </div>
            </div>

            {/* Dual Ranking Card (Toppers vs Needs review) */}
            <div className="grid-2" style={{ gap: '24px' }}>
              
              {/* Toppers */}
              <div className="glass-panel" style={{ padding: '24px', borderRadius: '18px' }}>
                <h4 style={{ color: 'white', fontSize: '0.95rem', fontWeight: 'bold', marginBottom: '16px' }}>🏆 Class Toppers</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {toppers.map((t, idx) => (
                    <div key={idx} style={{
                      padding: '12px 16px',
                      background: 'rgba(255,255,255,0.01)',
                      border: '1px solid rgba(255,255,255,0.04)',
                      borderRadius: '10px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '0.85rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ color: '#00D4AA', fontWeight: 'bold' }}>#{t.rank}</span>
                        <span style={{ color: 'white' }}>{t.name}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span style={{ color: 'white', fontWeight: 'bold' }}>{t.score}</span>
                        <span style={{ color: '#00D4AA', fontSize: '0.75rem' }}>{t.trend}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Needs reviewer */}
              <div className="glass-panel" style={{ padding: '24px', borderRadius: '18px' }}>
                <h4 style={{ color: 'white', fontSize: '0.95rem', fontWeight: 'bold', marginBottom: '16px' }}>⚠️ Lagging Students (Requires Intervention)</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {atRisk.map((r, idx) => (
                    <div key={idx} style={{
                      padding: '12px 16px',
                      background: 'rgba(255, 107, 107, 0.04)',
                      border: '1px solid rgba(255, 107, 107, 0.15)',
                      borderRadius: '10px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '0.85rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ color: '#FF6B6B', fontWeight: 'bold' }}>#{r.rank}</span>
                        <div>
                          <span style={{ color: 'white', display: 'block' }}>{r.name}</span>
                          <span style={{ fontSize: '0.7rem', color: '#A0A0C0' }}>Gaps in: {r.lag}</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => alert(`Simulating chat popups with student ${r.name}...`)}
                        className="btn btn-secondary" 
                        style={{ padding: '6px 12px', fontSize: '0.75rem', color: '#FFB347', borderColor: 'rgba(255,179,71,0.2)' }}
                      >
                        Message
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Aggregated doubts compilation */}
            <div className="glass-panel" style={{ padding: '24px', borderRadius: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ color: 'white', fontSize: '1rem', fontWeight: 'bold' }}>Most Asked Doubts by Students</h3>
                <span style={{ fontSize: '0.75rem', color: '#A0A0C0', background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: '20px' }}>AI Compiled</span>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {compiledDoubts.map((doubt) => (
                  <div key={doubt.id} style={{
                    background: doubt.expanded ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.02)',
                    borderRadius: '10px',
                    border: doubt.expanded ? '1px solid rgba(108, 99, 255, 0.3)' : '1px solid transparent',
                    transition: 'all 0.2s',
                    overflow: 'hidden'
                  }}>
                    {/* Header */}
                    <div 
                      onClick={() => toggleDoubtExpanded(doubt.id)}
                      style={{
                        padding: '14px 20px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        cursor: 'pointer',
                        fontSize: '0.85rem'
                      }}
                    >
                      <div>
                        <h4 style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          "{doubt.topic}"
                          {doubt.addedToRevision && <CheckCircle size={14} color="#00D4AA" />}
                        </h4>
                        <span style={{ fontSize: '0.75rem', color: '#A0A0C0' }}>Asked by {doubt.frequency} students this week</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <button 
                          onClick={(e) => { e.stopPropagation(); toggleAddToRevision(doubt.id); }}
                          className={`btn ${doubt.addedToRevision ? 'btn-ghost' : 'btn-secondary'}`} 
                          style={{ padding: '6px 12px', fontSize: '0.75rem', color: doubt.addedToRevision ? '#00D4AA' : 'white' }}
                        >
                          {doubt.addedToRevision ? 'Added to Revision ✓' : 'Add to Revision Agenda'}
                        </button>
                        {doubt.expanded ? <ChevronUp size={18} color="#A0A0C0" /> : <ChevronDown size={18} color="#A0A0C0" />}
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {doubt.expanded && (
                      <div style={{
                        padding: '0 20px 16px 20px',
                        borderTop: '1px solid rgba(255,255,255,0.04)',
                        marginTop: '4px',
                        paddingTop: '12px'
                      }}>
                        <div style={{ background: 'rgba(108, 99, 255, 0.08)', borderLeft: '3px solid #6C63FF', padding: '12px', borderRadius: '4px 8px 8px 4px' }}>
                          <h5 style={{ fontSize: '0.75rem', color: '#6C63FF', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>AI Struggle Analysis</h5>
                          <p style={{ fontSize: '0.85rem', color: '#cceee8', lineHeight: '1.5' }}>
                            {doubt.detailedContext}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Chapter performance class chart */}
            <div className="glass-panel" style={{ padding: '30px', borderRadius: '20px' }}>
              <h3 style={{ color: 'white', fontSize: '1.05rem', fontWeight: 'bold', marginBottom: '20px' }}>Chapter average score spreads</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {classPerformance.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                      <span style={{ color: 'white' }}>{item.chapter}</span>
                      <span style={{ color: 'white', fontWeight: 'bold' }}>{item.average}% Class Avg</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.04)', borderRadius: '4px' }}>
                      <div style={{ width: `${item.average}%`, height: '100%', background: item.color, borderRadius: '4px', transition: 'width 1s' }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent assignments table */}
            <div className="glass-panel" style={{ padding: '24px', borderRadius: '18px', overflowX: 'auto' }}>
              <h3 style={{ color: 'white', fontSize: '1rem', fontWeight: 'bold', marginBottom: '16px' }}>Assignments status logs</h3>
              
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ color: '#626280', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '8px', textAlign: 'left' }}>
                    <th style={{ padding: '10px' }}>Assignment Name</th>
                    <th>Submissions</th>
                    <th>Due Date</th>
                    <th>AI Grading Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'Thermodynamics Calorimetry Sheet', subs: '32/38', due: 'Yesterday', graded: 'Completed' },
                    { name: 'Electrostatics Flux Grids', subs: '28/38', due: 'In 2 days', graded: 'Pending submissions', action: true }
                  ].map((ass, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ padding: '14px 10px', color: 'white' }}>{ass.name}</td>
                      <td>{ass.subs} completed</td>
                      <td>{ass.due}</td>
                      <td style={{ color: ass.graded === 'Completed' ? '#00D4AA' : '#FFB347' }}>{ass.graded}</td>
                      <td>
                        {ass.action ? (
                          <button 
                            onClick={() => handleGradeWithAI(ass.name)}
                            disabled={gradingAssignment !== null}
                            className="btn btn-primary" 
                            style={{ padding: '6px 12px', fontSize: '0.75rem', color: '#0D0D1A' }}
                          >
                            {gradingAssignment === ass.name ? 'Grading...' : 'Grade with AI'}
                          </button>
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: '#626280' }}>Dispatched</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {subPage === 'knowledge' && (
          <KnowledgeBase />
        )}

        {/* Classes (My Lectures) sub page */}
        {subPage === 'classes' && (
          <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <button onClick={() => setSubPage('overview')} className="btn btn-ghost" style={{ marginBottom: '10px', width: 'fit-content' }}>← Back to Overview</button>
            
            <div style={{
              background: 'linear-gradient(135deg, rgba(108, 99, 255, 0.15) 0%, rgba(5, 213, 128, 0.05) 100%)',
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
                  <Calendar style={{ color: '#00D4AA' }} /> Lectures Schedule & Log
                </h2>
                <p style={{ color: '#A0A0C0', fontSize: '0.9rem', maxWidth: '500px' }}>
                  Manage scheduled batches, start digital streaming, and audit attendance logs for physics classes.
                </p>
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div className="glass-panel" style={{ padding: '12px 20px', borderRadius: '16px', textAlign: 'center', minWidth: '120px' }}>
                  <span style={{ fontSize: '0.75rem', color: '#A0A0C0', display: 'block' }}>Lectures Conducted</span>
                  <span style={{ fontSize: '1.5rem', fontWeight: '800', color: '#00D4AA' }}>12</span>
                </div>
                <div className="glass-panel" style={{ padding: '12px 20px', borderRadius: '16px', textAlign: 'center', minWidth: '120px' }}>
                  <span style={{ fontSize: '0.75rem', color: '#A0A0C0', display: 'block' }}>Upcoming Sessions</span>
                  <span style={{ fontSize: '1.5rem', fontWeight: '800', color: '#6C63FF' }}>3</span>
                </div>
              </div>
            </div>

            {/* Layout grid */}
            <div className="grid-split-reverse" style={{ gap: '24px' }}>
              {/* Upcoming Lectures */}
              <div className="glass-panel" style={{ padding: '24px', borderRadius: '18px' }}>
                <h3 style={{ color: 'white', fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock size={18} style={{ color: '#6C63FF' }} /> Upcoming Lectures
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {[
                    { id: 'u1', topic: 'Kinetic Theory of Gases (KTG)', batch: 'JEE Main - Batch A', day: 'Monday', date: 'June 8, 2026', time: '10:00 AM', actionable: true },
                    { id: 'u2', topic: 'Real Gases & Van der Waals Equation', batch: 'JEE Main - Batch A', day: 'Wednesday', date: 'June 10, 2026', time: '04:00 PM' },
                    { id: 'u3', topic: 'Specific Heat Capacities & Degrees of Freedom', batch: 'JEE Main - Batch B', day: 'Friday', date: 'June 12, 2026', time: '10:00 AM' }
                  ].map((cls, i) => (
                    <div key={i} style={{
                      padding: '16px',
                      background: 'rgba(255,255,255,0.01)',
                      border: cls.actionable ? '1px solid rgba(0, 212, 170, 0.25)' : '1px solid rgba(255,255,255,0.05)',
                      borderRadius: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <span style={{ fontSize: '0.7rem', color: '#6C63FF', fontWeight: 'bold' }}>{cls.batch}</span>
                          <h4 style={{ color: 'white', fontSize: '0.95rem', fontWeight: 'bold', margin: '4px 0 0 0' }}>{cls.topic}</h4>
                        </div>
                        <span style={{ fontSize: '0.75rem', color: '#A0A0C0' }}>{cls.day}, {cls.date}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.75rem', color: '#A0A0C0' }}>⏰ {cls.time}</span>
                        {cls.actionable ? (
                          <button onClick={() => alert("Launching Live Class Stream!")} className="btn btn-primary btn-glow btn-pill" style={{ padding: '6px 14px', fontSize: '0.75rem', color: '#0D0D1A' }}>
                            Start Broadcast
                          </button>
                        ) : (
                          <button onClick={() => alert("Materials pre-loaded!")} className="btn btn-secondary btn-pill" style={{ padding: '6px 14px', fontSize: '0.75rem' }}>
                            Load Slides
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Conducted Lectures Log */}
              <div className="glass-panel" style={{ padding: '24px', borderRadius: '18px' }}>
                <h3 style={{ color: 'white', fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle size={18} style={{ color: '#00D4AA' }} /> Lecture History Logs
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[
                    { topic: 'Calorimetry & Phase Diagrams', date: 'June 5, 2026', time: '10:00 AM', attendance: '35/38', doubts: 8 },
                    { topic: 'Laws of Thermodynamics & Entropy', date: 'June 3, 2026', time: '04:00 PM', attendance: '34/38', doubts: 12 },
                    { topic: 'Thermodynamics & Carnot Cycle', date: 'June 2, 2026', time: '10:00 AM', attendance: '36/38', doubts: 5 }
                  ].map((log, idx) => (
                    <div key={idx} style={{
                      padding: '14px',
                      background: 'rgba(255,255,255,0.01)',
                      border: '1px solid rgba(255,255,255,0.04)',
                      borderRadius: '10px',
                      fontSize: '0.8rem'
                    }}>
                      <h4 style={{ color: 'white', fontWeight: '600', margin: '0 0 6px 0' }}>{log.topic}</h4>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#A0A0C0', fontSize: '0.72rem' }}>
                        <span>📅 {log.date} at {log.time}</span>
                        <span>👥 Attendance: <strong style={{ color: '#00D4AA' }}>{log.attendance}</strong></span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.04)', marginTop: '8px', paddingTop: '8px' }}>
                        <span style={{ fontSize: '0.72rem', color: '#626280' }}>Doubt clusters: <strong>{log.doubts}</strong></span>
                        <button onClick={() => setSubPage('doubts')} className="btn btn-ghost" style={{ padding: '2px 8px', fontSize: '0.7rem', color: '#00D4AA' }}>
                          View doubts →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Analytics sub page */}
        {subPage === 'analytics' && (
          <div className="fade-in">
            <button onClick={() => setSubPage('overview')} className="btn btn-ghost" style={{ marginBottom: '20px' }}>← Back to Overview</button>
            <div className="glass-panel" style={{ padding: '30px', borderRadius: '24px' }}>
              <h2 style={{ color: 'white', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <BarChart3 size={24} color="#6C63FF" /> Deep Student Analytics
              </h2>
              <p style={{ color: '#A0A0C0', fontSize: '0.9rem', marginBottom: '24px' }}>Run comprehensive AI diagnostics to uncover root causes and generate personalized study plans.</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {toppers.concat(atRisk).map((st) => (
                  <div key={st.id} style={{
                    background: 'rgba(255,255,255,0.02)',
                    borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.04)',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      padding: '16px 20px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '0.9rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{
                          width: '40px', height: '40px', borderRadius: '50%',
                          background: st.score > '80%' ? 'rgba(0,212,170,0.1)' : 'rgba(255,107,107,0.1)',
                          color: st.score > '80%' ? '#00D4AA' : '#FF6B6B',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: 'bold', fontSize: '1rem'
                        }}>
                          {st.name[0]}
                        </div>
                        <div>
                          <span style={{ color: 'white', fontWeight: 'bold', display: 'block' }}>{st.name}</span>
                          <span style={{ color: '#A0A0C0', fontSize: '0.75rem' }}>Overall Score: {st.score}</span>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => handleAnalyzeStudent(st.id, st.name)}
                        disabled={analyzingStudent === st.id}
                        className="btn btn-secondary"
                        style={{ 
                          padding: '8px 16px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px',
                          background: studentAnalysisDetails[st.id] ? 'rgba(108, 99, 255, 0.1)' : '',
                          borderColor: studentAnalysisDetails[st.id] ? '#6C63FF' : ''
                        }}
                      >
                        <Brain size={14} color={studentAnalysisDetails[st.id] ? "#6C63FF" : "white"} /> 
                        {analyzingStudent === st.id ? 'Running 360° Diagnostic...' : studentAnalysisDetails[st.id] ? 'Re-run Analysis' : 'Run Deep Analysis'}
                      </button>
                    </div>

                    {/* Highly Detailed AI Analysis Panel */}
                    {studentAnalysisDetails[st.id] && (
                      <div className="fade-in" style={{
                        padding: '24px',
                        background: 'rgba(0, 0, 0, 0.3)',
                        borderTop: '1px solid rgba(255,255,255,0.04)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '24px'
                      }}>
                        
                        {/* 1. Root Cause & Diagnosis */}
                        <div className="grid-2" style={{ gap: '20px' }}>
                          <div style={{ background: 'rgba(108,99,255,0.05)', border: '1px solid rgba(108,99,255,0.2)', padding: '16px', borderRadius: '12px' }}>
                            <h5 style={{ color: '#6C63FF', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <Target size={14} /> AI Diagnosis
                            </h5>
                            <p style={{ color: '#E0E0FF', fontSize: '0.85rem', lineHeight: '1.5' }}>{studentAnalysisDetails[st.id].diagnosis}</p>
                          </div>
                          <div style={{ background: 'rgba(255,107,107,0.05)', border: '1px solid rgba(255,107,107,0.2)', padding: '16px', borderRadius: '12px' }}>
                            <h5 style={{ color: '#FF6B6B', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <AlertCircle size={14} /> Root Cause Inference
                            </h5>
                            <p style={{ color: '#FFE0E0', fontSize: '0.85rem', lineHeight: '1.5' }}>{studentAnalysisDetails[st.id].rootCause}</p>
                          </div>
                        </div>

                        {/* 2. Sub-Topic Mastery Bars & Student Profile */}
                        <div className="grid-1-2" style={{ gap: '20px', alignItems: 'start' }}>
                          {/* Profile Data */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                              <Brain size={18} color="#00D4AA" />
                              <div>
                                <span style={{ display: 'block', fontSize: '0.7rem', color: '#A0A0C0' }}>Learning Style</span>
                                <span style={{ fontSize: '0.8rem', color: 'white', fontWeight: 'bold' }}>{studentAnalysisDetails[st.id].learningStyle}</span>
                              </div>
                            </div>
                            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                              <Clock size={18} color="#FFB347" />
                              <div>
                                <span style={{ display: 'block', fontSize: '0.7rem', color: '#A0A0C0' }}>Test Efficiency</span>
                                <span style={{ fontSize: '0.8rem', color: 'white', fontWeight: 'bold' }}>{studentAnalysisDetails[st.id].efficiency}</span>
                              </div>
                            </div>
                          </div>

                          {/* Radar/Bars */}
                          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '16px', borderRadius: '12px' }}>
                            <h5 style={{ color: 'white', fontSize: '0.85rem', marginBottom: '12px' }}>Sub-Topic Mastery Breakdown</h5>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                              {studentAnalysisDetails[st.id].topicBreakdown.map((tb, idx) => (
                                <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                                    <span style={{ color: '#A0A0C0' }}>{tb.name}</span>
                                    <span style={{ color: tb.score > 70 ? '#00D4AA' : tb.score > 40 ? '#FFB347' : '#FF6B6B', fontWeight: 'bold' }}>{tb.score}%</span>
                                  </div>
                                  <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px' }}>
                                    <div style={{ width: `${tb.score}%`, height: '100%', background: tb.score > 70 ? '#00D4AA' : tb.score > 40 ? '#FFB347' : '#FF6B6B', borderRadius: '3px' }}></div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* 3. Actionable Study Plan */}
                        <div style={{ background: 'rgba(0, 212, 170, 0.05)', border: '1px solid rgba(0, 212, 170, 0.2)', padding: '20px', borderRadius: '12px' }}>
                          <h5 style={{ color: '#00D4AA', fontSize: '0.85rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <BookOpen size={16} /> AI Recommended Action Plan
                          </h5>
                          <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', color: '#cceee8' }}>
                            {studentAnalysisDetails[st.id].recommendedPlan.map((step, idx) => (
                              <li key={idx}>{step}</li>
                            ))}
                          </ul>
                          <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                            <button onClick={() => alert("Study plan sent directly to the student's dashboard!")} className="btn btn-primary" style={{ padding: '6px 14px', fontSize: '0.75rem', color: '#0D0D1A' }}>
                              Assign Plan to Student
                            </button>
                          </div>
                        </div>

                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* AI Class Intelligence Analytics sub page */}
        {subPage === 'insights' && (
          <div className="fade-in">
            <button onClick={() => setSubPage('overview')} className="btn btn-ghost" style={{ marginBottom: '20px' }}>← Back to Overview</button>
            <div className="glass-panel" style={{ padding: '30px', borderRadius: '24px' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h2 style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Brain size={26} color="#6C63FF" /> Deep Class Intelligence
                </h2>
                <button onClick={() => alert("Re-syncing with latest student mock test data...")} className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <RefreshCw size={14} /> Refresh AI Models
                </button>
              </div>
              <p style={{ color: '#A0A0C0', fontSize: '0.9rem', marginBottom: '30px' }}>Macro-level cohort behavioral patterns and curriculum pacing recommendations.</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
                
                {/* Curriculum Pacing Optimizer */}
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', overflow: 'hidden' }}>
                  <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <h3 style={{ color: 'white', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Calendar size={18} color="#FFB347" /> Curriculum Pacing Optimizer
                    </h3>
                  </div>
                  <div className="grid-2" style={{ padding: '24px', gap: '20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                       <div style={{ background: 'rgba(108,99,255,0.08)', borderLeft: '3px solid #6C63FF', padding: '16px', borderRadius: '8px' }}>
                        <h4 style={{ color: 'white', fontSize: '0.85rem', marginBottom: '4px' }}>Fast-Track Recommended: Calculus</h4>
                        <p style={{ color: '#A0A0C0', fontSize: '0.8rem', lineHeight: '1.5' }}>Batch assimilation rate is 1.4x faster than expected. You can safely skip introductory lectures on 'Definite Integrals' and move straight to application-level PyQs.</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ background: 'rgba(255,107,107,0.08)', borderLeft: '3px solid #FF6B6B', padding: '16px', borderRadius: '8px' }}>
                        <h4 style={{ color: 'white', fontSize: '0.85rem', marginBottom: '4px' }}>Slow-Down Required: Thermodynamics</h4>
                        <p style={{ color: '#A0A0C0', fontSize: '0.8rem', lineHeight: '1.5' }}>Cognitive load warnings detected. Students are spending 3x longer on Carnot Engine assignments. Recommend pausing the syllabus schedule and dedicating 2 extra remedial classes.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Behavioral Insights */}
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', overflow: 'hidden' }}>
                  <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <h3 style={{ color: 'white', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Lightbulb size={18} color="#00D4AA" /> Behavioral & Engagement Insights
                    </h3>
                  </div>
                  <div className="grid-3" style={{ padding: '24px', gap: '16px' }}>
                    {[
                      { icon: <TrendingUp size={20} color="#00D4AA" />, title: "Smart Notes Efficacy", desc: "Students who use the AI Smart Notes feature actively are scoring 14% higher in weekly mock tests." },
                      { icon: <TrendingDown size={20} color="#FF6B6B" />, title: "Weekend Drop-off", desc: "Engagement on the 'Daily Questions' stack drops by 65% on Sundays. Consider gamifying weekend streaks." },
                      { icon: <Target size={20} color="#6C63FF" />, title: "Doubt Resolution Time", desc: "AI is instantly resolving 82% of batch doubts. Your manual intervention is only required for complex open-ended theories." }
                    ].map((insight, idx) => (
                      <div key={idx} style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.04)' }}>
                        <div style={{ marginBottom: '12px', background: 'rgba(255,255,255,0.05)', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {insight.icon}
                        </div>
                        <h4 style={{ color: 'white', fontSize: '0.85rem', marginBottom: '8px' }}>{insight.title}</h4>
                        <p style={{ color: '#A0A0C0', fontSize: '0.75rem', lineHeight: '1.6' }}>{insight.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Predictive Risk Model */}
                <div style={{ background: 'rgba(255,179,71,0.05)', border: '1px solid rgba(255,179,71,0.2)', borderRadius: '16px', overflow: 'hidden' }}>
                  <div style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h3 style={{ color: '#FFB347', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <AlertCircle size={18} /> Predictive Risk Model
                      </h3>
                      <p style={{ color: '#FFE0B2', fontSize: '0.8rem' }}>AI Forecast for the upcoming Term-End Examination</p>
                    </div>
                    <button onClick={() => alert("Creating automated intervention group chat for at-risk students.")} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.8rem', background: '#FFB347', color: '#0D0D1A', border: 'none' }}>
                      Auto-Remediate Cohort
                    </button>
                  </div>
                  <div style={{ padding: '0 24px 24px 24px' }}>
                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '12px', display: 'flex', gap: '20px', alignItems: 'center' }}>
                      <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(255,107,107,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #FF6B6B' }}>
                        <span style={{ color: '#FF6B6B', fontSize: '1.2rem', fontWeight: 'bold' }}>12</span>
                      </div>
                      <div>
                        <h4 style={{ color: 'white', fontSize: '0.9rem', marginBottom: '4px' }}>Students Projected to Score Below 50%</h4>
                        <p style={{ color: '#A0A0C0', fontSize: '0.8rem', lineHeight: '1.5' }}>
                          Based on historical velocity, homework completion rates, and current doubt frequency, 12 students (including Varun V. and Rohan D.) are on track to fail the Thermodynamics module. Immediate intervention recommended.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}
        {subPage === 'session-insights' && (
          <div className="fade-in" style={{ height: '100%' }}>
            <SessionInsights 
              setSessionDiagnosis={setSessionDiagnosis} 
              setParentUpdate={setParentUpdate}
              addNote={addNote}
            />
          </div>
        )}

        {subPage === 'doubts' && (
          <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            
            {/* AI Doubt Analytics Overview Header */}
            <div className="glass-panel" style={{ padding: '30px', borderRadius: '24px', background: 'linear-gradient(135deg, rgba(0, 212, 170, 0.08) 0%, rgba(13, 13, 26, 0.8) 100%)', border: '1px solid rgba(0, 212, 170, 0.2)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <h2 style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.4rem' }}>
                    <MessageSquare size={24} color="#00D4AA" /> AI Student Doubt Desk
                  </h2>
                  <p style={{ color: '#A0A0C0', fontSize: '0.88rem', marginTop: '4px' }}>Real-time clustering & AI diagnostic report of active student questions asked during lectures.</p>
                </div>
                <button 
                  onClick={generateDoubtAIReport} 
                  disabled={generatingDoubtReport}
                  className="btn btn-primary btn-pill btn-glow" 
                  style={{ padding: '10px 20px', fontSize: '0.82rem', color: '#0D0D1A' }}
                >
                  <Brain size={14} style={{ marginRight: '6px' }} />
                  {generatingDoubtReport ? "Analyzing Doubts..." : doubtReport ? "Re-Generate Doubt Diagnostic" : "Analyze Doubt Patterns"}
                </button>
              </div>

              {/* Live doubt indicators */}
              <div className="grid-3" style={{ gap: '16px', marginTop: '20px' }}>
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ fontSize: '0.72rem', color: '#A0A0C0', display: 'block', marginBottom: '4px' }}>Active Batch Doubts</span>
                  <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'white' }}>{studentDoubts.length + compiledDoubts.length} Doubts</span>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ fontSize: '0.72rem', color: '#A0A0C0', display: 'block', marginBottom: '4px' }}>AI Auto-Resolved Rate</span>
                  <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#00D4AA' }}>84.5% resolved</span>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ fontSize: '0.72rem', color: '#A0A0C0', display: 'block', marginBottom: '4px' }}>Curriculum Pacing Shift</span>
                  <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#FFB347' }}>Thermodynamics lag (High)</span>
                </div>
              </div>
            </div>

            {/* AI generated Report section */}
            {doubtReport && (
              <div className="glass-panel fade-in" style={{ padding: '30px', borderRadius: '24px', borderLeft: '4px solid #6C63FF', background: 'rgba(108, 99, 255, 0.02)' }}>
                <h3 style={{ color: 'white', fontSize: '1.1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Brain size={18} color="#6C63FF" /> Cohort Cognitive Struggle Diagnostics
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#CCCCCC', lineHeight: '1.6', marginBottom: '24px', background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '12px' }}>
                  {doubtReport.overview}
                </p>

                <div className="grid-2" style={{ gap: '20px', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <h4 style={{ fontSize: '0.9rem', color: 'white', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '8px' }}>Core Misconceptions Detected</h4>
                    {doubtReport.struggles.map((st, idx) => (
                      <div key={idx} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', padding: '16px', borderRadius: '12px' }}>
                        <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#6C63FF', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>{st.topic}</span>
                        <p style={{ fontSize: '0.8rem', color: 'white', marginBottom: '8px' }}>{st.issue}</p>
                        <p style={{ fontSize: '0.78rem', color: '#00D4AA', fontStyle: 'italic', margin: 0 }}>💡 Recommendation: {st.recommendation}</p>
                      </div>
                    ))}
                  </div>

                  <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', padding: '20px', borderRadius: '16px' }}>
                    <h4 style={{ fontSize: '0.9rem', color: 'white', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '8px', marginBottom: '16px' }}>AI Recommended Remedial Actions</h4>
                    <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.82rem', color: '#A0A0C0', margin: 0 }}>
                      {doubtReport.plan.map((item, idx) => (
                        <li key={idx} style={{ lineHeight: '1.5' }}>{item}</li>
                      ))}
                    </ul>
                    <button 
                      onClick={() => alert("Remedial revision resources successfully pushed to student notes panels!")}
                      className="btn btn-secondary" 
                      style={{ width: '100%', marginTop: '24px', fontSize: '0.78rem' }}
                    >
                      Push Revision Resources to Students
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Split layout: student doubts feed & struggle heatmap */}
            <div className="grid-2-1" style={{ gap: '24px' }}>
              
              {/* Student doubts feed */}
              <div className="glass-panel" style={{ padding: '24px', borderRadius: '18px' }}>
                <h3 style={{ color: 'white', fontSize: '1rem', fontWeight: 'bold', marginBottom: '16px' }}>Live Class Doubts Feed</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {studentDoubts.map((doubt) => (
                    <div 
                      key={doubt.id} 
                      style={{ 
                        padding: '16px', 
                        borderRadius: '12px', 
                        background: 'rgba(255,255,255,0.01)', 
                        border: '1px solid rgba(255,255,255,0.04)',
                        position: 'relative'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '0.8rem', color: 'white', fontWeight: 'bold' }}>{doubt.student}</span>
                          <span className="badge" style={{ fontSize: '0.62rem', background: 'rgba(108, 99, 255, 0.1)', color: '#B88EFC', border: '1px solid rgba(108, 99, 255, 0.2)' }}>{doubt.tag}</span>
                        </div>
                        <span style={{ fontSize: '0.7rem', color: '#626280' }}>{doubt.time}</span>
                      </div>
                      <p style={{ fontSize: '0.82rem', color: '#D1D1E0', lineHeight: '1.4', margin: '0 0 12px 0' }}>
                        "{doubt.question}"
                      </p>

                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button 
                          onClick={() => {
                            setStudentDoubts(prev => prev.map(d => d.id === doubt.id ? { ...d, resolved: !d.resolved } : d));
                          }}
                          className={`btn ${doubt.resolved ? 'btn-ghost' : 'btn-secondary'}`} 
                          style={{ padding: '4px 10px', fontSize: '0.72rem', color: doubt.resolved ? '#00D4AA' : 'white' }}
                        >
                          {doubt.resolved ? "Resolved ✓" : "Mark Resolved"}
                        </button>
                        <button 
                          onClick={() => {
                            setWritingManualId(doubt.id);
                            setManualAnswerText("");
                          }}
                          className="btn btn-secondary" 
                          style={{ padding: '4px 10px', fontSize: '0.72rem' }}
                        >
                          Answer Manually
                        </button>
                        <button 
                          onClick={() => resolveDoubtWithAI(doubt.id, doubt.question)}
                          disabled={solvingDoubtId === doubt.id}
                          className="btn btn-primary" 
                          style={{ padding: '4px 10px', fontSize: '0.72rem', color: '#0D0D1A' }}
                        >
                          {solvingDoubtId === doubt.id ? "Analyzing..." : "Explain with AI"}
                        </button>
                      </div>

                      {/* Manual answer input */}
                      {writingManualId === doubt.id && (
                        <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <textarea
                            value={manualAnswerText}
                            onChange={(e) => setManualAnswerText(e.target.value)}
                            placeholder="Type your explanation here..."
                            style={{
                              width: '100%',
                              minHeight: '80px',
                              background: 'rgba(255,255,255,0.02)',
                              border: '1px solid rgba(255,255,255,0.08)',
                              borderRadius: '8px',
                              padding: '10px',
                              color: 'white',
                              fontSize: '0.8rem',
                              fontFamily: 'inherit',
                              outline: 'none',
                              resize: 'vertical'
                            }}
                          />
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                            <button
                              onClick={() => { setWritingManualId(null); setManualAnswerText(""); }}
                              className="btn btn-secondary"
                              style={{ padding: '4px 10px', fontSize: '0.72rem' }}
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => submitManualAnswer(doubt.id)}
                              className="btn btn-primary"
                              style={{ padding: '4px 10px', fontSize: '0.72rem', color: '#0D0D1A' }}
                            >
                              Submit Answer
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Solve block response */}
                      {solvingDoubtId === doubt.id && (
                        <div style={{ marginTop: '12px', color: '#A0A0C0', fontSize: '0.75rem', fontStyle: 'italic' }}>
                          AI is crafting a pedagogical explanation for this doubt...
                        </div>
                      )}
                      
                      {solvingDoubtId !== doubt.id && solvedDoubtAnswers[doubt.id] && (
                        <div style={{ marginTop: '12px', background: 'rgba(0, 212, 170, 0.05)', border: '1px solid rgba(0, 212, 170, 0.15)', padding: '12px', borderRadius: '8px' }}>
                          <span style={{ fontSize: '0.7rem', color: '#00D4AA', fontWeight: 'bold', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                            {solvedDoubtAnswers[doubt.id].startsWith("[Educator]") ? "Educator's Answer" : "AI Draft Explanation"}
                          </span>
                          <p style={{ fontSize: '0.8rem', color: '#E0E0FF', lineHeight: '1.45', margin: 0 }}>
                            {solvedDoubtAnswers[doubt.id].replace(/^\[Educator\]\s*/, "")}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Struggle Heatmap */}
              <div className="glass-panel" style={{ padding: '24px', borderRadius: '18px' }}>
                <h3 style={{ color: 'white', fontSize: '1rem', fontWeight: 'bold', marginBottom: '16px' }}>Struggle Heatmap</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {[
                    { topic: "Carnot Engine work signs", pct: 88, color: '#FF6B6B' },
                    { topic: "Integral substitution boundaries", pct: 72, color: '#FFB347' },
                    { topic: "SN2 vs SN1 solvents", pct: 54, color: '#FFB347' },
                    { topic: "Electrostatics flux vectors", pct: 30, color: '#00D4AA' }
                  ].map((h, idx) => (
                    <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                        <span style={{ color: 'white' }}>{h.topic}</span>
                        <span style={{ color: h.color, fontWeight: 'bold' }}>{h.pct}% Struggle</span>
                      </div>
                      <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px' }}>
                        <div style={{ width: `${h.pct}%`, height: '100%', background: h.color, borderRadius: '3px' }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

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
            {activeMetricModal === 'students' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <span style={{ fontSize: '1.75rem' }}>👨‍👩‍👦</span>
                  <div>
                    <h3 style={{ color: 'white', fontSize: '1.25rem', fontWeight: 'bold' }}>Active Students</h3>
                    <span style={{ fontSize: '0.75rem', color: '#A0A0C0' }}>Batch enrolment and attendance distribution</span>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', margin: '20px 0' }}>
                  {[
                    { batch: 'JEE Main - Batch A', count: 20, pct: 100, color: '#6C63FF' },
                    { batch: 'NEET Main - Batch A', count: 18, pct: 90, color: '#00D4AA' }
                  ].map((b, idx) => (
                    <div key={idx}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '6px' }}>
                        <span style={{ color: '#A0A0C0' }}>{b.batch}</span>
                        <span style={{ color: b.color, fontWeight: 'bold' }}>{b.count} enrolled</span>
                      </div>
                      <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px' }}>
                        <div style={{ width: `${b.pct}%`, height: '100%', background: b.color, borderRadius: '3px' }}></div>
                      </div>
                    </div>
                  ))}
                </div>
                <p style={{ fontSize: '0.8rem', color: '#A0A0C0', lineHeight: '1.5', marginTop: '16px' }}>
                  📈 Cohort Engagement: **98.2% attendance** verified across active cohorts this week.
                </p>
              </div>
            )}

            {activeMetricModal === 'accuracy' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <span style={{ fontSize: '1.75rem' }}>📊</span>
                  <div>
                    <h3 style={{ color: 'white', fontSize: '1.25rem', fontWeight: 'bold' }}>Average Class Accuracy</h3>
                    <span style={{ fontSize: '0.75rem', color: '#A0A0C0' }}>Diagnostic scores across chapters</span>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', margin: '20px 0' }}>
                  {classPerformance.map((c, idx) => (
                    <div key={idx}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '6px' }}>
                        <span style={{ color: '#A0A0C0' }}>{c.chapter}</span>
                        <span style={{ color: c.color, fontWeight: 'bold' }}>{c.average}%</span>
                      </div>
                      <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px' }}>
                        <div style={{ width: `${c.average}%`, height: '100%', background: c.color, borderRadius: '3px' }}></div>
                      </div>
                    </div>
                  ))}
                </div>
                <p style={{ fontSize: '0.8rem', color: '#FF6B6B', lineHeight: '1.5', marginTop: '16px' }}>
                  ⚠️ **AI Alert**: Class is lagging significantly in **Thermodynamics (38% average)**. Dedicated remedial lecture recommended.
                </p>
              </div>
            )}

            {activeMetricModal === 'engagement' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <span style={{ fontSize: '1.75rem' }}>📈</span>
                  <div>
                    <h3 style={{ color: 'white', fontSize: '1.25rem', fontWeight: 'bold' }}>Students Engaged Today</h3>
                    <span style={{ fontSize: '0.75rem', color: '#A0A0C0' }}>Live activity split</span>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', margin: '20px 0' }}>
                  {[
                    { activity: 'Solving Daily Questions', count: 18, color: '#6C63FF' },
                    { activity: 'Chatting with AI Tutor', count: 10, color: '#00D4AA' },
                    { activity: 'Taking Mock Exams', count: 4, color: '#FFB347' }
                  ].map((a, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
                      <span style={{ color: '#A0A0C0' }}>{a.activity}</span>
                      <span style={{ color: a.color, fontWeight: 'bold' }}>{a.count} online</span>
                    </div>
                  ))}
                </div>
                <p style={{ fontSize: '0.8rem', color: '#A0A0C0', lineHeight: '1.5' }}>
                  ⚡ Peak activity detected between **7:00 PM and 9:30 PM**.
                </p>
              </div>
            )}

             {activeMetricModal === 'assignments' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <span style={{ fontSize: '1.75rem' }}>📝</span>
                  <div>
                    <h3 style={{ color: 'white', fontSize: '1.25rem', fontWeight: 'bold' }}>Assignments Pending</h3>
                    <span style={{ fontSize: '0.75rem', color: '#A0A0C0' }}>Evaluation status</span>
                  </div>
                </div>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  padding: '16px',
                  borderRadius: '12px',
                  margin: '16px 0'
                }}>
                  <span style={{ fontSize: '0.65rem', color: '#FFB347', fontWeight: 'bold', textTransform: 'uppercase' }}>Active Task</span>
                  <h4 style={{ color: 'white', fontSize: '0.9rem', margin: '4px 0 8px' }}>Carnot Cycle & Thermodynamics</h4>
                  <p style={{ fontSize: '0.75rem', color: '#A0A0C0', lineHeight: '1.4' }}>
                    **40 submissions** received. Grade instantly using AI Autograder to send results to parents.
                  </p>
                </div>
                <button 
                  onClick={() => {
                    setActiveMetricModal(null);
                    handleGradeWithAI("Carnot Cycle & Thermodynamics");
                  }}
                  className="btn btn-primary btn-glow"
                  style={{ width: '100%', fontSize: '0.8rem' }}
                >
                  🤖 Grade Instantly with AI
                </button>
              </div>
            )}

            {activeMetricModal === 'lectures_conducted' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <span style={{ fontSize: '1.75rem' }}>📅</span>
                  <div>
                    <h3 style={{ color: 'white', fontSize: '1.25rem', fontWeight: 'bold' }}>Lectures Conducted</h3>
                    <span style={{ fontSize: '0.75rem', color: '#A0A0C0' }}>Total classes taken this term</span>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', margin: '20px 0' }}>
                  {[
                    { topic: 'Thermodynamics & Carnot Cycle', date: 'June 2, 2026', time: '10:00 AM', attendance: '36/38 students' },
                    { topic: 'Laws of Thermodynamics & Entropy', date: 'June 3, 2026', time: '04:00 PM', attendance: '34/38 students' },
                    { topic: 'Calorimetry & Phase Diagrams', date: 'June 5, 2026', time: '10:00 AM', attendance: '35/38 students' }
                  ].map((lecture, idx) => (
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
                        <h4 style={{ color: 'white', fontWeight: '600' }}>{lecture.topic}</h4>
                        <span style={{ fontSize: '0.7rem', color: '#A0A0C0' }}>{lecture.date} · {lecture.time}</span>
                      </div>
                      <span style={{ color: '#00D4AA', fontWeight: 'bold', fontSize: '0.75rem' }}>{lecture.attendance}</span>
                    </div>
                  ))}
                </div>
                <p style={{ fontSize: '0.8rem', color: '#A0A0C0', lineHeight: '1.5' }}>
                  🏫 **Summary**: Total of **12 lectures** conducted, averaging **92% attendance**.
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
