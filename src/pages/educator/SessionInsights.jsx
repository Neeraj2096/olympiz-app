import React, { useState } from 'react';
import { 
  Sparkles, Brain, Target, GraduationCap, BookOpen, Heart, 
  Send, Copy, Edit, Bookmark, ChevronRight, AlertCircle, FileText,
  Video, RefreshCw, CheckCircle, TrendingUp, Trash2, Search
} from 'lucide-react';
import Groq from 'groq-sdk';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

const preprocessLaTeX = (text) => {
  if (!text) return '';
  let processed = text;
  // Convert LaTeX math delimiters to Markdown math delimiters ($ and $$)
  processed = processed.replace(/\\\((.*?)\\\)/g, '$$$1$$');
  processed = processed.replace(/\\\[(.*?)\\\]/gs, '$$$$$1$$$$');
  // Ensure align blocks are wrapped in block math if they are bare
  processed = processed.replace(/(?<!\$)\\begin{align\*?}([\s\S]*?)\\end{align\*?}(?!\$)/g, '$$$$ \\begin{aligned}$1\\end{aligned} $$$$');
  // Ensure array and matrix blocks are wrapped in block math if they are bare
  processed = processed.replace(/(?<!\$)\\begin{(array|pmatrix|bmatrix|Bmatrix|vmatrix|Vmatrix|matrix|cases|equation\*?)}([\s\S]*?)\\end{\1}(?!\$)/g, '$$$$ \\begin{$1}$2\\end{$1} $$$$');
  // Fix missing slashes from parsed JSON
  processed = processed.replace(/ quad /g, ' \\quad ');
  processed = processed.replace(/ ext{/g, ' \\text{');
  processed = processed.replace(/ cdot /g, ' \\cdot ');
  processed = processed.replace(/ mu /g, ' \\mu ');
  processed = processed.replace(/ mucdot/g, ' \\mu\\cdot');
  // Fix literal \n that might have survived
  processed = processed.replace(/\\n/g, '\n');
  return processed;
};

export default function SessionInsights({ setSessionDiagnosis, setParentUpdate, addNote }) {
  const [selectedSession, setSelectedSession] = useState(null);
  const [transcriptInput, setTranscriptInput] = useState('');
  const [analysisStatus, setAnalysisStatus] = useState('idle'); // 'idle' | 'analyzing' | 'done' | 'error'
  const [activeTab, setActiveTab] = useState('diagnosis');
  const [analysisData, setAnalysisData] = useState(null);
  
  // UI States for confirmation & interaction
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showParentEditModal, setShowParentEditModal] = useState(false);
  const [editableParentText, setEditableParentText] = useState("");
  const [practiceAnswersVisible, setPracticeAnswersVisible] = useState({});

  const [filterType, setFilterType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const [sessions, setSessions] = useState([
    { id: 1, student_name: "Arjun", batch: "Batch A", subject: "Physics", topic: "Newton's Laws & Friction", date: "Today, 10:00 AM", duration: "12 min", analyzed_status: "Not analyzed", transcript_snippet: "Teacher: Let's review the homework problem... Arjun: I got 4 m/s^2. I just did F = ma..." },
    { id: 2, student_name: "Priya", batch: "Batch A", subject: "Physics", topic: "Work, Energy and Power", date: "Yesterday, 2:00 PM", duration: "15 min", analyzed_status: "Analyzed", transcript_snippet: "Priya: I don't understand why work done by gravity is zero here. Teacher: Look at the angle between force and displacement..." },
    { id: 3, student_name: "Rahul", batch: "Batch C", subject: "Chemistry", topic: "Chemical Bonding", date: "2 days ago", duration: "10 min", analyzed_status: "Not analyzed", transcript_snippet: "Rahul: So ionic bonds are always stronger than covalent? Teacher: Not necessarily! Think about diamond..." }
  ]);

  const mockTranscript = `Teacher: Let's review the homework problem. A 5kg block is pulled with a 20N force on a rough surface with coefficient of friction 0.2. What's the acceleration? Arjun, what did you get?
Arjun: I got 4 m/s^2. I just did F = ma, so 20 = 5a, meaning a = 4.
Teacher: Not quite. Remember there is friction. What is the formula for kinetic friction?
Arjun: Um, friction is mu times Normal force? So 0.2 * 5 = 1 N?
Teacher: Close, but Normal force isn't just mass. It's mass times gravity (mg).
Arjun: Oh right! So 5 * 9.8 = 49. Then friction is 0.2 * 49 = 9.8 N.
Teacher: Exactly! So now what is the net force?
Arjun: Net force is 20 - 9.8 = 10.2 N.
Teacher: Perfect. And the acceleration?
Arjun: 10.2 / 5 = 2.04 m/s^2.
Teacher: Excellent. Never forget that friction opposes the motion and relies on the Normal force, not just mass.`;

  const runAnalysis = async () => {
    if (!selectedSession && !transcriptInput) return;
    setAnalysisStatus('analyzing');
    
    const apiKey = import.meta.env.VITE_GROQ_API_KEY || "";
    
    if (!apiKey) {
      console.warn("No Groq API Key found. Falling back to mock data.");
      setTimeout(() => {
        setAnalysisData({
          diagnosis: [
            { concept: "Net Force Calculation", evidence: "I just did F = ma, so 20 = 5a", why_it_matters: "Ignoring opposing forces like friction leads to incorrect acceleration.", correction: "Always sum all forces (F_net = F_applied - f_friction) before using F=ma." },
            { concept: "Normal Force vs Mass", evidence: "0.2 * 5 = 1 N", why_it_matters: "Friction depends on Normal Force, which is a weight (force), not a mass.", correction: "Normal force on a flat surface is N = mg, not just m." },
            { concept: "Step-by-step Execution", evidence: "Arjun jumped straight to F=ma without drawing a Free Body Diagram.", why_it_matters: "Free body diagrams prevent missing forces.", correction: "Draw a Free Body Diagram (FBD) for every mechanics problem before writing equations." }
          ],
          teacher_feedback: {
            did_well: "You guided Arjun to self-correct the Normal force calculation rather than just giving him the answer.",
            could_improve: "You didn't ask Arjun to explicitly draw a Free Body Diagram, which is the root cause of him missing the friction force.",
            better_explanation: "Before asking for the formula for friction, ask: 'Let's draw a Free Body Diagram. What are all the forces acting on the block horizontally?'"
          },
          concept_card: {
            topic: "Friction and Net Force (Newton's 2nd Law)",
            core_idea: "Acceleration is caused by the NET force, not just the applied force. On a rough surface, kinetic friction always opposes the motion.",
            analogy: "Think of your applied force as your gross income, and friction as taxes. Your acceleration depends on your net income (Net Force), not what you started with.",
            formula_breakdown: {
              expression: "F_{net} = F_{applied} - f_k = m \\cdot a",
              plain_english: "The total pulling force minus the rubbing friction equals mass times acceleration.",
              variables: [
                { symbol: "F_{net}", name: "Net Force", unit: "Newtons (N)", meaning: "Total combined force" },
                { symbol: "f_k", name: "Kinetic Friction", unit: "Newtons (N)", meaning: "Force resisting motion (μ_k * N)" },
                { symbol: "N", name: "Normal Force", unit: "Newtons (N)", meaning: "Perpendicular contact force (mg on flat ground)" }
              ]
            },
            common_mistake: "Using mass instead of weight for Normal force (using 5 instead of 5*9.8).",
            practice_questions: [
              { id: 'q1', q: "A 10kg box is pulled with 50N. Kinetic friction is 20N. What is the acceleration?", a: "F_net = 50 - 20 = 30N. a = 30/10 = 3 m/s^2." },
              { id: 'q2', q: "If the coefficient of friction is 0.1 and mass is 20kg (g=10), what is the friction force?", a: "N = mg = 20*10 = 200N. f = μN = 0.1 * 200 = 20N." }
            ]
          },
          parent_update: "In today's physics session on Newton's Laws, Arjun did a great job actively participating! He initially stumbled on calculating friction by forgetting to multiply by gravity, but with a little guidance, he successfully corrected his own mistake and solved the complex problem perfectly. He's showing great resilience in learning."
        });
        setAnalysisStatus('done');
        if (selectedSession) selectedSession.analyzed_status = "Analyzed";
      }, 2000);
      return;
    }

    try {
      const groq = new Groq({ apiKey, dangerouslyAllowBrowser: true });
      const targetText = transcriptInput || "No transcript provided.";
      
      const prompt = `You are an expert pedagogical AI analyzing a teacher-student session transcript.
Analyze the following transcript:
"${targetText}"

You MUST output a single valid JSON object strictly adhering to this structure:
{
  "diagnosis": [
    {
      "concept": "Concept misunderstood",
      "evidence": "Exact quote from conversation",
      "why_it_matters": "Why this learning gap matters",
      "correction": "Suggested correction to fix the gap"
    }
  ],
  "teacher_feedback": {
    "did_well": "1. What the teacher did well in the session",
    "could_improve": "2. What could have been better in their teaching approach",
    "better_explanation": "3. One improved version of how the teacher could explain the exact same concept more effectively"
  },
  "concept_card": {
    "topic": "Name of the topic being taught (e.g. Static Friction)",
    "core_idea": "1. Core idea in simple language",
    "analogy": "2. One real-life analogy",
    "formula_breakdown": {
      "expression": "3. One formula/result in clean, well-formatted LaTeX (use \\text{} for words in subscripts, and \\cdot for multiplication, never use *).",
      "plain_english": "Plain English explanation of the formula",
      "variables": [
        { "symbol": "F", "name": "Force", "unit": "N", "meaning": "Push or pull" }
      ]
    },
    "common_mistake": "4. One common mistake students make regarding this concept",
    "practice_questions": [
      { "id": "q1", "q": "5. Practice question 1", "a": "A detailed step-by-step solution. Use standard Markdown for lists (1. 2. 3.). DO NOT use \\begin{enumerate} or \\item. Wrap ALL math, numbers, and variables in $...$." },
      { "id": "q2", "q": "Practice question 2", "a": "A detailed step-by-step solution. Use standard Markdown for lists (1. 2. 3.). DO NOT use \\begin{enumerate} or \\item. Wrap ALL math, numbers, and variables in $...$." }
    ]
  },
  "parent_update": "A short parent update based on this session. The tone MUST be Positive, Honest, Not alarming, and Easy for a parent to understand. Maximum 150 words."
}

Ensure the diagnosis array contains at least 3 learning gaps. Ensure all keys exactly match the structure above.
CRITICAL: You MUST double-escape all LaTeX backslashes in your JSON output (e.g., use \\\\mu instead of \\mu, \\\\cdot instead of \\cdot, \\\\text instead of \\text). Failure to double-escape will corrupt the JSON. Use standard markdown formatting for lists and bold text. NEVER use LaTeX document environments like \\begin{enumerate} or \\item. ALWAYS wrap math formulas, symbols, and variables in $...$ for inline or $$...$$ for block math.`;

      const completion = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama-3.1-8b-instant",
        response_format: { type: "json_object" }
      });

      const result = completion.choices[0]?.message?.content;
      if (!result) throw new Error("No result from Groq");

      // Sanitize the JSON string to fix single-escaped LaTeX commands that break JSON.parse
      // We skip n, r, and u so we don't break newlines, carriage returns, or unicode escapes.
      const safeResult = result
        .replace(/```json/gi, '')
        .replace(/```/g, '')
        .trim()
        .replace(/(?<!\\)\\(?=[a-mo-qs-tv-zA-Z])/g, '\\\\');

      const responseData = JSON.parse(safeResult);
      setAnalysisData(responseData);
      setAnalysisStatus('done');
      if (selectedSession) selectedSession.analyzed_status = "Analyzed";

    } catch (error) {
      console.error("Groq Analysis Failed:", error);
      setAnalysisStatus('error');
    }
  };

  const handleSendToStudent = () => {
    if (analysisData?.diagnosis) {
      // Map to simple 1-2 line gaps for the student dashboard
      const formattedGaps = analysisData.diagnosis.map(d => `${d.concept}: ${d.correction}`);
      setSessionDiagnosis(formattedGaps);
      setShowConfirmModal(false);
      alert("✅ Diagnosis successfully sent to Student Dashboard!");
    }
  };

  const handleSendToNotes = () => {
    if (analysisData?.concept_card) {
      addNote({
        title: `AI Recap: ${analysisData.concept_card.topic}`,
        content: `<h3>Core Idea</h3><p>${analysisData.concept_card.core_idea}</p><h3>Analogy</h3><p>${analysisData.concept_card.analogy}</p>`,
        category: selectedSession?.subject || 'Physics',
        type: 'AI Session Recap',
        fullData: analysisData.concept_card // Passed so SmartNotes can render the custom UI
      });
      alert("✅ Concept Card saved to Student's Notes!");
    }
  };

  const handleSendToParent = () => {
    if (analysisData?.parent_update) {
      setParentUpdate(editableParentText || analysisData.parent_update);
      setShowParentEditModal(false);
      alert("✅ Update successfully sent to Parent Dashboard!");
    }
  };

  const togglePracticeAnswer = (id) => {
    setPracticeAnswersVisible(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const statusPill = {
    idle: { color: '#A0A0C0', bg: 'rgba(255,255,255,0.05)', label: 'Ready for Analysis', icon: <FileText size={14}/> },
    analyzing: { color: '#6C63FF', bg: 'rgba(108,99,255,0.1)', label: 'Analyzing class transcript (takes ~10s)...', icon: <RefreshCw size={14} className="spin-animation"/> },
    done: { color: '#00D4AA', bg: 'rgba(0,212,170,0.1)', label: 'Analysis Complete', icon: <CheckCircle size={14}/> },
    error: { color: '#FF6B6B', bg: 'rgba(255,107,107,0.1)', label: 'Analysis Failed', icon: <AlertCircle size={14}/> }
  }[analysisStatus];

  return (
    <div style={{ display: 'flex', gap: '20px', height: '100%', minHeight: '80vh' }}>
      
      {/* Left Panel: Session Selection */}
      <div className="glass-panel" style={{ width: '350px', padding: '24px', borderRadius: '24px', display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ color: 'white', fontSize: '1.2rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Video size={20} color="#6C63FF" /> Select Session
        </h2>
        <p style={{ color: '#A0A0C0', fontSize: '0.8rem', marginBottom: '20px', lineHeight: '1.4' }}>
          Pick any past or live session. Not every session needs analysis — choose the ones that matter.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', alignItems: 'center' }}>
            {['All', 'Analyzed', 'Not analyzed'].map(f => (
              <button 
                key={f} 
                onClick={() => setFilterType(f)}
                style={{ 
                  background: filterType === f ? 'rgba(108,99,255,0.2)' : 'rgba(255,255,255,0.05)', 
                  color: filterType === f ? 'white' : '#A0A0C0', 
                  fontSize: '0.7rem', 
                  padding: '4px 10px', 
                  borderRadius: '12px', 
                  whiteSpace: 'nowrap', 
                  border: `1px solid ${filterType === f ? '#6C63FF' : 'rgba(255,255,255,0.1)'}`,
                  cursor: 'pointer'
                }}
              >
                {f}
              </button>
            ))}
            <button 
              onClick={() => {
                setShowSearch(!showSearch);
                if (showSearch) setSearchQuery(''); // Clear search when closing
              }}
              style={{ background: showSearch ? 'rgba(108,99,255,0.2)' : 'rgba(255,255,255,0.05)', border: `1px solid ${showSearch ? '#6C63FF' : 'rgba(255,255,255,0.1)'}`, color: showSearch ? 'white' : '#A0A0C0', padding: '4px 8px', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', marginLeft: 'auto' }}
              title="Search transcripts"
            >
              <Search size={14} />
            </button>
          </div>
          {showSearch && (
            <input 
              type="text"
              placeholder="Search transcript, student, topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '0.8rem', outline: 'none' }}
              autoFocus
            />
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', flex: 1, paddingRight: '4px' }}>
          {sessions.filter(s => {
            const matchesFilter = filterType === 'All' || s.analyzed_status === filterType;
            const q = searchQuery.toLowerCase();
            const matchesSearch = !q || 
              s.student_name.toLowerCase().includes(q) || 
              s.topic.toLowerCase().includes(q) ||
              s.transcript_snippet.toLowerCase().includes(q) ||
              s.batch.toLowerCase().includes(q);
            return matchesFilter && matchesSearch;
          }).map(session => (
            <div 
              key={session.id}
              onClick={() => {
                setSelectedSession(session);
                setAnalysisStatus('idle');
                setAnalysisData(null);
                setTranscriptInput('');
              }}
              style={{ 
                background: selectedSession?.id === session.id ? 'rgba(108, 99, 255, 0.15)' : 'rgba(255,255,255,0.03)', 
                border: `1px solid ${selectedSession?.id === session.id ? '#6C63FF' : 'rgba(255,255,255,0.05)'}`,
                padding: '16px', 
                borderRadius: '16px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#00D4AA', fontSize: '0.7rem', fontWeight: 'bold', background: 'rgba(0,212,170,0.1)', padding: '2px 8px', borderRadius: '8px' }}>{session.subject}</span>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.7rem', color: session.analyzed_status === "Analyzed" ? '#00D4AA' : '#A0A0C0' }}>{session.analyzed_status}</span>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSessions(sessions.filter(s => s.id !== session.id));
                      if (selectedSession?.id === session.id) {
                        setSelectedSession(null);
                        setAnalysisStatus('idle');
                        setAnalysisData(null);
                        setTranscriptInput('');
                      }
                    }}
                    style={{ background: 'none', border: 'none', color: '#FF6B6B', cursor: 'pointer', padding: '2px', opacity: 0.7 }}
                    onMouseOver={(e) => e.currentTarget.style.opacity = 1}
                    onMouseOut={(e) => e.currentTarget.style.opacity = 0.7}
                    title="Delete Session"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <h4 style={{ color: 'white', fontSize: '0.9rem', marginBottom: '4px' }}>Discussion with {session.student_name}</h4>
              <p style={{ color: '#A0A0C0', fontSize: '0.8rem', marginBottom: '8px' }}>{session.batch} • {session.topic}</p>
              
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '8px', borderRadius: '8px', fontSize: '0.75rem', color: '#8080A0', fontStyle: 'italic', marginBottom: '12px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                "{session.transcript_snippet}"
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.7rem', color: '#8080A0' }}>
                <span>{session.date} • {session.duration}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel: Analysis Workspace */}
      <div className="glass-panel" style={{ flex: 1, padding: '30px', borderRadius: '24px', display: 'flex', flexDirection: 'column', overflowY: 'auto', maxHeight: 'calc(100vh - 100px)' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h2 style={{ color: 'white', fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Sparkles size={24} color="#00D4AA" /> Session Analysis Engine
            </h2>
            <p style={{ color: '#A0A0C0', fontSize: '0.85rem', marginTop: '4px' }}>
              {selectedSession ? `Analyzing: Discussion with ${selectedSession.student_name} (${selectedSession.topic})` : "Select a session from the left to run AI analysis, or paste a transcript manually below."}
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: statusPill.bg, color: statusPill.color, padding: '8px 16px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '500', border: `1px solid ${statusPill.color}40` }}>
              {statusPill.icon} {statusPill.label}
            </div>
            {analysisStatus !== 'idle' && (
              <button 
                onClick={() => {
                  setAnalysisStatus('idle');
                  setAnalysisData(null);
                  setSelectedSession(null);
                  setTranscriptInput('');
                }}
                style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '8px 16px', borderRadius: '20px', fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              >
                Start New
              </button>
            )}
          </div>
        </div>

        {analysisStatus === 'idle' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ color: 'white', fontSize: '0.9rem' }}>Or paste transcript manually:</span>
                <button 
                  onClick={() => setTranscriptInput(mockTranscript)}
                  style={{ background: 'none', border: 'none', color: '#00D4AA', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <FileText size={14}/> Load Sample Transcript
                </button>
              </div>
              <textarea 
                value={transcriptInput}
                onChange={e => setTranscriptInput(e.target.value)}
                placeholder="Paste the teacher-student conversation here..."
                style={{ flex: 1, background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '16px', color: 'white', fontSize: '0.9rem', resize: 'none', outline: 'none', fontFamily: 'monospace' }}
              />
            </div>
            
            <button 
              onClick={runAnalysis}
              disabled={!selectedSession && !transcriptInput}
              className="btn btn-primary btn-glow" 
              style={{ padding: '14px', borderRadius: '12px', fontSize: '1rem', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', opacity: (!selectedSession && !transcriptInput) ? 0.5 : 1 }}
            >
              <Brain size={20} /> Analyze Session
            </button>
          </div>
        )}

        {analysisStatus === 'analyzing' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
            <Brain size={48} color="#6C63FF" className="pulse-animation" />
            <h3 style={{ color: 'white', fontSize: '1.2rem' }}>AI is extracting insights...</h3>
            <p style={{ color: '#A0A0C0' }}>Scanning for knowledge gaps, pedagogical feedback, and conceptual analogies.</p>
          </div>
        )}

        {analysisStatus === 'done' && analysisData && (
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            
            {/* Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '24px' }}>
                {[
                  { id: 'diagnosis', icon: <Target size={16}/>, label: 'Student Diagnosis' },
                  { id: 'teacher_feedback', icon: <GraduationCap size={16}/>, label: 'Teacher Feedback' },
                  { id: 'concept_card', icon: <BookOpen size={16}/>, label: 'Concept Card' },
                  { id: 'parent_update', icon: <Heart size={16}/>, label: 'Parent Communication' },
                  { id: 'transcript', icon: <FileText size={16}/>, label: 'View Transcript' }
                ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '12px 20px',
                    color: activeTab === tab.id ? '#00D4AA' : '#A0A0C0',
                    borderBottom: activeTab === tab.id ? '2px solid #00D4AA' : '2px solid transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '0.9rem',
                    fontWeight: activeTab === tab.id ? 'bold' : 'normal',
                    transition: 'all 0.2s'
                  }}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Contents */}
            <div style={{ flex: 1, overflowY: 'auto', paddingRight: '8px' }}>
              
              {/* DIAGNOSIS TAB */}
              {activeTab === 'diagnosis' && (
                <div className="fade-in">
                  <h3 style={{ color: 'white', marginBottom: '16px' }}>Identified Knowledge Gaps</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                    {analysisData.diagnosis.map((gap, i) => (
                      <div key={i} style={{ background: 'rgba(255,107,107,0.05)', borderLeft: '4px solid #FF6B6B', borderRadius: '0 12px 12px 0', padding: '20px' }}>
                        <h4 style={{ color: '#FF6B6B', fontSize: '1rem', marginBottom: '8px' }}>{gap.concept}</h4>
                        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '8px', border: '1px dashed rgba(255,255,255,0.1)', marginBottom: '12px', fontSize: '0.85rem' }}>
                          <span style={{ color: '#A0A0C0' }}>Evidence from transcript: </span><span style={{ color: 'white', fontStyle: 'italic' }}>"{gap.evidence}"</span>
                        </div>
                        <p style={{ color: '#E0E0E0', fontSize: '0.9rem', marginBottom: '8px' }}><strong>Why it matters:</strong> {gap.why_it_matters}</p>
                        <p style={{ color: '#00D4AA', fontSize: '0.9rem' }}><strong>Correction:</strong> {gap.correction}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <button onClick={() => setShowConfirmModal(true)} className="btn btn-primary btn-glow" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '8px' }}>
                      <Send size={16}/> Send to Student
                    </button>
                  </div>
                </div>
              )}

              {/* TEACHER FEEDBACK TAB */}
              {activeTab === 'teacher_feedback' && (
                <div className="fade-in">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,179,71,0.1)', color: '#FFB347', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.85rem' }}>
                    <AlertCircle size={16}/> This tab is NEVER visible to students or parents. Educator-only reflection.
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                    <div style={{ background: 'rgba(0,212,170,0.05)', border: '1px solid rgba(0,212,170,0.2)', borderRadius: '12px', padding: '20px' }}>
                      <h4 style={{ color: '#00D4AA', fontSize: '1rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle size={18}/> What went well</h4>
                      <p style={{ color: 'white', fontSize: '0.9rem', lineHeight: '1.5' }}>{analysisData.teacher_feedback.did_well}</p>
                    </div>
                    
                    <div style={{ background: 'rgba(255,179,71,0.05)', border: '1px solid rgba(255,179,71,0.2)', borderRadius: '12px', padding: '20px' }}>
                      <h4 style={{ color: '#FFB347', fontSize: '1rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}><TrendingUp size={18}/> What could improve</h4>
                      <p style={{ color: 'white', fontSize: '0.9rem', lineHeight: '1.5' }}>{analysisData.teacher_feedback.could_improve}</p>
                    </div>

                    <div style={{ background: 'rgba(108,99,255,0.05)', border: '1px solid rgba(108,99,255,0.2)', borderRadius: '12px', padding: '20px' }}>
                      <h4 style={{ color: '#6C63FF', fontSize: '1rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}><Brain size={18}/> A more effective explanation</h4>
                      <p style={{ color: 'white', fontSize: '0.9rem', lineHeight: '1.5' }}>{analysisData.teacher_feedback.better_explanation}</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '8px' }} onClick={() => alert("Saved to Reflection Log!")}>
                      <Bookmark size={16}/> Save to My Reflection Log
                    </button>
                  </div>
                </div>
              )}

              {/* CONCEPT CARD TAB */}
              {activeTab === 'concept_card' && (
                <div className="fade-in">
                  <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
                    <h3 style={{ color: 'white', fontSize: '1.2rem', marginBottom: '16px' }}>{analysisData.concept_card.topic}</h3>
                    
                    <div style={{ marginBottom: '20px' }}>
                      <h4 style={{ color: '#00D4AA', fontSize: '0.9rem', marginBottom: '4px' }}>Core Idea</h4>
                      <p style={{ color: '#E0E0E0', fontSize: '0.95rem', lineHeight: '1.5' }}>{analysisData.concept_card.core_idea}</p>
                    </div>

                    <div style={{ marginBottom: '20px', background: 'rgba(108,99,255,0.1)', padding: '16px', borderRadius: '12px', borderLeft: '4px solid #6C63FF' }}>
                      <h4 style={{ color: '#6C63FF', fontSize: '0.9rem', marginBottom: '4px' }}>Intuitive Analogy</h4>
                      <p style={{ color: 'white', fontSize: '0.95rem', lineHeight: '1.5' }}>{analysisData.concept_card.analogy}</p>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                      <h4 style={{ color: '#A0A0C0', fontSize: '0.9rem', marginBottom: '8px' }}>Formula Breakdown</h4>
                      <div style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '12px', textAlign: 'center', marginBottom: '12px', color: 'white', fontSize: '1.2rem' }}>
                        <ReactMarkdown
                          remarkPlugins={[remarkMath]}
                          rehypePlugins={[rehypeKatex]}
                        >
                          {`$$ ${preprocessLaTeX(analysisData.concept_card.formula_breakdown.expression).replace(/\$/g, '')} $$`}
                        </ReactMarkdown>
                      </div>
                      <p style={{ color: '#E0E0E0', fontSize: '0.9rem', marginBottom: '12px', textAlign: 'center' }}>"{analysisData.concept_card.formula_breakdown.plain_english}"</p>
                      
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                        <tbody>
                          {analysisData.concept_card.formula_breakdown.variables.map((v, i) => (
                            <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                              <td style={{ padding: '8px', color: '#00D4AA', fontWeight: 'bold' }}>
                                <ReactMarkdown
                                  remarkPlugins={[remarkMath]}
                                  rehypePlugins={[rehypeKatex]}
                                >
                                  {`$${v.symbol.replace(/\$/g, '')}$`}
                                </ReactMarkdown>
                              </td>
                              <td style={{ padding: '8px', color: 'white' }}>{v.name}</td>
                              <td style={{ padding: '8px', color: '#A0A0C0' }}>{v.meaning}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div style={{ marginBottom: '24px', background: 'rgba(255,107,107,0.05)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,107,107,0.2)' }}>
                      <h4 style={{ color: '#FF6B6B', fontSize: '0.9rem', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}><AlertCircle size={16}/> Common Mistake</h4>
                      <p style={{ color: 'white', fontSize: '0.9rem' }}>{analysisData.concept_card.common_mistake}</p>
                    </div>

                    <div>
                      <h4 style={{ color: 'white', fontSize: '1rem', marginBottom: '12px' }}>Practice Questions</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {analysisData.concept_card.practice_questions.map((q) => (
                          <div key={q.id} style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '12px' }}>
                            <p style={{ color: 'white', fontSize: '0.9rem', marginBottom: '12px' }}>{q.q}</p>
                            
                            {practiceAnswersVisible[q.id] ? (
                              <div style={{ background: 'rgba(0,212,170,0.1)', padding: '12px', borderRadius: '8px', borderLeft: '3px solid #00D4AA', marginTop: '8px' }}>
                                <div style={{ color: '#E0E0E0', fontSize: '0.9rem' }}>
                                  <ReactMarkdown 
                                    remarkPlugins={[remarkMath]} 
                                    rehypePlugins={[rehypeKatex]}
                                    components={{
                                      ol: ({node, ...props}) => <ol style={{ paddingLeft: '24px', margin: '8px 0' }} {...props} />,
                                      ul: ({node, ...props}) => <ul style={{ paddingLeft: '24px', margin: '8px 0' }} {...props} />,
                                      li: ({node, ...props}) => <li style={{ marginBottom: '6px' }} {...props} />
                                    }}
                                  >
                                    {preprocessLaTeX(q.a)}
                                  </ReactMarkdown>
                                </div>
                                <button onClick={() => togglePracticeAnswer(q.id)} style={{ background: 'none', border: 'none', color: '#00D4AA', fontSize: '0.8rem', cursor: 'pointer', marginTop: '8px', display: 'block' }}>Hide Answer</button>
                              </div>
                            ) : (
                              <button onClick={() => togglePracticeAnswer(q.id)} className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.8rem', borderRadius: '6px' }}>View Answer</button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <button className="btn" style={{ background: 'transparent', color: '#A0A0C0', display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => alert('Copied to clipboard')}>
                      <Copy size={16}/> Copy
                    </button>
                    <button onClick={handleSendToNotes} className="btn btn-primary btn-glow" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '8px' }}>
                      <Send size={16}/> Send to Student's Notes
                    </button>
                  </div>
                </div>
              )}

              {/* PARENT UPDATE TAB */}
              {activeTab === 'parent_update' && (
                <div className="fade-in">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.05)', color: '#A0A0C0', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.85rem' }}>
                    <Heart size={16} color="#FF6B6B"/> Plain language, max 150 words, warm and non-alarming, zero jargon.
                  </div>
                  
                  <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
                    <p style={{ color: 'white', fontSize: '1rem', lineHeight: '1.6' }}>{analysisData.parent_update}</p>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <button className="btn" style={{ background: 'transparent', color: '#A0A0C0', display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => alert('Copied to clipboard')}>
                      <Copy size={16}/> Copy as WhatsApp Message
                    </button>
                    <button onClick={() => { setEditableParentText(analysisData.parent_update); setShowParentEditModal(true); }} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '8px' }}>
                      <Edit size={16}/> Edit Before Sending
                    </button>
                    <button onClick={() => handleSendToParent()} className="btn btn-primary btn-glow" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '8px' }}>
                      <Send size={16}/> Send to Parent Dashboard
                    </button>
                  </div>
                </div>
              )}
              {/* TRANSCRIPT TAB */}
              {activeTab === 'transcript' && (
                <div className="fade-in">
                  <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '24px' }}>
                    <h3 style={{ color: 'white', fontSize: '1.2rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FileText size={20} color="#6C63FF"/> Session Transcript
                    </h3>
                    <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '12px', color: '#E0E0E0', fontSize: '0.9rem', whiteSpace: 'pre-wrap', fontFamily: 'monospace', lineHeight: '1.5', maxHeight: '400px', overflowY: 'auto' }}>
                      {transcriptInput || (selectedSession ? "Transcript data not available for this session." : "No transcript provided.")}
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>
        )}
      </div>

      {/* Confirmation Modal for Student Diagnosis */}
      {showConfirmModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="glass-panel" style={{ padding: '30px', borderRadius: '20px', width: '400px', maxWidth: '90%' }}>
            <h3 style={{ color: 'white', fontSize: '1.2rem', marginBottom: '16px' }}>Confirm Send to Student</h3>
            <p style={{ color: '#A0A0C0', fontSize: '0.9rem', marginBottom: '24px', lineHeight: '1.5' }}>
              This will replace the student's current weak-topics widget with this session's diagnosis. Continue?
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button onClick={() => setShowConfirmModal(false)} className="btn btn-outline" style={{ padding: '8px 16px', borderRadius: '8px' }}>Cancel</button>
              <button onClick={handleSendToStudent} className="btn btn-primary btn-glow" style={{ padding: '8px 16px', borderRadius: '8px' }}>Send to Student</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal for Parent Update */}
      {showParentEditModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="glass-panel" style={{ padding: '30px', borderRadius: '20px', width: '500px', maxWidth: '90%' }}>
            <h3 style={{ color: 'white', fontSize: '1.2rem', marginBottom: '16px' }}>Edit Parent Update</h3>
            <textarea 
              value={editableParentText}
              onChange={e => setEditableParentText(e.target.value)}
              style={{ width: '100%', height: '150px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '16px', color: 'white', fontSize: '0.95rem', resize: 'none', outline: 'none', marginBottom: '24px', lineHeight: '1.5' }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button onClick={() => setShowParentEditModal(false)} className="btn btn-outline" style={{ padding: '8px 16px', borderRadius: '8px' }}>Cancel</button>
              <button onClick={handleSendToParent} className="btn btn-primary btn-glow" style={{ padding: '8px 16px', borderRadius: '8px' }}>Save & Send</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
