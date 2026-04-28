import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Github } from 'lucide-react';
import ThemeToggle from '../ui/ThemeToggle';

const Header = () => {
  return (
    <motion.header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border" initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.5, ease: 'easeOut' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div whileTap={{ scale: 0.95 }}>
            <Link to="/" className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors duration-200">
              <div className="w-8 h-8 rounded-lg bg-primary shadow-sm flex items-center justify-center">
                <Github size={16} className="text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-xl bg-gradient-to-r from-primary to-green-500 bg-clip-text text-transparent">GitFlex</span>
            </Link>
          </motion.div>

          {/* Navigation */}
          {/* <nav className="hidden md:flex items-center space-x-6">
            <motion.div whileHover={{ y: -1 }}>
              <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium">
                About
              </Link>
            </motion.div>
            <motion.div whileHover={{ y: -1 }}>
              <a
                href="https://github.com/nishadkindre/gitflex"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium flex items-center gap-1.5"
              >
                <Github size={14} />
                GitHub
              </a>
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
