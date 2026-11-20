import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';
import registerimage from "../../../public/image/registerpageimage.png";
import  loginimage from '../../../public/image/loginimage.png';
import  Hero  from '../../../public/image/hero.png'

// 1. Added custom slide content details to cycle together with the graphics
const SLIDES_DATA = [
  {
    id: 1,
    titleHighlight: "Predict the Future",
    titleMain: "with people who think ahead",
    description:
      "Share your predictions, connect with like-minded people, build your reputation, and discover what the world believes will happen next.",
    name: "Alex Carter",
    role: "Top Predictor",
    companyLogoText: "PredictHub",
    poweredBy: "SOCIAL PREDICTIONS",
    image: registerimage,
    metrics: [
      "12K Predictions",
      "8K Members",
      "94% Accuracy"
    ],
   bgGradient:
"from-[#fafafa] via-white to-[#fff7ef] dark:from-zinc-950 dark:via-zinc-900 dark:to-[#2b1b0f]"
  },

  {
    id: 2,
    titleHighlight: "Share Your Opinion",
    titleMain: "before the world finds out",
    description:
      "Post predictions on sports, technology, finance, entertainment, politics, and trending events while growing your community.",
    name: "Sophia Lee",
    role: "Community Leader",
    companyLogoText: "PredictHub",
    poweredBy: "TRENDING NOW",
     image: loginimage,
    metrics: [
      "25K Followers",
      "2.4K Discussions",
      "Live Trending"
    ],

bgGradient:
"from-[#fafafa] via-white to-[#f8f2eb] dark:from-zinc-950 dark:via-zinc-950 dark:to-[#1b1712]"
  },

  {
    id: 3,
    titleHighlight: "Build Your Reputation",
    titleMain: "one prediction at a time",
    description:
      "Earn followers, gain credibility through accurate predictions, and become one of the platform's most trusted voices.",
    name: "Daniel James",
    role: "Verified Creator",
    companyLogoText: "PredictHub",
    poweredBy: "COMMUNITY VERIFIED",
    image: Hero ,
    metrics: [
      "Top Creator",
      "98% Success",
      "15K Followers"
    ],
   bgGradient:
"from-white via-[#f9f9f9] to-[#f4efe8] dark:from-zinc-950 dark:via-zinc-900 dark:to-[#25180f]"
  }
];

export default function HeroSection() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward

  const handleNext = () => {
    setDirection(1);
    setCurrentIdx((prev) => (prev + 1) % SLIDES_DATA.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIdx((prev) => (prev - 1 + SLIDES_DATA.length) % SLIDES_DATA.length);
  };

  useEffect(() => {
    const timer = setInterval(handleNext, 6000);
    return () => clearInterval(timer);
  }, []);

  const currentSlide = SLIDES_DATA[currentIdx];

  // Smooth slide variant mapping for left-side copy elements
  const textVariants = {
    enter: (dir: number) => ({
      y: dir > 0 ? 15 : -15,
      opacity: 0
    }),
    center: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
    },
    exit: (dir: number) => ({
      y: dir > 0 ? -15 : 15,
      opacity: 0,
      transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
    })
  };

  // Multi-layered visual variant settings matching image_c76546.jpg style
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 80 : -80,
      opacity: 0,
      scale: 0.98
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -80 : 80,
      opacity: 0,
      scale: 0.98,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
    })
  };

  return (
    <div className="relative bg-white dark:bg-zinc-950 flex items-center overflow-hidden ">
      
      {/* Dynamic Background Sync Atmosphere Layer */}
      <div className={`absolute inset-0 bg-gradient-to-tr ${currentSlide.bgGradient} transition-all duration-1000 pointer-events-none`} />

      <div className="relative max-w-7xl w-full px-2 sm:px-2 lg:px-6 grid grid-cols-1 lg:grid-cols-12 gap-2 items-center py-0 z-10">
        
        {/* ========================================== */}
        {/* Left Section: Dynamic Content Panel */}
        {/* ========================================== */}
        <div className="lg:col-span-5 flex flex-col justify-center space-y-4 text-left relative min-h-[280px]">
          
          <button 
            onClick={handlePrev}
            className="hidden lg:flex absolute -left-14 top-1/2 -translate-y-1/2 p-2 rounded-full border border-[#b46d23]/20 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm text-zinc-400 hover:text-[#b46d23] dark:hover:text-zinc-100 transition-colors active:scale-90 z-30"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* AnimatePresence monitors layout changes for text components */}
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentIdx}
              custom={direction}
              variants={textVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="space-y-4"
            >
              <h1 className="text-4xl sm:text-[52px] font-bold tracking-tight text-zinc-900 dark:text-zinc-50 leading-[1.15]">
               <span className="text-[#b46d23] dark:text-[#d8a15f] transition-colors duration-500">
                  {currentSlide.titleHighlight}
                </span> <br />
                {currentSlide.titleMain}
              </h1>

              <p className="text-base text-zinc-500 dark:text-zinc-400 font-medium max-w-md leading-relaxed">
                {currentSlide.description}
              </p>
            </motion.div>
          </AnimatePresence>

      <div className="flex items-center space-x-5 pt-2">
  {/* Primary Button with Pure Tailwind Glass Shine Effect */}
  <button className="group relative overflow-hidden px-6 py-3.5 bg-[#b46d23] hover:bg-[#9b5d1d] text-white font-semibold text-sm rounded-lg shadow-lg shadow-[#b46d23]/20 active:scale-[0.98] transition-all duration-300">
    
    {/* The Shining Glass Beam Layer */}
    <span className="absolute top-0 -left-[100%] w-1/2 h-full z-10 block transform -skew-x-[25deg] bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-0 group-hover:left-[150%] group-hover:opacity-100 transition-all duration-700 ease-in-out" />
    
    {/* Button Text */}
    <span className="relative z-10">Start Predicting</span>
  </button>

  {/* Secondary Button */}
  <button className="text-sm font-semibold text-[#b46d23] dark:text-[#d8a15f] hover:underline inline-flex items-center">
    Explore Community
  </button>
</div>
        </div>

        {/* ========================================== */}
        {/* Right Section: Interactive Showcase */}
        {/* ========================================== */}
        <div className="lg:col-span-7 relative w-full h-[450px] sm:h-[500px] flex items-center justify-center">
          
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentIdx}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0 w-full h-full flex items-center justify-center"
            >
              
              {/* 1. Brand Logo Badge Layout */}
              <motion.div 
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
               className="absolute top-12 right-4 sm:right-12 px-6 py-4 rounded-xl bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-[#b46d23]/20 dark:border-[#b46d23]/30 w-48 shadow-xl text-center z-10"
              >
                <div className="font-extrabold text-xl tracking-tight text-[#b46d23] dark:text-[#d8a15f]">
                  {currentSlide.companyLogoText}
                </div>
                <div className="text-[9px] font-bold tracking-widest text-zinc-400 dark:text-zinc-500 mt-1 uppercase">
                  POWERED BY <br/>{currentSlide.poweredBy}
                </div>
              </motion.div>

              {/* 2. Portrait Backdrop Frame */}
              <div className="relative w-[320px] sm:w-[380px] h-full flex items-end justify-center mix-blend-multiply dark:mix-blend-normal">
                <img 
                  src={currentSlide.image} 
                  alt={currentSlide.name}
                  className="w-full h-[85%] object-cover object-top rounded-b-2xl mask-image-v-linear" 
                />
              </div>

              {/* 3. Metrics Badge Stacks */}
              <div className="absolute right-0 sm:right-6 bottom-16 flex flex-col space-y-3 z-20">
                {currentSlide.metrics.map((metric, index) => {
                  const [label, status] = metric.split(" ");
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 25 }}
                      animate={{ opacity: 1, x: 0, transition: { delay: 0.12 + index * 0.06 } }}
                      className="flex items-center space-x-2 px-4 py-2.5 rounded-full bg-white/80 dark:bg-zinc-900/90 backdrop-blur-xl shadow-lg border border-[#b46d23]/10 dark:border-[#b46d23]/20 text-xs sm:text-sm font-medium text-zinc-800 dark:text-zinc-200"
                    >
                      <span className="font-bold">{label}</span>
                      <span className="text-zinc-400 dark:text-zinc-500 font-normal">{status}</span>
                    </motion.div>
                  );
                })}
              </div>

              {/* 4. Overlay Executive Banner */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.22 } }}
               className="absolute bottom-6 left-4 sm:left-12 inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#b46d23] to-[#9b5d1d] border border-white/20 text-white text-xs sm:text-sm font-medium shadow-xl shadow-[#b46d23]/20 backdrop-blur-sm cursor-pointer group hover:pr-5 transition-all z-20"
              >
                <span><strong className="font-semibold">{currentSlide.name}</strong> {currentSlide.role}</span>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </motion.div>

            </motion.div>
          </AnimatePresence>

          <button 
            onClick={handleNext}
            className="hidden lg:flex absolute -right-14 top-1/2 -translate-y-1/2 p-2 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-100 transition-colors active:scale-90 z-30"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

        </div>
      </div>
    </div>
  );
}