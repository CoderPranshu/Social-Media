"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface GalleryItem {
  id: number;
  title: string;
  subtitle: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  { id: 1, title: "New York", subtitle: "the future" },
  { id: 2, title: "Good Boy", subtitle: "the future" },
  { id: 3, title: "Coastline", subtitle: "the future" },
  { id: 4, title: "Palm Trees", subtitle: "the future" },
  { id: 5, title: "Retro", subtitle: "the future" },
  { id: 6, title: "Deep Blue", subtitle: "the future" },
  { id: 7, title: "Cyberpunk", subtitle: "the future" },
];

export default function PremiumGallery() {
  // Explicitly typing refs prevents TypeScript from assuming they are 'never'
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  
  const duplicatedItems = [...GALLERY_ITEMS, ...GALLERY_ITEMS];

  useGSAP(() => {
    const track = trackRef.current;
    const container = containerRef.current;
    
    if (!track || !container) return;

    let cards = gsap.utils.toArray<HTMLElement>(".gallery-card");
    if (cards.length === 0) return;

    let xPos = 0;
    let targetXPos = 0;
    let speed = 1.0; 
    let isHovered = false;
    
    let cardWidth = 0;
    let halfTrackWidth = 0;

    const initDimensions = () => {
      if (!cards[0] || !track) return;
      const gap = parseFloat(window.getComputedStyle(track).gap) || 20;
      cardWidth = cards[0].getBoundingClientRect().width + gap;
      halfTrackWidth = GALLERY_ITEMS.length * cardWidth;
    };

    initDimensions();
    window.addEventListener("resize", initDimensions);

    const updateCurveAndPosition = () => {
      if (halfTrackWidth === 0) return;

      if (!isHovered) {
        targetXPos -= speed;
      }
      
      xPos += (targetXPos - xPos) * 0.1;

      const wrappedX = ((xPos % halfTrackWidth) - halfTrackWidth) % halfTrackWidth;
      gsap.set(track, { x: wrappedX });

      const containerRect = container.getBoundingClientRect();
      const centerX = containerRect.left + containerRect.width / 2;
      
      const isMobile = window.innerWidth < 640;
      const arcIntensity = isMobile ? 16 : 45; 
      const maxRotation = isMobile ? 6 : 15;  

      cards.forEach((card) => {
        const cardRect = card.getBoundingClientRect();
        const cardCenter = cardRect.left + cardRect.width / 2;
        const distanceFromCenter = (cardCenter - centerX) / (containerRect.width / 2);

        const yTranslation = Math.pow(Math.abs(distanceFromCenter), 2) * arcIntensity; 
        const rotationAngle = distanceFromCenter * maxRotation;

        gsap.set(card, {
          y: yTranslation,
          rotation: rotationAngle,
          transformOrigin: isMobile ? "center 110%" : "center 150%",
        });
      });
    };

    gsap.ticker.add(updateCurveAndPosition);

    const handleMouseEnter = () => {
      isHovered = true;
      gsap.to({ val: speed }, {
        val: 0.15,
        duration: 0.5,
        ease: "power2.out",
        onUpdate: function (this: gsap.core.Tween) { 
          speed = this.targets()[0].val; 
        }
      });
    };

    const handleMouseLeave = () => {
      isHovered = false;
      gsap.to({ val: speed }, {
        val: 1.0,
        duration: 0.6,
        ease: "power2.out",
        onUpdate: function (this: gsap.core.Tween) { 
          speed = this.targets()[0].val; 
        }
      });
    };

    let startX = 0;
    let isDragging = false;

    const dragStart = (clientX: number) => {
      isDragging = true;
      isHovered = true;
      startX = clientX;
    };

    const dragMove = (clientX: number) => {
      if (!isDragging) return;
      const deltaX = clientX - startX;
      const sensitivity = window.innerWidth < 640 ? 0.8 : 1.3;
      targetXPos += deltaX * sensitivity; 
      startX = clientX;
    };

    const dragEnd = () => {
      isDragging = false;
      if (!container.matches(':hover')) {
        handleMouseLeave();
      }
    };

    // Strongly typed inline wrappers for event listener callbacks
    const handleMouseDown = (e: MouseEvent) => dragStart(e.clientX);
    const handleMouseMove = (e: MouseEvent) => dragMove(e.clientX);
    const handleTouchStart = (e: TouchEvent) => dragStart(e.touches[0].clientX);
    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging) dragMove(e.touches[0].clientX);
    };

    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mouseleave", handleMouseLeave);
    container.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", dragEnd);

    container.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", dragEnd);

    return () => {
      gsap.ticker.remove(updateCurveAndPosition);
      window.removeEventListener("resize", initDimensions);
      container.removeEventListener("mouseenter", handleMouseEnter);
      container.removeEventListener("mouseleave", handleMouseLeave);
      container.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", dragEnd);
      container.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", dragEnd);
    };
  }, { scope: containerRef });

  return (
    <div className="w-full py-2 dark:bg-neutral-950 overflow-hidden">
      <div className="mx-auto max-w-5xl px-4 text-center mb-4 sm:mb-8">
        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-zinc-900 dark:text-white leading-tight">
          Discover What's <span className="text-[#b46d23]">Trending</span>
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-xs sm:text-sm md:text-base text-zinc-600 dark:text-zinc-400 px-2">
          Explore predictions across sports, technology, finance, entertainment, gaming, business, politics, and more.
        </p>
      </div>

      <section className="relative w-full min-h-[45vh] sm:min-h-[65vh] flex flex-col justify-center items-center overflow-hidden">
        <div 
          ref={containerRef} 
          className="relative w-full cursor-grab active:cursor-grabbing select-none py-4 sm:py-12 touch-pan-y"
        >
          <div 
            ref={trackRef} 
            className="flex gap-4 sm:gap-8 w-max px-4 items-end will-change-transform"
          >
            {duplicatedItems.map((item, index) => (
              <div
                key={`${item.id}-${index}`}
                className="gallery-card group relative flex flex-col items-center flex-shrink-0"
              >
                <div className="relative w-32 h-44 sm:w-56 sm:h-76 bg-[#2CA6F6] rounded-[14px] sm:rounded-[24px] shadow-md sm:shadow-xl flex flex-col items-center justify-center overflow-hidden transition-all duration-500 sm:group-hover:scale-105 sm:group-hover:shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/20 opacity-0 sm:group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                  <div className="flex flex-col gap-1.5 sm:gap-3.5 items-center transform transition-transform duration-700 sm:group-hover:scale-105">
                    <div className="flex gap-0.5 sm:gap-1.5 -rotate-3">
                      {["t", "h", "e"].map((char, i) => (
                        <span key={i} className="w-5 h-5 sm:w-9 sm:h-9 bg-[#FCD34D] text-neutral-900 font-extrabold rounded-sm sm:rounded-md flex items-center justify-center text-[10px] sm:text-base shadow-sm sm:shadow-md uppercase border-b-[1.5px] sm:border-b-2 border-amber-500/30">
                          {char}
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-0.5 sm:gap-1 rotate-2 translate-y-0.5">
                      {["f", "u", "t", "u", "r", "e"].map((char, i) => (
                        <span key={i} className="w-4 h-4 sm:w-7.5 sm:h-7.5 bg-[#FCD34D] text-neutral-900 font-extrabold rounded-[2px] sm:rounded-md flex items-center justify-center text-[8px] sm:text-xs shadow-sm uppercase border-b border-amber-500/20">
                          {char}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-3 sm:mt-6 text-center transform transition-transform duration-500 sm:group-hover:translate-y-1">
                  <h3 className="text-xs sm:text-xl font-semibold text-[#E07A1B] tracking-wide font-sans">
                    {item.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}