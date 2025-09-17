import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Github, Home } from 'lucide-react';
import ThemeToggle from '../ui/ThemeToggle';

const Header = () => {
  return (
    <motion.header 
      className="sticky top-0 z-50 glass-header" 
      initial={{ y: -100, opacity: 0 }} 
      animate={{ y: 0, opacity: 1 }} 
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div 
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <Link to="/" className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors duration-300">
              <motion.div 
                className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-green-600 shadow-primary-glow flex items-center justify-center"
                whileHover={{ rotate: 5, scale: 1.1 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <Github size={16} className="text-white" />
              </motion.div>
              <span className="font-display font-bold text-xl bg-gradient-to-r from-primary via-green-600 to-emerald-500 bg-clip-text text-transparent">
                GitFlex
              </span>
            </Link>
          </motion.div>

          {/* Navigation */}
          {/* <nav className="hidden md:flex items-center space-x-8">
            <motion.div whileHover={{ y: -2 }}>
              <Link 
                to="/" 
                className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                <Home size={18} />
                <span className="font-medium">Home</span>
              </Link>
            </motion.div>
            
            <motion.div whileHover={{ y: -2 }}>
              <Link 
                to="/about" 
                className="text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium"
              >
                About
              </Link>
            </motion.div>
          </nav> */}

          {/* Theme Toggle */}
          <div className="flex items-center space-x-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <ThemeToggle />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
