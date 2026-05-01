"use client";

import React, { useState, useEffect } from "react";
import { supabase, logActivity } from "../../../../utils/supabase";

const Feed = () => {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const fetchProfiles = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);

      if (user) {
        const { data: profilesData } = await supabase
          .from("profiles")
          .select("*")
          .neq("id", user.id);

        const { data: friendshipsData } = await supabase
          .from("friendships")
          .select("user_id_1, user_id_2, status")
          .or(`user_id_1.eq.${user.id},user_id_2.eq.${user.id}`);

        const friendIds = (friendshipsData || []).map((f) =>
          f.user_id_1 === user.id ? f.user_id_2 : f.user_id_1
        );

        const filtered = (profilesData || []).filter(
          (p) => !friendIds.includes(p.id)
        );

        setProfiles(filtered);
      }

      setLoading(false);
    };

    fetchProfiles();
  }, []);

  const handleAddFriend = async (profileId: string) => {
    if (!currentUser) return;

    const { error } = await supabase
      .from("friendships")
      .insert([
        {
          user_id_1: currentUser.id,
          user_id_2: profileId,
          status: "pending",
        },
      ]);

    if (!error) {
      await logActivity(currentUser.id, "friend_request_sent", {
        target_id: profileId,
      });
    }
  };

  if (loading) {
    return (
      <div className="text-center text-gray-500 py-10">
        Loading profiles...
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-indigo-600">Discover</h2>
        <p className="text-gray-500">Find people you might connect with</p>
      </div>

      {/* Grid */}
      {profiles.length === 0 ? (
        <p className="text-gray-500">No other users found.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {profiles.map((profile) => (
            <div
              key={profile.id}
              className="bg-white rounded-2xl shadow-sm border hover:shadow-md transition overflow-hidden"
            >
              {/* Profile header / avatar placeholder */}
              <div className="h-32 bg-gradient-to-r from-indigo-400 to-purple-400"></div>

              <div className="p-4">
                {/* Name */}
                <h3 className="text-lg font-semibold">
                  {profile.username || "Anonymous User"}
                </h3>

                {/* Tags */}
                <div className="mt-2 space-y-1 text-sm text-gray-500">
                  <p>
                    <span className="font-medium text-gray-700">Gender:</span>{" "}
                    {profile.gender || "Not specified"}
                  </p>
                  <p>
                    <span className="font-medium text-gray-700">Zodiac:</span>{" "}
                    {profile.zodiac || "Not specified"}
                  </p>
                </div>

                {/* Action button */}
                <button
                  onClick={() => handleAddFriend(profile.id)}
                  className="mt-4 w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-xl transition"
                >
                  Add Friend
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Feed;