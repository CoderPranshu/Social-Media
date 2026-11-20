// NetworkLeftSidebar.tsx
import React, { useState } from 'react';
import { Users, UserCheck, UsersRound, Calendar, FileText, ChevronDown, ChevronUp } from 'lucide-react';

// Define valid section types
export type NetworkSection = 'overview' | 'connections' | 'following' | 'groups' | 'events' | 'pages';

interface NetworkLeftSidebarProps {
    activeSection: NetworkSection;
    onSelectSection: (section: NetworkSection) => void;
}

export const NetworkLeftSidebar: React.FC<NetworkLeftSidebarProps> = ({ activeSection, onSelectSection }) => {
    const [isOpen, setIsOpen] = useState(false);

    const items = [
        { id: 'mynetwork' as NetworkSection, label: 'Connections', count: 651, icon: Users },
        { id: 'following' as NetworkSection, label: 'Following & followers', count: null, icon: UserCheck },
        // { id: 'groups' as NetworkSection, label: 'Groups', count: 1, icon: UsersRound },
        // { id: 'events' as NetworkSection, label: 'Events', count: null, icon: Calendar },
        // { id: 'pages' as NetworkSection, label: 'Pages', count: 50, icon: FileText },
    ];

    return (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.01)] overflow-hidden p-3 md:p-4">
            
            {/* Header Layout */}
            <div 
                className="flex items-center justify-between cursor-pointer md:cursor-default p-1 md:p-0 md:mb-3 select-none"
                onClick={() => setIsOpen(!isOpen)}
            >
                <h3 className="text-[11px] md:text-xs font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider px-1">
                    Manage my network
                </h3>
                <div className="md:hidden text-zinc-400 p-1">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
            </div>
            
            {/* Nav List Block Panel */}
            <div className={`space-y-1 mt-2 md:mt-0 ${isOpen ? 'block' : 'hidden md:block'}`}>
                {items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeSection === item.id;

                    return (
                        <button 
                            key={item.label} 
                            onClick={() => {
                                onSelectSection(item.id);
                                setIsOpen(false); // Close mobile drawer on selection
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all text-xs font-medium group ${
                                isActive 
                                    ? 'bg-[#FAF6F0] dark:bg-zinc-800 text-[#A26227] dark:text-orange-400 font-bold' 
                                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                            }`}
                        >
                            <div className="flex items-center space-x-3 min-w-0">
                                <Icon className={`w-4 h-4 shrink-0 transition-colors ${
                                    isActive ? 'text-[#A26227] dark:text-orange-400' : 'text-zinc-400 group-hover:text-[#A26227]'
                                }`} />
                                <span className={`truncate transition-colors ${
                                    isActive ? 'text-zinc-900 dark:text-zinc-100' : 'group-hover:text-zinc-900 dark:group-hover:text-white'
                                }`}>
                                    {item.label}
                                </span>
                            </div>
                            {item.count !== null && (
                                <span className={`text-[11px] px-2 py-0.5 rounded-md shrink-0 font-semibold ${
                                    isActive 
                                        ? 'bg-orange-100/50 text-[#A26227] dark:bg-zinc-700' 
                                        : 'text-zinc-400 dark:text-zinc-500 bg-zinc-50 dark:bg-zinc-800/50'
                                }`}>
                                    {item.count}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};