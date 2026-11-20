import React from 'react';
// 1. Import Link from Inertia instead of using standard HTML anchor elements
import { Link } from '@inertiajs/react';
import { Twitter, Github, Linkedin, Globe, Shield, Radio } from 'lucide-react';

export default function Footer() {
  const footerLinks = [
    {
      title: "Platform",
      links: [
        { label: "Home", href: "/dashboard" },
        { label: "Explore Predictions", href: "/dashboard" },
        { label: "Trending Topics", href: "/popularfeed" },
      ]
    },
    {
      title: "Company",
      links: [
        { label: "About Us", href: "/about" },
        { label: "Our Mission", href: "/about" },
      ]
    },
    {
      title: "Support",
      links: [
        { label: "Help Center", href: "/help" },
        { label: "Community Guidelines", href: "/privacy" },
      ]
    }
  ];

  return (
    /* CRITICAL MOBILE TWEAK: 
       Changed py-12 to pt-10 pb-24 md:py-12 so that text content 
       safely clears the mobile bottom tab bar navigation wrap layer.
    */
    <footer className="border-t border-zinc-200/60 dark:border-zinc-800/60 bg-gradient-to-b from-white to-zinc-50 dark:from-zinc-900 dark:to-zinc-950 pt-10 pb-24 md:py-12 px-4 sm:px-8 lg:px-16 text-left transition-all duration-300">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-6 gap-8 md:gap-10 lg:gap-12">

        {/* Brand Description Column - Takes up full row space on small screens, half space on desktop grids */}
        <div className="col-span-2 md:col-span-3 space-y-3.5">
          <Link href="/dashboard" className="flex items-center space-x-2.5 font-bold text-zinc-950 dark:text-white text-sm md:text-base no-underline hover:opacity-90 transition-opacity">
            <span className="w-5 h-5 md:w-6 md:h-6 rounded-lg bg-[#A26227] text-white flex items-center justify-center text-xs md:text-sm font-bold shadow-md shadow-[#A26227]/20">
              P
            </span>
            <span className="tracking-tight">PredictionHub</span>
          </Link>
          <p className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed max-w-sm">
            PredictionHub is a social platform where people share predictions, discover
            trending ideas, connect with like-minded thinkers, and build their reputation
            through accurate insights across sports, technology, finance, entertainment,
            and world events.
          </p>
          {/* Social Vector Icons Element */}
          <div className="flex items-center space-x-2.5 pt-1">
            {[
              { icon: Twitter, href: "#" },
              { icon: Github, href: "#" },
              { icon: Linkedin, href: "#" },
              { icon: Globe, href: "#" }
            ].map((social, i) => {
              const Icon = social.icon;
              return (
                <a
                  key={i}
                  href={social.href}
                  className="p-2 rounded-lg border border-zinc-200/60 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 text-zinc-400 hover:text-[#A26227] dark:hover:text-[#d8a15f] hover:border-[#A26227]/40 dark:hover:border-amber-500/30 shadow-sm transition-all duration-200 hover:-translate-y-0.5"
                >
                  <Icon className="w-3.5 h-3.5 md:w-4 md:h-4" />
                </a>
              );
            })}
          </div>
        </div>

        {/* Links Navigation Maps */}
        {footerLinks.map((group, index) => (
          /* col-span-1 means 2 menu headers sit side-by-side cleanly on standard phone widths */
          <div key={index} className="col-span-1 space-y-2.5">
            <h4 className="text-[10px] md:text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
              {group.title}
            </h4>
            <ul className="space-y-2 text-xs md:text-sm font-semibold text-zinc-600 dark:text-zinc-400 list-none m-0 p-0">
              {group.links.map((link, lIndex) => (
                <li key={lIndex}>
              
                  <Link
                    href={link.href}
                    className="hover:text-zinc-950 dark:hover:text-white text-zinc-600 dark:text-zinc-400 transition-colors duration-150 flex items-center group no-underline"
                  >
                    <span className="w-0 group-hover:w-1.5 h-1.5 rounded-full bg-[#A26227] mr-0 group-hover:mr-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom Legal Section Tray */}
      <div className="max-w-7xl mx-auto border-t border-zinc-200/60 dark:border-zinc-800/60 mt-8 pt-5 flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left text-[11px] md:text-xs text-zinc-400 dark:text-zinc-500 font-medium">

        <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-x-3 gap-y-1.5">
          <span>© 2026 PredictionHub. Predict the future. Connect with the community.</span>
          <span className="hidden sm:inline text-zinc-200 dark:text-zinc-800">|</span>
          <div className="flex items-center space-x-3">
            {/* Changed legal links to Inertia <Link> components */}
            <Link href="/privacy" className="hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors no-underline">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors no-underline">Terms & Conditions</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}