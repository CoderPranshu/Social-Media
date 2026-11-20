import { type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { Navbar } from '../components/navbar';
import { FollowersFollowingContent } from '../components/FollowersFollowingContent';
import { LeftSidebar } from '../components/LeftSidebar'; 
import { SidebarProvider } from '@/components/ui/sidebar';
import { NetworkMainContent } from '@/components/NetworkMainContent';
import { NetworkLayout } from '@/components/NetworkLayout';

export default function Network() {
    const { auth } = usePage<SharedData>().props;

    // Trigger basic safety return handler if back on layout
    const handleBackTrigger = () => {
        if (typeof window !== 'undefined') {
            window.history.back();
        }
    };

    return (
        <div className="min-h-screen w-full bg-zinc-50 dark:bg-zinc-950 font-sans selection:bg-amber-100 selection:text-amber-900 overflow-x-hidden">
            <Navbar />
               
            {/* Main Fluid Responsive Canvas Wrapper */}
            <div className="w-full max-w-[1460px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 md:pt-6 pb-12">
                <div className="space-y-4 md:space-y-5">
                    
                    {/* MOBILE & TABLET SIDEBAR WRAPPER ONLY:
                      - `block`: Rendered visible on mobile and tablet viewport paths.
                      - `lg:hidden`: Vanishes completely on desktop screens so it won't conflict with your main view.
                    */}
                    <div className="w-full block lg:hidden">
                        <SidebarProvider>
                            <LeftSidebar />
                        </SidebarProvider>
                    </div>

                    {/* Main Content Component View Block (Takes clean full width seamlessly on desktop) */}
                    <main className="w-full min-w-0">
                        <FollowersFollowingContent onBack={handleBackTrigger} />
                    </main>
                    <main className="w-full min-w-0">
                        <NetworkLayout/>
                    </main>
                    

                </div>
            </div>
        </div>
    );
}