'use client'
import React, { useState } from 'react';
import { 
  Search, 
  Home, 
  Users, 
  Briefcase, 
  MessageCircle, 
  Bell, 
  User,
  Grid3X3,
  ChevronDown
} from 'lucide-react';
import { SignedIn, UserButton } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

const Navbar = () => {
  const [searchValue, setSearchValue] = useState('');
  const [activeTab, setActiveTab] = useState('home');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showBusinessMenu, setShowBusinessMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    {
      id: 1,
      type: 'connection',
      avatar: 'imageUrl',
      title: 'Ayush accepted req',
      time: '2 hours ago',
      unread: true
    },
    {
      id: 2,
      type: 'like',
      avatar: 'imageUrl',
      title: 'hey',
      time: '4 hours ago',
      unread: true
    },
  ];

  const navItems = [
    { id: 'home', icon: Home, label: 'Home', active: true },
    { id: 'network', icon: Users, label: 'My Network', count: 12 },
    { id: 'notifications', icon: Bell, label: 'Notifications', count: 5 },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">

          <div className="flex items-center space-x-4">

            <div className="flex-shrink-0">
            
              <img src="https://gdgakgec.org/static/media/GDG%20logo.79a234d6b6b5e51e6958.jpeg" alt="logo" className='w-52 h-8' />
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-64 pl-10 pr-4 py-2 bg-blue-50 border border-transparent rounded-md text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white"
              />
            </div>
          </div>

          <div className="flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === 'notifications') {
                      setShowNotifications(!showNotifications);
                    } else {
                      setActiveTab(item.id);
                      setShowNotifications(false);
                    }
                  }}
                  className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-md transition-colors duration-200 relative group ${
                    isActive || (item.id === 'notifications' && showNotifications)
                      ? 'text-gray-900' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <div className="relative">
                    <Icon className="h-5 w-5" />
                    {item.count && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                        {item.count}
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-medium">{item.label}</span>
                  {(isActive || (item.id === 'notifications' && showNotifications)) && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 rounded-full"></div>
                  )}
                </button>
              );
            })}
            
            {showNotifications && (
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                    <button className="text-blue-600 text-sm hover:underline">Mark all as read</button>
                  </div>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-b-0 ${
                        notification.unread ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                          notification.type === 'connection' ? 'bg-blue-500' :
                          notification.type === 'like' ? 'bg-red-500' :
                          notification.type === 'job' ? 'bg-green-500' :
                          notification.type === 'comment' ? 'bg-purple-500' :
                          'bg-orange-500'
                        }`}>
                          {notification.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900 leading-relaxed">
                            {notification.title}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                        </div>
                        {notification.unread && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-3 border-t border-gray-100 text-center">
                  <button className="text-blue-600 text-sm hover:underline">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">

            <div className="relative">
              <SignedIn>
                <UserButton />
              </SignedIn>
              
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">John Doe</p>
                        <p className="text-sm text-gray-500">Software Engineer</p>
                      </div>
                    </div>
                  </div>
                  <div className="py-1">
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">View Profile</a>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings & Privacy</a>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Help</a>
                    <hr className="my-1" />
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Sign Out</a>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
      
      {(showProfileMenu || showBusinessMenu || showNotifications) && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowProfileMenu(false);
            setShowBusinessMenu(false);
            setShowNotifications(false);
          }}
        />
      )}
    </nav>
  );
};

export default Navbar;