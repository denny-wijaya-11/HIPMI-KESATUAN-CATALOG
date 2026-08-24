'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

// Simple hover lift card — replaces TiltCard 3D effect
export function SimpleCard({ children, className = '' }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className={`bg-[#F2F2F2] rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden ${className}`}
    >
      {children}
    </motion.div>
  );
}

// Clean solid button — replaces GlowingButton
export function SolidButton({ children, href, onClick, variant = 'primary', className = '' }) {
  const Component = href ? Link : 'button';
  
  const variants = {
    primary: 'bg-[#C62828] hover:bg-[#8E0000] text-white shadow-sm hover:shadow-md',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-800',
    outline: 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 hover:border-gray-300',
  };

  return (
    <Component
      href={href || undefined}
      onClick={onClick}
      className={`inline-flex items-center justify-center px-7 py-3.5 rounded-full text-sm font-semibold transition-all duration-200 ${variants[variant]} ${className}`}
    >
      {children}
    </Component>
  );
}

// Warm background section — replaces ParticleBackground
export function WarmBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Subtle warm gradient blobs */}
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full opacity-30" style={{ background: 'radial-gradient(circle, rgba(198,40,40,0.08) 0%, transparent 70%)' }} />
      <div className="absolute top-1/3 -left-20 w-[400px] h-[400px] rounded-full opacity-30" style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 70%)' }} />
      <div className="absolute -bottom-40 right-1/4 w-[500px] h-[500px] rounded-full opacity-20" style={{ background: 'radial-gradient(circle, rgba(198,40,40,0.05) 0%, transparent 70%)' }} />
    </div>
  );
}

// Stat counter for hero
export function StatItem({ value, label }) {
  return (
    <div className="text-center">
      <div className="text-2xl md:text-3xl font-bold text-[#C62828]">{value}</div>
      <div className="text-xs md:text-sm text-gray-500 mt-1">{label}</div>
    </div>
  );
}
