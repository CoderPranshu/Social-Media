import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Eye, Lock, FileText, ChevronRight, HelpCircle, ArrowUpRight } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import Footer from '@/components/footer';
import Cta from '@/components/Cta';

export default function PrivacyPage() {
  const lastUpdated = "June 29, 2026";

  const privacyPillars = [
    { 
      icon: Eye, 
      title: "Absolute Transparency", 
      desc: "We clear out all complex legal jargon to lay down exactly what data we log, how it helps your workflow, and why it stays protected.", 
      color: "from-amber-500/10 to-orange-500/5 hover:border-orange-200 dark:hover:border-amber-500/30" 
    },
    { 
      icon: Lock, 
      title: "Data Sovereignty", 
      desc: "Your data belongs to you. Our architecture is optimized to let you manage, export, or permanently clear your digital records at any time.", 
      color: "from-amber-600/10 to-amber-500/5 hover:border-amber-200 dark:hover:border-amber-500/30" 
    },
    { 
      icon: Shield, 
      title: "Rigorous Security", 
      desc: "We utilize secure database layers and strict encryption standards to eliminate external risk, keeping your dashboard logs airtight.", 
      color: "from-zinc-500/10 to-stone-500/5 hover:border-zinc-300 dark:hover:border-zinc-700" 
    }
  ];

  const policySections = [
    {
      id: "collection",
      title: "1. Information We Collect",
      content: "We aggregate essential data to run high-velocity, high-converting platforms seamlessly. This includes profile metadata (such as your name and account credentials) and interaction signals gathered to optimize your interactive layout feeds.",
    },
    {
      id: "usage",
      title: "2. How We Process Data",
      content: "Your information ensures system logic integrity and permanent platform metrics precision. We process data strictly to customize premium UI experiences, handle authenticated state logic, and eliminate unnecessary infrastructure latency.",
    },
    {
      id: "sharing",
      title: "3. Third-Party Consensus & Sharing",
      content: "We never distribute your premium data logs to third-party brokers. Data sharing is strictly restricted to secure integration layers, such as encrypted payment infrastructure gates or verified analytic signals necessary for platform rigidity.",
    },
    {
      id: "rights",
      title: "4. Digital Control & Sovereignty",
      content: "You retain full control over your dynamic ecosystem profile. You can query, update, or permanently terminate your tracking identity logs through your profile dashboard interface instantly.",
    }
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#FCFAF7] dark:bg-zinc-950 font-sans antialiased text-zinc-800 dark:text-zinc-200 selection:bg-amber-100 dark:selection:bg-amber-950 selection:text-[#A26227] dark:selection:text-amber-400 transition-colors duration-300">
        
        {/* HERO SECTION */}
        <section className="relative overflow-hidden px-6 pt-32 pb-24 border-b border-[#EFEBE4] dark:border-zinc-900 text-center bg-zinc-900">
          {/* BACKGROUND IMAGE CONTAINER WITH PREMIUM OVERLAYS */}
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80" 
              alt="Premium abstract digital background" 
              className="w-full h-full object-cover object-center opacity-45 mix-blend-luminosity"
            />
            <div className="absolute inset-0 bg-[#FCFAF7]/85 mix-blend-multiply dark:hidden" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#FCFAF7]/40 via-[#FCFAF7]/80 to-[#FCFAF7] dark:from-zinc-900/40 dark:via-zinc-950/80 dark:to-zinc-950" />
          </div>
          
          {/* HERO CONTENT */}
          <div className="max-w-4xl mx-auto relative z-10 space-y-6">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-5xl text-zinc-950 dark:text-zinc-50 tracking-tight leading-[1.15]"
            >
              Privacy Policy &{" "}
              <span className="text-[#A26227] dark:text-amber-500 relative inline-block">
                Data Architecture.
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-sm md:text-base text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto font-semibold leading-relaxed"
            >
              We are dedicated to safeguarding your digital footprint. This charter outlines our absolute architectural standards for collecting, protecting, and scaling platform information with complete security.
            </motion.p>
          </div>
        </section>

        {/* CORE PRIVACY PILLARS */}
        <section className="max-w-[1400px] mx-auto px-8 py-16 relative overflow-hidden">
          <div className="absolute top-1/4 right-0 w-72 h-72 bg-[#FAF5EE] dark:bg-zinc-900/20 rounded-full blur-3xl pointer-events-none -z-10" />

          {/* SECTION HEADER BLOCK */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4 text-left">
            <div className="max-w-xl space-y-2">
              <div className="inline-flex items-center space-x-1.5 bg-[#FAF5EE] dark:bg-zinc-900 border border-orange-200/40 dark:border-zinc-800 px-2.5 py-0.5 rounded-md">
                <span className="w-2.5 h-2.5 bg-[#A26227] dark:bg-amber-500 rounded-full" />
                <span className="text-[14px] uppercase text-[#A26227] dark:text-amber-500 tracking-widest">Principles</span>
              </div>
              <h2 className="text-3xl text-zinc-900 dark:text-zinc-100 tracking-tight leading-none">
                Our Privacy Foundation
              </h2>
              <p className="text-[18px] md:text-[16px] text-zinc-400 dark:text-zinc-500 mt-4 font-semibold tracking-tight">
                The immutable operational metrics shielding your data layers.
              </p>
            </div>
            <div className="hidden md:block h-[1px] bg-[#EFEBE4] dark:bg-zinc-800 flex-1 mx-8 mb-2" />
          </div>

          {/* GRID MATRIX CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-2 text-left">
            {privacyPillars.map((value, idx) => {
              const IconComponent = value.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: idx * 0.12, ease: [0.21, 0.47, 0.32, 0.98] }}
                  className={`relative bg-white dark:bg-zinc-900/50 border border-[#EFEBE4] dark:border-zinc-900 p-8 rounded-2xl transition-all duration-300 group flex flex-col justify-between cursor-pointer ${value.color}`}
                >
                  <div>
                    <div className="w-11 h-11 rounded-xl bg-[#FCFAF7] dark:bg-zinc-900 border border-[#EFEBE4] dark:border-zinc-800 shadow-sm flex items-center justify-center text-zinc-800 dark:text-zinc-200 group-hover:bg-[#FAF5EE] dark:group-hover:bg-zinc-800 group-hover:border-orange-200/50 dark:group-hover:border-amber-500/30 transition-all duration-300">
                      <IconComponent className="w-5 h-5 text-[#A26227] dark:text-amber-500 group-hover:scale-110 transition-transform duration-300" />
                    </div>

                    <h3 className="text-[22px] text-zinc-900 dark:text-zinc-100 mt-6 mb-3 tracking-tight group-hover:text-[#A26227] dark:group-hover:text-amber-500 transition-colors duration-200">
                      {value.title}
                    </h3>
                    <p className="text-[16px] text-zinc-500 dark:text-zinc-400 font-semibold leading-relaxed">
                      {value.desc}
                    </p>
                  </div>

                  <div className="pt-6 flex justify-end">
                    <span className="text-[10px] uppercase tracking-wider text-zinc-400 dark:text-zinc-600 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 inline-flex items-center gap-1">
                      Verify <ArrowUpRight className="w-3 h-3 text-[#A26227] dark:text-amber-500" />
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* DETAILED REGULATORY DOCUMENTATION */}
        <section className="relative overflow-hidden bg-white dark:bg-zinc-900/20 border-y border-[#EFEBE4] dark:border-zinc-900 py-24 px-6">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#FAF5EE_1px,transparent_1px),linear-gradient(to_bottom,#FAF5EE_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f1f23_1px,transparent_1px),linear-gradient(to_bottom,#1f1f23_1px,transparent_1px)] [background-size:4rem_4rem] opacity-70 dark:opacity-40 pointer-events-none" />

          <div className="max-w-[1300px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start text-left relative z-10">
            
            {/* STICKY QUICK LINKS NAV */}
            <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-6 bg-[#FCFAF7] dark:bg-zinc-900 border border-[#EFEBE4] dark:border-zinc-800 p-6 rounded-2xl">
              <div className="flex items-center gap-2 pb-4 border-b border-[#EFEBE4] dark:border-zinc-800">
                <FileText className="w-5 h-5 text-[#A26227] dark:text-amber-500" />
                <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">Document Sections</h4>
              </div>
              <nav className="flex flex-col space-y-1.5">
                {policySections.map((section) => (
                  <a 
                    key={section.id} 
                    href={`#${section.id}`}
                    className="group flex items-center justify-between px-3 py-2 text-xs font-bold rounded-lg text-zinc-500 dark:text-zinc-400 hover:bg-[#FAF5EE] dark:hover:bg-zinc-800 hover:text-[#A26227] dark:hover:text-amber-500 transition-all"
                  >
                    <span>{section.title.split('. ')[1]}</span>
                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all text-[#A26227] dark:text-amber-500" />
                  </a>
                ))}
              </nav>
            </div>

            {/* EXPANDED CONTENT BLOCK */}
            <div className="lg:col-span-8 space-y-12">
              {policySections.map((section) => (
                <div key={section.id} id={section.id} className="scroll-mt-32 space-y-4 border-b border-[#EFEBE4]/60 dark:border-zinc-800/60 pb-8 last:border-0 last:pb-0">
                  <h3 className="text-xl md:text-2xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
                    {section.title}
                  </h3>
                  <p className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400 font-semibold leading-relaxed">
                    {section.content}
                  </p>
                  <p className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400 font-semibold leading-relaxed">
                    Our dynamic architecture maintains absolute node validation rules. We process these parameters locally or within secure database environments to eliminate cross-site leakage risk and maintain a clean system experience.
                  </p>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* SEAMLESS QUESTION HELPDESK ZONE */}
       <div className="mt-3 mb-3">
          <Cta />
        </div>

        <Footer />
      </div>
    </>
  );
}