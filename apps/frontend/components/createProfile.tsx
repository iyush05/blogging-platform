'use client'

import React, { useState, useEffect } from 'react';
import { Search, User, UserPlus, X, Users } from 'lucide-react';
import axios from 'axios'
import { BACKEND_URL } from '@/config';
import { useAuth, useUser } from '@clerk/nextjs';

const ProfileCardDialog = () => {
  // Control variable - set this to true to show the dialog
  const [showDialog, setShowDialog] = useState(true);
  const { getToken } = useAuth();
  // User profile state
  const [userProfile, setUserProfile] = useState({
    name: '',
    username: '',
    bio: ''
  });
  
  // Search and users state
  const [searchQuery, setSearchQuery] = useState('');
  const [allUsers, setAllUsers] = useState([
    { id: 1, name: 'Alice Johnson', username: '@alice_j', avatar: '👩‍💻', followers: 1234, isFollowing: false },
    { id: 2, name: 'Bob Smith', username: '@bob_dev', avatar: '👨‍🎨', followers: 856, isFollowing: false },
    { id: 3, name: 'Carol Davis', username: '@carol_design', avatar: '👩‍🎨', followers: 2341, isFollowing: true },
    { id: 4, name: 'David Wilson', username: '@david_code', avatar: '👨‍💼', followers: 567, isFollowing: false },
    { id: 5, name: 'Emma Brown', username: '@emma_ux', avatar: '👩‍🔬', followers: 1789, isFollowing: false },
    { id: 6, name: 'Frank Miller', username: '@frank_photo', avatar: '📸', followers: 3456, isFollowing: false }
  ]);
  
  const [filteredUsers, setFilteredUsers] = useState(allUsers);
  const { user } = useUser();
  const email = user?.emailAddresses[0].emailAddress;
  const imageUrl = user?.imageUrl;

  // Filter users based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredUsers(allUsers);
    } else {
      const filtered = allUsers.filter(user => 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.username.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, allUsers]);

  // Handle follow/unfollow
  const handleFollowToggle = async (userId: any) => {
    try {
      // Simulate API call with axios
      // await axios.post(`/api/users/${userId}/follow`);
      
      setAllUsers(prev => prev.map(user => 
        user.id === userId 
          ? { ...user, isFollowing: !user.isFollowing, followers: user.isFollowing ? user.followers - 1 : user.followers + 1 }
          : user
      ));
    } catch (error) {
      console.error('Error toggling follow:', error);
    }
  };

  // Handle profile update
  const handleProfileUpdate = async () => {
    const token = await getToken();
    if (!userProfile.name.trim() || !userProfile.username.trim()) {
      alert('Please fill in both name and username');
      return;
    }
    
    try {
      // Simulate API call with axios
      // await axios.put('/api/profile', userProfile);
      const update = await axios.post(`${BACKEND_URL}/user/create`, {
        name: userProfile.name,
        username: userProfile.username,
        bio: userProfile.bio,
        email: email,
        imageUrl: imageUrl
      }, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
      console.log('Profile updated:', update);
      alert('Profile updated successfully!');
      setShowDialog(false)
      return null
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      window.location.reload()
    }
  };


if(!showDialog) {
  return null
}

  return ( <>
    
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with blur */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-md transition-opacity duration-300"
        
      />
      
      {/* Dialog Card */}
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="relative bg-blue-500 p-6 text-white">
          {/* <button
            onClick={() => setShowDialog(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors duration-200"
          >
            <X size={20} />
          </button> */}
          
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl">
              <User size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Profile</h1>
              <p className="text-white/80">Manage your profile and discover users</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Profile Section */}
          <div className="bg-white/50 rounded-2xl p-6 border border-white/30">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <User size={20} className="text-blue-500" />
              Your Profile
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={userProfile.name}
                  onChange={(e) => setUserProfile(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 transition-all duration-200 bg-white/70"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                <input
                  type="text"
                  value={userProfile.username}
                  onChange={(e) => setUserProfile(prev => ({ ...prev, username: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-transparent transition-all duration-200 bg-white/70"
                  placeholder="@username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                <input
                  type="text"
                  value={userProfile.bio}
                  onChange={(e) => setUserProfile(prev => ({ ...prev, bio: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-transparent transition-all duration-200 bg-white/70"
                  placeholder="Write about yourself"
                />
              </div>
            </div>
            <button
              onClick={handleProfileUpdate}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-all duration-200 font-medium"
            >
              Update Profile
            </button>
          </div>

          {/* Search Section */}
          <div className="bg-white/50 rounded-2xl p-6 border border-white/30">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Users size={20} className="text-purple-500" />
              Discover Users
            </h2>
            
            {/* Search Bar */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white/70"
                placeholder="Search for users..."
              />
            </div>

            {/* Users List */}
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {filteredUsers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <User size={48} className="mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">User does not exist</p>
                  <p className="text-sm">Try searching for a different name or username</p>
                </div>
              ) : (
                filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 bg-white/40 rounded-xl border border-white/30 hover:bg-white/60 transition-all duration-200"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center text-white text-lg">
                        {user.avatar}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{user.name}</h3>
                        <p className="text-gray-600 text-sm">{user.username}</p>
                        <p className="text-gray-500 text-xs">{user.followers.toLocaleString()} followers</p>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleFollowToggle(user.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                        user.isFollowing
                          ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          : 'bg-blue-600 text-white hover:bg-blue-500 hover:to-purple-600'
                      }`}
                    >
                      <UserPlus size={16} />
                      {user.isFollowing ? 'Connected' : 'Connect'}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
  );
};

export default ProfileCardDialog;