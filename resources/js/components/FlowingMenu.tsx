"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const CATEGORIES = [
  {
    id: "predict",
    title: "PREDICT TOMORROW",
    tickerText: "SPORTS PREDICTIONS",
    image: "https://images.unsplash.com/photo-1541252260730-0412e8e2108e?w=500&auto=format&fit=crop&q=60",
  },
  {
    id: "tech",
    title: "TECH & AI",
    tickerText: "ARTIFICIAL INTELLIGENCE",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=60",
  },
  {
    id: "finance",
    title: "FINANCE & CRYPTO",
    tickerText: "MARKET BLOCKCHAIN ANALYSIS",
    image: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=500&auto=format&fit=crop&q=60",
  },
  {
    id: "world",
    title: "WORLD EVENTS",
    tickerText: "GLOBAL NEWS UPDATES",
    image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=500&auto=format&fit=crop&q=60",
  },
];

export default function PremiumCategoryMenu() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Explicitly type the output of gsap.utils.toArray as HTMLElement[]
    const rows = gsap.utils.toArray(".category-row") as HTMLElement[];

    rows.forEach((row) => {
      // Safely type check internal selector targets
      const defaultHeader = row.querySelector(".default-header") as HTMLElement | null;
      const hoverContent = row.querySelector(".hover-reveal-content") as HTMLElement | null;
      const marqueeTrack = row.querySelector(".marquee-inner-track") as HTMLElement | null;

      if (!defaultHeader || !hoverContent || !marqueeTrack) return;

      // Infinite loop configuration
      const marqueeTween = gsap.to(marqueeTrack, {
        xPercent: -50,
        repeat: -1,
        duration: 14, 
        ease: "none",
      }).pause();

      const tl = gsap.timeline({
        paused: true,
        onStart: () => marqueeTween.play(),
        onReverseComplete: () => marqueeTween.pause(),
      });

      // Flawless premium transformations
      tl.to(defaultHeader, {
        opacity: 0,
        y: -10,
        duration: 0.25,
        ease: "power2.out",
      })
      .to(hoverContent, {
        opacity: 1,
        y: 0,
        duration: 0.35,
        ease: "power3.out",
      }, "-=0.15")
      .to(row, {
        backgroundColor: "#FAF9F6",
        duration: 0.25,
        ease: "power2.out",
      }, 0);

      // Mouse Listeners for Desktop
      const enterHandler = () => {
        tl.play();
        rows.forEach((sib) => {
          if (sib !== row) gsap.to(sib, { opacity: 0.3, duration: 0.25 });
        });
      };

      const leaveHandler = () => {
        tl.reverse();
        rows.forEach((sib) => gsap.to(sib, { opacity: 1, duration: 0.25 }));
      };

      row.addEventListener("mouseenter", enterHandler);
      row.addEventListener("mouseleave", leaveHandler);

      // Smart Touch Interaction Layer for Mobile/Tablets
      const touchStartHandler = (e: TouchEvent) => {
        const isCurrentlyActive = tl.progress() > 0;
        
        if (!isCurrentlyActive) {
          e.preventDefault();
          
          rows.forEach((sib) => {
            if (sib !== row) {
              gsap.to(sib, { opacity: 0.3, duration: 0.25 });
              sib.dispatchEvent(new Event("mouseleave"));
            }
          });
          tl.play();
          gsap.to(row, { opacity: 1, duration: 0.25 });
        } else {
          tl.reverse();
        }
      };

      row.addEventListener("touchstart", touchStartHandler, { passive: false });
    });
  }, { scope: containerRef });

  return (
    <section className="w-full flex justify-center items-center py-1 px-1 overflow-hidden">
      <div 
        ref={containerRef}
        className="w-full max-w-full flex flex-col bg-[#783E0D] overflow-hidden"
      >
        {CATEGORIES.map((cat) => (
          <div
            key={cat.id}
            className="category-row relative w-full min-h-[70px] sm:min-h-[90px] md:min-h-[110px] py-6 sm:py-8 md:py-10 bg-[#783E0D] border-b border-white/10 last:border-none cursor-pointer flex items-center justify-center overflow-hidden select-none transition-opacity duration-300"
          >
            {/* 1. Static Initial View Text */}
            <div className="default-header pointer-events-none absolute inset-0 flex items-center justify-center w-full h-full px-4 text-center z-10">
              <h2 className="text-base sm:text-xl md:text-2xl font-bold tracking-[0.15em] sm:tracking-[0.2em] text-[#FAF9F6] font-sans transition-colors duration-300">
                {cat.title}
              </h2>
            </div>

            {/* 2. Hover Revealed Continuous Marquee Panel */}
            <div className="hover-reveal-content pointer-events-none absolute inset-0 w-full h-full opacity-0 translate-y-3 flex items-center overflow-hidden bg-white z-20">
              <div className="w-full overflow-hidden flex items-center">
                
                {/* Horizontal Marquee Track Container */}
                <div className="marquee-inner-track flex whitespace-nowrap items-center gap-8 sm:gap-12 will-change-transform">
                  
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex items-center gap-8 sm:gap-12 flex-shrink-0">
                      <span className="text-sm sm:text-lg md:text-xl font-black tracking-wider text-[#783E0D] uppercase font-mono">
                        {cat.tickerText}
                      </span>
                      
                      <div className="w-16 h-7 sm:w-24 sm:h-9 md:w-28 md:h-11 rounded-full overflow-hidden border border-[#783E0D]/20 shadow-md flex-shrink-0">
                        <img 
                          src={cat.image} 
                          alt={cat.tickerText} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  ))}

                </div>
              </div>
            </div>

          </div>
        ))}
      </div>
    </section>
  );
}