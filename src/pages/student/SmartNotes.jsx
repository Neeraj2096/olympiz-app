import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Search, Grid, List, Plus, FileText, 
  Trash2, BookOpen, Volume2, Calendar, Brain, ArrowRight, RefreshCw,
  Play, Pause, Square, Download
} from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import 'katex/dist/katex.min.css';
export default function SmartNotes({ notesList, addNote, deleteNote, earnXP, activeCourse = 'JEE Main' }) {
  const [activeTab, setActiveTab] = useState('list'); // 'list' | 'editor' | 'flashcards' | 'transcribe'
  const [selectedNote, setSelectedNote] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  
  // Note editing states
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteCategory, setNoteCategory] = useState('Physics');
  const [editorMode, setEditorMode] = useState('edit'); // 'edit' | 'preview'

  // Flashcards state
  const [activeCard, setActiveCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [customFlashcards, setCustomFlashcards] = useState([]);
  const [generatingAI, setGeneratingAI] = useState(false);

  // Quiz state
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [showQuizResult, setShowQuizResult] = useState(false);

  // Live class transcription state
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcripts, setTranscripts] = useState([]);
  const [formulas, setFormulas] = useState([]);

  // TTS note player states
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Session Recap Practice Questions state
  const [practiceAnswersVisible, setPracticeAnswersVisible] = useState({});

  const togglePracticeAnswer = (id) => {
    setPracticeAnswersVisible(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const startTTS = () => {
    window.speechSynthesis.cancel();
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = noteContent;
    const cleanText = tempDiv.textContent || tempDiv.innerText || "";
    if (!cleanText.trim()) return;
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
    setIsPaused(false);
  };

  const pauseTTS = () => {
    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const resumeTTS = () => {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  };

  const stopTTS = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  };

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const handleExport = (format) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = noteContent;
    const plainText = tempDiv.textContent || tempDiv.innerText || "";
    let contentToDownload = "";
    let filename = `${noteTitle.replace(/\s+/g, '_')}_notes`;
    let mimeType = "text/plain";
    if (format === 'PDF') {
      contentToDownload = `--- NOTE TITLE: ${noteTitle} ---\nCategory: ${noteCategory}\n\n${plainText}`;
      filename += ".txt";
    } else if (format === 'Docs') {
      contentToDownload = `<h1>${noteTitle}</h1><p><strong>Category:</strong> ${noteCategory}</p><hr/>${noteContent}`;
      filename += ".html";
      mimeType = "text/html";
    } else if (format === 'Notion') {
      contentToDownload = `# ${noteTitle}\n**Category:** ${noteCategory}\n\n${plainText}`;
      filename += ".md";
    }
    const blob = new Blob([contentToDownload], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    earnXP(5);
  };

  // Preloaded Spaced Repetition Flashcards
  const flashcardsDeck = [
    { front: "What is Sn2 reaction configuration rule?", back: "Full stereochemical inversion (Walden Inversion) due to backside attack of nucleophile." },
    { front: "First Law of Thermodynamics Equation?", back: "dQ = dU + dW. Conservation of heat energy inside working states." },
    { front: "Limit of sin(x)/x as x approaches 0?", back: "Approaches exactly 1. Proven using the sandwich/squeeze theorem." }
  ];

  const handleSelectNote = (note) => {
    setSelectedNote(note);
    setNoteTitle(note.title);
    setNoteContent(note.content);
    setNoteCategory(note.category);
    setActiveTab('editor');
  };

  const handleCreateNewNote = () => {
    setSelectedNote(null);
    setNoteTitle('Untitled Concept Notes');
    setNoteContent('<p>Start writing your revision formulas or class pointers here...</p>');
    setNoteCategory('Physics');
    setActiveTab('editor');
  };

  const handleSaveNote = () => {
    if (selectedNote) {
      // update
      const updated = { ...selectedNote, title: noteTitle, content: noteContent, category: noteCategory };
      deleteNote(selectedNote.id);
      addNote(updated);
    } else {
      // create
      const created = {
        id: 'n_' + Date.now(),
        title: noteTitle,
        content: noteContent,
        category: noteCategory,
        type: 'My Notes',
        date: 'Today'
      };
      addNote(created);
    }
    earnXP(15);
    setActiveTab('list');
  };

  // Live class transcription simulator
  useEffect(() => {
    let interval;
    if (isTranscribing) {
      const liveTexts = [
        "So today class we are investigating thermodynamic equilibriums.",
        "Remember, when volume is held constant, no work is performed, so dW = 0.",
        "This is called an Isochoric process! The equation simplifies to dQ = dU.",
        "Write this down: dQ = dU is key for isochoric reactions."
      ];
      let idx = 0;
      interval = setInterval(() => {
        if (idx < liveTexts.length) {
          setTranscripts(prev => [...prev, liveTexts[idx]]);
          if (idx === 2) {
            setFormulas(prev => [...prev, "Isochoric process: dW = 0, so dQ = dU"]);
          }
          idx++;
        } else {
          setIsTranscribing(false);
          // auto note generated
          const auto = {
            id: 'n_' + Date.now(),
            title: 'Auto Note: Isochoric processes',
            content: '<h3>Isochoric Process Breakdown</h3><p>Class lecture captured. Volume is held constant, meaning no external work dW is performed.</p><h4>Primary Equation:</h4><code>dQ = dU</code>',
            category: 'Physics',
            type: 'Auto-generated',
            date: 'Today'
          };
          addNote(auto);
          earnXP(30);
          alert("Live Class Finished! AI generated note has been added to your log! +30 XP claimed. 🎓");
        }
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isTranscribing]);

  // AI Tools actions on note content
  const handleAIAssist = async (action) => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
    if (!apiKey) {
      // Mock Fallbacks if API Key is not set
      earnXP(10);
      if (action === 'simplify') {
        setNoteContent(prev => prev + `<br/><h3>AI Simplification:</h3><p>Simply put: holding volume constant means no expansions happen, so zero work gets done. Heat added goes 100% into internal heat energy!</p>`);
      } else if (action === 'hindi') {
        setNoteContent(prev => prev + `<br/><h3>AI Translation (Hindi):</h3><p>संक्षेप में: निरंतर आयतन का अर्थ है कि कोई प्रसार नहीं होता है, इसलिए शून्य कार्य होता है।</p>`);
      } else if (action === 'flashcard') {
        setCustomFlashcards(prev => [
          ...prev,
          { front: `What is the core concept of "${noteTitle}"?`, back: "Extracting key learning parameters and formula relationships from notes." }
        ]);
        alert("Generated a conceptual flashcard based on this note title!");
      } else if (action === 'quiz') {
        const mockQuiz = {
          questions: [
            { q: "Which process is defined by holding the volume constant?", opts: ["Isothermal", "Adiabatic", "Isochoric", "Isobaric"], correct: 2, explanation: "In an isochoric process, volume remains constant (dV=0)." },
            { q: "What is the work done (dW) in an Isochoric Process?", opts: ["dW = dQ", "dW = 0", "dW = dU", "dW = infinity"], correct: 1, explanation: "Since volume change is zero, work done by/on the gas is zero." }
          ]
        };
        setActiveQuiz(mockQuiz);
        setQuizAnswers({});
        setShowQuizResult(false);
      } else if (action === 'outline') {
        setNoteContent(prev => prev + `<br/><h3>AI Study Outline & Key Takeaways:</h3><div style="background: rgba(255,179,71,0.04); padding: 14px; border-radius: 8px; border-left: 3px solid #FFB347; margin-top: 12px;"><ul><li><strong>Core Concept:</strong> Structured study pattern for ${noteTitle}</li><li><strong>Key Takeaway:</strong> Focus on understanding formulas, variables and logical derivations.</li></ul></div>`);
      }
      return;
    }

    setGeneratingAI(true);
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      
      if (action === 'simplify') {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `Simplify the following study note for a student. Explain the core ideas in simple terms and bullet points. Retain markdown or HTML: ${noteContent}`;
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        setNoteContent(prev => prev + `<br/><h3>AI Simplification:</h3><div style="background: rgba(0,212,170,0.04); padding: 14px; border-radius: 8px; border-left: 3px solid #00D4AA; margin-top: 12px;">${text}</div>`);
        earnXP(15);
      }
      else if (action === 'hindi') {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `Translate the following study note to Hindi, explaining it clearly for a Hindi medium student. Keep math equations intact: ${noteContent}`;
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        setNoteContent(prev => prev + `<br/><h3>AI Translation (Hindi):</h3><div style="background: rgba(108,99,255,0.04); padding: 14px; border-radius: 8px; border-left: 3px solid #6C63FF; margin-top: 12px;">${text}</div>`);
        earnXP(15);
      }
      else if (action === 'flashcard') {
        const jsonModel = genAI.getGenerativeModel({
          model: "gemini-1.5-flash",
          generationConfig: { responseMimeType: "application/json" }
        });
        
        // Strip HTML tags so the model receives clean plain text
        const cleanContent = noteContent
          .replace(/<[^>]*>?/gm, ' ')
          .replace(/AI Solved Doubt/gi, '')
          .replace(/Step-by-Step Breakdown/gi, '')
          .replace(/\s+/g, ' ')
          .trim();

        const prompt = `Analyze the following educational content and generate exactly 3 revision flashcards.
        STRICT RULES:
        1. "front": MUST be a simple, ONE-LINER direct question about the factual subject matter.
        2. "back": MUST be a simple, ONE-LINER summarized answer.
        3. Do NOT reference "AI Note", the note's title, or any formatting. Just extract pure factual Q&A.
        
        Content:
        """${cleanContent}"""
        
        You must return exactly in this JSON format:
        [
          {"front": "Simple one-liner question?", "back": "Simple one-liner answer."},
          ...
        ]`;
        const result = await jsonModel.generateContent(prompt);
        let text = result.response.text();
        text = text.replace(/```json/gi, '').replace(/```/g, '').trim();
        const flashcards = JSON.parse(text);
        
        // Defensive key mapping to ensure front/back are always populated
        const rawDeck = Array.isArray(flashcards) ? flashcards : (flashcards.flashcards || []);
        const sanitizedCards = rawDeck.map(card => ({
          front: card.front || card.question || `Concept question about ${noteTitle}`,
          back: card.back || card.answer || "Review note details for full answer."
        }));

        setCustomFlashcards(prev => [...prev, ...sanitizedCards]);
        earnXP(20);
        alert(`🎉 AI successfully generated ${sanitizedCards.length} custom flashcards and added them to your Review Deck!`);
      }
      else if (action === 'quiz') {
        const jsonModel = genAI.getGenerativeModel({
          model: "gemini-1.5-flash",
          generationConfig: { responseMimeType: "application/json" }
        });
        const prompt = `Generate exactly 3 multiple-choice questions (MCQs) with 4 options to test a student's recall on this content: "${noteContent}".
        You must return exactly in this JSON format:
        {
          "questions": [
            {
              "q": "Question text?",
              "opts": ["Option A", "Option B", "Option C", "Option D"],
              "correct": 0,
              "explanation": "Brief explanation of correct option"
            },
            ...
          ]
        }`;
        const result = await jsonModel.generateContent(prompt);
        let text = result.response.text();
        text = text.replace(/```json/gi, '').replace(/```/g, '').trim();
        const quiz = JSON.parse(text);
        setActiveQuiz(quiz);
        setQuizAnswers({});
        setShowQuizResult(false);
        earnXP(20);
      }
      else if (action === 'outline') {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `Analyze the following note and generate a beautifully structured study outline and list of key takeaways. Highlight formulas, laws, or terms using HTML or bolding. Retain markdown or HTML: ${noteContent}`;
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        setNoteContent(prev => prev + `<br/><h3>AI Study Outline & Key Takeaways:</h3><div style="background: rgba(255,179,71,0.04); padding: 14px; border-radius: 8px; border-left: 3px solid #FFB347; margin-top: 12px;">${text}</div>`);
        earnXP(15);
      }
    } catch (e) {
      console.error("AI Assist Error: ", e);
      alert("Something went wrong with the AI request.");
    } finally {
      setGeneratingAI(false);
    }
  };

  return (
    <div style={{ padding: '0px', fontFamily: "'Inter', sans-serif", position: 'relative', zIndex: 5 }}>
      
      {/* 1. Main Notes List View */}
      {activeTab === 'list' && (
        <div className="fade-in">
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h2 style={{ color: 'white', marginBottom: '6px' }}>AI Smart Notes</h2>
              <p style={{ color: '#A0A0C0', fontSize: '0.9rem' }}>Real-time live lecture recordings and spaced repetition deck.</p>
            </div>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={() => { setTranscripts([]); setFormulas([]); setIsTranscribing(true); setActiveTab('transcribe'); }}
                className="btn btn-secondary btn-pill" 
                style={{ padding: '10px 20px', fontSize: '0.85rem', color: '#00D4AA', borderColor: 'rgba(0,212,170,0.3)' }}
              >
                🎙 Record Live Class
              </button>
              <button 
                onClick={() => setActiveTab('flashcards')}
                className="btn btn-secondary btn-pill" 
                style={{ padding: '10px 20px', fontSize: '0.85rem' }}
              >
                🧠 Review Flashcards
              </button>
              <button 
                onClick={handleCreateNewNote}
                className="btn btn-primary btn-glow btn-pill" 
                style={{ padding: '10px 20px', fontSize: '0.85rem' }}
              >
                <Plus size={16} /> New Note
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#626280' }} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={e=>setSearchQuery(e.target.value)}
                placeholder="Search notes..." 
                className="form-input" 
                style={{ paddingLeft: '38px', width: '100%' }}
              />
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', overflowX: 'auto', paddingBottom: '4px' }}>
            {['All', 'Auto-generated', 'My Notes', 'Flashcards', 'Shared', 'AI Session Recap'].map(f => (
              <button 
                key={f}
                onClick={() => setActiveFilter(f)}
                style={{ 
                  background: activeFilter === f ? 'rgba(0,212,170,0.1)' : 'rgba(255,255,255,0.05)', 
                  color: activeFilter === f ? '#00D4AA' : '#A0A0C0', 
                  fontSize: '0.75rem', 
                  padding: '6px 12px', 
                  borderRadius: '16px', 
                  whiteSpace: 'nowrap', 
                  border: `1px solid ${activeFilter === f ? '#00D4AA' : 'rgba(255,255,255,0.1)'}`,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Notes Grid */}
          <div className="grid-3" style={{ gap: '20px' }}>
            {notesList.filter(n => {
              const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase());
              const matchesFilter = activeFilter === 'All' || n.type === activeFilter;
              return matchesSearch && matchesFilter;
            }).map((note) => (
              <div 
                key={note.id} 
                className="glass-panel"
                style={{
                  padding: '24px',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '180px'
                }}
                onClick={() => handleSelectNote(note)}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span className="badge" style={{ fontSize: '0.65rem' }}>{note.category}</span>
                    <span style={{ fontSize: '0.7rem', color: note.type === 'Auto-generated' ? '#00D4AA' : '#A0A0C0' }}>{note.type}</span>
                  </div>
                  <h4 style={{ color: 'white', fontSize: '1rem', marginBottom: '8px' }}>{note.title}</h4>
                  <div 
                    style={{ fontSize: '0.8rem', color: '#A0A0C0', height: '60px', overflow: 'hidden', maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)' }}
                    dangerouslySetInnerHTML={{ __html: note.content }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '12px', marginTop: '12px' }}>
                  <span style={{ fontSize: '0.75rem', color: '#626280' }}>⏱ {note.date}</span>
                  <button 
                    onClick={(e) => { e.stopPropagation(); deleteNote(note.id); }}
                    style={{ background: 'transparent', border: 'none', color: '#FF6B6B', cursor: 'pointer' }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* 2. Custom Rich Text Note Editor */}
      {activeTab === 'editor' && (
        <div className="fade-in">
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <button onClick={() => setActiveTab('list')} className="btn btn-ghost" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
              ← Return
            </button>
            <button onClick={handleSaveNote} className="btn btn-primary btn-pill" style={{ padding: '10px 20px', fontSize: '0.85rem' }}>
              Save & Exit
            </button>
          </div>

          <div className="grid-main-sidebar" style={{
            gap: '24px',
          }}>
            
            {/* Editor Workspace */}
            <div className="glass-panel" style={{ padding: '30px', borderRadius: '20px' }}>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                <input 
                  type="text" 
                  value={noteTitle}
                  onChange={e=>setNoteTitle(e.target.value)}
                  placeholder="Note Title" 
                  style={{
                    background: 'transparent',
                    border: 'none',
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: 'white',
                    outline: 'none',
                    flex: 1
                  }}
                />
                
                <select 
                  value={noteCategory}
                  onChange={e=>setNoteCategory(e.target.value)}
                  className="form-input" 
                  style={{ padding: '6px', fontSize: '0.8rem', background: '#13132B' }}
                >
                  {['Physics', 'Chemistry', 'Mathematics', 'Biology (Botany)', 'Biology (Zoology)']
                    .filter(s => {
                      if (activeCourse.includes('JEE') && s.includes('Biology')) return false;
                      if (activeCourse.includes('NEET') && s === 'Mathematics') return false;
                      return true;
                    })
                    .map(s=><option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {/* Mode Tabs */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: '16px' }}>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <button
                    onClick={() => setEditorMode('edit')}
                    style={{
                      padding: '8px 16px',
                      background: 'transparent',
                      border: 'none',
                      borderBottom: editorMode === 'edit' ? '2px solid #00D4AA' : '2px solid transparent',
                      color: editorMode === 'edit' ? '#00D4AA' : '#A0A0C0',
                      fontSize: '0.85rem',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    Write Mode
                  </button>
                  <button
                    onClick={() => setEditorMode('preview')}
                    style={{
                      padding: '8px 16px',
                      background: 'transparent',
                      border: 'none',
                      borderBottom: editorMode === 'preview' ? '2px solid #00D4AA' : '2px solid transparent',
                      color: editorMode === 'preview' ? '#00D4AA' : '#A0A0C0',
                      fontSize: '0.85rem',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    Formatted Preview
                  </button>
                </div>

                {editorMode === 'preview' && (
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', paddingBottom: '4px' }}>
                    <span style={{ fontSize: '0.75rem', color: '#A0A0C0', marginRight: '4px' }}>Note Reader:</span>
                    {!isSpeaking ? (
                      <button 
                        onClick={startTTS} 
                        className="btn btn-secondary btn-pill" 
                        style={{ padding: '4px 10px', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Play size={10} /> Play
                      </button>
                    ) : (
                      <>
                        {isPaused ? (
                          <button 
                            onClick={resumeTTS} 
                            className="btn btn-secondary btn-pill" 
                            style={{ padding: '4px 10px', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                          >
                            <Play size={10} /> Resume
                          </button>
                        ) : (
                          <button 
                            onClick={pauseTTS} 
                            className="btn btn-secondary btn-pill" 
                            style={{ padding: '4px 10px', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                          >
                            <Pause size={10} /> Pause
                          </button>
                        )}
                        <button 
                          onClick={stopTTS} 
                          className="btn btn-secondary btn-pill" 
                          style={{ padding: '4px 10px', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '4px', color: '#FF6B6B', borderColor: 'rgba(255,107,107,0.2)' }}
                        >
                          <Square size={10} /> Stop
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Math Equation Insert Toolbar (only visible in edit mode) */}
              {editorMode === 'edit' && (
                <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', flexWrap: 'wrap', background: 'rgba(0,0,0,0.15)', padding: '6px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <span style={{ fontSize: '0.72rem', color: '#626280', alignSelf: 'center', marginRight: '6px' }}>Insert:</span>
                  {[
                    { label: 'α', value: 'α' },
                    { label: 'β', value: 'β' },
                    { label: 'θ', value: 'θ' },
                    { label: 'π', value: 'π' },
                    { label: 'Δ', value: 'Δ' },
                    { label: '√', value: '√()' },
                    { label: '∫', value: '∫' },
                    { label: 'Σ', value: 'Σ' },
                    { label: 'Fraction', value: '\\frac{}{}' },
                    { label: 'Inline Math', value: '$ $' },
                    { label: 'Block Math', value: '$$ $$' }
                  ].map((btn, bi) => (
                    <button
                      key={bi}
                      onClick={() => setNoteContent(prev => prev + btn.value)}
                      style={{
                        padding: '4px 8px',
                        fontSize: '0.7rem',
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '4px',
                        color: 'white',
                        cursor: 'pointer',
                        transition: 'background 0.15s'
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              )}

              {editorMode === 'edit' ? (
                <textarea
                  value={noteContent}
                  onChange={e=>setNoteContent(e.target.value)}
                  style={{
                    width: '100%',
                    minHeight: '300px',
                    background: 'rgba(255,255,255,0.01)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '12px',
                    padding: '16px',
                    color: 'white',
                    fontSize: '0.95rem',
                    fontFamily: "'Inter', sans-serif",
                    outline: 'none',
                    resize: 'vertical',
                    lineHeight: '1.6'
                  }}
                />
              ) : (
                <div 
                  style={{
                    width: '100%',
                    minHeight: '300px',
                    background: 'rgba(0,0,0,0.15)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '12px',
                    padding: '20px',
                    color: 'white',
                    fontSize: '0.95rem',
                    lineHeight: '1.65',
                    overflowY: 'auto'
                  }}
                >
                  {selectedNote?.type === 'AI Session Recap' && selectedNote?.fullData ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      <div style={{ marginBottom: '10px' }}>
                        <h4 style={{ color: '#00D4AA', fontSize: '1rem', marginBottom: '8px' }}>Core Idea</h4>
                        <p style={{ color: '#E0E0E0', fontSize: '1rem', lineHeight: '1.6' }}>{selectedNote.fullData.core_idea}</p>
                      </div>

                      <div style={{ background: 'rgba(108,99,255,0.1)', padding: '16px', borderRadius: '12px', borderLeft: '4px solid #6C63FF' }}>
                        <h4 style={{ color: '#6C63FF', fontSize: '1rem', marginBottom: '8px' }}>Intuitive Analogy</h4>
                        <p style={{ color: 'white', fontSize: '1rem', lineHeight: '1.6' }}>{selectedNote.fullData.analogy}</p>
                      </div>

                      <div style={{ marginBottom: '10px' }}>
                        <h4 style={{ color: '#A0A0C0', fontSize: '0.95rem', marginBottom: '12px' }}>Formula Breakdown</h4>
                        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '12px', textAlign: 'center', marginBottom: '12px' }}>
                          <span style={{ color: 'white', fontSize: '1.4rem', fontFamily: 'monospace' }}>{selectedNote.fullData.formula_breakdown.expression}</span>
                        </div>
                        <p style={{ color: '#E0E0E0', fontSize: '0.95rem', marginBottom: '16px', textAlign: 'center', fontStyle: 'italic' }}>"{selectedNote.fullData.formula_breakdown.plain_english}"</p>
                        
                        <div style={{ overflowX: 'auto' }}>
                          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                            <tbody>
                              {selectedNote.fullData.formula_breakdown.variables.map((v, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                  <td style={{ padding: '10px', color: '#00D4AA', fontWeight: 'bold' }}>{v.symbol}</td>
                                  <td style={{ padding: '10px', color: 'white' }}>{v.name}</td>
                                  <td style={{ padding: '10px', color: '#A0A0C0' }}>{v.meaning}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div style={{ background: 'rgba(255,107,107,0.05)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,107,107,0.2)' }}>
                        <h4 style={{ color: '#FF6B6B', fontSize: '0.95rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>Common Mistake</h4>
                        <p style={{ color: 'white', fontSize: '0.95rem', lineHeight: '1.5' }}>{selectedNote.fullData.common_mistake}</p>
                      </div>

                      <div style={{ marginTop: '10px' }}>
                        <h4 style={{ color: 'white', fontSize: '1.1rem', marginBottom: '16px' }}>Practice Questions</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                          {selectedNote.fullData.practice_questions.map((q) => (
                            <div key={q.id} style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '12px' }}>
                              <p style={{ color: 'white', fontSize: '0.95rem', marginBottom: '16px', lineHeight: '1.5' }}>{q.q}</p>
                              
                              {practiceAnswersVisible[q.id] ? (
                                <div style={{ background: 'rgba(0,212,170,0.05)', padding: '16px', borderRadius: '8px', borderLeft: '3px solid #00D4AA', marginTop: '12px' }}>
                                  <p style={{ color: '#E0E0E0', fontSize: '0.95rem', lineHeight: '1.5' }}>{q.a}</p>
                                  <button onClick={() => togglePracticeAnswer(q.id)} className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.8rem', borderRadius: '6px', marginTop: '12px' }}>Hide Answer</button>
                                </div>
                              ) : (
                                <button onClick={() => togglePracticeAnswer(q.id)} className="btn btn-primary btn-glow" style={{ padding: '8px 16px', fontSize: '0.85rem', borderRadius: '8px', color: '#0D0D1A' }}>View Answer</button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <ReactMarkdown
                      remarkPlugins={[remarkMath, remarkGfm]}
                      rehypePlugins={[rehypeKatex, rehypeRaw]}
                      components={{
                        p: ({node, ...props}) => <p style={{margin: '0 0 10px 0', color: 'inherit'}} {...props} />,
                        h1: ({node, ...props}) => <h1 style={{fontSize: '1.5rem', margin: '20px 0 10px 0', color: 'white'}} {...props} />,
                        h2: ({node, ...props}) => <h2 style={{fontSize: '1.25rem', margin: '16px 0 8px 0', color: 'white'}} {...props} />,
                        h3: ({node, ...props}) => <h3 style={{fontSize: '1.1rem', margin: '12px 0 6px 0', color: 'white'}} {...props} />,
                        ul: ({node, ...props}) => <ul style={{marginLeft: '20px', listStyleType: 'disc', margin: '10px 0 10px 20px'}} {...props} />,
                        ol: ({node, ...props}) => <ol style={{marginLeft: '20px', listStyleType: 'decimal', margin: '10px 0 10px 20px'}} {...props} />,
                        li: ({node, ...props}) => <li style={{marginBottom: '5px'}} {...props} />,
                        table: ({node, ...props}) => <div style={{overflowX: 'auto', margin: '15px 0'}}><table style={{width: '100%', borderCollapse: 'collapse'}} {...props} /></div>,
                        th: ({node, ...props}) => <th style={{border: '1px solid rgba(255,255,255,0.2)', padding: '10px', background: 'rgba(255,255,255,0.05)', color: 'white', textAlign: 'left', fontWeight: 'bold'}} {...props} />,
                        td: ({node, ...props}) => <td style={{border: '1px solid rgba(255,255,255,0.1)', padding: '10px', color: 'inherit'}} {...props} />
                      }}
                    >
                      {noteContent}
                    </ReactMarkdown>
                  )}
                </div>
              )}
            </div>

            {/* AI generated MCQ Quiz Box */}
            {activeQuiz && (
              <div className="glass-panel" style={{ padding: '24px', borderRadius: '20px', gridColumn: '1 / -1', borderLeft: '4px solid #6C63FF', marginTop: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '10px' }}>
                  <h4 style={{ color: 'white', fontSize: '0.95rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px', margin: 0 }}>
                    🧠 AI Recall Practice Quiz
                  </h4>
                  <button 
                    onClick={() => setActiveQuiz(null)}
                    style={{ background: 'transparent', border: 'none', color: '#FF6B6B', cursor: 'pointer', fontSize: '0.75rem' }}
                  >
                    Close Quiz
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  {activeQuiz.questions.map((q, qIndex) => {
                    const userChoice = quizAnswers[qIndex];
                    const isCorrect = userChoice === q.correct;
                    let explanation = q.explanation;
                    return (
                      <div key={qIndex} style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', padding: '16px', borderRadius: '12px' }}>
                        <p style={{ fontSize: '0.85rem', color: 'white', fontWeight: '500', marginBottom: '10px' }}>
                          {qIndex + 1}. {q.q}
                        </p>
                        <div className="grid-2" style={{ gap: '8px' }}>
                          {q.opts.map((opt, oIndex) => {
                            const selected = userChoice === oIndex;
                            const isThisCorrect = oIndex === q.correct;
                            let border = '1px solid rgba(255,255,255,0.06)';
                            let bg = 'rgba(255,255,255,0.02)';
                            let color = '#A0A0C0';
                            if (selected) {
                              if (showQuizResult) {
                                border = isCorrect ? '1px solid #00D4AA' : '1px solid #FF6B6B';
                                bg = isCorrect ? 'rgba(0,212,170,0.1)' : 'rgba(255,107,107,0.1)';
                                color = isCorrect ? '#00D4AA' : '#FF6B6B';
                              } else {
                                border = '1px solid #6C63FF';
                                bg = 'rgba(108,99,255,0.12)';
                                color = '#B88EFC';
                              }
                            } else if (showQuizResult && isThisCorrect) {
                              border = '1px solid #00D4AA';
                              bg = 'rgba(0,212,170,0.06)';
                              color = '#00D4AA';
                            }
                            return (
                              <button
                                key={oIndex}
                                disabled={showQuizResult}
                                onClick={() => setQuizAnswers(prev => ({ ...prev, [qIndex]: oIndex }))}
                                style={{
                                  padding: '8px 12px',
                                  borderRadius: '8px',
                                  border,
                                  background: bg,
                                  color,
                                  fontSize: '0.78rem',
                                  textAlign: 'left',
                                  cursor: showQuizResult ? 'not-allowed' : 'pointer'
                                }}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                        {showQuizResult && (
                          <p style={{ fontSize: '0.75rem', color: isCorrect ? '#00D4AA' : '#FFB347', marginTop: '10px', marginBottom: 0 }}>
                            {isCorrect ? '✓ Correct! ' : '✗ Incorrect. '} {explanation}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>

                {!showQuizResult ? (
                  <button 
                    disabled={Object.keys(quizAnswers).length < activeQuiz.questions.length}
                    onClick={() => setShowQuizResult(true)}
                    className="btn btn-primary btn-pill" 
                    style={{ padding: '10px 20px', fontSize: '0.82rem', marginTop: '16px', display: 'block', marginLeft: 'auto' }}
                  >
                    Submit Quiz
                  </button>
                ) : (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <span style={{ fontSize: '0.8rem', color: '#00D4AA', fontWeight: 'bold' }}>
                      Quiz Score: {Object.keys(quizAnswers).filter(k => quizAnswers[k] === activeQuiz.questions[k].correct).length} / {activeQuiz.questions.length} correct!
                    </span>
                    <button 
                      onClick={() => { setQuizAnswers({}); setShowQuizResult(false); }}
                      className="btn btn-secondary btn-pill" 
                      style={{ padding: '8px 16px', fontSize: '0.8rem' }}
                    >
                      Retry Quiz
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

            {/* AI Action Panels */}
            <div className="glass-panel" style={{ padding: '20px', borderRadius: '18px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h4 style={{ color: 'white', fontSize: '0.9rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={16} style={{ color: 'var(--primary-color)' }} /> AI Editor Actions
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button 
                  onClick={() => handleAIAssist('simplify')}
                  className="btn btn-secondary" 
                  style={{ width: '100%', fontSize: '0.8rem', padding: '10px', justifyContent: 'flex-start' }}
                >
                  ✨ Explain simply
                </button>
                <button 
                  onClick={() => handleAIAssist('hindi')}
                  className="btn btn-secondary" 
                  style={{ width: '100%', fontSize: '0.8rem', padding: '10px', justifyContent: 'flex-start' }}
                >
                  🗣 Translate to Hindi
                </button>
                <button 
                  onClick={() => handleAIAssist('flashcard')}
                  className="btn btn-secondary" 
                  style={{ width: '100%', fontSize: '0.8rem', padding: '10px', justifyContent: 'flex-start' }}
                >
                  🧠 Generate Flashcards
                </button>
                <button 
                  onClick={() => handleAIAssist('quiz')}
                  className="btn btn-secondary" 
                  style={{ width: '100%', fontSize: '0.8rem', padding: '10px', justifyContent: 'flex-start' }}
                >
                  ❓ Generate Practice Quiz
                </button>
                <button 
                  onClick={() => handleAIAssist('outline')}
                  className="btn btn-secondary" 
                  style={{ width: '100%', fontSize: '0.8rem', padding: '10px', justifyContent: 'flex-start' }}
                >
                  📖 Generate Study Outline
                </button>
              </div>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '16px' }}>
                <span style={{ fontSize: '0.75rem', color: '#626280' }}>Export note (Download):</span>
                <div style={{ display: 'flex', gap: '6px', marginTop: '10px' }}>
                  {['PDF', 'Docs', 'Notion'].map(ex => (
                    <button 
                      key={ex} 
                      onClick={() => handleExport(ex)}
                      className="btn btn-ghost" 
                      style={{ flex: 1, padding: '6px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                    >
                      <Download size={10} /> {ex}
                    </button>
                  ))}
                </div>
              </div>
            </div>

          </div>
        )}

      {/* 3. Spaced Repetition Flashcards Deck */}
      {activeTab === 'flashcards' && (() => {
        const fullDeck = [...flashcardsDeck, ...customFlashcards];
        if (fullDeck.length === 0) {
          return (
            <div className="fade-in" style={{ maxWidth: '440px', margin: '40px auto', textAlign: 'center' }}>
              <button onClick={() => setActiveTab('list')} className="btn btn-ghost" style={{ marginBottom: '20px', padding: '6px 12px', fontSize: '0.85rem' }}>
                ← Exit Flashcards
              </button>
              <p style={{ color: '#A0A0C0', fontSize: '0.9rem' }}>No flashcards available. Create notes and use AI Editor Actions to generate flashcards!</p>
            </div>
          );
        }
        return (
          <div className="fade-in" style={{ maxWidth: '440px', margin: '40px auto', textAlign: 'center' }}>
            
            <button onClick={() => { setActiveTab('list'); setActiveCard(0); setIsFlipped(false); }} className="btn btn-ghost" style={{ marginBottom: '20px', padding: '6px 12px', fontSize: '0.85rem' }}>
              ← Exit Flashcards
            </button>

            {/* Progress indicators */}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#A0A0C0', marginBottom: '16px' }}>
              <span>Card {activeCard + 1} of {fullDeck.length}</span>
              <span>Spaced Repetition Active</span>
            </div>

            {/* Flippable Card UI */}
            <div 
              onClick={() => setIsFlipped(!isFlipped)}
              style={{
                perspective: '1000px',
                cursor: 'pointer',
                height: '240px',
                marginBottom: '30px'
              }}
            >
              <div style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                textAlign: 'center',
                transition: 'transform 0.6s',
                transformStyle: 'preserve-3d',
                transform: isFlipped ? 'rotateY(180deg)' : 'none'
              }}>
                
                {/* Front side */}
                <div className="glass-panel" style={{
                  position: 'absolute',
                  inset: 0,
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '30px',
                  borderRadius: '24px',
                  background: 'rgba(108, 99, 255, 0.08)',
                  border: '1px solid rgba(108, 99, 255, 0.2)'
                }}>
                  <span style={{ fontSize: '0.7rem', color: '#6C63FF', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '10px' }}>Front</span>
                  <p style={{ color: 'white', fontSize: '1.1rem', fontWeight: 'bold' }}>{fullDeck[activeCard]?.front}</p>
                  <span style={{ fontSize: '0.75rem', color: '#626280', marginTop: '20px' }}>Click to flip card</span>
                </div>

                {/* Back side */}
                <div className="glass-panel" style={{
                  position: 'absolute',
                  inset: 0,
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '30px',
                  borderRadius: '24px',
                  background: 'rgba(0, 212, 170, 0.08)',
                  border: '1px solid rgba(0, 212, 170, 0.2)'
                }}>
                  <span style={{ fontSize: '0.7rem', color: '#00D4AA', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '10px' }}>Back (AI answer)</span>
                  <p style={{ color: 'white', fontSize: '1.1rem', fontWeight: 'bold' }}>{fullDeck[activeCard]?.back}</p>
                  <span style={{ fontSize: '0.75rem', color: '#626280', marginTop: '20px' }}>Click to flip back</span>
                </div>

              </div>
            </div>

            {/* Swiping ratings */}
            {isFlipped && (
              <div style={{ display: 'flex', gap: '12px', animation: 'fadeIn 0.2s ease' }}>
                <button 
                  onClick={() => { 
                    setIsFlipped(false); 
                    if (activeCard < fullDeck.length - 1) setActiveCard(activeCard + 1); 
                    else { setActiveTab('list'); setActiveCard(0); }
                  }}
                  className="btn btn-secondary" 
                  style={{ flex: 1, padding: '10px', fontSize: '0.8rem' }}
                >
                  ⚠️ Needs Review
                </button>
                <button 
                  onClick={() => { 
                    setIsFlipped(false); 
                    if (activeCard < fullDeck.length - 1) setActiveCard(activeCard + 1); 
                    else { setActiveTab('list'); setActiveCard(0); }
                    earnXP(10);
                  }}
                  className="btn btn-primary" 
                  style={{ flex: 1, padding: '10px', fontSize: '0.8rem' }}
                >
                  ✅ Know This (+10 XP)
                </button>
              </div>
            )}

          </div>
        );
      })()}

      {/* 4. Live Recording Transcriber Mock */}
      {activeTab === 'transcribe' && (
        <div className="fade-in" style={{ maxWidth: '520px', margin: '20px auto' }}>
          
          <div className="glass-panel" style={{ padding: '30px', borderRadius: '24px', borderLeft: '4px solid #00D4AA' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '12px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#00D4AA', animation: 'pulse 1s infinite' }}></span>
                <span style={{ color: 'white', fontWeight: 'bold', fontSize: '0.9rem' }}>Live Class Recording...</span>
              </div>
              <button 
                onClick={() => { setIsTranscribing(false); setActiveTab('list'); }}
                className="btn btn-ghost" 
                style={{ padding: '4px 10px', fontSize: '0.75rem', color: '#FF6B6B' }}
              >
                Cancel Session
              </button>
            </div>

            {/* Simulated Stream lines */}
            <div style={{
              background: 'rgba(0,0,0,0.15)',
              borderRadius: '12px',
              padding: '16px',
              minHeight: '180px',
              marginBottom: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              maxHeight: '220px',
              overflowY: 'auto'
            }}>
              {transcripts.length === 0 ? (
                <p style={{ fontSize: '0.85rem', color: '#626280', fontStyle: 'italic' }}>Listening to lecturer mic stream...</p>
              ) : (
                transcripts.map((t, i) => (
                  <p key={i} style={{ fontSize: '0.8rem', color: 'white', lineHeight: '1.4', animation: 'fadeIn 0.3s ease' }}>
                    <span style={{ color: '#626280', marginRight: '6px' }}>[Lec]</span> {t}
                  </p>
                ))
              )}
            </div>

            {/* Formula box detections */}
            {formulas.length > 0 && (
              <div style={{
                background: 'rgba(0, 212, 170, 0.08)',
                border: '1px solid rgba(0, 212, 170, 0.2)',
                borderRadius: '12px',
                padding: '12px 16px',
                fontSize: '0.8rem',
                color: '#00D4AA',
                animation: 'fadeIn 0.3s'
              }}>
                <strong>Formula Detected:</strong> <br />
                {formulas[0]}
              </div>
            )}

            <p style={{ fontSize: '0.75rem', color: '#A0A0C0', textAlign: 'center', marginTop: '20px', lineHeight: '1.4' }}>
              Keep the mic stream active. Once the session ends, AI auto-structures notes and formula sheets for your review!
            </p>
          </div>

        </div>
      )}

      {/* Pulse keyframe definitions */}
      <style>{`
        @keyframes pulse {
          0% { opacity: 0.4; }
          50% { opacity: 1; }
          100% { opacity: 0.4; }
        }
      `}</style>

    </div>
  );
}
