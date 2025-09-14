import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Github, Home } from 'lucide-react';
import ThemeToggle from '../ui/ThemeToggle';

const Header = () => {
  return (
    <motion.header className="sticky top-0 z-50 backdrop-blur-sm bg-background/80 border-b border-border" initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.5, ease: 'easeOut' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div whileTap={{ scale: 0.95 }}>
            <Link to="/" className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors duration-200">
              <div className="w-8 h-8 rounded-lg bg-primary shadow-sm flex items-center justify-center">
                <Github size={16} className="text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-xl bg-gradient-to-r from-primary to-green-600 bg-clip-text text-transparent">GitFlex</span>
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
            <ThemeToggle />
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
