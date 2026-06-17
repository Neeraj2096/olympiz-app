import React, { useState, useEffect } from 'react';
import { Flame } from 'lucide-react';

export default function Navbar({ currentPage, navigate, isAuthenticated, user, logout }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (anchor) => {
    if (currentPage !== 'landing') {
      navigate('landing');
      setTimeout(() => {
        const element = document.querySelector(anchor);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const element = document.querySelector(anchor);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      height: '76px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 5vw',
      transition: 'all 0.3s ease',
      background: scrolled ? 'rgba(13, 13, 26, 0.75)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid transparent',
      boxShadow: scrolled ? '0 10px 30px rgba(0, 0, 0, 0.3)' : 'none'
    }}>
      {/* Logo */}
      <div 
        onClick={() => navigate('landing')} 
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer',
          userSelect: 'none'
        }}
      >
        <div style={{
          background: 'linear-gradient(135deg, #6C63FF 0%, #00D4AA 100%)',
          borderRadius: '10px',
          width: '38px',
          height: '38px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(108, 99, 255, 0.3)'
        }}>
          <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#0D0D1A' }}>O</span>
        </div>
        <span style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: '22px',
          fontWeight: '800',
          background: 'linear-gradient(135deg, #FFFFFF 30%, #A0A0C0 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '-0.5px'
        }}>
          Olympiz<span style={{
            background: 'linear-gradient(135deg, #6C63FF 0%, #00D4AA 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>.ai</span>
        </span>
      </div>

      {/* Center Links (Only on Landing/Signup) */}
      {!isAuthenticated && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '32px',
        }} className="nav-links-desktop">
          <span onClick={() => handleNavClick('#features')} style={{ color: '#A0A0C0', fontWeight: '500', fontSize: '0.95rem', cursor: 'pointer', transition: 'color 0.2s' }}>Features</span>
          <span onClick={() => handleNavClick('#how-it-works')} style={{ color: '#A0A0C0', fontWeight: '500', fontSize: '0.95rem', cursor: 'pointer', transition: 'color 0.2s' }}>How it Works</span>
          <span onClick={() => handleNavClick('#educators')} style={{ color: '#A0A0C0', fontWeight: '500', fontSize: '0.95rem', cursor: 'pointer', transition: 'color 0.2s' }}>For Educators</span>
          <span onClick={() => handleNavClick('#pricing')} style={{ color: '#A0A0C0', fontWeight: '500', fontSize: '0.95rem', cursor: 'pointer', transition: 'color 0.2s' }}>Pricing</span>
        </div>
      )}

      {/* Authenticated Links (Quick Jumps) */}
      {isAuthenticated && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
        }}>
          <button 
            onClick={() => {
              if (user.role === 'student') navigate('dashboard-student');
              else if (user.role === 'parent') navigate('dashboard-parent');
              else navigate('dashboard-educator');
            }}
            className="btn btn-secondary btn-pill"
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
          >
            Go to Workspace
          </button>
        </div>
      )}

      {/* CTA Buttons / Profile Info */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
      }}>
        {isAuthenticated ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {user.role === 'student' && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(255, 179, 71, 0.1)',
                border: '1px solid rgba(255, 179, 71, 0.3)',
                padding: '6px 12px',
                borderRadius: '50px',
                fontSize: '0.85rem',
                fontWeight: '600',
                color: '#FFB347'
              }}>
                <Flame size={16} fill="#FFB347" />
                <span>{user.streak} Days</span>
              </div>
            )}
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '6px 14px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '50px',
            }}>
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: user.role === 'student' ? 'var(--primary-color)' : 'var(--secondary-color)',
                color: '#0D0D1A',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.85rem'
              }}>
                {user.name ? user.name[0].toUpperCase() : 'U'}
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: '500', color: 'white' }}>{user.name.split(' ')[0]}</span>
            </div>

            <button onClick={logout} className="btn btn-ghost" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
              Log Out
            </button>
          </div>
        ) : (
          <>
            <button 
              onClick={() => navigate('signup')} 
              className="btn btn-ghost"
              style={{ fontWeight: '600' }}
            >
              Log In
            </button>
            <button 
              onClick={() => navigate('signup')} 
              className="btn btn-primary btn-glow btn-pill"
              style={{ padding: '10px 22px', fontSize: '0.9rem' }}
            >
              Start Free
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
