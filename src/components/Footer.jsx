import React from 'react';

export default function Footer({ navigate }) {
  return (
    <footer style={{
      background: '#070712',
      borderTop: '1px solid rgba(255, 255, 255, 0.06)',
      padding: '80px 5vw 40px',
      position: 'relative',
      zIndex: 10,
      fontFamily: "'Inter', sans-serif"
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        gap: '40px',
        marginBottom: '60px'
      }} className="grid-footer">
        {/* Column 1 - Brand */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div 
            onClick={() => navigate('landing')} 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer'
            }}
          >
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
            <span style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '20px',
              fontWeight: '800',
              color: 'white'
            }}>Olympiz<span style={{ color: '#00D4AA' }}>.ai</span></span>
          </div>
          <p style={{
            fontSize: '0.9rem',
            color: '#A0A0C0',
            maxWidth: '280px',
            lineHeight: '1.6'
          }}>
            AI-first learning ecosystem for the next generation of Indian students. Learn smarter, grow faster.
          </p>
          <div style={{ display: 'flex', gap: '16px', marginTop: '10px' }}>
            {['twitter', 'instagram', 'youtube', 'linkedin', 'discord'].map((soc) => (
              <span 
                key={soc} 
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.85rem',
                  color: '#A0A0C0',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(108, 99, 255, 0.15)';
                  e.currentTarget.style.borderColor = '#6C63FF';
                  e.currentTarget.style.color = '#white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                  e.currentTarget.style.color = '#A0A0C0';
                }}
              >
                {soc[0]}
              </span>
            ))}
          </div>
        </div>

        {/* Column 2 - Platform */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h4 style={{ color: 'white', fontSize: '0.95rem', fontWeight: '600' }}>Platform</h4>
          {['Features', 'Pricing', 'AI Tools', 'Mobile App', 'Integrations'].map((link) => (
            <span key={link} style={{ color: '#A0A0C0', fontSize: '0.85rem', cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = 'white'} onMouseLeave={(e) => e.target.style.color = '#A0A0C0'}>{link}</span>
          ))}
        </div>

        {/* Column 3 - For */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h4 style={{ color: 'white', fontSize: '0.95rem', fontWeight: '600' }}>For</h4>
          {['Students', 'Educators', 'Parents', 'Institutions', 'Schools'].map((link) => (
            <span key={link} style={{ color: '#A0A0C0', fontSize: '0.85rem', cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = 'white'} onMouseLeave={(e) => e.target.style.color = '#A0A0C0'}>{link}</span>
          ))}
        </div>

        {/* Column 4 - Company */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h4 style={{ color: 'white', fontSize: '0.95rem', fontWeight: '600' }}>Company</h4>
          {['About Us', 'Blog', 'Careers', 'Press', 'Contact'].map((link) => (
            <span key={link} style={{ color: '#A0A0C0', fontSize: '0.85rem', cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = 'white'} onMouseLeave={(e) => e.target.style.color = '#A0A0C0'}>{link}</span>
          ))}
        </div>

        {/* Column 5 - Legal */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h4 style={{ color: 'white', fontSize: '0.95rem', fontWeight: '600' }}>Legal</h4>
          {['Privacy Policy', 'Terms of Service', 'Refund Policy', 'Cookie Policy'].map((link) => (
            <span key={link} style={{ color: '#A0A0C0', fontSize: '0.85rem', cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = 'white'} onMouseLeave={(e) => e.target.style.color = '#A0A0C0'}>{link}</span>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        paddingTop: '30px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px',
        fontSize: '0.85rem',
        color: '#626280'
      }} className="footer-bottom-flex">
        <span>© 2026 Olympiz.ai. All rights reserved.</span>
        <span>Made with ❤️ in India.</span>
      </div>
    </footer>
  );
}
