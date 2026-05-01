import React, { useEffect, useState } from "react";
import { supabase } from "../../../../utils/supabase";
import ProfileSetup from "./profile-setup";
// The Profile component allows users to view and update their personal information.
// It interacts with the 'profiles' table in Supabase.
const Profile = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showProfileSetup, setShowProfileSetup] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (!error) {
          setProfile(data);
        }
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);

  if (loading) return <p>Loading profile...</p>;
  if (!profile) return <p>Profile not found.</p>;

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "1rem" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ color: "#4f46e5", margin: 0 }}>Your Profile</h2>
        <button 
          style={{ padding: '0.6rem 1.2rem', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', transition: 'all 0.2s' }}
          onClick={() => alert("Edit profile functionality coming soon!")}
        >
          Edit Profile
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {/* Identity Card */}
        <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: '1.1rem', color: '#334155', marginBottom: '1rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>Identity</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <p style={{ margin: 0 }}><strong>Username:</strong> <span style={{ color: '#475569' }}>{profile.username}</span></p>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}><strong>ID:</strong> {profile.id}</p>
            {profile.show_gender && (
              <p style={{ margin: 0 }}><strong>Gender:</strong> <span style={{ color: '#475569' }}>{profile.gender}</span></p>
            )}
            {profile.nationality && (
              <p style={{ margin: 0 }}><strong>Nationality:</strong> <span style={{ color: '#475569' }}>{profile.nationality}</span></p>
            )}
            {profile.religion && (
              <p style={{ margin: 0 }}><strong>Religion:</strong> <span style={{ color: '#475569' }}>{profile.religion}</span></p>
            )}
          </div>
        </div>

        {/* Life & Zodiac Card */}
        <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: '1.1rem', color: '#334155', marginBottom: '1rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>Life Details</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {profile.show_birthday && (
              <p style={{ margin: 0 }}><strong>Birthday:</strong> <span style={{ color: '#475569' }}>{profile.birthday}</span></p>
            )}
            {profile.show_zodiac && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <p style={{ margin: 0 }}><strong>Zodiac:</strong> <span style={{ color: '#4f46e5', fontWeight: '600' }}>{profile.zodiac}</span></p>
              </div>
            )}
            <p style={{ margin: 0 }}><strong>Location:</strong> <span style={{ color: '#475569' }}>{profile.location_preference === 'none' ? 'Hidden' : `Showing ${profile.location_preference}`}</span></p>
            <p style={{ margin: 0 }}><strong>Last Active:</strong> <span style={{ color: '#475569' }}>{new Date(profile.last_seen_at).toLocaleString()}</span></p>
          </div>
        </div>

        {/* Interests Card */}
        <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', gridColumn: '1 / -1' }}>
          <h3 style={{ fontSize: '1.1rem', color: '#334155', marginBottom: '1rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>Interests & Passion</h3>
          {profile.interests && profile.interests.length > 0 ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
              {profile.interests.map((interest: any, index: number) => (
                <div key={index} style={{ backgroundColor: '#eef2ff', padding: '0.75rem 1.25rem', borderRadius: '12px', border: '1px solid #c7d2fe' }}>
                  <span style={{ fontWeight: '600', color: '#4f46e5' }}>{interest.name}</span>
                  <div style={{ fontSize: '0.75rem', color: '#6366f1', marginTop: '0.25rem' }}>
                    Level: {'★'.repeat(interest.level)}{'☆'.repeat(5-interest.level)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>No interests added yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;