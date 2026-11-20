import React from 'react';
import { LeftSidebar } from './LeftSidebar';
import { MiddleFeed } from './MiddleFeed';
import { RightSidebar } from './RightSidebar';
import Footer from './footer';

export const HomeLayout: React.FC = () => {
    return (
        <>
            {/* MOBILE ONLY: Renders floating at the root layout scope level safely */}
            <LeftSidebar viewMode="mobile" />

            <div className="flex min-h-screen justify-center px-4 pt-2 pb-20 transition-colors selection:bg-[#b46d23]/20 md:pt-2 md:pb-0 dark:bg-zinc-950">
                {/* Structural constraint grid wrapper layout context */}
                <div className="grid w-full max-w-[1440px] grid-cols-1 items-start gap-6 lg:grid-cols-4">
                    
                    {/* DESKTOP ONLY SIDEBAR POSITION: Snaps perfectly inside grid structure space */}
                    <div className="hidden lg:sticky lg:top-[80px] lg:col-span-1 lg:block">
                        <LeftSidebar viewMode="desktop" />
                    </div>

                    {/* Central feed card wrappers */}
                    <div className="col-span-1 w-full space-y-5 lg:col-span-2">
                        <MiddleFeed />
                    </div>

                    {/* Right side widgets/context panels */}
                    <div className="hidden lg:sticky lg:top-[88px] lg:col-span-1 lg:block">
                        <RightSidebar />
                    </div>
                </div>
            </div>

            {/* Desktop footer panel layout node links */}
            <div className="hidden md:block mt-4">
                <Footer />
            </div>
        </>
    );
};