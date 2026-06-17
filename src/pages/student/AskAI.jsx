import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, Mic, Camera, FunctionSquare, 
  Send, Languages, Save, ThumbsUp, StopCircle, Database
} from 'lucide-react';
import { pipeline, env } from '@xenova/transformers';
env.allowLocalModels = false;
import Groq from 'groq-sdk';
import { supabase } from '../../lib/supabase';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
const preprocessLaTeX = (text) => {
  if (!text) return '';
  let processed = text;
  // Convert LaTeX math delimiters to Markdown math delimiters ($ and $$)
  // because ReactMarkdown treats \( as an escaped parenthesis.
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
  return processed;
};

export default function AskAI({ user, addNote, earnXP, activeCourse = 'JEE Main' }) {
  const [messages, setMessages] = useState([
    {
      id: 0,
      role: 'ai',
      text: "Hello! I am your 24/7 personal study partner. You can type, speak, or upload a photo of a textbook/formula. What are we revising today?",
      stepByStep: null,
      conceptLinks: [],
      expandedStep: false
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [language, setLanguage] = useState('English');
  const [subject, setSubject] = useState('Physics');
  const [chapter, setChapter] = useState('Kinematics');
  const contextQuestions = getContextQuestions(subject, chapter);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [listeningMic, setListeningMic] = useState(false);
  const fileInputRef = React.useRef(null);
  const [micDots, setMicDots] = useState('');

  const messagesEndRef = useRef(null);
  const micIntervalRef = useRef(null);
  const msgIdRef = useRef(1);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Mic dot animation
  useEffect(() => {
    if (listeningMic) {
      let count = 0;
      micIntervalRef.current = setInterval(() => {
        count = (count + 1) % 4;
        setMicDots('.'.repeat(count));
      }, 400);
    } else {
      clearInterval(micIntervalRef.current);
      setMicDots('');
    }
    return () => clearInterval(micIntervalRef.current);
  }, [listeningMic]);



  // --- Dynamic, Contextual & Localized Questions Compiler ---
  function getContextQuestions(selectedSubject, selectedChapter) {
    const subj = selectedSubject.toLowerCase();
    const ch = selectedChapter.toLowerCase();

    if (subj === 'physics') {
      if (ch === 'thermodynamics') {
        return {
          doubts: [
            "First Law of Thermodynamics",
            "Isothermal vs Adiabatic work",
            "Concept of Entropy",
            "Carnot Engine efficiency",
            "Zeroth Law of Thermodynamics"
          ],
          prompts: [
            "Explain Carnot Engine efficiency simply",
            "First Law of Thermodynamics formula",
            "Isothermal vs Adiabatic PV curves",
            "State the 2nd Law of Thermodynamics",
            "What is entropy change in cycle?"
          ]
        };
      } else if (ch === 'optics') {
        return {
          doubts: [
            "Snell's Law derivation",
            "Total Internal Reflection",
            "Lens Maker's Formula",
            "Young's Double Slit Experiment",
            "Brewster's Angle concept"
          ],
          prompts: [
            "Explain Total Internal Reflection visually",
            "Derive Lens Maker's Formula step-by-step",
            "What is Young's Double Slit fringe width?",
            "Explain wave optics Huygens principle",
            "Focal length changes in water"
          ]
        };
      } else { // Kinematics or default Physics
        return {
          doubts: [
            "Newton's 3rd Law",
            "Projectile motion range",
            "Relative velocity in 2D",
            "Derivation of v² = u² + 2as",
            "Instantaneous acceleration"
          ],
          prompts: [
            "Newton's 3rd Law boat example",
            "Derive projectile maximum height formula",
            "Explain relative velocity of crossing trains",
            "What is average velocity in circular path?",
            "Derive motion equations graphically"
          ]
        };
      }
    } else if (subj === 'chemistry') {
      if (ch === 'organic halides') {
        return {
          doubts: [
            "SN1 vs SN2 inversion",
            "Walden Inversion steric rules",
            "Alkyl Halide reactivity trends",
            "Grignard reagent preparation",
            "Markovnikov's addition rule"
          ],
          prompts: [
            "SN1 vs SN2 reaction mechanisms",
            "Explain Walden Inversion sterics",
            "Why tertiary halides favor SN1?",
            "Grignard reagent synthesis with dry ether",
            "Markovnikov vs Anti-Markovnikov addition"
          ]
        };
      } else if (ch === 'thermodynamics') {
        return {
          doubts: [
            "Hess's Law of Heat Summation",
            "Gibbs Free Energy spontaneity",
            "Enthalpy vs Internal Energy",
            "Entropy change in reactions",
            "Bomb calorimeter work"
          ],
          prompts: [
            "Explain Hess's Law with examples",
            "Gibbs Free Energy spontaneity criteria",
            "Difference between Enthalpy and dU",
            "Calculate reaction entropy changes",
            "State the Third Law of Thermodynamics"
          ]
        };
      } else { // default chemistry
        return {
          doubts: [
            "Periodic trends of electronegativity",
            "Hybridization of Carbon molecules",
            "Bohr's atomic model limits",
            "Balancing redox reactions",
            "Le Chatelier's equilibrium principle"
          ],
          prompts: [
            "Explain electronegativity periodic trends",
            "Determine hybridization of CH4 and C2H2",
            "What are limits of Bohr's atomic model?",
            "Balance redox reaction in acidic medium",
            "Explain Le Chatelier's shift with pressure"
          ]
        };
      }
    } else if (subj === 'mathematics') {
      return {
        doubts: [
          "lim x→0 (sinx/x) proof",
          "Squeeze Theorem definition",
          "Derivative of ln(sinx)",
          "Fundamental Theorem of Calculus",
          "LaTeX formula syntax guidelines"
        ],
        prompts: [
          "Squeeze Theorem visual proof",
          "lim x→0 (sinx/x) squeeze theorem proof",
          "Derive f(x) = ln(sin x) using chain rule",
          "State the 1st Fundamental Theorem of Calculus",
          "Give me LaTeX formula syntax examples"
        ]
      };
    } else if (subj === 'biology') {
      if (ch === 'cell division') {
        return {
          doubts: [
            "Mitosis vs Meiosis differences",
            "Prophase I crossing over",
            "Cytokinesis in plants vs animals",
            "Role of Spindle Fibres",
            "Stages of cell cycle interphase"
          ],
          prompts: [
            "Mitosis vs Meiosis complete comparison table",
            "Explain Prophase I crossing over step-by-step",
            "Cytokinesis mechanism in plant cell plates",
            "What is role of spindle fibers in anaphase?",
            "Detail G1, S, and G2 stages of cell cycle"
          ]
        };
      } else { // default biology / Photosynthesis
        return {
          doubts: [
            "Explain photosynthesis simply",
            "Light vs Dark reactions",
            "Calvin Cycle step-by-step",
            "Chloroplast cell structure",
            "Role of RuBisCO enzyme"
          ],
          prompts: [
            "Explain photosynthesis light vs dark stages",
            "Calvin Cycle starch production pathway",
            "Draw chloroplast structures conceptually",
            "RuBisCO enzyme dual activity as carboxylase",
            "Write overall photosynthesis balanced equation"
          ]
        };
      }
    }

    return {
      doubts: [
        "Newton's 3rd Law",
        "SN1 vs SN2 inversion",
        "lim x→0 (sinx/x)",
        "Explain photosynthesis",
        "First Law of Thermodynamics"
      ],
      prompts: [
        "Explain photosynthesis simply",
        "First Law of Thermodynamics",
        "Newton's 3rd Law example",
        "LaTeX formula syntax",
        "lim x→0 (sinx/x)"
      ]
    };
  };

  // ... (simulatedAnswers object remains unchanged)

  const getAnswer = (text, lang) => {
    // ... (rest of logic)
    const lower = text.toLowerCase().trim();
    // 1. Check for predefined database matches
    let topic = null;
    if (lower.includes('thermo') || lower.includes('heat') || lower.includes('first law')) topic = 'thermodynamics';
    else if (lower.includes('photo') || lower.includes('plant') || lower.includes('chloro') || lower.includes('bio')) topic = 'photosynthesis';
    else if (lower.includes('newton') || lower.includes('third law') || lower.includes('action') || lower.includes('reaction')) topic = 'newton';
    else if (lower.includes('sn1') || lower.includes('sn2') || lower.includes('nucleophilic') || lower.includes('inversion')) topic = 'sn1sn2';
    else if (lower.includes('lim') || lower.includes('sin') || lower.includes('sinx') || lower.includes('squeeze')) topic = 'limit';
    else if (lower.includes('latex') || lower.includes('formula') || lower.includes('function syntax')) topic = 'latex';

    const selectedLang = ['English', 'Hindi', 'Tamil', 'Telugu', 'Bengali', 'Marathi'].includes(lang) ? lang : 'English';

    if (topic && simulatedAnswers[topic]) {
      return simulatedAnswers[topic][selectedLang] || simulatedAnswers[topic]['English'];
    }

    // 2. Dynamic Doubt Solver for any other topic/query!
    let subjectDetected = 'General Science & Mathematics';
    let responseText = '';
    let steps = '';
    let links = [];

    if (lower.includes('quadratic') || lower.includes('equation')) {
      subjectDetected = 'Mathematics (Algebra)';
      responseText = "A quadratic equation is a second-degree polynomial equation of the form:\n\n  ax² + bx + c = 0\n\nwhere a ≠ 0. The solutions (roots) can be found using the quadratic formula:\n\n  x = [-b ± √(b² - 4ac)] / (2a)\n\nThe term (b² - 4ac) is the discriminant (D), which determines the nature of the roots:\n• D > 0: Two distinct real roots\n• D = 0: Two equal real roots\n• D < 0: Two complex conjugate roots";
      steps = "Step 1: Write down the coefficients a, b, and c from the equation.\nStep 2: Calculate the discriminant D = b² - 4ac.\nStep 3: Substitute a, b, and D into the quadratic formula.\nStep 4: Simplify to find the two roots x₁ and x₂.";
      links = ['Quadratic Formula', 'Discriminant', 'Nature of Roots'];
    }
    else if (lower.includes('derivative') || lower.includes('differentiation')) {
      subjectDetected = 'Mathematics (Calculus)';
      responseText = "Differentiation is the process of finding the rate of change of a function with respect to a variable. The derivative of f(x) at x is defined as:\n\n  f'(x) = lim(h→0) [f(x+h) - f(x)] / h\n\nCommon derivative rules include:\n• Power Rule: d/dx(x^n) = n * x^(n-1)\n• Product Rule: d/dx(u*v) = u'v + uv'\n• Quotient Rule: d/dx(u/v) = (u'v - uv') / v²\n• Chain Rule: d/dx(f(g(x))) = f'(g(x)) * g'(x)";
      steps = "Step 1: Identify the outer and inner functions for complex compositions.\nStep 2: Apply the correct differentiation rule (Product, Quotient, or Chain rule).\nStep 3: Calculate derivatives of the individual components.\nStep 4: Simplify the algebraic expression.";
      links = ['Chain Rule', 'Limits & Derivatives', 'Rate of Change'];
    }
    else if (lower.includes('gravity') || lower.includes('gravitation')) {
      subjectDetected = 'Physics (Mechanics)';
      responseText = "Gravitation is a natural phenomenon by which all things with mass or energy are attracted to one another. Newton's Law of Universal Gravitation states:\n\n  F = G * (m1 * m2) / r²\n\nwhere:\n• F is the gravitational force between masses m1 and m2\n• G is the gravitational constant (6.674 × 10⁻¹¹ N·m²/kg²)\n• r is the distance between the centers of the two masses";
      steps = "Step 1: Identify the two masses (m1 and m2) and the distance (r) between their centers.\nStep 2: Convert all units to standard SI units (kg for mass, meters for distance).\nStep 3: Substitute the values into Newton's gravitational formula.\nStep 4: Solve for the gravitational force F in Newtons.";
      links = ['Gravitational Constant', 'Acceleration due to Gravity (g)', 'Kepler\'s Laws'];
    }
    else if (lower.includes('speed of light')) {
      subjectDetected = 'Physics (Modern Physics)';
      responseText = "The speed of light in a vacuum, commonly denoted by 'c', is a fundamental physical constant. Its exact value is defined as:\n\n  c = 299,792,458 m/s (~ 3 × 10⁸ m/s)\n\nKey implications:\n• It is the absolute speed limit for information and matter in the universe.\n• According to Einstein's theory of relativity (E = mc²), mass increases infinitely as velocity approaches c.";
      steps = "Step 1: Recognize 'c' as the speed of electromagnetic waves in vacuum.\nStep 2: In a medium, speed v = c / n, where n is the refractive index.\nStep 3: Use this relation to calculate wavelengths and frequencies using c = ν * λ.";
      links = ['Refractive Index', 'Special Relativity', 'Electromagnetic Spectrum'];
    }
    else if (lower.includes('friction')) {
      subjectDetected = 'Physics (Mechanics)';
      responseText = "Friction is the force resisting the relative motion of solid surfaces, fluid layers, and material elements sliding against each other. The friction force is given by:\n\n  f = μ * N\n\nwhere:\n• μ is the coefficient of friction (static μs or kinetic μk)\n• N is the normal force perpendicular to the contact surface";
      steps = "Step 1: Draw a Free Body Diagram (FBD) of the object.\nStep 2: Resolve forces along the perpendicular direction to find the normal force N.\nStep 3: Identify if the object is static or in motion to select μs or μk.\nStep 4: Calculate the friction force f = μ * N.";
      links = ['Coefficient of Friction', 'Normal Force', 'FBD Analysis'];
    }
    else if (lower.includes('hybrid') || lower.includes('bonding')) {
      subjectDetected = 'Chemistry (Inorganic)';
      responseText = "Hybridization is the concept of mixing atomic orbitals to form new hybrid orbitals suitable for the pairing of electrons to form chemical bonds in valence bond theory. Steric Number determines the hybridization:\n• Steric Number 2: sp (Linear)\n• Steric Number 3: sp2 (Trigonal Planar)\n• Steric Number 4: sp3 (Tetrahedral)\n• Steric Number 5: sp3d (Trigonal Bipyramidal)\n• Steric Number 6: sp3d2 (Octahedral)";
      steps = "Step 1: Identify the central atom and count its valence electrons.\nStep 2: Add one electron for each negative charge, subtract one for each positive charge.\nStep 3: Count the number of surrounding sigma bonds and lone pairs (Steric Number).\nStep 4: Assign the hybridization state corresponding to the Steric Number.";
      links = ['VSEPR Theory', 'Sigma and Pi Bonds', 'Molecular Geometry'];
    }
    else if (lower.includes('cell') || lower.includes('mitosis') || lower.includes('meiosis')) {
      subjectDetected = 'Biology (Cell Biology)';
      responseText = "Cell division is the process by which a parent cell divides into two or more daughter cells.\n• Mitosis: Produces two genetically identical diploid daughter cells. Essential for growth and tissue repair.\n• Meiosis: Produces four genetically diverse haploid gametes. Essential for sexual reproduction and genetic diversity via crossing over in Prophase I.";
      steps = "Step 1: Interphase (DNA replication occurs in S-phase).\nStep 2: Karyokinesis (Division of nucleus: Prophase, Metaphase, Anaphase, Telophase).\nStep 3: Cytokinesis (Division of cytoplasm: cell plate in plants, cleavage furrow in animals).\nStep 4: Checkpoints (G1, G2, M check points control regulation).";
      links = ['Cell Cycle Interphase', 'Prophase I Crossing Over', 'Diploid vs Haploid'];
    }
    else {
      const cleanQuery = text.replace(/[?.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").trim();
      const queryWords = cleanQuery.split(' ');
      const mainSubject = queryWords.length > 1 ? queryWords[queryWords.length - 1] : cleanQuery;
      
      subjectDetected = subject || 'General Query Solver';
      responseText = `Great question regarding "${cleanQuery}"! Let me break this down conceptually. In academic curricula, understanding "${mainSubject}" involves analyzing its fundamental definitions, properties, and core equations.\n\nHere is a comprehensive breakdown of this topic:\n1. **Core Concept**: "${cleanQuery}" represents a key principle of study. \n2. **Governing Rules**: All calculations and theoretical explanations follow the laws of conservation and scientific methods.\n3. **Application**: It is commonly tested in JEE/NEET syllabus to assess logic and problem-solving skills.`;
      steps = `Step 1: Define the primary terms involved in "${cleanQuery}".\nStep 2: Identify the relevant equations, variables, and constants.\nStep 3: Apply logical reasoning or algebraic substitution to solve for unknowns.\nStep 4: Double-check units and check if boundary conditions are met.`;
      links = [`${mainSubject} Overview`, 'Formula Reference Sheet', 'Solved Syllabus Examples'];
    }

    // Multilingual translation support for dynamic responses
    const translations = {
      Hindi: {
        subjectText: "विषय",
        stepsHeader: "चरण-दर-चरण विश्लेषण",
        relatedHeader: "संबंधित",
        generalIntro: "बहुत बढ़िया सवाल! यहाँ एक वैज्ञानिक विश्लेषण है:"
      },
      Tamil: {
        subjectText: "பாடம்",
        stepsHeader: "படி-படியாக விளக்கம்",
        relatedHeader: "தொடர்புடையவை",
        generalIntro: "அருமையான கேள்வி! இதோ விரிவான விளக்கம்:"
      },
      Telugu: {
        subjectText: "విషయం",
        stepsHeader: "దశల వారీ విశ్లేషణ",
        relatedHeader: "సంబంధిత",
        generalIntro: "చాలా మంచి ప్రశ్న! ఇక్కడ వివరణ ఉంది:"
      },
      Bengali: {
        subjectText: "বিষয়",
        stepsHeader: "ধাপ-ভিত্তিক বিশ্লেষণ",
        relatedHeader: "সম্পর্কিত",
        generalIntro: "চমৎকার প্রশ্ন! নিচে বিস্তারিত আলোচনা করা হলো:"
      },
      Marathi: {
        subjectText: "विषय",
        stepsHeader: "पायरी-दर-पायरी विश्लेषण",
        relatedHeader: "संबंधित",
        generalIntro: "उत्तम प्रश्न! येथे स्पष्टीकरण दिले आहे:"
      }
    };

    if (selectedLang !== 'English' && translations[selectedLang]) {
      const trans = translations[selectedLang];
      return {
        text: `[${trans.subjectText}: ${subjectDetected}]\n${trans.generalIntro}\n\n${responseText}`,
        stepByStep: steps.replace(/Step/g, 'पायरी/படி/దశ/ধাপ'),
        conceptLinks: links
      };
    }

    return {
      text: `[Subject: ${subjectDetected}]\n\n${responseText}`,
      stepByStep: steps,
      conceptLinks: links
    };
  };

  const handleSend = async (textToSend, imageData = null) => {
    const trimmed = (textToSend || '').trim();
    if ((!trimmed && !imageData) || loading) return;

    const userMsg = { id: msgIdRef.current++, role: 'user', text: trimmed, image: imageData };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    const apiKey = import.meta.env.VITE_GROQ_API_KEY || "";
    if (apiKey) {
      try {
        const groq = new Groq({ apiKey, dangerouslyAllowBrowser: true });
        
        // RAG Pipeline: Retrieve relevant context
        let contextText = "";
        try {
          // Load local embedding model
          const extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
          const embedResult = await extractor(trimmed, { pooling: 'mean', normalize: true });
          const queryEmbedding = Array.from(embedResult.data);
          
          const { data: matchData, error: matchError } = await supabase.rpc('match_documents', {
            query_embedding: queryEmbedding,
            match_threshold: 0.5,
            match_count: 3
          });
          
          if (!matchError && matchData && matchData.length > 0) {
            contextText = "\n\nCOURSE MATERIALS CONTEXT (Use this to answer the question accurately if relevant):\n" + matchData.map(d => d.content).join("\n---\n");
          }
        } catch (ragError) {
          console.error("RAG retrieval failed, falling back to general knowledge", ragError);
        }

        const prompt = `You are a helpful 24/7 personal Socratic study partner for student exam preparation. 
The student's active subject is "${subject}".
The preferred language for the response is "${language}".${contextText}

${imageData ? "Analyze the provided image of the student's handwritten work or problem. Identify exactly where they made a mistake or what concept they are missing, and give a Socratic hint rather than just feeding the final answer. Act as a tutor." : "Solve the student's doubt with absolute educational clarity."}

- Provide explanations and formulas (use LaTeX where appropriate).
- Output a step-by-step breakdown.
- Suggest 2-4 related key concepts.

The doubt query is: "${trimmed}"

You MUST respond strictly in the following JSON format:
{
  "text": "The main explanation. Keep it clear, friendly, and structured. Use Markdown formatting. If the requested language is not English, translate this text to the requested language.",
  "stepByStep": "A detailed step-by-step explanation or derivation of the solution. If the requested language is not English, translate this text to the requested language.",
  "conceptLinks": ["Array of 2-4 related key concepts, short and clickable (e.g. ['Newton\\'s Laws', 'Entropy', 'Calculus Rules'])"]
}`;

        let result = null;
        try {
          const messageContent = [];
          messageContent.push({ type: "text", text: prompt });
          if (imageData) {
            messageContent.push({ type: "image_url", image_url: { url: imageData } });
          }

          const modelParams = {
            messages: [{ role: "user", content: messageContent }],
            model: imageData ? "llama-3.2-11b-vision-preview" : "llama-3.1-8b-instant",
          };
          if (!imageData) {
            modelParams.response_format = { type: "json_object" };
          }

          const completion = await groq.chat.completions.create(modelParams);
          result = completion.choices[0]?.message?.content;
        } catch (modelError) {
          console.warn("Groq failed:", modelError);
        }

        if (!result) {
          throw new Error("Model candidates failed.");
        }

        // LLMs frequently forget to double-escape LaTeX commands that match JSON control characters.
        // We must escape \b (begin, beta), \f (frac), \r (right, rho), \t (text, theta) before parsing.
        let safeResult = result
          .replace(/```json/gi, '')
          .replace(/```/g, '')
          .trim()
          .replace(/(?<!\\)\\b/g, '\\\\b')
          .replace(/(?<!\\)\\f/g, '\\\\f')
          .replace(/(?<!\\)\\r/g, '\\\\r')
          .replace(/(?<!\\)\\t/g, '\\\\t');

        const responseData = JSON.parse(safeResult);

        setMessages(prev => [...prev, {
          id: msgIdRef.current++,
          role: 'ai',
          text: responseData.text || "Sorry, I couldn't generate a clear response.",
          stepByStep: responseData.stepByStep || null,
          conceptLinks: responseData.conceptLinks || [],
          expandedStep: false,
          isRealAI: true,
          usedRAG: contextText.length > 0
        }]);
        setLoading(false);
        earnXP(15);
        return;
      } catch (error) {
        console.error("Groq API Error, falling back to simulated engine:", error);
      }
    }

    // Fallback simulated response
    setTimeout(() => {
      const responseDetails = getAnswer(trimmed, language);
      let text = responseDetails.text;

      setMessages(prev => [...prev, {
        id: msgIdRef.current++,
        role: 'ai',
        text,
        stepByStep: responseDetails.stepByStep,
        conceptLinks: responseDetails.conceptLinks,
        expandedStep: false,
        isRealAI: false
      }]);
      setLoading(false);
      earnXP(15);
    }, 1400 + Math.random() * 600); // slight variance for realism
  };

  // Toggle step-by-step for a SPECIFIC message by its id
  const toggleStep = (id) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, expandedStep: !m.expandedStep } : m));
  };

  const handleImageUpload = () => {
    if (loading || uploadingImage) return;
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingImage(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      setUploadingImage(false);
      const base64Data = event.target.result;
      handleSend("Please analyze my step-by-step working in this image and tell me where I went wrong. Don't just give the answer, act as a Socratic tutor.", base64Data);
    };
    reader.readAsDataURL(file);
  };

  const handleMicToggle = () => {
    if (loading) return;
    if (listeningMic) {
      setListeningMic(false);
      // Simulate captured voice query
      setTimeout(() => handleSend("Explain Newton's Third Law with a real-life example"), 300);
    } else {
      setListeningMic(true);
      // Auto-stop after 3 seconds
      setTimeout(() => {
        setListeningMic(false);
        setTimeout(() => handleSend("Explain Newton's Third Law with a real-life example"), 300);
      }, 3000);
    }
  };

  const handleSaveToNotes = (msg) => {
    let topic = '';
    const aiIndex = messages.findIndex(m => m.id === msg.id);
    if (aiIndex > 0 && messages[aiIndex - 1].role === 'user') {
      const prompt = messages[aiIndex - 1].text;
      topic = prompt.split(' ').slice(0, 5).join(' ') + (prompt.split(' ').length > 5 ? '...' : '');
    }
    
    const newNote = {
      title: `AI Note: ${subject}${topic ? ` - ${topic}` : ''}`,
      content: `### AI Solved Doubt\n\n${preprocessLaTeX(msg.text)}\n\n${msg.stepByStep ? `### Step-by-Step Breakdown\n\n${preprocessLaTeX(msg.stepByStep)}` : ''}`,
      category: subject,
      type: 'Auto-generated'
    };
    addNote(newNote);
    alert("✅ Saved to 'Smart Notes'! +20 XP earned!");
    earnXP(20);
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '260px 1fr',
      height: 'calc(100vh - 120px)',
      background: 'var(--card-bg)',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: '20px',
      overflow: 'hidden'
    }}>

      {/* ── Sidebar ── */}
      <div style={{
        background: 'rgba(0,0,0,0.2)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        overflowY: 'auto'
      }}>
        <h4 style={{ color: 'white', fontSize: '0.9rem', fontWeight: 'bold', margin: 0 }}>Study Context</h4>

        <div className="form-group">
          <label style={{ fontSize: '0.75rem' }}>Active Subject</label>
          <select value={subject} onChange={e => setSubject(e.target.value)}
            className="form-input" style={{ padding: '8px', fontSize: '0.8rem', background: '#0D0D1A' }}>
            {['Physics', 'Chemistry', 'Mathematics', 'Biology (Botany)', 'Biology (Zoology)']
              .filter(s => {
                if (activeCourse.includes('JEE') && s.includes('Biology')) return false;
                if (activeCourse.includes('NEET') && s === 'Mathematics') return false;
                return true;
              })
              .map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Languages size={12} /> Answer Language
          </label>
          <select value={language} onChange={e => setLanguage(e.target.value)}
            className="form-input" style={{ padding: '8px', fontSize: '0.8rem', background: '#0D0D1A' }}>
            {['English', 'Hindi', 'Tamil', 'Telugu', 'Bengali', 'Marathi'].map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>

        {/* Past Doubts */}
        <div style={{ marginTop: '8px' }}>
          <h5 style={{ color: '#626280', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>
            Quick Doubts
          </h5>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {contextQuestions.doubts.map((h, i) => (
              <div
                key={i}
                onClick={() => handleSend(`Explain ${h}`)}
                style={{
                  fontSize: '0.8rem',
                  color: 'var(--text-secondary)',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  padding: '8px 10px',
                  borderRadius: '8px',
                  background: 'rgba(255,255,255,0.01)',
                  border: '1px solid transparent',
                  opacity: loading ? 0.5 : 1,
                  transition: 'border-color 0.2s, background 0.2s'
                }}
                onMouseEnter={e => { if (!loading) e.currentTarget.style.borderColor = 'rgba(108,99,255,0.3)'; e.currentTarget.style.background = 'rgba(108,99,255,0.05)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.background = 'rgba(255,255,255,0.01)'; }}
              >
                ↗ {h}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main Chat Pane ── */}
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>

        {/* Header */}
        <div style={{
          padding: '14px 24px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexShrink: 0
        }}>
          <div>
            <h3 style={{ color: 'white', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
              <Sparkles size={16} style={{ color: '#6C63FF' }} />
              Ask AI Solver
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00D4AA', display: 'inline-block', animation: 'pulse 2s infinite' }} />
            </h3>
            <span style={{ fontSize: '0.72rem', color: '#A0A0C0' }}>
              AI Tutor · {subject} · Responding in {language}
            </span>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ 
              fontSize: '0.65rem', 
              background: import.meta.env.VITE_GEMINI_API_KEY ? 'rgba(0, 212, 170, 0.15)' : 'rgba(255, 107, 107, 0.15)',
              color: import.meta.env.VITE_GEMINI_API_KEY ? '#00D4AA' : '#FF6B6B',
              padding: '4px 10px',
              borderRadius: '50px',
              border: `1px solid ${import.meta.env.VITE_GEMINI_API_KEY ? 'rgba(0, 212, 170, 0.25)' : 'rgba(255, 107, 107, 0.25)'}`,
              fontWeight: '500'
            }}>
              {import.meta.env.VITE_GEMINI_API_KEY ? '● Gemini Online' : '○ Preview Mode'}
            </span>
          </div>
        </div>

        {/* Message Feed */}
        <div style={{
          flex: 1,
          padding: '24px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          {messages.map(msg => (
            <div
              key={msg.id}
              style={{
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '78%',
                display: 'flex',
                gap: '12px',
                animation: 'fadeInUp 0.3s ease'
              }}
            >
              {msg.role === 'ai' && (
                <div style={{
                  width: '32px', height: '32px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6C63FF 0%, #00D4AA 100%)',
                  color: '#0D0D1A', fontWeight: 'bold',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.8rem', flexShrink: 0
                }}>Ω</div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: 0 }}>
                {/* Bubble */}
                <div style={{
                  background: msg.role === 'user'
                    ? 'linear-gradient(135deg, #6C63FF, #00D4AA)'
                    : 'rgba(255,255,255,0.03)',
                  color: 'white',
                  padding: '14px 18px',
                  borderRadius: msg.role === 'user' ? '20px 20px 4px 20px' : '4px 20px 20px 20px',
                  border: msg.role === 'user' ? 'none' : '1px solid rgba(255,255,255,0.07)',
                  fontSize: '0.88rem',
                  lineHeight: '1.65',
                  wordBreak: 'break-word',
                  fontWeight: '400'
                }}>
                  {msg.usedRAG && (
                    <div style={{ marginBottom: '10px', fontSize: '0.75rem', color: '#00D4AA', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'bold', background: 'rgba(0, 212, 170, 0.1)', padding: '4px 8px', borderRadius: '6px', width: 'fit-content' }}>
                      <Database size={12} /> Answered from your Knowledge Base
                    </div>
                  )}
                  <ReactMarkdown
                    remarkPlugins={[remarkMath, remarkGfm]}
                    rehypePlugins={[rehypeKatex]}
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
                    {preprocessLaTeX(msg.text)}
                  </ReactMarkdown>
                </div>

                {/* AI extras */}
                {msg.role === 'ai' && msg.id > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

                    {/* Step-by-step toggle — per-message */}
                    {msg.stepByStep && (
                      <div>
                        <button
                          onClick={() => toggleStep(msg.id)}
                          className="btn btn-secondary"
                          style={{ padding: '5px 12px', fontSize: '0.72rem', borderRadius: '8px' }}
                        >
                          {msg.expandedStep ? '▲ Hide Steps' : '▼ Show Step-by-Step Breakdown'}
                        </button>
                        {msg.expandedStep && (
                          <div style={{
                            marginTop: '8px',
                            background: 'rgba(0,212,170,0.04)',
                            borderLeft: '3px solid var(--secondary-color)',
                            padding: '12px 16px',
                            fontSize: '0.8rem',
                            color: '#cceee8',
                            lineHeight: '1.7',
                            borderRadius: '0 8px 8px 0'
                          }}>
                            <ReactMarkdown
                              remarkPlugins={[remarkMath, remarkGfm]}
                              rehypePlugins={[rehypeKatex]}
                              components={{
                                p: ({node, ...props}) => <p style={{margin: '0 0 10px 0', color: 'inherit'}} {...props} />,
                                h1: ({node, ...props}) => <h1 style={{fontSize: '1.3rem', margin: '16px 0 8px 0', color: 'white'}} {...props} />,
                                h2: ({node, ...props}) => <h2 style={{fontSize: '1.15rem', margin: '12px 0 6px 0', color: 'white'}} {...props} />,
                                h3: ({node, ...props}) => <h3 style={{fontSize: '1.05rem', margin: '10px 0 4px 0', color: 'white'}} {...props} />,
                                ul: ({node, ...props}) => <ul style={{marginLeft: '20px', listStyleType: 'disc', margin: '10px 0 10px 20px'}} {...props} />,
                                ol: ({node, ...props}) => <ol style={{marginLeft: '20px', listStyleType: 'decimal', margin: '10px 0 10px 20px'}} {...props} />,
                                li: ({node, ...props}) => <li style={{marginBottom: '5px'}} {...props} />,
                                table: ({node, ...props}) => <div style={{overflowX: 'auto', margin: '15px 0'}}><table style={{width: '100%', borderCollapse: 'collapse'}} {...props} /></div>,
                                th: ({node, ...props}) => <th style={{border: '1px solid rgba(255,255,255,0.2)', padding: '10px', background: 'rgba(255,255,255,0.05)', color: 'white', textAlign: 'left', fontWeight: 'bold'}} {...props} />,
                                td: ({node, ...props}) => <td style={{border: '1px solid rgba(255,255,255,0.1)', padding: '10px', color: 'inherit'}} {...props} />
                              }}
                            >
                              {preprocessLaTeX(msg.stepByStep)}
                            </ReactMarkdown>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Concept tags */}
                    {msg.conceptLinks && msg.conceptLinks.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.68rem', color: '#626280' }}>Related:</span>
                        {msg.conceptLinks.map((c, i) => (
                          <span
                            key={i}
                            onClick={() => handleSend(`Explain ${c}`)}
                            style={{
                              fontSize: '0.7rem', color: '#00D4AA',
                              background: 'rgba(0,212,170,0.08)',
                              padding: '3px 9px', borderRadius: '6px',
                              cursor: loading ? 'not-allowed' : 'pointer',
                              border: '1px solid rgba(0,212,170,0.15)',
                              opacity: loading ? 0.5 : 1,
                              transition: 'background 0.2s'
                            }}
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Action row */}
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => handleSaveToNotes(msg)}
                        className="btn btn-ghost"
                        style={{ padding: '5px 12px', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '5px' }}
                      >
                        <Save size={11} /> Save to Notes (+20 XP)
                      </button>
                      <button className="btn btn-ghost" style={{ padding: '5px 12px', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <ThumbsUp size={11} /> Helpful
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <div style={{ display: 'flex', gap: '12px', alignSelf: 'flex-start', animation: 'fadeInUp 0.3s ease' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #6C63FF 0%, #00D4AA 100%)',
                color: '#0D0D1A', fontWeight: 'bold',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.8rem', flexShrink: 0
              }}>Ω</div>
              <div style={{
                background: 'rgba(255,255,255,0.03)',
                padding: '14px 20px',
                borderRadius: '4px 20px 20px 20px',
                border: '1px solid rgba(255,255,255,0.07)',
                display: 'flex', alignItems: 'center', gap: '6px'
              }}>
                <span style={{ fontSize: '0.83rem', color: '#A0A0C0' }}>AI is thinking</span>
                {/* Animated dots */}
                <span style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                  {[0, 1, 2].map(i => (
                    <span key={i} style={{
                      width: '6px', height: '6px', borderRadius: '50%',
                      background: '#6C63FF',
                      animation: `typingDot 1.2s ${i * 0.4}s infinite ease-in-out`
                    }} />
                  ))}
                </span>
              </div>
            </div>
          )}

          {/* Mic listening indicator */}
          {listeningMic && (
            <div style={{
              alignSelf: 'flex-end',
              background: 'rgba(255,107,107,0.08)',
              border: '1px solid rgba(255,107,107,0.3)',
              padding: '10px 18px',
              borderRadius: '20px 20px 4px 20px',
              color: '#FF6B6B',
              fontSize: '0.85rem',
              display: 'flex', alignItems: 'center', gap: '8px',
              animation: 'fadeInUp 0.3s ease'
            }}>
              <Mic size={14} style={{ animation: 'pulse 0.8s infinite' }} />
              Listening{micDots}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts */}
        <div style={{
          padding: '8px 24px',
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          borderTop: '1px solid rgba(255,255,255,0.04)',
          background: 'rgba(0,0,0,0.1)',
          flexShrink: 0
        }}>
          {contextQuestions.prompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              disabled={loading}
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '50px',
                padding: '5px 14px',
                fontSize: '0.72rem',
                color: loading ? '#626280' : '#A0A0C0',
                whiteSpace: 'nowrap',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => { if (!loading) { e.currentTarget.style.background = 'rgba(108,99,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(108,99,255,0.3)'; e.currentTarget.style.color = '#fff'; }}}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = loading ? '#626280' : '#A0A0C0'; }}
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          background: 'var(--card-bg)',
          flexShrink: 0
        }}>
          <div style={{
            background: listeningMic ? 'rgba(255,107,107,0.06)' : 'rgba(255,255,255,0.02)',
            border: `1px solid ${listeningMic ? 'rgba(255,107,107,0.4)' : 'rgba(255,255,255,0.08)'}`,
            borderRadius: '16px',
            padding: '8px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.3s'
          }}>
            {/* Camera */}
            <button
              onClick={handleImageUpload}
              disabled={uploadingImage || loading}
              title="Upload Photo of Question"
              style={{ background: 'transparent', border: 'none', color: uploadingImage ? '#00D4AA' : '#A0A0C0', cursor: 'pointer', padding: '6px' }}
            >
              <Camera size={18} />
            </button>

            {/* Mic toggle */}
            <button
              onClick={handleMicToggle}
              disabled={loading}
              title={listeningMic ? "Stop listening" : "Voice input"}
              style={{
                background: listeningMic ? 'rgba(255,107,107,0.2)' : 'transparent',
                border: 'none',
                color: listeningMic ? '#FF6B6B' : '#A0A0C0',
                cursor: loading ? 'not-allowed' : 'pointer',
                padding: '6px',
                borderRadius: '6px',
                transition: 'all 0.2s'
              }}
            >
              {listeningMic ? <StopCircle size={18} /> : <Mic size={18} />}
            </button>

            {/* LaTeX */}
            <button
              onClick={() => handleSend("Give me LaTeX formula syntax examples")}
              disabled={loading}
              title="Insert LaTeX formula"
              style={{ background: 'transparent', border: 'none', color: '#A0A0C0', cursor: loading ? 'not-allowed' : 'pointer', padding: '6px' }}
            >
              <FunctionSquare size={18} />
            </button>

            <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.08)' }} />

            <input
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend(inputText)}
              placeholder={listeningMic ? "Listening for your question..." : "Ask about Newton's Laws, Chemical reactions, Integration..."}
              disabled={listeningMic}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                color: listeningMic ? '#FF6B6B' : 'white',
                fontSize: '0.88rem',
                outline: 'none'
              }}
            />

            <button
              onClick={() => handleSend(inputText)}
              disabled={!inputText.trim() || loading}
              style={{
                width: '36px', height: '36px',
                background: inputText.trim() && !loading
                  ? 'linear-gradient(135deg, #6C63FF, #00D4AA)'
                  : 'rgba(255,255,255,0.04)',
                border: 'none',
                borderRadius: '50%',
                color: inputText.trim() && !loading ? '#0D0D1A' : '#626280',
                cursor: inputText.trim() && !loading ? 'pointer' : 'not-allowed',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s',
                flexShrink: 0
              }}
            >
              <Send size={15} />
            </button>
          </div>
          <p style={{ fontSize: '0.65rem', color: '#626280', margin: '6px 0 0 12px' }}>
            Enter to send · Ctrl+M for mic · Supports Math, Science & Language switch
          </p>
        </div>

      </div>

      {/* Inline keyframe CSS */}
      <style>{`
        @keyframes typingDot {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-6px); opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
