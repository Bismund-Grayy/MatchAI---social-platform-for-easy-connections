"use client";

import React, { useState, useEffect } from "react";
import { supabase, logActivity } from "../../../../utils/supabase";

// Zodiac calculation utility function
const getZodiacSign = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1;

  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Aquarius";
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return "Pisces";
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Aries";
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Taurus";
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Gemini";
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Cancer";
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leo";
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Virgo";
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Libra";
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Scorpio";
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Sagittarius";
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "Capricorn";
  return "";
};

const INTEREST_OPTIONS = [
  "Anime", "Coding", "Farming", "Fiction", "Writing", "Cooking", "Gaming", 
  "History", "Martial Arts", "Movies", "Nature", "Books", "Pets", "Crafting", 
  "Arts", "Singing", "Fitness", "Astrology", "Cars", "Travel", "Sports", 
  "Business", "Life", "Education", "LGBTQ"
];

const RELIGION_OPTIONS = [
  "Christianity", "Islam", "Hinduism", "Buddhism", "Sikhism", "Judaism", 
  "Agnostic", "Atheistic", "Non-religious", "Other"
];

const NATIONALITY_OPTIONS = [
  "American", "British", "Canadian", "Chinese", "French", "German", "Indian", "Japanese", "Other"
];

const ProfileSetup = ({ onComplete }: { onComplete: () => void }) => {
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState<string>("");
  const [formData, setFormData] = useState({
    gender: "",
    show_gender: true,
    birthday: "",
    show_birthday: true,
    zodiac: "",
    show_zodiac: true,
    location_preference: "none",
    nationality: "",
    religion: "",
    interests: {} as Record<string, boolean>,
  });

  useEffect(() => {
    // Initialize interests as false
    const initialInterests: Record<string, boolean> = {};
    INTEREST_OPTIONS.forEach(interest => {
      initialInterests[interest] = false;
    });
    setFormData(prev => ({ ...prev, interests: initialInterests }));

    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        setUsername(user.user_metadata.username || "");
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (formData.birthday) {
      setFormData(prev => ({ ...prev, zodiac: getZodiacSign(formData.birthday) }));
    }
  }, [formData.birthday]);

  const handleInterestChange = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: {
        ...prev.interests,
        [interest]: !prev.interests[interest]
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          gender: formData.gender,
          show_gender: formData.show_gender,
          birthday: formData.birthday,
          show_birthday: formData.show_birthday,
          zodiac: formData.zodiac,
          show_zodiac: formData.show_zodiac,
          location_preference: formData.location_preference,
          nationality: formData.nationality,
          religion: formData.religion,
          interests: formData.interests,
          is_profile_complete: true,
        })
        .eq("id", userId);

      if (updateError) throw updateError;
      onComplete();
    } catch (err: any) {
      setError(err.message || "An error occurred while saving your profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "2rem auto", padding: "2rem", border: "1px solid #e2e8f0", borderRadius: "16px", backgroundColor: "#ffffff", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}>
      <h2 style={{ color: "#4f46e5", marginBottom: "0.5rem" }}>Complete Your Profile</h2>
      <p style={{ fontSize: "0.85rem", color: "#64748b", marginBottom: "1.5rem" }}>Unique ID: {userId}</p>

      {error && (
        <div style={{ padding: "1rem", backgroundColor: "#fee2e2", color: "#b91c1c", borderRadius: "8px", marginBottom: "1.5rem", fontSize: "0.9rem" }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", color: "#334155" }}>Gender:</label>
          <select 
            value={formData.gender} 
            onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))} 
            required 
            style={{ display: 'block', width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '0.5rem' }}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <label style={{ fontSize: "0.9rem", color: "#64748b", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <input type="checkbox" checked={formData.show_gender} onChange={(e) => setFormData(prev => ({ ...prev, show_gender: e.target.checked }))} /> 
            Show gender on profile
          </label>
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", color: "#334155" }}>Birthday:</label>
          <input 
            type="date" 
            value={formData.birthday} 
            onChange={(e) => setFormData(prev => ({ ...prev, birthday: e.target.value }))} 
            required 
            style={{ display: 'block', width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '0.5rem' }} 
          />
          <label style={{ fontSize: "0.9rem", color: "#64748b", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <input type="checkbox" checked={formData.show_birthday} onChange={(e) => setFormData(prev => ({ ...prev, show_birthday: e.target.checked }))} /> 
            Show birthday on profile
          </label>
        </div>

        {formData.birthday && (
          <div style={{ marginBottom: "1.5rem", padding: "1rem", background: "#f8fafc", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
            <p style={{ margin: 0, color: "#334155" }}><strong>Auto Zodiac:</strong> {formData.zodiac}</p>
            <label style={{ fontSize: "0.9rem", color: "#64748b", display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.5rem" }}>
              <input type="checkbox" checked={formData.show_zodiac} onChange={(e) => setFormData(prev => ({ ...prev, show_zodiac: e.target.checked }))} /> 
              Show zodiac on profile
            </label>
          </div>
        )}

        <div style={{ marginBottom: "1.5rem" }}>
          <h3 style={{ fontSize: "1.1rem", color: "#334155", marginBottom: "1rem", borderBottom: "1px solid #e2e8f0", paddingBottom: "0.5rem" }}>Interests</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', backgroundColor: "#f8fafc", padding: "1rem", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
            {INTEREST_OPTIONS.map((interest) => (
              <label key={interest} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: "0.9rem", color: "#475569", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={formData.interests[interest] || false}
                  onChange={() => handleInterestChange(interest)}
                  style={{ width: "16px", height: "16px", cursor: "pointer" }}
                />
                {interest}
              </label>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", color: "#334155" }}>Location Preference:</label>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.9rem", color: "#64748b", cursor: "pointer" }}>
              <input type="radio" value="city" checked={formData.location_preference === 'city'} onChange={(e) => setFormData(prev => ({ ...prev, location_preference: e.target.value }))} /> 
              Show City
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.9rem", color: "#64748b", cursor: "pointer" }}>
              <input type="radio" value="area" checked={formData.location_preference === 'area'} onChange={(e) => setFormData(prev => ({ ...prev, location_preference: e.target.value }))} /> 
              Show Area
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.9rem", color: "#64748b", cursor: "pointer" }}>
              <input type="radio" value="none" checked={formData.location_preference === 'none'} onChange={(e) => setFormData(prev => ({ ...prev, location_preference: e.target.value }))} /> 
              Don't Show
            </label>
          </div>
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", color: "#334155" }}>Nationality:</label>
          <input 
            type="text" 
            value={formData.nationality} 
            onChange={(e) => setFormData(prev => ({ ...prev, nationality: e.target.value }))} 
            placeholder="e.g. Filipino"
            style={{ display: 'block', width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} 
          />
        </div>

        <div style={{ marginBottom: "2rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", color: "#334155" }}>Religion:</label>
          <input 
            type="text" 
            value={formData.religion} 
            onChange={(e) => setFormData(prev => ({ ...prev, religion: e.target.value }))} 
            placeholder="e.g. Christian"
            style={{ display: 'block', width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} 
          />
        </div>

        <button 
          type="submit" 
          disabled={loading} 
          style={{ 
            width: '100%', 
            padding: '1rem', 
            background: loading ? '#94a3b8' : '#4f46e5', 
            color: 'white', 
            border: 'none', 
            borderRadius: '12px', 
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '1rem',
            fontWeight: '600',
            transition: 'background 0.2s'
          }}
        >
          {loading ? "Saving your profile..." : "Complete Setup"}
        </button>
      </form>
    </div>
  );
};

export default ProfileSetup;
