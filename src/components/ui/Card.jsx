import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ children, className = '', hover = true, onClick, padding = 'p-6', variant = 'default', ...props }) => {
  const getCardClasses = () => {
    const baseClasses = `
      bg-card text-card-foreground border border-border/50 rounded-xl transition-all duration-300 ${padding} ${className}
      ${hover ? 'cursor-pointer' : ''}
      ${onClick ? 'cursor-pointer' : ''}
    `;

    switch (variant) {
      case 'glass':
        return `${baseClasses} glass-card`;
      case 'enhanced':
        return `${baseClasses} card-enhanced`;
      default:
        return `${baseClasses} shadow-card-enhanced hover:shadow-card-enhanced-hover`;
    }
  };

  const MotionComponent = motion.div;

  return (
    <MotionComponent
      className={getCardClasses()}
      onClick={onClick}
      whileHover={hover ? { y: -4, scale: 1.02 } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      {...props}
    >
      {children}
    </MotionComponent>
  );
};

export const StatsCard = ({ title, value, subtitle, icon, color = 'text-primary', className = '' }) => {
  return (
    <Card className={`text-center ${className}`} padding="p-6" variant="enhanced">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.1, duration: 0.3, ease: 'easeOut' }} className="space-y-3">
        {icon && (
          <motion.div 
            className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-green-600/10 border border-primary/20 ${color} mb-2`}
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.2 }}
          >
            {icon}
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.3 }}>
          <h3 className="text-3xl font-bold text-foreground">{value}</h3>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          {subtitle && <p className="text-xs text-muted-foreground/75">{subtitle}</p>}
        </motion.div>
      </motion.div>
    </Card>
  );
};

export const FeatureCard = ({ title, description, icon, className = '', delay = 0 }) => {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.5, ease: 'easeOut' }}>
      <Card className={`text-center h-full ${className}`} variant="enhanced">
        <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }} className="space-y-4">
          {icon && (
            <motion.div 
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-green-600 text-white shadow-primary-glow"
              whileHover={{ rotate: 5, scale: 1.1 }}
              transition={{ duration: 0.3 }}
            >
              {icon}
            </motion.div>
          )}

          <div>
            <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
            <p className="text-muted-foreground leading-relaxed">{description}</p>
          </div>
        </motion.div>
      </Card>
    </motion.div>
  );
};

export const ProfileCard = ({ profile, onClick, className = '' }) => {
  return (
    <Card onClick={onClick} className={`overflow-hidden ${className}`} padding="p-0" variant="enhanced">
      <div className="p-6 text-center space-y-4">
        <motion.div
          className="relative inline-block"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.2 }}
        >
          <img
            src={profile.avatar_url}
            alt={profile.login}
            className="w-20 h-20 rounded-2xl mx-auto shadow-primary-glow border-2 border-primary/20"
          />
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full border-2 border-card opacity-90"></div>
        </motion.div>

        <div className="space-y-2">
          <h3 className="font-semibold text-foreground text-lg">{profile.name || profile.login}</h3>
          <p className="text-sm text-muted-foreground bg-muted/50 rounded-full px-3 py-1 inline-block">@{profile.login}</p>
        </div>

        {/* Hide user bio for consistent cards */}
        {/* {profile.bio && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {profile.bio}
          </p>
        )} */}
      </div>
    </Card>
  );
};

export default Card;
