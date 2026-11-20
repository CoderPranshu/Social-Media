import React, { useState } from 'react';
import { X, UserPlus } from 'lucide-react';

interface NetworkMainContentProps {
    searchQuery: string;
}

export const NetworkMainContent: React.FC<NetworkMainContentProps> = ({ searchQuery }) => {
    // Pending Invitations State
  

    // Recommendation Suggestions List Matching exact Mockup Data
    const [suggestions, setSuggestions] = useState([
        { id: 1, name: 'Sonali Verma', role: 'HR @ Reboot Xp', mutual: 'SHOBHIT is a mutual connection', bg: 'bg-[#FCEFE3]', initials: 'SV' },
        { id: 2, name: 'Sahil Gupta', role: 'Full Stack Developer (MERN)', mutual: 'Kushall and 15 other mutual connections', bg: 'bg-[#E3F4FC]', initials: 'SG' },
        { id: 3, name: 'Diksha Bhatt', role: 'Full stack developer', mutual: 'Vanshika and 3 other mutual connections', bg: 'bg-[#E3E8FC]', initials: 'DB' },
        { id: 4, name: 'Mansi Panwar', role: 'Frontend Developer | React.js', mutual: 'Vansh and 23 other mutual connections', bg: 'bg-[#FCE3FA]', initials: 'MP' },
        { id: 5, name: 'Nikhil Kumar Yadav', role: 'Skilled Full Stack MERN Developer', mutual: 'PRIYANSHU and 2 other mutual connections', bg: 'bg-[#FCE3E3]', initials: 'NY' },
        { id: 6, name: 'Abhishek Pandey', role: 'Associate Developer at Flowsensy', mutual: 'Amit and 16 other mutual connections', bg: 'bg-[#E3FCEF]', initials: 'AP' },
    ]);

    const handleDismissSuggestion = (id: number) => {
        setSuggestions((prev) => prev.filter((person) => person.id !== id));
    };

    const filteredSuggestions = suggestions.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.role.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-4 md:space-y-5">
            
            {/* PENDING INVITATIONS ROW CONTAINER */}
          

            {/* MAIN RECOMMENDATIONS CARD GRID */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.01)] p-4 md:p-5">
                <div className="flex justify-between items-center mb-4 md:mb-5">
                    <span className="text-[11px] md:text-xs font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider line-clamp-1 pr-2">People you may know</span>
                    {/* <button className="text-xs font-bold text-[#A26227] hover:text-[#8F531E] hover:underline shrink-0">See all</button> */}
                </div>

                {filteredSuggestions.length === 0 ? (
                    <div className="text-center py-12 text-xs font-medium text-zinc-400 dark:text-zinc-500">
                        No custom user profiles found matches your parameters.
                    </div>
                ) : (
                    /* grid-cols-2 keeps it balanced as a 2x2 grid view layout layout rule on mobile */
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                        {filteredSuggestions.map((person) => (
                            <div key={person.id} className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800/80 rounded-2xl overflow-hidden relative flex flex-col justify-between items-center text-center pb-3 md:pb-4 hover:shadow-[0_8px_25px_rgba(0,0,0,0.025)] transition-all duration-300 group">
                                
                                {/* Close Button */}
                                <button 
                                    onClick={() => handleDismissSuggestion(person.id)}
                                    className="absolute top-2 right-2 md:top-2.5 md:right-2.5 bg-white/90 hover:bg-white text-zinc-400 hover:text-zinc-600 rounded-full p-1 z-10 shadow-sm border border-zinc-100/20 transition-all"
                                    title="Dismiss suggestion"
                                >
                                    <X className="w-3 h-3" />
                                </button>

                                {/* Background Banner Cover Image Layer */}
                                <div className="w-full h-12 md:h-16 relative shrink-0">
                                    <div className={`w-full h-full rounded-t-2xl opacity-80 ${person.bg} group-hover:opacity-100 transition-opacity`} />
                                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-full border-2 md:border-[3px] border-white dark:border-zinc-900 overflow-hidden mx-auto absolute left-1/2 -translate-x-1/2 top-4 md:top-5 bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center font-black text-zinc-700 dark:text-zinc-200 text-[10px] md:text-xs shadow-sm精确">
                                        {person.initials}
                                    </div>
                                </div>

                                {/* Body Typography Context Block Container */}
                                <div className="px-2 md:px-4 pt-6 md:pt-8 flex-1 flex flex-col justify-between w-full">
                                    <div className="space-y-0.5 md:space-y-1">
                                        <h4 className="text-[11px] md:text-xs font-bold text-zinc-800 dark:text-zinc-100 line-clamp-1 group-hover:text-[#A26227] transition-colors leading-snug">
                                            {person.name}
                                        </h4>
                                        <p className="text-[10px] md:text-[11px] text-zinc-400 font-medium line-clamp-2 min-h-[28px] md:min-h-[32px] px-0.5 leading-tight">
                                            {person.role}
                                        </p>
                                    </div>

                                    {/* Mutual connections segment info */}
                                    <p className="text-[9px] md:text-[10px] text-zinc-400 font-medium mt-2 md:mt-3 border-t border-zinc-50 dark:border-zinc-800/50 pt-2 md:pt-3 min-h-[28px] md:min-h-[32px] text-center px-0.5 line-clamp-2 leading-tight">
                                        {person.mutual}
                                    </p>
                                </div>

                                {/* Action Buttons */}
                                <div className="w-full px-2 md:px-4 mt-2">
                                    <button className="w-full flex items-center justify-center space-x-1 border border-[#A26227]/30 text-[#A26227] hover:text-white hover:bg-[#A26227] hover:border-[#A26227] py-1 md:py-1.5 rounded-full text-[10px] md:text-xs font-bold transition-all duration-200 shadow-sm">
                                        <UserPlus className="w-3 h-3 md:w-3.5 md:h-3.5" />
                                        <span>Follow</span>
                                    </button>
                                </div>

                            </div>
                        ))}
                    </div>
                )}
            </div>

        </div>
    );
};