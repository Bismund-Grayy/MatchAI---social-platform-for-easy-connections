import React from "react";

// The Banner component provides a visual header for the User Hub.
// It can be used to display announcements or branded imagery.
const Banner = () => {
  return (
    <div style={{ padding: '1.5rem', backgroundColor: '#eef2ff', textAlign: 'center', marginBottom: '1.5rem', borderRadius: '12px', border: '1px solid #c7d2fe' }}>
      <h2 style={{ color: '#4f46e5', margin: 0 }}>Welcome to your MatchAI Hub!</h2>
      <p style={{ color: '#6366f1', marginTop: '0.5rem', fontSize: '0.9rem' }}>Connecting hearts with AI precision.</p>
    </div>
  );
};

export default Banner;