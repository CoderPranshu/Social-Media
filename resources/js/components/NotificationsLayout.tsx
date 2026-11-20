import React from 'react';
import { useState } from 'react';
import { NotificationsLeftSidebar } from './NotificationsLeftSidebar';
import { NotificationsList } from './NotificationsList';
import { NotificationsRightSidebar } from './NotificationsRightSidebar';
import Footer from './footer';

interface NotificationsLayoutProps {
  searchQuery?: string;
}

export const NotificationsLayout: React.FC<NotificationsLayoutProps> = ({ searchQuery = '' }) => {
  const [currentFilter, setCurrentFilter] = useState('All');

  const handleFilterChangeFromSidebar = (label: string) => {
    // Normalizes 'All notifications' string to 'All' to match your filter criteria inside NotificationsList
    const parsedFilter = label === 'All notifications' ? 'All' : label;
    setCurrentFilter(parsedFilter);
  };

  return (
    /* Added pb-20 on mobile viewports so that the content doesn't get covered 
      by the mobile fixed bottom navigation bar layout.
    */
   <>
    <div className="min-h-screen bg-[#f9f8f6] dark:bg-zinc-950 pt-2 md:pt-6 pb-20 md:pb-6 px-3 sm:px-4 flex justify-center transition-colors">
      
      {/* Grid Setup: 
        - Default (mobile/tablet): grid-cols-1 (stacks everything vertically)
        - Desktop (lg and up): grid-cols-4 (3-column layout format)
      */}
      <div className="w-full max-w-[1408px] grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-5 items-start">
        
        {/* Left Column (1 Column Space on Desktop) 
          - On mobile, this will snap to the absolute top of the page.
          - On desktop, it stays fixed and sticky to the left side menu layout.
        */}
        <div className="w-full lg:col-span-1 lg:sticky lg:top-[80px] z-30">
          <NotificationsLeftSidebar onFilterChange={handleFilterChangeFromSidebar} />
        </div>

        {/* Center Main Stream Column (2 Columns Space on Desktop) 
          - Takes up full width on mobile screens naturally.
        */}
        <div className="w-full lg:col-span-2">
          {/* Make sure to pass the active filter state down so your list responds to pill selections */}
          <NotificationsList searchQuery={searchQuery} currentFilter={currentFilter} />
        </div>

        {/* Right Dynamic Area (1 Column Space on Desktop)
          - Automatically moves below the main list feed stack on mobile layout.
          - Stays sticky on desktop.
        */}
        <div className="w-full lg:col-span-1 lg:sticky lg:top-[88px] space-y-4">
          <NotificationsRightSidebar />
        </div>

      </div>
    </div>
     <Footer/>
     </>
  );
};