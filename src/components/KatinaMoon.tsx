import React from 'react';
import { motion } from 'motion/react';

export const KatinaMoon = ({ className }: { className?: string }) => (
  <div className={`relative ${className}`}>
    <motion.div
      animate={{ 
        scale: [1, 1.05, 1],
        rotate: [0, 5, -5, 0]
      }}
      transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      className="relative w-full h-full flex items-center justify-center"
    >
      {/* Ethereal Glow Layer */}
      <motion.div 
        animate={{ 
          opacity: [0.15, 0.35, 0.15],
          scale: [1, 1.25, 1] 
        }}
        transition={{ duration: 5, repeat: Infinity }}
        className="absolute inset-0 bg-[#ecd8a6]/20 blur-[40px] rounded-full scale-150"
      />
      
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-[#ecd8a6] relative z-10 drop-shadow-[0_0_12px_rgba(236,216,166,0.5)]">
        {/* Detailed Crescent */}
        <path 
          d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" 
          fill="currentColor"
          fillOpacity="0.1"
          stroke="currentColor" 
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Mystic Star hanging off the tip area */}
        <motion.path
          d="M19 7l0.5 1.2 1.2 0.5-1.2 0.5-0.5 1.2-0.5-1.2-1.2-0.5 1.2-0.5 0.5-1.2z"
          fill="currentColor"
          animate={{ 
            scale: [0.7, 1.1, 0.7],
            opacity: [0.3, 0.9, 0.3],
            rotate: [0, 90, 180, 270, 360]
          }}
          transition={{ 
            scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
            opacity: { duration: 3, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 8, repeat: Infinity, ease: "linear" }
          }}
        />

        {/* Floating dust particles inside crescent */}
        <motion.circle
          cx="8" cy="12" r="0.2"
          fill="currentColor"
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 4, repeat: Infinity, delay: 1 }}
        />
        <motion.circle
          cx="12" cy="16" r="0.15"
          fill="currentColor"
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 3, repeat: Infinity, delay: 2 }}
        />
        <motion.circle
          cx="10" cy="8" r="0.1"
          fill="currentColor"
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
        />
      </svg>
    </motion.div>
  </div>
);
