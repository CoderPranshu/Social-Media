import HeroSection from '@/components/herosection';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, Search, X } from 'lucide-react';
import { useRef, useState } from 'react';
import Statsection from '../components/stats';
import Trendingsection from '../components/trendingsection';
import CircularGallery from '../components/CircularGallery';
import FlowingMenu from '../components/FlowingMenu';
import CTA from '../components/Cta'
import Footer from '@/components/footer';

export default function DashboardPage() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const containerRef = useRef(null);

    return (
        <div
            ref={containerRef}
            className="relative min-h-screen overflow-x-hidden bg-[#FDFBF7] font-sans text-zinc-800 antialiased selection:bg-[#A26227]/20 dark:bg-zinc-950 dark:text-zinc-200"
        >
            {/* 1. NAVBAR */}
            <nav className="sticky top-0 z-50 border-b border-zinc-100 bg-white/80 backdrop-blur-md transition-all dark:border-zinc-800/80 dark:bg-zinc-900/80">
                <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6">
                    <div className="flex shrink-0 items-center space-x-2 text-base font-bold tracking-tight text-[#A26227] md:text-lg">
                        <a href="/home">
                            <span className="text-zinc-900 dark:text-white">PredictionHub</span>
                        </a>
                    </div>

                    <div className="relative hidden w-full max-w-xs md:block xl:max-w-md">
                        <Search className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
                        <input
                            type="text"
                            placeholder="Search predictions..."
                            className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-1.5 pr-4 pl-9 text-xs transition-all focus:ring-1 focus:ring-[#A26227] focus:outline-none dark:border-zinc-700/60 dark:bg-zinc-800/50"
                        />
                    </div>

                    {/* Desktop Links */}
                    <div className="hidden shrink-0 items-center space-x-4 text-xs font-semibold text-zinc-500 md:flex lg:space-x-6 lg:text-sm dark:text-zinc-400">
                        <div className="flex items-center space-x-4 lg:space-x-6">
                            <a href="#" className="border-b-2 border-[#A26227] px-1 py-5 text-[#A26227] dark:text-orange-400">
                                Home
                            </a>
                            <a href="#" className="px-1 py-5 transition hover:text-zinc-900 dark:hover:text-white">
                                Feed
                            </a>
                            <a href="#" className="px-1 py-5 transition hover:text-zinc-900 dark:hover:text-white">
                                Explore
                            </a>
                        </div>

                        <div className="flex items-center space-x-2 lg:border-l lg:border-zinc-200 lg:pl-2 lg:dark:border-zinc-800">
                            <a
                                href="/login"
                                className="rounded-xl border border-zinc-200 px-3 py-1.5 text-xs font-bold text-zinc-700 transition-all hover:bg-zinc-50 md:text-sm dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                            >
                                Log in
                            </a>
                            <a
                                href="/register"
                                className="rounded-xl bg-[#A26227] px-3 py-1.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#8F531E] md:text-sm"
                            >
                                Sign up
                            </a>
                        </div>
                    </div>

                    {/* Mobile Hamburger Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="rounded-xl p-2 text-zinc-600 transition hover:bg-zinc-100 md:hidden dark:text-zinc-300 dark:hover:bg-zinc-800"
                    >
                        {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>

                {/* Mobile Navigation Side Drawer */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute top-16 left-0 z-50 w-full space-y-4 border-b border-zinc-100 bg-white p-4 shadow-xl md:hidden dark:border-zinc-800 dark:bg-zinc-900"
                        >
                            <div className="relative w-full">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                                <input
                                    type="text"
                                    placeholder="Search predictions..."
                                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-2 pr-4 pl-10 text-sm focus:ring-1 focus:ring-[#A26227] focus:outline-none dark:border-zinc-700/60 dark:bg-zinc-800/50"
                                />
                            </div>
                            <div className="flex flex-col space-y-2 font-semibold">
                                <a href="#" className="rounded-lg bg-amber-500/5 p-2 text-[#A26227] dark:text-orange-400">
                                    Home
                                </a>
                                <a
                                    href="#"
                                    className="rounded-lg p-2 text-zinc-600 transition hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800"
                                >
                                    Feed
                                </a>
                                <a
                                    href="#"
                                    className="rounded-lg p-2 text-zinc-600 transition hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800"
                                >
                                    Explore
                                </a>
                            </div>
                            <div className="flex gap-3 border-t border-zinc-100 pt-2 dark:border-zinc-800">
                                <a
                                    href="/login"
                                    className="flex-1 rounded-xl border border-zinc-200 py-2 text-center text-sm font-bold text-zinc-700 dark:border-zinc-700 dark:text-zinc-300"
                                >
                                    Log in
                                </a>
                                <a
                                    href="/register"
                                    className="flex-1 rounded-xl bg-[#A26227] py-2 text-center text-sm font-bold text-white shadow-sm"
                                >
                                    Sign up
                                </a>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            {/* 2. HERO ZONE */}
            <HeroSection />

            {/* MAIN LAYOUT WRAPPER */}
            <main className="relative z-20 mx-auto max-w-[1440px] space-y-10 px-4 py-6 sm:px-6 md:space-y-16 md:py-10">
                {/* 3. CORE STATISTICS */}
                <Statsection />

                {/* 4. MAIN INTERACTIVE DIRECTORY HUB */}
                {/* Trending section  */}
                <Trendingsection />

                {/* Gallery Headers Section */}
              
                <div >
                    <CircularGallery />
                </div>

                {/* flowing menu  */}
                <div >
                    <FlowingMenu />
                </div>

                {/* 6. CALL TO ACTION ZONE */}
                <CTA/>

            </main>

            {/* 9. FOOTER */}
            <Footer />
        </div>
    );
}
