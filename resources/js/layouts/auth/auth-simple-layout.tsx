import React from 'react';
import { 
  Search
} from 'lucide-react';
import { Link } from '@inertiajs/react';
import Footer from '@/components/footer';

interface AuthLayoutProps {
    children: React.ReactNode;
    title?: string;
    description?: string;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
    return (
        // Changed container to absolute full-screen fluid layout to prevent clamping
        <div className="w-full  bg-[#FAFAFA] flex flex-col justify-between antialiased selection:bg-amber-700/10 selection:text-amber-800">
            
            {/* Global Sticky Navigation Bar Header */}
           <nav className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-800/80 sticky top-0 z-50 transition-all">
        <div className="max-w-[1240px] mx-auto px-4 h-16 flex items-center justify-between gap-6">
          <div className="flex items-center space-x-2.5 text-[#A26227] text-lg shrink-0 font-bold tracking-tight">
            <span className="w-7 h-7 rounded-xl bg-gradient-to-br from-[#A26227] to-[#8F531E] text-white flex items-center justify-center text-xs shadow-md shadow-orange-700/10">P</span>
            <span className="text-zinc-900 dark:text-white">PredictionHub</span>
          </div>

          <div className="relative max-w-md w-full hidden md:block">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search predictions, people, topics..." 
              className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/60 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#A26227] transition-all"
            />
          </div>

          <div className="flex items-center space-x-6 shrink-0 text-medium font-semibold text-zinc-500 dark:text-zinc-400">
            <a href="#" className="text-[#A26227] dark:text-orange-400 border-b-2 border-[#A26227] py-5 px-1 flex items-center gap-1">Home</a>
            <a href="#" className="hover:text-zinc-900 dark:hover:text-white transition py-5 px-1">Feed</a>
            <a href="#" className="hover:text-zinc-900 dark:hover:text-white transition py-5 px-1">Explore</a>
            <div className="flex items-center space-x-2 pl-2 border-l border-zinc-200 dark:border-zinc-800">
              <a 
    href="/login" 
    className="inline-block border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-3.5 py-1.5 rounded-xl transition-all font-bold text-[16px] text-center"
  >
    Log in
  </a>

  {/* Sign Up Button - Pure HTML Anchor Link */}
  <a 
    href="/register" 
    className="inline-block bg-[#A26227] hover:bg-[#8F531E] text-white px-3.5 py-1.5 rounded-xl transition-all font-bold text-[16px] shadow-sm shadow-orange-800/10 text-center"
  >
    Sign up
  </a>
             
            </div>
          </div>
        </div>
      </nav>

            {/* Core Children Content Slot - Injects the login split layout safely */}
            <main className="flex-1 w-full flex items-center justify-center ">
                <div className="w-full max-w-7xl mx-auto">
                    {children}
                </div>
            </main>

            {/* Premium Marketing Links Footer */}
          <Footer/>

        </div>
    );
}