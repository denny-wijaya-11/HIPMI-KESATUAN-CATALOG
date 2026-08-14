'use client';

import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { useState, useRef } from 'react';

// Spotlight Background Effect (Optimized - removed JS mouse tracking to fix lag)
export function SpotlightBackground({ children, className = '' }) {
  return (
    <div className={`relative group overflow-hidden ${className}`}>
      <div className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition duration-500 group-hover:opacity-100 bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.1),transparent_70%)]" />
      {children}
    </div>
  );
}

// Tilt Card Effect (Glassmorphism + 3D Tilt)
export function TiltCard({ children, className = '' }) {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX, y: middleY });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{
        rotateX: position.y * -0.05,
        rotateY: position.x * 0.05,
      }}
      transition={{
        type: 'spring',
        stiffness: 100,
        damping: 30,
        mass: 0.5,
      }}
      className={`relative bg-neutral-900/40 border border-white/10 overflow-hidden shadow-2xl rounded-3xl will-change-transform ${className}`}
      style={{ transformStyle: 'preserve-3d', transform: 'translateZ(0)' }}
    >
      {children}
    </motion.div>
  );
}

// Glowing Button (Web3 Style)
export function GlowingButton({ children, href, onClick, className = '' }) {
  const Component = href ? 'a' : 'button';
  
  return (
    <Component
      href={href}
      onClick={onClick}
      className={`relative inline-flex items-center justify-center p-[1px] overflow-hidden text-sm font-medium rounded-full group bg-gradient-to-br from-red-500 via-orange-400 to-amber-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-red-200 dark:focus:ring-red-800 ${className}`}
    >
      <span className="relative px-8 py-4 transition-all ease-in duration-300 bg-neutral-950 rounded-full group-hover:bg-opacity-0 font-semibold tracking-wide">
        {children}
      </span>
      {/* Glow Behind - Optimized */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-orange-400 to-amber-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none -z-10" />
    </Component>
  );
}

// Animated Text Reveal
export function TextReveal({ text, className = '' }) {
  const words = text.split(' ');

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 * i },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div
      className={`flex flex-wrap justify-center ${className}`}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {words.map((word, index) => (
        <motion.span variants={child} key={index} className="mr-3 mb-2">
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
}

// Particle Background (Optimized for performance and full screen)
export function ParticleBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* 100% CSS Gradients instead of heavy CSS blurs and mix-blend modes */}
      <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full" style={{ background: 'radial-gradient(circle, rgba(220,38,38,0.06) 0%, transparent 60%)', transform: 'translateZ(0)' }} />
      <div className="absolute top-[10%] right-[-10%] w-[50vw] h-[50vw] rounded-full" style={{ background: 'radial-gradient(circle, rgba(234,88,12,0.05) 0%, transparent 60%)', transform: 'translateZ(0)' }} />
      <div className="absolute bottom-[-20%] left-[20%] w-[70vw] h-[70vw] rounded-full" style={{ background: 'radial-gradient(circle, rgba(217,119,6,0.05) 0%, transparent 60%)', transform: 'translateZ(0)' }} />
      
      {/* Grid overlay for texture */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20 [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      
      {/* Scanline effect */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px]" />
    </div>
  );
}
