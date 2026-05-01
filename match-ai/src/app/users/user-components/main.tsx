"use client";

import React, { useState, useEffect } from "react";
import ChatInterface from "./chat-interface";
import Feed from "./feed";
import FriendList from "./friend-list";
import Logout from "./logout";
import MessageRequest from "./message-request";
import Profile from "./profile";
import ProfileSetup from "./profile-setup";
import { supabase } from "../../../../utils/supabase";

type ActiveView = 'feed' | 'profile' | 'friends' | 'messages' | 'chat' | 'setup';

export default function Main() {
  const [activeView, setActiveView] = useState<ActiveView>('feed');
  const [user, setUser] = useState<any>(null);
  const [isProfileComplete, setIsProfileComplete] = useState<boolean | null>(null);
  const [selectedChatFriend, setSelectedChatFriend] = useState<any>(null);

  useEffect(() => {
    const channel = supabase.channel('online-users');

    channel
      .on('presence', { event: 'sync' }, () => {
        console.log('Online users synced:', channel.presenceState());
      })
      .subscribe(async (status: string) => {
        if (status === 'SUBSCRIBED') {
          const { data: { user: currentUser } } = await supabase.auth.getUser();
          if (currentUser) {
            await channel.track({
              online_at: new Date().toISOString(),
              user_id: currentUser.id,
            });

            await supabase
              .from('profiles')
              .update({ last_seen_at: new Date().toISOString() })
              .eq('id', currentUser.id);
          }
        }
      });

    const getUser = async () => {
      try {
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        setUser(currentUser);

        if (currentUser) {
          // Check if user has completed their profile setup
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('is_profile_complete')
            .eq('id', currentUser.id)
            .single();
          
          if (profileError) throw profileError;

          if (profile && !profile.is_profile_complete) {
            setActiveView('setup');
            setIsProfileComplete(false);
          } else {
            setIsProfileComplete(true);
          }
        }
      } catch (error: any) {
        console.error("Error fetching user or profile:", error.message);
        // Fallback or error handling
        setIsProfileComplete(true); // Allow entry but might have missing data
      }
    };

    getUser();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const renderContent = () => {
    if (activeView === 'setup') {
      return (
        <ProfileSetup
          onComplete={() => {
            setIsProfileComplete(true);
            setActiveView('feed');
          }}
        />
      );
    }

    switch (activeView) {
      case 'feed':
        return <Feed />;
      case 'profile':
        return <Profile />;
      case 'friends':
        return (
          <FriendList
            onChat={(friend) => {
              setSelectedChatFriend(friend);
              setActiveView('chat');
            }}
          />
        );
      case 'messages':
        return <MessageRequest />;
      case 'chat':
        return (
          <ChatInterface
            friend={selectedChatFriend}
            onBack={() => setActiveView('friends')}
          />
        );
      default:
        return <Feed />;
    }
  };

  const navItemClass = (view: ActiveView) =>
    `px-3 py-2 rounded-lg cursor-pointer transition ${
      activeView === view
        ? "bg-indigo-100 text-indigo-600 font-semibold"
        : "hover:bg-gray-100 text-gray-600"
    }`;

  return (
    <div className="h-screen flex flex-col bg-gray-100">

      {/* 🔝 Header */}
      <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-indigo-600">
          MatchAI
        </h1>
        <Logout />
      </header>

      <div className="flex flex-1 overflow-hidden">

        {/* 📌 Sidebar */}
        {isProfileComplete && (
          <aside className="w-64 bg-white border-r p-4 hidden md:block">
            <h3 className="text-sm font-semibold text-gray-400 mb-4">
              Navigation
            </h3>

            <ul className="space-y-2">
              <li className={navItemClass('feed')} onClick={() => setActiveView('feed')}>
                Feed
              </li>
              <li className={navItemClass('profile')} onClick={() => setActiveView('profile')}>
                Profile
              </li>
              <li className={navItemClass('friends')} onClick={() => setActiveView('friends')}>
                Friends
              </li>
              <li className={navItemClass('messages')} onClick={() => setActiveView('messages')}>
                Requests
              </li>
            </ul>
          </aside>
        )}

        {/* 📄 Main Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {isProfileComplete === null ? (
            <div className="text-center text-gray-500">
              Loading profile...
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm p-6 min-h-full">
              {renderContent()}
            </div>
          )}
        </main>

      </div>
    </div>
  );
}