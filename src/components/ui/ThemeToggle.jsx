import React from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      className={`
        relative p-3 rounded-2xl glass-badge
        text-primary hover:text-primary/80
        transition-all duration-300
        group
        ${className}
      `}
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.05 }}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <motion.div
        className="relative"
        animate={{
          rotate: theme === 'light' ? 0 : 180,
          scale: [1, 0.8, 1]
        }}
        transition={{
          rotate: { duration: 0.5, ease: 'easeInOut' },
          scale: { duration: 0.3 }
        }}
      >
        {theme === 'light' ? (
          <Sun size={18} className="group-hover:drop-shadow-sm transition-all" />
        ) : (
          <Moon size={18} className="group-hover:drop-shadow-sm transition-all" />
        )}
      </motion.div>

      {/* Enhanced glow effect */}
      <motion.div 
        className="absolute inset-0 rounded-2xl bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
        whileHover={{ scale: 1.1 }} 
      />
    </motion.button>
  );
};

export default ThemeToggle;
