import React from 'react'
import loginimage from '../../../public/image/loginimage.png';


const Cta = () => {
  return (
    <section className="group relative bg-gradient-to-br from-[#FAF6F0] to-[#F3ECE0] dark:from-zinc-900 dark:to-zinc-950 border border-[#f4e6d4]/60 dark:border-zinc-800/80 rounded-[1.5rem] md:rounded-[2rem] p-6 sm:p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 text-left overflow-hidden shadow-sm">
          <div className="space-y-4 md:space-y-6 max-w-xl relative z-10 flex-1">
            <h2 className="text-xl sm:text-3xl lg:text-4xl font-black text-zinc-900 dark:text-white tracking-tight leading-tight">
              Join the ecosystem validating global consensus.
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium max-w-lg">
              Create an account to setup targeted prediction dynamic feeds, bookmark core topics, and map verified networks with industry specialists.
            </p>
       
            <div className="pt-1">
              {/* <button className="w-full sm:w-auto bg-[#A26227] hover:bg-[#8F531E] text-white text-xs md:text-sm font-bold px-5 py-3 rounded-xl transition-all shadow-md active:scale-95">
                Register Now
              </button> */}
               <a
                  href="/register"
                  className="w-full sm:w-auto bg-[#A26227] hover:bg-[#8F531E] text-white text-xs md:text-sm font-bold px-5 py-3 rounded-xl transition-all shadow-md active:scale-95"
                >
                     Sign up
                </a>              
            </div>
          </div>
          
          {/* Layered Stacked Cards Layout */}
          <div className="relative hidden md:flex items-center justify-center shrink-0 z-10 w-[240px] h-[240px] lg:w-[300px] lg:h-[300px] md:mr-4">
            <div className="absolute inset-0 rounded-[2rem] bg-[#C59B27] opacity-80 transform rotate-6 scale-95 translate-x-2 translate-y-1 shadow-md" />
            <div className="absolute inset-0 rounded-[2rem] bg-[#E9C341] transform -rotate-3 scale-98 -translate-x-1 shadow-sm" />
            <div className="absolute inset-0 rounded-[2rem] bg-white border border-white/60 dark:border-zinc-800 overflow-hidden shadow-xl flex items-center justify-center p-1">
              <img src={loginimage} alt="Ecosystem Integration" className="w-full h-full object-cover rounded-[1.8rem]" />
            </div>
          </div>
        </section>
  )
}

export default Cta  
  
 