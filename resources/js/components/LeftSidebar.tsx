import React from 'react';
// 1. Change the import from react-router-dom to @inertiajs/react
import { Link, usePage } from '@inertiajs/react';
import { Home, Flame, Clock, Compass, Bookmark, HelpCircle, Users, Layers } from 'lucide-react';
import { SidebarFooter } from './ui/sidebar';
import { NavUser } from './nav-user';

interface LeftSidebarProps {
  viewMode?: 'desktop' | 'mobile' | 'all';
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({ viewMode = 'all' }) => {
  // 2. Inertia tracks URLs via usePage()
  const { url } = usePage();
  const currentPath = url;

  const topNavs = [
    { label: 'Home', icon: Home, to: '/dashboard' },
    { label: 'Popular', icon: Flame, to: '/popularfeed' },
    { label: 'Notification', icon: Clock, to: '/notification' },
    { label: 'Follower', icon: Users, to: '/followersfollowing' },
    { label: 'Explore', icon: Compass, to: '/dashboard' },
  ];

  const bottomNavs = [
    { label: 'Saved', icon: Bookmark, to: '/saved' },
    { label: 'My Predictions', icon: Layers, to: '/allpost' },
    { label: 'About', icon: HelpCircle, to: '/about' },
  ];

  const mobileNavs = [
    { label: 'Home', icon: Home, to: '/dashboard' },
    { label: 'Popular', icon: Flame, to: '/popularfeed' },
    { label: 'Latest', icon: Clock, to: '/latest' },
    { label: 'Saved', icon: Bookmark, to: '/saved' },
  ];

  const renderDesktop = () => (
    <div className="w-full max-w-[260px] space-y-4">
      <div className="relative overflow-hidden rounded-2xl border border-[#e5ca9a]/60 dark:border-[#b46d23]/30 bg-gradient-to-b from-white/95 via-[#fffdf9]/95 to-white/98 dark:from-zinc-900/95 dark:via-zinc-900/98 dark:to-zinc-950 shadow-[0_10px_30px_-12px_rgba(180,109,35,0.08)] text-left transition-all duration-300 hover:shadow-[0_15px_35px_-10px_rgba(180,109,35,0.18)] hover:border-[#b46d23]/50 group/card">

        {/* Header Profile Box Container */}
        <div className="relative pt-6 pb-4 text-center border-b border-zinc-100 dark:border-zinc-800/60">
          <div className="absolute top-0 left-0 right-0 h-24 overflow-hidden pointer-events-none z-0">
            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-[#dfc58a] via-[#cc9643] to-[#ebd3a2] dark:from-[#4a3b1e] dark:via-[#6e5327] dark:to-transparent rounded-b-[45%] scale-x-110 origin-top shadow-sm transition-transform duration-500 group-hover/card:scale-y-105" />
          </div>

          {/* Using Inertia Link href instead of to */}
          <Link href="/profile" className="block w-[74px] h-[74px] rounded-full border-[3px] dark:border-zinc-900 ring-2 ring-[#e5ca9a]/50 dark:ring-[#b46d23]/30 overflow-hidden mx-auto bg-zinc-50 relative z-10 transition-all duration-500 ease-out hover:scale-105 hover:shadow-lg hover:ring-[#b46d23]/60">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
              alt="Isha Singh"
              className="w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-110"
            />
          </Link>

          <div className="relative z-10">
            <Link href="/profile" className="inline-block no-underline group/name">
              <h5 className="font-extrabold text-zinc-900 dark:text-zinc-100 mt-3 text-sm tracking-tight transition-colors duration-200 group-hover/card:text-[#b46d23] group-hover/name:underline">
                Isha Singh
              </h5>
            </Link>
            <p className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 mt-0.5 tracking-wide">
              Full Stack Developer
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="p-2.5 space-y-0.5 relative z-10">
          {topNavs.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.to;

            return (
              <Link
                key={item.label}
                href={item.to}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 text-xs font-bold rounded-xl transition-all duration-200 ease-out group/item relative overflow-hidden no-underline ${
                  isActive
                    ? 'bg-gradient-to-r from-[#fdf8f2] to-[#faf1e6] text-[#b46d23] dark:from-[#2a2215]/50 dark:to-zinc-800/30 dark:text-[#d48d3b] shadow-[0_2px_12px_-3px_rgba(180,109,35,0.12)] border border-[#e5ca9a]/40 dark:border-[#b46d23]/20'
                    : 'text-zinc-500 dark:text-zinc-400 hover:bg-[#fafafa] dark:hover:bg-zinc-800/40 hover:text-zinc-900 dark:hover:text-zinc-100 border border-transparent'
                }`}
              >
                {isActive && <span className="absolute left-0 top-3 bottom-3 w-0.5 bg-[#b46d23] rounded-r-full" />}
                <Icon className={`w-4 h-4 stroke-[2.25] transition-transform duration-200 group-hover/item:scale-110 ${isActive ? 'text-[#b46d23]' : 'text-zinc-400 group-hover/item:text-[#b46d23]'}`} />
                <span className="transition-transform duration-200 group-hover/item:translate-x-0.5">{item.label}</span>
              </Link>
            );
          })}

          <hr className="my-2.5 border-zinc-100 dark:border-zinc-800/60 mx-2" />

          {bottomNavs.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.to;

            return (
              <Link
                key={item.label}
                href={item.to}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 text-xs font-bold rounded-xl border border-transparent transition-all duration-200 ease-out group/item no-underline ${
                  isActive ? 'text-[#b46d23] bg-[#faf1e6]/40 dark:bg-zinc-800/20' : 'text-zinc-500 dark:text-zinc-400 hover:bg-[#fafafa] dark:hover:bg-zinc-800/40 hover:text-zinc-900 dark:hover:text-zinc-100'
                }`}
              >
                <Icon className={`w-4 h-4 stroke-[2] transition-transform duration-200 group-hover/item:scale-110 ${isActive ? 'text-[#b46d23]' : 'text-zinc-400 group-hover/item:text-[#b46d23]'}`} />
                <span className="transition-transform duration-200 group-hover/item:translate-x-0.5">{item.label}</span>
              </Link>
            );
          })}

          <SidebarFooter>
            <NavUser />
          </SidebarFooter>
        </div>
      </div>
    </div>
  );

  const renderMobile = () => (
    <div className="fixed bottom-0 left-0 right-0 w-full z-[999] bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] pb-[env(safe-area-inset-bottom)]">
      <nav className="flex justify-around items-center h-16 w-full px-2 max-w-lg mx-auto">
        {mobileNavs.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.to;

          return (
            <Link
              key={item.label}
              href={item.to}
              className={`flex flex-col items-center justify-center flex-1 h-full space-y-1 no-underline transition-colors duration-200 ${
                isActive ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-400 dark:text-zinc-500'
              }`}
            >
              <div className="relative flex items-center justify-center">
                <Icon className={`w-[22px] h-[22px] stroke-[2] ${isActive ? 'text-zinc-950 dark:white stroke-[2.25]' : ''}`} />
              </div>
              <span className="text-[10px] tracking-tight font-medium">{item.label}</span>
            </Link>
          );
        })}

        <Link
          href="/profile"
          className={`flex flex-col items-center justify-center flex-1 h-full space-y-1 no-underline transition-colors duration-200 ${
            currentPath === '/profile' ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-400 dark:text-zinc-500'
          }`}
        >
          <div className={`w-6 h-6 rounded-full overflow-hidden border-2 transition-all flex items-center justify-center ${
            currentPath === '/profile' ? 'border-zinc-900 dark:border-white' : 'border-zinc-300 dark:border-zinc-700'
          }`}>
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&auto=format&fit=crop&q=80"
              alt="Profile View"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-[10px] font-medium tracking-tight">Profile</span>
        </Link>
      </nav>
    </div>
  );

  return (
    <>
      {viewMode !== 'mobile' && <div className="hidden lg:block">{renderDesktop()}</div>}
      {viewMode !== 'desktop' && <div className="block lg:hidden">{renderMobile()}</div>}
    </>
  );
};
