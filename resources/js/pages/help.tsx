import React from 'react';
import { motion } from 'framer-motion';
import { Search, HelpCircle, BookOpen, MessageSquare, Code, ArrowUpRight, ChevronRight, Zap } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import Footer from '@/components/footer';
import Cta from '@/components/Cta';

export default function HelpPage() {
  const supportCategories = [
    { 
      icon: BookOpen, 
      title: "Guides & Tutorials", 
      desc: "Deep-dive documentation covering interactive UI configurations, layout strategies, and deployment loops.", 
      color: "from-amber-500/10 to-orange-500/5 hover:border-orange-200 dark:hover:border-amber-500/30" 
    },
    { 
      icon: Code, 
      title: "API & Integrations", 
      desc: "Technical manifests for setting up dynamic data streams, Webhooks, and authenticating system dashboard pipelines.", 
      color: "from-amber-600/10 to-amber-500/5 hover:border-amber-200 dark:hover:border-amber-500/30" 
    },
    { 
      icon: MessageSquare, 
      title: "Community Desk", 
      desc: "Collaborate with global platform developers to exchange custom system structures and UI logic setups.", 
      color: "from-zinc-500/10 to-stone-500/5 hover:border-zinc-300 dark:hover:border-zinc-700" 
    }
  ];

  const faqs = [
    {
      id: "faq-1",
      question: "How do I sync my active analytics feed?",
      answer: "Navigate to your dashboard integration tab, generate a secure platform parameter node, and drop the tracking secret directly into your environment stack for immediate live ingestion cycles."
    },
    {
      id: "faq-2",
      question: "Can I customize the luxury layout presets?",
      answer: "Absolutely. Our UI components utilize structured modern layers allowing you to easily adjust tracking curves, animation weights, and glassmorphism levels globally."
    },
    {
      id: "faq-3",
      question: "What happens if a data stream experiences latency?",
      answer: "Our fallback architecture immediately handles redundant caching states locally to ensure the client-side experience suffers zero framework bloat or UI freezes while reconnecting."
    },
    {
      id: "faq-4",
      question: "How do I manage multi-tenant permissions?",
      answer: "Role-based parameters can be configured directly inside your administrative control panel, allowing you to lock or open access metrics for specific team profile channels instantly."
    }
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#FCFAF7] dark:bg-zinc-950 font-sans antialiased text-zinc-800 dark:text-zinc-200 selection:bg-amber-100 dark:selection:bg-amber-950 selection:text-[#A26227] dark:selection:text-amber-400 transition-colors duration-300">
        
        {/* HERO SECTION WITH INTEGRATED SEARCH INPUT */}
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
          <div className="max-w-4xl mx-auto relative z-10 space-y-8">
            <div className="space-y-4">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-4xl md:text-5xl text-zinc-950 dark:text-zinc-50 tracking-tight leading-[1.15]"
              >
                How can we refine your{" "}
                <span className="text-[#A26227] dark:text-amber-500 relative inline-block">
                  digital operations?
                </span>
              </motion.h1>
            </div>

            {/* PREMIUM SEARCH BAR COMPONENT */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="max-w-xl mx-auto relative"
            >
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-zinc-400 dark:text-zinc-500" />
              </div>
              <input 
                type="text" 
                placeholder="Search topics, error codes, or technical guides..." 
                className="w-full bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 border border-[#EFEBE4] dark:border-zinc-800 rounded-2xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#A26227]/20 dark:focus:ring-amber-500/30 focus:border-[#A26227] dark:focus:border-amber-500 transition-all shadow-sm font-medium"
              />
            </motion.div>
          </div>
        </section>

        {/* RESOURCE CHANNELS */}
        <section className="max-w-[1400px] mx-auto px-8 py-16 relative overflow-hidden">
          <div className="absolute top-1/4 right-0 w-72 h-72 bg-[#FAF5EE] dark:bg-zinc-900/20 rounded-full blur-3xl pointer-events-none -z-10" />

          {/* SECTION HEADER BLOCK */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4 text-left">
            <div className="max-w-xl space-y-2">
              <div className="inline-flex items-center space-x-1.5 bg-[#FAF5EE] dark:bg-zinc-900 border border-orange-200/40 dark:border-zinc-800 px-2.5 py-0.5 rounded-md">
                <span className="w-2.5 h-2.5 bg-[#A26227] dark:bg-amber-500 rounded-full" />
                <span className="text-[14px] uppercase text-[#A26227] dark:text-amber-500 tracking-widest">Knowledge</span>
              </div>
              <h2 className="text-3xl text-zinc-900 dark:text-zinc-100 tracking-tight leading-none">
                Resource Matrices
              </h2>
              <p className="text-[18px] md:text-[16px] text-zinc-400 dark:text-zinc-500 mt-4 font-semibold tracking-tight">
                Select an operational directory to isolate architectural concepts.
              </p>
            </div>
            <div className="hidden md:block h-[1px] bg-[#EFEBE4] dark:bg-zinc-800 flex-1 mx-8 mb-2" />
          </div>

          {/* GRID MATRIX CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-2 text-left">
            {supportCategories.map((category, idx) => {
              const IconComponent = category.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: idx * 0.12, ease: [0.21, 0.47, 0.32, 0.98] }}
                  className={`relative bg-white dark:bg-zinc-900/50 border border-[#EFEBE4] dark:border-zinc-900 p-8 rounded-2xl transition-all duration-300 group flex flex-col justify-between cursor-pointer ${category.color}`}
                >
                  <div>
                    <div className="w-11 h-11 rounded-xl bg-[#FCFAF7] dark:bg-zinc-900 border border-[#EFEBE4] dark:border-zinc-800 shadow-sm flex items-center justify-center text-zinc-800 dark:text-zinc-200 group-hover:bg-[#FAF5EE] dark:group-hover:bg-zinc-800 group-hover:border-orange-200/50 dark:group-hover:border-amber-500/30 transition-all duration-300">
                      <IconComponent className="w-5 h-5 text-[#A26227] dark:text-amber-500 group-hover:scale-110 transition-transform duration-300" />
                    </div>

                    <h3 className="text-[22px] text-zinc-900 dark:text-zinc-100 mt-6 mb-3 tracking-tight group-hover:text-[#A26227] dark:group-hover:text-amber-500 transition-colors duration-200">
                      {category.title}
                    </h3>
                    <p className="text-[16px] text-zinc-500 dark:text-zinc-400 font-semibold leading-relaxed">
                      {category.desc}
                    </p>
                  </div>

                  <div className="pt-6 flex justify-end">
                    <span className="text-[10px] uppercase tracking-wider text-zinc-400 dark:text-zinc-600 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 inline-flex items-center gap-1">
                      Open Index <ArrowUpRight className="w-3 h-3 text-[#A26227] dark:text-amber-500" />
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* KNOWLEDGE BASE CORE FAQ LAYOUT */}
        <section className="relative overflow-hidden bg-white dark:bg-zinc-900/20 border-y border-[#EFEBE4] dark:border-zinc-900 py-24 px-6">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#FAF5EE_1px,transparent_1px),linear-gradient(to_bottom,#FAF5EE_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f1f23_1px,transparent_1px),linear-gradient(to_bottom,#1f1f23_1px,transparent_1px)] [background-size:4rem_4rem] opacity-70 dark:opacity-40 pointer-events-none" />

          <div className="max-w-[1300px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start text-left relative z-10">
            
            {/* LEFT COLUMN PANEL HEADER */}
            <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-4">
              <div className="w-9 h-9 rounded-xl bg-[#FAF5EE] dark:bg-zinc-900 border border-orange-200/60 dark:border-zinc-800 flex items-center justify-center text-[#A26227] dark:text-amber-500">
                <HelpCircle className="w-4 h-4" />
              </div>
              <h2 className="text-3xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight leading-none">
                Frequent Inquiries
              </h2>
              <p className="text-xs md:text-sm text-zinc-400 dark:text-zinc-500 font-semibold leading-relaxed">
                Quick solutions to standard integration paradigms calculated directly by our system architecture desk.
              </p>
            </div>

            {/* RIGHT COLUMN INDIVIDUAL FAQ LOGS */}
            <div className="lg:col-span-8 space-y-6">
              {faqs.map((faq) => (
                <div 
                  key={faq.id} 
                  className="bg-[#FCFAF7] dark:bg-zinc-900/40 border border-[#EFEBE4] dark:border-zinc-800/80 p-6 rounded-2xl space-y-3 transition-all hover:bg-white dark:hover:bg-zinc-900 hover:border-amber-300/70 dark:hover:border-amber-500/40 hover:shadow-xs group cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-base md:text-lg font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-[#A26227] dark:group-hover:text-amber-500 transition-colors duration-200">
                      {faq.question}
                    </h3>
                    <ChevronRight className="w-4 h-4 text-zinc-400 dark:text-zinc-500 group-hover:text-[#A26227] dark:group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all mt-1 flex-shrink-0" />
                  </div>
                  <p className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400 font-semibold leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* HIGH-TOUCH CTA SUPPORT BRIDGE */}
       <div className="mt-3 mb-3">
          <Cta />
        </div>

        <Footer />
      </div>
    </>
  );
}