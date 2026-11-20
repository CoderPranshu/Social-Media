import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Users, Award, Target, ArrowUpRight } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import loginimage from '../../../public/image/loginimage.png';
import Footer from '@/components/footer';
import Cta from '@/components/Cta';

export default function AboutPage() {
  const coreValues = [
    { 
      icon: Shield, 
      title: "Public & Immutable", 
      desc: "Every dynamic layer and system strategy we deploy is built on verifiable, bulletproof logic designed for permanent market authority.", 
      color: "from-amber-500/10 to-orange-500/5 hover:border-orange-200 dark:hover:border-orange-500/30" 
    },
    { 
      icon: Users, 
      title: "Ecosystem Driven", 
      desc: "We aggregate global digital signals and complex developer insights to form high-impact, interactive platforms that run flawlessly.", 
      color: "from-amber-600/10 to-amber-500/5 hover:border-amber-200 dark:hover:border-amber-500/30" 
    },
    { 
      icon: Award, 
      title: "Reputation Layered", 
      desc: "Our codebases and systems speak for themselves, built deliberately to secure long-term digital retention, high volume, and premium UI execution.", 
      color: "from-zinc-500/10 to-stone-500/5 hover:border-zinc-300 dark:hover:border-zinc-700" 
    }
  ];

  return (
    <>
      <Navbar/>
      <div className="min-h-screen p-2 bg-zinc-50 dark:bg-zinc-950 font-sans antialiased text-zinc-800 dark:text-zinc-200 selection:bg-amber-100 selection:text-[#A26227]">
        
        {/* HERO SECTION */}
        <section className="relative overflow-hidden px-6 pt-32 pb-24 border-b border-zinc-200/80 dark:border-zinc-800 text-center bg-zinc-900">
          {/* 1. BACKGROUND IMAGE CONTAINER WITH PREMIUM OVERLAYS */}
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80" 
              alt="Premium abstract digital background" 
              className="w-full h-full object-cover object-center opacity-45 mix-blend-luminosity"
            />
            {/* Subtle tint layer to match your warm theme */}
            <div className="absolute inset-0 bg-zinc-50/85 dark:bg-zinc-950/85 mix-blend-multiply" />
            {/* Radial gradient vignette to ensure the center text pops beautifully */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-50/80 dark:via-zinc-950/80 to-zinc-50 dark:to-zinc-950" />
          </div>
          
          {/* 2. HERO CONTENT LAYERS */}
          <div className="max-w-4xl mx-auto relative z-10 space-y-6">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-5xl font-black text-zinc-950 dark:text-zinc-50 tracking-tight leading-[1.15]"
            >
              Crafting high-velocity digital solutions that bridge the gap between{" "}
              <span className="text-[#A26227] dark:text-orange-400 relative inline-block">
                imagination and revenue.
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-sm md:text-base text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto font-semibold leading-relaxed"
            >
              We engineer high-performance web ecosystems designed for speed, luxury design aesthetics, and scalability. From interactive interfaces to secure architectures, we turn bold concepts into high-tier infrastructure.
            </motion.p>
          </div>
        </section>

        {/* CORE FRAMEWORK & VALUE SYSTEM */}
        <section className="max-w-[1400px] mx-auto px-8 py-6 relative overflow-hidden">
          {/* Background Accent Subtle Blurs */}
          <div className="absolute top-1/4 right-0 w-72 h-72 bg-[#FAF5EE]/40 dark:bg-amber-950/10 rounded-full blur-3xl pointer-events-none -z-10" />

          {/* SECTION HEADER BLOCK */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4 text-left">
            <div className="max-w-xl space-y-2">
              <div className="inline-flex items-center space-x-1.5 bg-[#FAF5EE] dark:bg-zinc-900 border border-orange-200/40 dark:border-zinc-800 px-2.5 py-0.5 rounded-md">
                <span className="w-2.5 h-2.5 bg-[#A26227] dark:bg-orange-500 rounded-full" />
                <span className="text-[14px] uppercase text-[#A26227] dark:text-orange-400 tracking-widest font-bold">Framework</span>
              </div>
              <h2 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight leading-none">
                Our Operating Pillars
              </h2>
              <p className="text-[18px] md:text-[16px] text-zinc-400 dark:text-zinc-500 mt-4 font-semibold tracking-tight">
                The immutable architectural standards anchoring every build we execute.
              </p>
            </div>
            
            <div className="hidden md:block h-[1px] bg-zinc-200 dark:bg-zinc-800 flex-1 mx-8 mb-2" />
          </div>

          {/* GRID MATRIX CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-2 text-left">
            {coreValues.map((value, idx) => {
              const IconComponent = value.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: idx * 0.12, ease: [0.21, 0.47, 0.32, 0.98] }}
                  className={`relative bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 p-8 rounded-2xl transition-all duration-300 group flex flex-col justify-between cursor-pointer ${value.color}`}
                >
                  <div>
                    {/* Icon wrapper with structural bounce */}
                    <div className="w-11 h-11 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-700/60 shadow-xs flex items-center justify-center text-zinc-800 dark:text-zinc-200 group-hover:bg-[#FAF5EE] dark:group-hover:bg-zinc-800/80 group-hover:border-orange-200/50 dark:group-hover:border-zinc-600 transition-all duration-300">
                      <IconComponent className="w-5 h-5 text-[#A26227] dark:text-orange-400 group-hover:scale-110 transition-transform duration-300" />
                    </div>

                    {/* Typography Matrix */}
                    <h3 className="text-[22px] font-black text-zinc-900 dark:text-zinc-50 mt-6 mb-3 tracking-tight group-hover:text-[#A26227] dark:group-hover:text-orange-400 transition-colors duration-200">
                      {value.title}
                    </h3>
                    <p className="text-[16px] text-zinc-500 dark:text-zinc-400 font-semibold leading-relaxed">
                      {value.desc}
                    </p>
                  </div>

                  {/* Micro Action Hook appearing on hover */}
                  <div className="pt-6 flex justify-end">
                    <span className="text-[10px] uppercase tracking-wider text-zinc-400 dark:text-zinc-500 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 inline-flex items-center gap-1 font-bold">
                      <ArrowUpRight className="w-3 h-3 text-[#A26227] dark:text-orange-400" />
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* STRATEGIC MISSION BLOCK */}
        <section className="relative overflow-hidden bg-white dark:bg-zinc-900 border-y border-zinc-200/80 dark:border-zinc-800 py-28 px-6">
          {/* Soft geometric accent lines for structure */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#FAF5EE_1px,transparent_1px),linear-gradient(to_bottom,#FAF5EE_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f1f23_1px,transparent_1px),linear-gradient(to_bottom,#1f1f23_1px,transparent_1px)] [background-size:4rem_4rem] opacity-70 pointer-events-none" />

          <div className="max-w-[1300px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center text-left relative z-10">
            
            {/* LEFT COLUMN: INTEL & COPY */}
            <div className="lg:col-span-5 space-y-6">
              {/* Target Icon with a warm amber pulse layer */}
              <div className="relative w-9 h-9 rounded-xl bg-[#FAF5EE] dark:bg-zinc-800 border border-orange-200/60 dark:border-zinc-700 flex items-center justify-center text-[#A26227] dark:text-orange-400">
                <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-[#A26227]/20 dark:bg-orange-500/20 opacity-75" />
                <Target className="w-4 h-4 relative z-10" />
              </div>

              <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight leading-none">
                  Our Relentless Mission
                </h2>
                <p className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400 font-semibold leading-relaxed">
                  In a digital market saturated with generic templates, we specialize in high-end, premium engineering. We eliminate unnecessary framework bloat, utilizing modern stacks to deploy lightning-fast, high-converting platforms.
                </p>
                <p className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400 font-semibold leading-relaxed">
                  Every pixel, animation layer, and structural node is rigorously calculated to present a premium experience while pushing absolute security and structural speed to its limit.
                </p>
              </div>
            </div>

            {/* RIGHT COLUMN: LIGHT GALLERY MATRIX WITH INTEGRATED IMAGE */}
            <div className="lg:col-span-7 relative group grid grid-cols-1 sm:grid-cols-12 gap-4">
              
              {/* 1. Bright Architectural Feature Image */}
              <div className="sm:col-span-5 h-48 sm:h-full min-h-[220px] relative rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950">
                <img 
                  src="https://images.unsplash.com/photo-1545558014-8692077e9b5c?auto=format&fit=crop&w=600&q=80" 
                  alt="Minimal clean architecture layout" 
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 filter saturate-[0.15]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-50/80 dark:from-zinc-900/80 via-transparent to-transparent" />
              </div>

              {/* 2. Metrics Block Grid */}
              <div className="sm:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Card 1 */}
                <motion.div 
                  whileHover={{ y: -3 }}
                  className="bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-800 p-6 rounded-2xl space-y-1 transition-all hover:bg-white dark:hover:bg-zinc-800 hover:border-amber-300/70 dark:hover:border-zinc-700 hover:shadow-xs"
                >
                  <div className="text-2xl font-black text-[#A26227] dark:text-orange-400">99.9%</div>
                  <div className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                    Uptime & Rigidity
                  </div>
                </motion.div>

                {/* Card 2 */}
                <motion.div 
                  whileHover={{ y: -3 }}
                  className="bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-800 p-6 rounded-2xl space-y-1 transition-all hover:bg-white dark:hover:bg-zinc-800 hover:border-amber-300/70 dark:hover:border-zinc-700 hover:shadow-xs"
                >
                  <div className="text-2xl font-black text-zinc-900 dark:text-zinc-100">MERN / Next</div>
                  <div className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                    Core Tech Stack
                  </div>
                </motion.div>

                {/* Card 3 */}
                <motion.div 
                  whileHover={{ y: -3 }}
                  className="bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-800 p-6 rounded-2xl space-y-1 transition-all hover:bg-white dark:hover:bg-zinc-800 hover:border-amber-300/70 dark:hover:border-zinc-700 hover:shadow-xs"
                >
                  <div className="text-2xl font-black text-zinc-900 dark:text-zinc-100">Premium</div>
                  <div className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                    UI/UX Focus
                  </div>
                </motion.div>

                {/* Card 4 */}
                <motion.div 
                  whileHover={{ y: -3 }}
                  className="bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-800 p-6 rounded-2xl space-y-1 transition-all hover:bg-white dark:hover:bg-zinc-800 hover:border-amber-300/70 dark:hover:border-zinc-700 hover:shadow-xs"
                >
                  <div className="text-2xl font-black text-[#A26227] dark:text-orange-400">High-Velocity</div>
                  <div className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                    Deployment Cycles
                  </div>
                </motion.div>

              </div>
            </div>

          </div>
        </section>

        {/* 6. CALL TO ACTION ZONE */}
        <div className="mt-3 mb-3">
          <Cta />
        </div>
        <Footer/>
      </div>
    </>
  );
}