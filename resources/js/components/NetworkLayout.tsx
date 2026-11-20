import React, { useState } from 'react';
import { NetworkLeftSidebar, NetworkSection } from '../components/NetworkLeftSidebar';
import { NetworkMainContent } from './NetworkMainContent';
import { FollowersFollowingContent } from './FollowersFollowingContent'; // Make sure this path is correct

interface NetworkLayoutProps {
    searchQuery?: string;
}

export const NetworkLayout: React.FC<NetworkLayoutProps> = ({ searchQuery = '' }) => {
    // 1. Manage the active section state here
    const [activeSection, setActiveSection] = useState<NetworkSection>('overview');

    return (
        <div className="min-h-screen  bg-[#FDFBF7]  dark:bg-zinc-950 flex justify-center">
            <div className="w-full max-w-[1460px]  items-start">
                
                {/* Left Structural Column Workspace */}
                {/* <div className="lg:col-span-1 lg:sticky lg:top-24 w-full">
                   
                    <NetworkLeftSidebar 
                        activeSection={activeSection}
                        onSelectSection={(section) => setActiveSection(section)}
                    />
                </div> */}

                {/* Main Wide Interaction Feed Column Workspace */}
                <div className="w-full">
                    {/* 3. Conditionally swap out components based on activeSection */}
                    {activeSection === 'overview' && (
                        <NetworkMainContent searchQuery={searchQuery} />
                    )}

                   
                    {/* Fallback view placeholder for sections you build out later */}
               
                </div>

            </div>
        </div>
    );
};