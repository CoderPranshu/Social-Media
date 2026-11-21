import React, { useState, useRef, useEffect } from 'react';
// 1. Import Link and usePage from Inertia instead of native browser properties
import { Link, usePage } from '@inertiajs/react';
import { Search, Home, Users, Bell, ChevronDown, Menu, X, Settings, LogOut, User } from 'lucide-react';

interface NavbarProps {
  onSearchChange?: (value: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onSearchChange }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 2. Use Inertia page hook to track the active URL pathway cleanly
  const { url, props } = usePage<any>();
  const currentPath = url;
  const user = props.auth?.user;
  const unreadCount = props.auth?.unread_notifications_count ?? 0;

  const navItems = [
    { id: 'Home', label: 'Home', icon: Home, href: '/dashboard' },
    { id: 'People', label: 'People', icon: Users, href: '/followersfollowing' },
    { id: 'Notifications', label: 'Notifications', icon: Bell, badge: unreadCount > 0 ? unreadCount : undefined, href: '/notification' },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (onSearchChange) {
      onSearchChange(value);
    }
  };

  return (
    <nav className="w-full bg-white dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800 sticky top-0 z-50 flex flex-col justify-center items-center px-4 transition-colors">
      
      {/* ========================================================================= */}
      {/* DESKTOP NAVBAR VIEW (md and up)                                           */}
      {/* ========================================================================= */}
      <div className="hidden md:flex w-full max-w-[1340px] items-center justify-between h-16 gap-4 relative">
        {/* Left Branding & Search */}
        <div className="flex items-center flex-1 max-w-[480px]">
         
          <Link href="/dashboard" className="flex items-center space-x-2 text-[#b46d23] text-lg shrink-0 font-black tracking-tight select-none mr-4 hover:opacity-90 transition-opacity no-underline">
            <span className="w-7 h-7 rounded-lg bg-[#b46d23] text-white flex items-center justify-center text-sm font-black shadow-sm">P</span>
            <span className="text-zinc-950 dark:text-white font-extrabold tracking-tight text-base">PredictionHub</span>
          </Link>

          <div className="relative flex-1 max-w-xs">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search predictions, topics, people..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full h-9 pl-9 pr-4 bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/80 rounded-xl text-xs font-medium text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 outline-none transition-all duration-150 focus:bg-white dark:focus:bg-zinc-800 focus:ring-1 focus:ring-[#b46d23] focus:border-[#b46d23]"
            />
          </div>
        </div>

        {/* Right Navigation & Profile Options */}
        <div className="flex items-center h-full shrink-0 space-x-2" ref={dropdownRef}>
          <ul className="flex items-center h-full m-0 p-0 list-none space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.href;
              
              return (
                <li key={item.id} className="relative h-full flex items-center">
                  
                  <Link
                    href={item.href}
                    className={`flex flex-col items-center justify-center min-w-[76px] h-[54px] rounded-xl bg-transparent border-none cursor-pointer transition-all duration-150 px-1 group text-center no-underline ${isActive ? 'text-[#b46d23]' : 'text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'}`}
                  >
                    <div className="relative flex items-center justify-center">
                      <Icon className={`w-5 h-5 transition-transform duration-150 group-hover:scale-105 ${isActive ? 'stroke-[2.25]' : 'stroke-[1.75]'}`} />
                      {item.badge && (
                        <span className="absolute -top-1 -right-1.5 bg-[#cc1016] text-white text-[9px] font-extrabold px-1 min-w-[14px] h-3.5 rounded-full flex items-center justify-center border border-white dark:border-zinc-900 shadow-sm animate-pulse">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] tracking-tight mt-1 font-bold transition-colors">{item.label}</span>
                    {isActive && <div className="absolute bottom-[-5px] left-3 right-3 h-[2.5px] bg-[#b46d23] rounded-full" />}
                  </Link>
                </li>
              );
            })}

            <div className="h-7 w-[1px] bg-zinc-100 dark:bg-zinc-800 mx-2" />

            {/* Profile Menu Trigger */}
            <li className="h-full flex items-center relative" >
              <button 
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex flex-col items-center justify-center min-w-[60px] h-[54px] text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 bg-transparent border-none cursor-pointer rounded-xl transition group text-center no-underline focus:outline-none"
              >
                <div className="w-6 h-6 rounded-full overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-sm shrink-0 transition group-hover:border-zinc-300 flex items-center justify-center text-[10px] font-bold text-zinc-600 dark:text-zinc-300">
                  {user?.avatar_path ? (
                    <img src={user.avatar_path} alt={user?.name ?? 'Me'} className="w-full h-full object-cover" />
                  ) : (
                    <span>{(user?.name ?? 'U').slice(0, 2).toUpperCase()}</span>
                  )}
                </div>
                <span className="text-[10px] font-bold tracking-tight mt-1 flex items-center select-none">
                  Me <ChevronDown className={`w-3 h-3 ml-0.5 opacity-70 group-hover:opacity-100 transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                </span>
              </button>

              {isProfileDropdownOpen && (
                <div className="absolute right-0 top-[58px] w-48 bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-xl shadow-xl py-1.5 z-50 text-left animate-in fade-in slide-in-from-top-2 duration-150">
                  {/* Changed dropdown items to Inertia <Link> components */}
                  <Link href="/profile" className="w-full px-3 py-2 text-xs font-bold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700/50 hover:text-[#b46d23] flex items-center gap-2 no-underline transition-colors"><User className="w-3.5 h-3.5" /> View Profile</Link>
                  <Link href="/notificationsetting" className="w-full px-3 py-2 text-xs font-bold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700/50 hover:text-[#b46d23] flex items-center gap-2 no-underline transition-colors"><Settings className="w-3.5 h-3.5" /> Notification Settings</Link>
                  <Link href="/settings/profile" className="w-full px-3 py-2 text-xs font-bold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700/50 hover:text-[#b46d23] flex items-center gap-2 no-underline transition-colors"><Settings className="w-3.5 h-3.5" /> Profile Settings</Link>
                  <div className="h-[1px] bg-zinc-100 dark:bg-zinc-700 my-1" />
                  
                  {/* Note: If your Sign Out route utilizes standard dynamic Laravel POST requests, you can add method="post" as an attribute to this Link descriptor component */}
                  <Link href="/logout" method="post" as="button" className="w-full px-3 py-2 text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-2 transition-colors border-none bg-transparent cursor-pointer text-left"><LogOut className="w-3.5 h-3.5" /> Sign Out</Link>
                </div>
              )}
            </li>
          </ul>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MOBILE NAVBAR VIEW                                                        */}
      {/* ========================================================================= */}
      <div className="flex md:hidden w-full items-center justify-between h-14 gap-3">
        {/* Far Left Avatar Toggle */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="w-8 h-8 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-700 shadow-sm shrink-0 outline-none focus:ring-2 focus:ring-[#b46d23]/40 flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 text-xs font-bold text-zinc-600 dark:text-zinc-300"
        >
          {user?.avatar_path ? (
            <img src={user.avatar_path} alt="Toggle Menu" className="w-full h-full object-cover" />
          ) : (
            <span>{(user?.name ?? 'U').slice(0, 2).toUpperCase()}</span>
          )}
        </button>

        {/* Center Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full h-9 pl-9 pr-4 bg-zinc-100 dark:bg-zinc-800 border-none rounded-md text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 outline-none"
          />
        </div>

        {/* Far Right Trigger */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-1 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 outline-none"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* ========================================================================= */}
      {/* MOBILE DRAWER EXTENSION                                                   */}
      {/* ========================================================================= */}
      {isMobileMenuOpen && (
        <div className="w-full md:hidden pb-4 pt-2 border-t border-zinc-100 dark:border-zinc-800 space-y-4 text-left animate-in slide-in-from-top duration-200">
          <div className="px-1 py-1">
            <p className="text-xs font-extrabold text-[#b46d23] uppercase tracking-wider mb-2 px-3">Navigation</p>
            <div className="flex flex-col space-y-0.5">
              {navItems.map((item) => (
                
                <Link
                  key={item.id}
                  href={item.href}
                  className={`px-3 py-2.5 rounded-xl text-xs font-bold no-underline flex items-center gap-3 transition-colors ${
                    currentPath === item.href 
                      ? 'bg-[#faf1e6] dark:bg-zinc-800 text-[#b46d23]' 
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="h-[1px] bg-zinc-100 dark:bg-zinc-800 mx-3" />

          <div className="px-1">
            <p className="text-xs font-extrabold text-zinc-400 uppercase tracking-wider mb-2 px-3">Account Settings</p>
            <div className="flex flex-col space-y-0.5">
              {/* Changed all mobile options below to Inertia Links */}
              <Link href="/profile" className="px-3 py-2.5 text-xs font-bold text-zinc-600 dark:text-zinc-300 flex items-center gap-3 no-underline"><User className="w-4 h-4" /> View Profile</Link>
              <Link href="/notificationsetting" className="px-3 py-2.5 text-xs font-bold text-zinc-600 dark:text-zinc-300 flex items-center gap-3 no-underline"><Settings className="w-4 h-4" /> Notification Settings</Link>
              <Link href="/settings/profile" className="px-3 py-2.5 text-xs font-bold text-zinc-600 dark:text-zinc-300 flex items-center gap-3 no-underline"><Settings className="w-4 h-4" /> Profile Settings</Link>
              <Link href="/logout" method="post" as="button" className="w-full px-3 py-2.5 text-xs font-bold text-red-600 dark:text-red-400 flex items-center gap-3 bg-transparent border-none text-left cursor-pointer"><LogOut className="w-4 h-4" /> Sign Out</Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};