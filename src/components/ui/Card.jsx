import React, { memo, useMemo } from 'react';
import { motion } from 'framer-motion';

const Card = memo(({ children, className = '', hover = true, onClick, padding = 'p-6', ...props }) => {
  const cardClasses = useMemo(() => `
    bg-card text-card-foreground border border-border rounded-lg shadow-neo dark:shadow-neo-dark ${padding} ${className}
    ${hover ? 'cursor-pointer' : ''}
    ${onClick ? 'cursor-pointer' : ''}
  `, [className, hover, onClick, padding]);

  const MotionComponent = motion.div;

  return (
    <MotionComponent
      className={cardClasses}
      onClick={onClick}
      // whileHover={hover ? { y: -4, scale: 1.02 } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      {...props}
    >
      {children}
    </MotionComponent>
  );
});

Card.displayName = 'Card';

export const StatsCard = memo(({ title, value, subtitle, icon, color = 'text-primary', className = '' }) => {
  return (
    <Card className={`text-center ${className}`} padding="p-4">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.1, duration: 0.3, ease: 'easeOut' }} className="space-y-2">
        {icon && <div className={`inline-flex items-center justify-center w-12 h-12 rounded-neo bg-light-bg dark:bg-dark-bg ${color} mb-2`}>{icon}</div>}

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.3 }}>
          <h3 className="text-2xl font-bold text-light-text dark:text-dark-text">{value}</h3>
          <p className="text-sm font-medium text-light-textSecondary dark:text-dark-textSecondary">{title}</p>
          {subtitle && <p className="text-xs text-light-textSecondary dark:text-dark-textSecondary opacity-75">{subtitle}</p>}
        </motion.div>
      </motion.div>
    </Card>
  );
});

StatsCard.displayName = 'StatsCard';

export const FeatureCard = ({ title, description, icon, className = '', delay = 0 }) => {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.5, ease: 'easeOut' }}>
      <Card className={`text-center h-full ${className}`}>
        <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }} className="space-y-4">
          {icon && (
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-neo-lg bg-gradient-to-br from-light-accent to-light-success dark:from-dark-accent dark:to-dark-success text-white shadow-neo dark:shadow-neo-dark">
              {icon}
            </div>
          )}

          <div>
            <h3 className="text-xl font-semibold text-light-text dark:text-dark-text mb-2">{title}</h3>
            <p className="text-light-textSecondary dark:text-dark-textSecondary leading-relaxed">{description}</p>
          </div>
        </motion.div>
      </Card>
    </motion.div>
  );
};

export const ProfileCard = ({ profile, onClick, className = '' }) => {
  return (
    <Card onClick={onClick} className={`overflow-hidden ${className}`} padding="p-0">
      <div className="p-4 text-center space-y-3">
        <motion.img
          src={profile.avatar_url}
          alt={profile.login}
          className="w-16 h-16 rounded-full mx-auto shadow-neo dark:shadow-neo-dark"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.2 }}
        />

        <div>
          <h3 className="font-semibold text-light-text dark:text-dark-text">{profile.name || profile.login}</h3>
          <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary">@{profile.login}</p>
        </div>

        {/* Hide user bio for consistent cards */}
        {/* {profile.bio && (
          <p className="text-xs text-light-textSecondary dark:text-dark-textSecondary line-clamp-2">
            {profile.bio}
          </p>
        )} */}
      </div>
    </Card>
  );
};

export default Card;
