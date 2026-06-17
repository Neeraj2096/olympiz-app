import React, { useState } from 'react';
import { 
  Sparkles, Flame, Check, AlertCircle, HelpCircle, ArrowRight, 
  Sun, Award, ShieldAlert, BookOpen, Clock, RefreshCw, BarChart2, Brain
} from 'lucide-react';

export default function DailyQuestions({ user, earnXP, deductXP, navigate, activeCourse = 'JEE Main' }) {
  const [activeTab, setActiveTab] = useState('quiz'); // 'quiz' | 'complete'
  const [currIdx, setCurrIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [hintUsed, setHintUsed] = useState(false);
  const [answersHistory, setAnswersHistory] = useState([]); // Array of { qIdx, selectedOpt, isCorrect }

  // 20 Questions focused on weak areas (Thermodynamics, Organic Chemistry/SN2, Integration, Probability)
  const dailySet = [
    {
      q: "In an adiabatic compression of an ideal gas, the temperature of the gas:",
      opts: ["Increases", "Decreases", "Remains constant", "Depends on absolute heat capacity"],
      correct: 0,
      hint: "Recall the first law dQ = dU + dW. For adiabatic, dQ = 0. Compression means work is done ON the gas (dW < 0), so dU > 0, which raises the temperature!",
      topic: "Thermodynamics",
      subject: "Physics",
      difficulty: "Hard",
      solution: "Adiabatic compression means no heat transfer (dQ = 0). The work done ON the gas is positive, meaning work done BY the gas is negative (dW < 0). Using First Law: dQ = dU + dW -> 0 = dU + dW -> dU = -dW. Since dW is negative, dU is positive. Internal energy increases, so temperature increases."
    },
    {
      q: "Which alkyl halide is most reactive toward nucleophilic substitution in an SN2 mechanism?",
      opts: ["CH3Cl (Methyl chloride)", "CH3CH2Cl (Ethyl chloride)", "(CH3)2CHCl (Isopropyl chloride)", "(CH3)3CCl (t-Butyl chloride)"],
      correct: 0,
      hint: "SN2 reactions are highly sensitive to steric hindrance. The less crowded the carbon, the faster the nucleophile can attack!",
      topic: "Organic Halides (SN2)",
      subject: "Chemistry",
      difficulty: "Medium",
      solution: "SN2 proceeds via back-side attack in a single concerted step. Steric hindrance at the electrophilic carbon increases from methyl < primary < secondary < tertiary. Methyl chloride (CH3Cl) is the least sterically hindered and therefore the most reactive."
    },
    {
      q: "The integral of sin(2x) dx from 0 to π/4 is:",
      opts: ["1", "½", "0", "-½"],
      correct: 1,
      hint: "Integrate to get -½ cos(2x), then apply boundaries from 0 to π/4.",
      topic: "Integration",
      subject: "Mathematics",
      difficulty: "Medium",
      solution: "∫ sin(2x) dx = -1/2 * cos(2x). Evaluation: [-1/2 * cos(2 * π/4)] - [-1/2 * cos(0)] = [-1/2 * cos(π/2)] + [1/2 * cos(0)] = 0 + 1/2 = 1/2."
    },
    {
      q: "If events A and B are independent, and P(A) = 0.4, P(B) = 0.5, then P(A ∪ B) is:",
      opts: ["0.9", "0.2", "0.7", "0.6"],
      correct: 2,
      hint: "For independent events, P(A ∩ B) = P(A) * P(B). Use P(A ∪ B) = P(A) + P(B) - P(A ∩ B).",
      topic: "Probability",
      subject: "Mathematics",
      difficulty: "Medium",
      solution: "Since A and B are independent, P(A ∩ B) = P(A) * P(B) = 0.4 * 0.5 = 0.20. P(A ∪ B) = P(A) + P(B) - P(A ∩ B) = 0.4 + 0.5 - 0.2 = 0.7."
    },
    {
      q: "A Carnot engine operating between 300K and 600K has an efficiency of:",
      opts: ["25%", "33.3%", "50%", "100%"],
      correct: 2,
      hint: "Carnot efficiency formula is η = 1 - (Tc / Th). Make sure to use absolute temperatures (Kelvin).",
      topic: "Thermodynamics",
      subject: "Physics",
      difficulty: "Medium",
      solution: "Efficiency η = 1 - Tc/Th. Here, Tc = 300K, Th = 600K. η = 1 - (300/600) = 1 - 0.5 = 0.50 or 50%."
    },
    {
      q: "Which solvent is most suitable for promoting an SN2 reaction?",
      opts: ["Water", "Ethanol", "DMSO (Dimethyl sulfoxide)", "Hexane"],
      correct: 2,
      hint: "SN2 reactions are favored by polar aprotic solvents because they solvate cations well but leave nucleophiles naked/unsolvated.",
      topic: "Organic Halides (SN2)",
      subject: "Chemistry",
      difficulty: "Hard",
      solution: "Polar protic solvents (like water, ethanol) form hydrogen bonds with the nucleophile, decreasing its nucleophilicity. Polar aprotic solvents (like DMSO, Acetone, DMF) solvate the counter-cation but not the nucleophile, increasing the reaction rate."
    },
    {
      q: "Evaluate ∫ (2x * e^(x^2)) dx:",
      opts: ["e^(x^2) + C", "2 * e^(x^2) + C", "x^2 * e^x + C", "e^x + C"],
      correct: 0,
      hint: "Use substitution method. Let u = x^2, then du = 2x dx.",
      topic: "Integration",
      subject: "Mathematics",
      difficulty: "Medium",
      solution: "Let u = x^2. Then du = 2x dx. The integral becomes ∫ e^u du = e^u + C. Substituting back gives e^(x^2) + C."
    },
    {
      q: "A bag contains 5 red and 3 blue balls. If two balls are drawn at random without replacement, the probability that both are red is:",
      opts: ["25/64", "5/14", "15/56", "5/8"],
      correct: 1,
      hint: "P(1st is Red) = 5/8. P(2nd is Red given 1st is Red) = 4/7. Multiply them.",
      topic: "Probability",
      subject: "Mathematics",
      difficulty: "Hard",
      solution: "Probability of first red ball = 5/8. After removing one red, 4 red and 3 blue remain. Probability of second red ball = 4/7. Total P = (5/8) * (4/7) = 20/56 = 5/14."
    },
    {
      q: "According to IUPAC sign conventions, if a gas expands quasi-statically against an external pressure, the work done BY the gas is:",
      opts: ["Positive", "Negative", "Zero", "Determined by temperature change"],
      correct: 1,
      hint: "Under IUPAC convention, work is defined from the system's perspective. In compression, work is done on system (W > 0). In expansion, work is done by system (W < 0).",
      topic: "Thermodynamics",
      subject: "Physics",
      difficulty: "Medium",
      solution: "In IUPAC chemical thermodynamics, W = -P_ext * ΔV. For expansion, ΔV > 0, making W negative. Thus, expansion work is negative."
    },
    {
      q: "Which compound undergoes the fastest SN1 solvolysis in water?",
      opts: ["1-Chlorobutane", "2-Chlorobutane", "2-Chloro-2-methylpropane (t-Butyl chloride)", "Chlorobenzene"],
      correct: 2,
      hint: "SN1 rate is determined by carbocation stability. Tertiary carbocations are much more stable than secondary or primary.",
      topic: "Organic Halides (SN1)",
      subject: "Chemistry",
      difficulty: "Medium",
      solution: "t-Butyl chloride forms a tertiary carbocation upon leaving group departure. Tertiary carbocations are stabilized by hyperconjugation and inductive effects, making tertiary halides undergo SN1 solvolysis the fastest."
    },
    {
      q: "Using integration by parts, the integral ∫ x * ln(x) dx is:",
      opts: ["(x^2/2) * ln(x) - x^2/4 + C", "x * ln(x) - x + C", "(x^2/2) * ln(x) + x^2/4 + C", "x^2 * ln(x) - x^2 + C"],
      correct: 0,
      hint: "Use ILATE rule. Let u = ln(x) and dv = x dx.",
      topic: "Integration",
      subject: "Mathematics",
      difficulty: "Hard",
      solution: "Let u = ln(x) -> du = (1/x) dx. Let dv = x dx -> v = x^2/2. Using ∫ u dv = uv - ∫ v du: (x^2/2)*ln(x) - ∫ (x^2/2)*(1/x) dx = (x^2/2)*ln(x) - ∫ (x/2) dx = (x^2/2)*ln(x) - x^2/4 + C."
    },
    {
      q: "A coin is tossed 5 times. The probability of getting exactly 3 heads is:",
      opts: ["5/16", "5/32", "10/32", "1/2"],
      correct: 0,
      hint: "Use the Binomial probability formula: P(X=k) = nCk * p^k * q^(n-k), where n=5, k=3, p=0.5.",
      topic: "Probability",
      subject: "Mathematics",
      difficulty: "Medium",
      solution: "Using P(X = k) = (n choose k) * p^k * q^(n-k): n = 5, k = 3, p = 0.5, q = 0.5. nCk = 5C3 = 10. P(X = 3) = 10 * (0.5)^3 * (0.5)^2 = 10 * 1/32 = 10/32 = 5/16."
    },
    {
      q: "A projectile is fired at an angle of 45° to the horizontal. If the initial velocity is doubled, the range of the projectile will:",
      opts: ["Double", "Remain the same", "Quadruple", "Be halved"],
      correct: 2,
      hint: "Recall the range formula: R = (u^2 * sin(2θ)) / g. Notice that R is proportional to the square of initial velocity u.",
      topic: "Kinematics",
      subject: "Physics",
      difficulty: "Easy",
      solution: "R = (u^2 * sin(2θ))/g. If u is replaced by 2u, R' = ((2u)^2 * sin(2θ))/g = 4 * (u^2 * sin(2θ))/g = 4R. Hence, the range quadruples."
    },
    {
      q: "What is the hybridization of the central sulfur atom in SF6?",
      opts: ["sp3", "sp3d", "sp3d2", "sp3d3"],
      correct: 2,
      hint: "Count the steric number of sulfur: 6 bonding pairs and 0 lone pairs. This requires 6 hybrid orbitals.",
      topic: "Chemical Bonding",
      subject: "Chemistry",
      difficulty: "Easy",
      solution: "Sulfur has 6 valence electrons, all bonded to fluorine atoms. Steric number = 6 (octahedral geometry). The hybridization corresponding to steric number 6 is sp3d2."
    },
    {
      q: "For any square matrix A, which of the following is true about det(A^T) (determinant of transpose of A)?",
      opts: ["det(A^T) = det(A)", "det(A^T) = -det(A)", "det(A^T) = 1/det(A)", "det(A^T) = det(A)^2"],
      correct: 0,
      hint: "Transpose swaps rows and columns, which does not alter the value of the determinant.",
      topic: "Matrices",
      subject: "Mathematics",
      difficulty: "Easy",
      solution: "A fundamental property of determinants is that det(A) = det(A^T). Taking the transpose of a matrix does not change its determinant."
    },
    {
      q: "In a dihybrid cross of two heterozygous individuals (RrYy x RrYy), what is the expected phenotypic ratio?",
      opts: ["3:1", "1:2:1", "9:3:3:1", "9:7"],
      correct: 2,
      hint: "Mendelian genetics dihybrid cross phenotypic ratio shows independent assortment of both traits.",
      topic: "Genetics",
      subject: "Biology",
      difficulty: "Easy",
      solution: "According to Mendel's Law of Independent Assortment, a dihybrid cross between two double-heterozygous parents results in a phenotypic ratio of 9:3:3:1 (dominant-dominant : dominant-recessive : recessive-dominant : recessive-recessive)."
    },
    {
      q: "A charge Q is placed at the center of a cube. The electric flux through one face of the cube is:",
      opts: ["Q / ε0", "Q / (6 * ε0)", "6 * Q / ε0", "Zero"],
      correct: 1,
      hint: "According to Gauss's Law, the total flux through the closed cube is Q/ε0. A cube has 6 symmetrical faces.",
      topic: "Electrostatics",
      subject: "Physics",
      difficulty: "Easy",
      solution: "By Gauss's Law, total flux through the entire closed surface (cube) is Φ_total = Q/ε0. Since the charge is at the center, the flux is distributed equally among all 6 faces. Therefore, flux through one face is Φ_face = Q/(6*ε0)."
    },
    {
      q: "How many stereoisomers exist for the coordination complex [Co(NH3)4Cl2]^+?",
      opts: ["1 (No isomers)", "2 (Geometrical only)", "3 (Geometrical & Optical)", "4"],
      correct: 1,
      hint: "The complex is of type [Ma4b2]. Draw cis and trans structures, and check if any have a plane of symmetry (which renders them optically inactive).",
      topic: "Coordination Compounds",
      subject: "Chemistry",
      difficulty: "Hard",
      solution: "The complex [Co(NH3)4Cl2]^+ exists as 2 geometrical isomers: cis and trans. Both isomers have planes of symmetry, making them achiral (optically inactive). Therefore, there are no optical isomers, and the total stereoisomers is 2."
    },
    {
      q: "Evaluate the limit of (sin(x) - x) / x^3 as x approaches 0:",
      opts: ["0", "1", "-1/6", "1/6"],
      correct: 2,
      hint: "The limit is in 0/0 form. Apply L'Hopital's rule three times or use the Taylor expansion of sin(x).",
      topic: "Calculus Limits",
      subject: "Mathematics",
      difficulty: "Hard",
      solution: "Using Taylor expansion of sin(x) = x - x^3/6 + x^5/120 - ... The limit is lim (x - x^3/6 - x) / x^3 = lim (-x^3/6)/x^3 = -1/6."
    },
    {
      q: "The change in entropy (ΔS) for a reversible isothermal expansion of an ideal gas is given by:",
      opts: ["n*R*ln(V2/V1)", "Zero", "n*Cp*ln(T2/T1)", "P*ΔV"],
      correct: 0,
      hint: "Recall that dS = dQ_rev / T. In isothermal expansion, dU = 0, so dQ_rev = dW = nRT ln(V2/V1).",
      topic: "Thermodynamics",
      subject: "Physics",
      difficulty: "Hard",
      solution: "For a reversible process, dS = dQ_rev/T. Since the process is isothermal, dU = 0 -> dQ_rev = dW = P dV = (nRT/V) dV. Thus, dS = (nR/V) dV. Integrating from V1 to V2 yields ΔS = n*R*ln(V2/V1)."
    }
  ].filter(q => {
    if (activeCourse.includes('JEE') && q.subject.includes('Biology')) return false;
    if (activeCourse.includes('NEET') && q.subject.includes('Math')) return false;
    return true;
  });

  const handleUseHint = () => {
    if (user.xp < 5) {
      alert("Insufficient XP! Solve more questions or ask doubts to earn XP.");
      return;
    }
    deductXP(5);
    setHintUsed(true);
  };

  const handleSubmitAns = () => {
    if (selectedOpt === null) return;
    setIsAnswered(true);
    
    const isCorrect = selectedOpt === dailySet[currIdx].correct;
    if (isCorrect) {
      setScore(prev => prev + 1);
      earnXP(10); // +10 XP for correct
    }

    setAnswersHistory(prev => [
      ...prev,
      {
        qIdx: currIdx,
        selectedOpt: selectedOpt,
        isCorrect: isCorrect
      }
    ]);
  };

  const handleNext = () => {
    if (currIdx < dailySet.length - 1) {
      setCurrIdx(currIdx + 1);
      setSelectedOpt(null);
      setIsAnswered(false);
      setHintUsed(false);
    } else {
      earnXP(50); // 50 XP streak bonus on completing 20 questions
      setActiveTab('complete');
    }
  };

  // Compile detailed subject stats from history
  const getSubjectStats = () => {
    const stats = { Physics: { tot: 0, cor: 0 }, Chemistry: { tot: 0, cor: 0 }, Mathematics: { tot: 0, cor: 0 }, Biology: { tot: 0, cor: 0 } };
    answersHistory.forEach(item => {
      const q = dailySet[item.qIdx];
      if (stats[q.subject]) {
        stats[q.subject].tot++;
        if (item.isCorrect) stats[q.subject].cor++;
      }
    });
    return stats;
  };

  const getSyllabusGaps = () => {
    const gaps = [];
    answersHistory.forEach(item => {
      if (!item.isCorrect) {
        const q = dailySet[item.qIdx];
        if (!gaps.includes(`${q.topic} (${q.subject})`)) {
          gaps.push(`${q.topic} (${q.subject})`);
        }
      }
    });
    return gaps;
  };

  const subjectStats = getSubjectStats();
  const syllabusGaps = getSyllabusGaps();

  return (
    <div style={{ padding: '0px', fontFamily: "'Inter', sans-serif", position: 'relative', zIndex: 5 }}>
      
      {/* Spaced Repetition Engine: Memory Retention Dashboard */}
      {activeTab === 'quiz' && (
        <div className="fade-in" style={{ maxWidth: '680px', margin: '0 auto 24px auto', padding: '24px', borderRadius: '20px', background: 'linear-gradient(135deg, rgba(0, 212, 170, 0.1) 0%, rgba(26, 26, 53, 0.6) 100%)', border: '1px solid rgba(0, 212, 170, 0.2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div>
              <h3 style={{ color: 'white', fontSize: '1.1rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Brain size={18} style={{ color: '#00D4AA' }} /> AI Spaced Repetition Engine
              </h3>
              <p style={{ color: '#A0A0C0', fontSize: '0.8rem', marginTop: '4px' }}>Ebbinghaus Forgetting Curve Analysis</p>
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Thermodynamics Memory */}
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ color: 'white', fontSize: '0.9rem', marginBottom: '4px' }}>Thermodynamics</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '120px', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: '42%', height: '100%', background: '#FF6B6B' }}></div>
                  </div>
                  <span style={{ color: '#FF6B6B', fontSize: '0.75rem', fontWeight: 'bold' }}>Memory dropping (42%)</span>
                </div>
              </div>
              <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.75rem', background: 'rgba(255, 107, 107, 0.1)', color: '#FF6B6B', border: '1px solid rgba(255, 107, 107, 0.3)' }}>
                Targeted in today's set
              </button>
            </div>

            {/* Organic Halides Memory */}
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ color: 'white', fontSize: '0.9rem', marginBottom: '4px' }}>Organic Halides</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '120px', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: '85%', height: '100%', background: '#00D4AA' }}></div>
                  </div>
                  <span style={{ color: '#00D4AA', fontSize: '0.75rem', fontWeight: 'bold' }}>Strong Retention (85%)</span>
                </div>
              </div>
              <span style={{ color: '#A0A0C0', fontSize: '0.75rem' }}>Review in 5 days</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'quiz' && (
        <div className="fade-in" style={{ maxWidth: '680px', margin: '0 auto' }}>
          
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <span className="badge badge-gradient">
                <Sun size={12} style={{ marginRight: '6px', color: '#FFB347' }} />
                <span>Daily Revision Challenge</span>
              </span>
              <h2 style={{ color: 'white', fontSize: '1.5rem', marginTop: '6px' }}>Daily 20 Questions</h2>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '0.8rem', color: '#A0A0C0' }}>Question {currIdx + 1} of {dailySet.length}</span>
              <div style={{ background: 'rgba(255, 179, 71, 0.1)', padding: '6px 12px', borderRadius: '50px', display: 'flex', alignItems: 'center', gap: '6px', color: '#FFB347', fontWeight: 'bold', fontSize: '0.8rem' }}>
                <Flame size={14} fill="#FFB347" />
                <span>{user.streak} Days</span>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ display: 'flex', gap: '4px', marginBottom: '30px', flexWrap: 'wrap' }}>
            {dailySet.map((_, idx) => (
              <div key={idx} style={{
                flex: 1,
                minWidth: '10px',
                height: '6px',
                borderRadius: '3px',
                background: idx < currIdx ? '#00D4AA' : idx === currIdx ? 'var(--primary-color)' : 'rgba(255,255,255,0.06)',
                transition: 'all 0.3s'
              }}></div>
            ))}
          </div>

          {/* Main revision card */}
          <div className="glass-panel" style={{
            padding: '30px',
            borderRadius: '20px',
            borderLeft: '4px solid var(--primary-color)',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--primary-color)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>
                {dailySet[currIdx].subject}: {dailySet[currIdx].topic}
              </span>
              <span className="badge" style={{
                borderColor: dailySet[currIdx].difficulty === 'Hard' ? 'rgba(255,107,107,0.2)' : dailySet[currIdx].difficulty === 'Medium' ? 'rgba(108,99,255,0.2)' : 'rgba(0,212,170,0.2)',
                color: dailySet[currIdx].difficulty === 'Hard' ? '#FF6B6B' : dailySet[currIdx].difficulty === 'Medium' ? '#B88EFC' : '#00D4AA',
                background: 'transparent',
                fontSize: '0.7rem'
              }}>{dailySet[currIdx].difficulty}</span>
            </div>

            <p style={{ color: 'white', fontSize: '1.05rem', fontWeight: '500', lineHeight: '1.6', marginBottom: '24px' }}>
              {dailySet[currIdx].q}
            </p>

            {/* Options list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {dailySet[currIdx].opts.map((opt, idx) => {
                const isSelected = selectedOpt === idx;
                let bg = 'rgba(255,255,255,0.02)';
                let border = '1px solid rgba(255,255,255,0.06)';
                let color = 'white';

                if (isAnswered) {
                  if (idx === dailySet[currIdx].correct) {
                    bg = 'rgba(0, 212, 170, 0.1)';
                    border = '1px solid #00D4AA';
                    color = '#00D4AA';
                  } else if (isSelected) {
                    bg = 'rgba(255, 107, 107, 0.1)';
                    border = '1px solid #FF6B6B';
                    color = '#FF6B6B';
                  }
                } else if (isSelected) {
                  bg = 'rgba(108, 99, 255, 0.08)';
                  border = '1px solid #6C63FF';
                  color = '#B88EFC';
                }

                return (
                  <div 
                    key={idx}
                    onClick={() => !isAnswered && setSelectedOpt(idx)}
                    style={{
                      background: bg,
                      border: border,
                      color: color,
                      borderRadius: '12px',
                      padding: '14px 20px',
                      cursor: isAnswered ? 'default' : 'pointer',
                      fontSize: '0.9rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      transition: 'all 0.15s'
                    }}
                  >
                    <div style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      border: isSelected ? `5px solid ${color}` : '2px solid rgba(255,255,255,0.2)',
                      background: 'transparent'
                    }}></div>
                    <span>{opt}</span>
                  </div>
                );
              })}
            </div>

            {/* Answer correctness review */}
            {isAnswered && (
              <div style={{
                marginTop: '20px',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '12px',
                padding: '16px',
                animation: 'fadeIn 0.2s ease'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  {selectedOpt === dailySet[currIdx].correct ? (
                    <Check size={18} style={{ color: '#00D4AA' }} />
                  ) : (
                    <AlertCircle size={18} style={{ color: '#FF6B6B' }} />
                  )}
                  <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: selectedOpt === dailySet[currIdx].correct ? '#00D4AA' : '#FF6B6B' }}>
                    {selectedOpt === dailySet[currIdx].correct ? 'Correct Answer! (+10 XP)' : 'Incorrect attempt!'}
                  </span>
                </div>
                <p style={{ fontSize: '0.85rem', color: '#E0E0FF', lineHeight: '1.5' }}>
                  <strong>Solution Analysis:</strong> {dailySet[currIdx].solution}
                </p>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '10px', marginTop: '10px', display: 'flex', gap: '10px' }}>
                  <button onClick={() => navigate('ai-chat')} className="btn btn-ghost" style={{ padding: '6px 12px', fontSize: '0.75rem' }}>Ask AI Follow-up doubt</button>
                </div>
              </div>
            )}

            {/* Card Footer Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px' }}>
              <div>
                {!isAnswered && (
                  <button 
                    onClick={handleUseHint}
                    disabled={hintUsed}
                    className="btn btn-secondary" 
                    style={{ padding: '8px 16px', fontSize: '0.75rem', opacity: hintUsed ? 0.6 : 1 }}
                  >
                    💡 Buy Hint (5 XP)
                  </button>
                )}
                {hintUsed && !isAnswered && (
                  <p style={{ fontSize: '0.75rem', color: '#FFB347', marginTop: '6px', maxWidth: '300px' }}>
                    <strong>Hint:</strong> {dailySet[currIdx].hint}
                  </p>
                )}
              </div>

              {!isAnswered ? (
                <button 
                  onClick={handleSubmitAns}
                  disabled={selectedOpt === null}
                  className="btn btn-primary"
                  style={{ opacity: selectedOpt === null ? 0.5 : 1 }}
                >
                  Confirm Answer
                </button>
              ) : (
                <button 
                  onClick={handleNext}
                  className="btn btn-primary btn-glow"
                >
                  {currIdx === dailySet.length - 1 ? 'Finish Revision & Analysis' : 'Next Card'}
                </button>
              )}
            </div>

          </div>

        </div>
      )}

      {/* Completion Panel with Detailed Analysis */}
      {activeTab === 'complete' && (
        <div className="fade-in" style={{ maxWidth: '800px', margin: '40px auto' }}>
          <div className="glass-panel" style={{ padding: '40px', borderRadius: '24px' }}>
            
            {/* Header summary */}
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #00D4AA 0%, #00FFF0 100%)',
                color: '#0D0D1A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                margin: '0 auto 20px',
                boxShadow: '0 8px 24px rgba(0,212,170,0.4)'
              }}>
                ✓
              </div>

              <span className="badge badge-gradient" style={{ marginBottom: '12px' }}>Consistency Locked!</span>
              <h2 style={{ color: 'white', marginBottom: '8px' }}>Daily Questions Completed!</h2>
              <p style={{ color: '#A0A0C0', fontSize: '0.95rem', lineHeight: '1.6' }}>
                Awesome work! You got <strong>{score}</strong> out of {dailySet.length} questions correct. You earned <strong>+{score * 10 + 50} XP</strong>!
              </p>

              <div style={{
                display: 'inline-flex',
                background: 'rgba(255, 179, 71, 0.08)',
                border: '1px solid rgba(255, 179, 71, 0.2)',
                borderRadius: '50px',
                padding: '8px 20px',
                alignItems: 'center',
                gap: '8px',
                color: '#FFB347',
                margin: '16px auto',
                fontWeight: 'bold',
                fontSize: '0.9rem'
              }}>
                <span>🔥</span> Streak maintained: {user.streak} Days!
              </div>
            </div>

            {/* Detailed Performance Analysis Section */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '30px', marginTop: '20px' }}>
              <h3 style={{ color: 'white', fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                <BarChart2 size={20} style={{ color: 'var(--primary-color)' }} /> Detailed Solution Analysis
              </h3>

              {/* Subject Breakdown */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '30px' }} className="catalog-grid-mobile">
                {Object.keys(subjectStats).map(sub => {
                  const data = subjectStats[sub];
                  const pct = data.tot > 0 ? Math.round((data.cor / data.tot) * 100) : 0;
                  return (
                    <div key={sub} style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
                      <span style={{ fontSize: '0.75rem', color: '#A0A0C0', textTransform: 'uppercase' }}>{sub}</span>
                      <h4 style={{ fontSize: '1.25rem', color: pct >= 75 ? '#00D4AA' : pct >= 50 ? '#FFB347' : '#FF6B6B', margin: '8px 0 4px', fontWeight: 'bold' }}>
                        {pct}%
                      </h4>
                      <span style={{ fontSize: '0.7rem', color: '#626280' }}>({data.cor}/{data.tot} correct)</span>
                    </div>
                  );
                })}
              </div>

              {/* Syllabus Gap Alert */}
              {syllabusGaps.length > 0 && (
                <div style={{
                  background: 'rgba(255, 107, 107, 0.05)',
                  border: '1px solid rgba(255, 107, 107, 0.15)',
                  borderRadius: '16px',
                  padding: '20px',
                  marginBottom: '30px',
                  display: 'flex',
                  gap: '12px'
                }}>
                  <ShieldAlert size={20} style={{ color: '#FF6B6B', flexShrink: 0 }} />
                  <div>
                    <h4 style={{ color: '#FF6B6B', fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '6px' }}>
                      Identified Knowledge Gaps
                    </h4>
                    <p style={{ color: '#A0A0C0', fontSize: '0.8rem', lineHeight: '1.5', marginBottom: '8px' }}>
                      You missed questions in the following topics. We suggest asking the AI Tutor to clarify these specific concepts:
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {syllabusGaps.map((gap, i) => (
                        <span key={i} className="badge" style={{ borderColor: 'rgba(255,107,107,0.2)', color: '#FF6B6B', background: 'transparent', fontSize: '0.7rem' }}>
                          {gap}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Question Review Scroll */}
              <div style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '8px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h4 style={{ color: 'white', fontSize: '0.95rem', fontWeight: 'bold', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '8px' }}>
                  Question-by-Question Review
                </h4>
                {answersHistory.map((item, idx) => {
                  const q = dailySet[item.qIdx];
                  return (
                    <div key={idx} style={{
                      background: 'rgba(255,255,255,0.01)',
                      border: '1px solid rgba(255,255,255,0.04)',
                      borderRadius: '12px',
                      padding: '16px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--primary-color)', fontWeight: 'bold', textTransform: 'uppercase' }}>
                          Q{idx + 1} · {q.subject} · {q.topic}
                        </span>
                        <span style={{ 
                          fontSize: '0.75rem', 
                          color: item.isCorrect ? '#00D4AA' : '#FF6B6B',
                          fontWeight: 'bold',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          {item.isCorrect ? '✓ Correct' : '✗ Incorrect'}
                        </span>
                      </div>
                      <p style={{ color: 'white', fontSize: '0.85rem', fontWeight: '500', marginBottom: '10px' }}>
                        {q.q}
                      </p>
                      <div style={{ fontSize: '0.75rem', color: '#A0A0C0', background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '6px', lineHeight: '1.4' }}>
                        <strong>Your Answer:</strong> {q.opts[item.selectedOpt]} <br />
                        <strong>Correct Answer:</strong> {q.opts[q.correct]} <br />
                        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: '8px', paddingTop: '8px' }}>
                          <strong>Detailed Solution:</strong> {q.solution}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>

            {/* Next Steps Buttons */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '30px' }} className="catalog-grid-mobile">
              <button onClick={() => navigate('mock-tests')} className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Take a Mock Test</button>
              <button onClick={() => navigate('ai-chat')} className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>Ask AI doubts</button>
              <button onClick={() => navigate('home')} className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center' }}>Back to Dashboard</button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
