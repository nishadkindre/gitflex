import React from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) => {
  const location = useLocation();

  // Check if current route is a profile page (any path that's not /, /about, /404)
  const isProfilePage = location.pathname !== '/' && location.pathname !== '/about' && location.pathname !== '/404' && !location.pathname.startsWith('/404');

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      <Header />

      <motion.main className="flex-1 w-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, ease: 'easeOut' }}>
        {children}
      </motion.main>

      {!isProfilePage && <Footer />}
    </div>
  );
};

export default Layout;
