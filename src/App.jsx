import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Page Imports
import Landing from './pages/Landing';
import SignUp from './pages/SignUp';
import Onboarding from './pages/Onboarding';
import StudentDashboard from './pages/student/StudentDashboard';
import EducatorDashboard from './pages/educator/EducatorDashboard';
import ParentDashboard from './pages/parent/ParentDashboard';
import { supabase } from './lib/supabase';

export default function App() {
  // Authentication & Session state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState('landing'); // 'landing' | 'signup' | 'onboarding' | 'dashboard-student' | 'dashboard-educator' | 'dashboard-parent'
  
  const [user, setUser] = useState({
    name: 'Arjun Kumar',
    role: 'student',
    streak: 14,
    xp: 450,
    testsTaken: 6,
    studyHours: 4,
    details: { targetExams: ['JEE Main', 'NEET'] }
  });

  const [activeCourse, setActiveCourse] = useState('JEE Main');

  // Sync activeCourse when user changes
  useEffect(() => {
    if (user?.details?.targetExams?.length > 0) {
      if (!user.details.targetExams.includes(activeCourse)) {
        setActiveCourse(user.details.targetExams[0]);
      }
    }
  }, [user]);

  // Smart Notes database state
  const [notesList, setNotesList] = useState([
    { 
      id: 'n1', 
      title: 'Newton\'s Third Law Demystified', 
      content: '<h3>Overview</h3><p>Every action has an equal and opposite reaction.</p><h3>Real-Life Examples</h3><ul><li>Jumping off a boat</li><li>Rocket propulsion</li><li>Walking on the ground</li></ul>', 
      category: 'Physics', 
      type: 'Auto-generated', 
      date: 'Yesterday' 
    },
    { 
      id: 'n2', 
      title: 'Organic Chemistry SN2 Inversion', 
      content: '<h3>Nucleophilic Substitution Reactions</h3><p>SN2 mechanism involves a single-step concerted pathway where the nucleophile attacks from the backside, causing a complete inversion of stereochemistry.</p>', 
      category: 'Chemistry', 
      type: 'My Notes', 
      date: '2 days ago' 
    },
    { 
      id: 'n3', 
      title: 'Human Reproduction - Menstrual Cycle', 
      content: '<h3>Hormonal Control</h3><p>FSH stimulates follicular development, while the LH surge triggers ovulation on day 14.</p>', 
      category: 'Biology', 
      type: 'Auto-generated', 
      date: '3 days ago' 
    }
  ]);

  // Mock test attempt history state
  const [testHistory, setTestHistory] = useState([
    { id: 't1', title: 'JEE Physics Mini Diagnostic', date: 'Yesterday', score: 16, percent: 80, correct: 4, incorrect: 1, timeTaken: '8 mins' }
  ]);

  // Dynamic weak areas compiled based on diagnostic scores
  const [weakTopics, setWeakTopics] = useState([
    'Thermodynamics (Physics) - 34% Accuracy',
    'Organic Halides (Chemistry) - 45% Accuracy',
    'Probability (Maths) - 52% Accuracy',
    'Genetics (Biology) - 40% Accuracy'
  ]);

  // AI Session Insight Engine Data
  const [sessionDiagnosis, setSessionDiagnosis] = useState(null);
  const [parentUpdate, setParentUpdate] = useState(null);

  // Fetch initial data from Supabase with safe fallback
  useEffect(() => {
    const fetchSupabaseData = async () => {
      try {
        console.log('🔌 Connecting to Supabase database...');
        
        // Fetch Notes
        const { data: dbNotes, error: notesError } = await supabase
          .from('notes')
          .select('*')
          .order('id', { ascending: false });
          
        if (notesError) throw notesError;
        
        if (dbNotes && dbNotes.length > 0) {
          setNotesList(dbNotes);
          console.log('✅ Loaded notes from Supabase:', dbNotes.length);
        }
      } catch (err) {
        console.warn('⚠️ Could not load notes from Supabase (using mock preloaded data):', err.message);
      }

      try {
        // Fetch Test History
        const { data: dbHistory, error: historyError } = await supabase
          .from('test_history')
          .select('*')
          .order('id', { ascending: false });

        if (historyError) throw historyError;

        if (dbHistory && dbHistory.length > 0) {
          setTestHistory(dbHistory);
          console.log('✅ Loaded test history from Supabase:', dbHistory.length);
        }
      } catch (err) {
        console.warn('⚠️ Could not load test history from Supabase (using mock preloaded data):', err.message);
      }
    };

    fetchSupabaseData();
  }, []);

  // State manipulation triggers
  const loginUser = (userData) => {
    setUser({
      ...user,
      ...userData
    });
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser({
      name: 'Arjun Kumar',
      role: 'student',
      streak: 14,
      xp: 450,
      testsTaken: 6,
      studyHours: 4
    });
    setCurrentPage('landing');
  };

  const earnXP = (amount) => {
    setUser(prev => {
      const newXp = prev.xp + amount;
      // Streak updates trigger randomly or on daily quiz finish
      return { ...prev, xp: newXp };
    });
  };

  const deductXP = (amount) => {
    setUser(prev => ({ ...prev, xp: Math.max(0, prev.xp - amount) }));
  };

  const updateUserData = (details) => {
    setUser(prev => ({
      ...prev,
      streak: prev.streak + 1, // increment streak on onboarding completion
      studyHours: details.studyHours || prev.studyHours
    }));
  };

  const addNote = async (newNote) => {
    const formattedNote = { id: 'n_' + Date.now(), date: 'Today', ...newNote };
    setNotesList(prev => [formattedNote, ...prev]);

    try {
      const { error } = await supabase.from('notes').insert([formattedNote]);
      if (error) throw error;
      console.log('✅ Note synchronized with Supabase.');
    } catch (err) {
      console.warn('⚠️ Supabase Notes Sync failed (using local fallback):', err.message);
    }
  };

  const deleteNote = async (noteId) => {
    setNotesList(prev => prev.filter(n => n.id !== noteId));

    try {
      const { error } = await supabase.from('notes').delete().eq('id', noteId);
      if (error) throw error;
      console.log('✅ Note deletion synchronized with Supabase.');
    } catch (err) {
      console.warn('⚠️ Supabase Notes Deletion Sync failed (using local fallback):', err.message);
    }
  };

  const addTestAttempt = async (attempt) => {
    setTestHistory(prev => [attempt, ...prev]);
    setUser(prev => ({ ...prev, testsTaken: prev.testsTaken + 1 }));
    
    // Dynamically adjust weak areas based on correct counts
    if (attempt.correct < 3) {
      setWeakTopics(prev => [...new Set([`Thermodynamics Review needed (${attempt.percent}% Score)`, ...prev])]);
    }

    try {
      const { error } = await supabase.from('test_history').insert([attempt]);
      if (error) throw error;
      console.log('✅ Test attempt synchronized with Supabase.');
    } catch (err) {
      console.warn('⚠️ Supabase Test History Sync failed (using local fallback):', err.message);
    }
  };

  const handleNavigate = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Determine if Navbar and Footer are rendered based on active workspace page
  const showSidebarDashboards = currentPage === 'dashboard-student' || currentPage === 'dashboard-educator' || currentPage === 'dashboard-parent';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      
      {/* 1. Global Navigation (Only on Landing/Register/Onboarding) */}
      {!showSidebarDashboards && (
        <Navbar 
          currentPage={currentPage} 
          navigate={handleNavigate} 
          isAuthenticated={isAuthenticated}
          user={user}
          logout={logout}
        />
      )}

      {/* 2. Core Routing views */}
      <div style={{ flex: 1 }}>
        {currentPage === 'landing' && (
          <Landing navigate={handleNavigate} />
        )}
        
        {currentPage === 'signup' && (
          <SignUp navigate={handleNavigate} loginUser={loginUser} />
        )}
        
        {currentPage === 'onboarding' && (
          <Onboarding navigate={handleNavigate} updateUserData={updateUserData} />
        )}
        
        {currentPage === 'dashboard-student' && (
          <StudentDashboard 
            user={user}
            logout={logout}
            navigate={handleNavigate}
            notesList={notesList}
            addNote={addNote}
            deleteNote={deleteNote}
            testHistory={testHistory}
            addTestAttempt={addTestAttempt}
            weakTopics={weakTopics}
            earnXP={earnXP}
            deductXP={deductXP}
            updateUserData={updateUserData}
            activeCourse={activeCourse}
            setActiveCourse={setActiveCourse}
            sessionDiagnosis={sessionDiagnosis}
          />
        )}
        {currentPage === 'dashboard-educator' && (
          <EducatorDashboard 
            user={user} 
            logout={logout} 
            navigate={handleNavigate} 
            setSessionDiagnosis={setSessionDiagnosis}
            setParentUpdate={setParentUpdate}
            addNote={addNote}
          />
        )}

        {currentPage === 'dashboard-parent' && (
          <ParentDashboard 
            user={user} 
            logout={logout} 
            navigate={handleNavigate} 
            testHistory={testHistory}
            weakTopics={weakTopics}
            notesList={notesList}
            parentUpdate={parentUpdate}
          />
        )}
      </div>

      {/* 3. Global Footer (Only on Landing/Register) */}
      {!showSidebarDashboards && currentPage !== 'signup' && (
        <Footer navigate={handleNavigate} />
      )}

    </div>
  );
}
