import React, { useState } from 'react';
import { Database, Upload, Save, CheckCircle, RefreshCw, Trash2, FileText } from 'lucide-react';
import { pipeline, env } from '@xenova/transformers';
env.allowLocalModels = false;
import { supabase } from '../../lib/supabase';
import * as pdfjsLib from 'pdfjs-dist';
import * as mammoth from 'mammoth';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

// Configure PDF.js worker
if (typeof window !== 'undefined' && 'pdfjsWorker' in window === false) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;
}

export default function KnowledgeBase() {
  const [inputText, setInputText] = useState("");
  const [docTitle, setDocTitle] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const chunkText = (text, maxLength = 1000) => {
    // Simple chunking by paragraph or length
    const chunks = [];
    let currentChunk = "";
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    
    for (let sentence of sentences) {
      if (currentChunk.length + sentence.length < maxLength) {
        currentChunk += sentence;
      } else {
        chunks.push(currentChunk.trim());
        currentChunk = sentence;
      }
    }
    if (currentChunk.trim()) {
      chunks.push(currentChunk.trim());
    }
    return chunks;
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsExtracting(true);
    setErrorMsg("");
    setSuccessMessage("");
    setDocTitle(file.name.replace(/\.[^/.]+$/, ""));

    try {
      const buffer = await file.arrayBuffer();
      let extractedText = "";

      if (file.type === "application/pdf") {
        const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          extractedText += content.items.map(item => item.str).join(' ') + '\n';
        }
      } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || file.type === "application/msword") {
        const result = await mammoth.extractRawText({ arrayBuffer: buffer });
        extractedText = result.value;
      } else {
        throw new Error("Unsupported file format. Please upload PDF or DOCX.");
      }

      // Sanitize extracted text to remove null bytes (\u0000) which crash PostgreSQL
      extractedText = extractedText.replace(/\0/g, '');

      setInputText(extractedText);
      setSuccessMessage(`Successfully extracted text from ${file.name}. Review and edit below before uploading.`);
    } catch (err) {
      console.error("Extraction error:", err);
      setErrorMsg("Failed to extract text: " + err.message);
    } finally {
      setIsExtracting(false);
      e.target.value = ""; // Reset file input
    }
  };

  const handleUpload = async () => {
    if (!docTitle.trim() || !inputText.trim()) {
      setErrorMsg("Please provide both a title and some text content.");
      return;
    }
    
    setIsProcessing(true);
    setErrorMsg("");
    setSuccessMessage("");

    try {
      // Load the feature extraction pipeline locally in the browser
      const extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
      
      const chunks = chunkText(inputText, 1500);
      
      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        if (!chunk) continue;
        
        // Generate embedding locally
        const output = await extractor(chunk, { pooling: 'mean', normalize: true });
        const embedding = Array.from(output.data);
        
        // Insert into Supabase
        const { error } = await supabase.from('documents').insert([{
          content: chunk,
          metadata: { title: docTitle, chunkIndex: i, totalChunks: chunks.length },
          embedding: embedding
        }]);
        
        if (error) {
          throw error;
        }
      }
      
      setSuccessMessage(`Successfully uploaded "${docTitle}" and split into ${chunks.length} chunks for AI retrieval!`);
      setInputText("");
      setDocTitle("");
    } catch (err) {
      console.error("Error during upload:", err);
      setErrorMsg("Failed to upload to Knowledge Base: " + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      <div className="glass-panel" style={{ padding: '30px', borderRadius: '24px' }}>
        <h2 style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <Database size={24} color="#6C63FF" />
          RAG Knowledge Base
        </h2>
        <p style={{ color: '#A0A0C0', fontSize: '0.9rem', marginBottom: '24px' }}>
          Upload PDF/DOCX files or paste text from your syllabus. The AI Tutor will read and use this context to answer student doubts accurately.
        </p>

        {errorMsg && (
          <div style={{ background: 'rgba(255, 107, 107, 0.1)', color: '#FF6B6B', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.85rem' }}>
            {errorMsg}
          </div>
        )}
        
        {successMessage && (
          <div style={{ background: 'rgba(0, 212, 170, 0.1)', color: '#00D4AA', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle size={16} /> {successMessage}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <label 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                background: 'rgba(108, 99, 255, 0.1)',
                border: '1px solid rgba(108, 99, 255, 0.4)',
                borderRadius: '8px',
                color: '#6C63FF',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'all 0.3s'
              }}
              className="hover-lift"
            >
              {isExtracting ? <RefreshCw size={18} className="spin" /> : <FileText size={18} />}
              {isExtracting ? 'Extracting Text...' : 'Upload PDF / DOCX'}
              <input 
                type="file" 
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
                onChange={handleFileUpload}
                style={{ display: 'none' }} 
              />
            </label>
            <span style={{ fontSize: '0.8rem', color: '#A0A0C0' }}>Max size: ~5MB. Text will be extracted to the box below.</span>
          </div>

          <div>
            <label style={{ display: 'block', color: 'white', fontSize: '0.85rem', marginBottom: '8px', fontWeight: 'bold' }}>Document Title / Topic</label>
            <input 
              type="text" 
              value={docTitle}
              onChange={(e) => setDocTitle(e.target.value)}
              placeholder="e.g. Thermodynamics Chapter 4 Syllabus"
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                color: 'white',
                fontSize: '0.9rem'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', color: 'white', fontSize: '0.85rem', marginBottom: '8px', fontWeight: 'bold' }}>Content (Review or Paste text here)</label>
            <textarea 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste the detailed course text here, or upload a document to auto-fill..."
              style={{
                width: '100%',
                height: '250px',
                padding: '16px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                color: 'white',
                fontSize: '0.9rem',
                resize: 'vertical',
                lineHeight: '1.5'
              }}
            />
          </div>

          <button 
            onClick={handleUpload}
            disabled={isProcessing}
            className="btn btn-primary btn-glow"
            style={{ 
              alignSelf: 'flex-start', 
              padding: '12px 24px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              opacity: isProcessing ? 0.7 : 1,
              cursor: isProcessing ? 'not-allowed' : 'pointer'
            }}
          >
            {isProcessing ? (
              <><RefreshCw size={18} className="spin" /> Processing AI Embeddings...</>
            ) : (
              <><Upload size={18} /> Upload & Index to Database</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
