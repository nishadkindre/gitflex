import React, { forwardRef, useMemo } from 'react';
import { motion } from 'framer-motion';

const Button = forwardRef(({ children, variant = 'primary', size = 'md', disabled = false, loading = false, className = '', onClick, type = 'button', ...props }, ref) => {
  const baseClasses =
    'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = useMemo(
    () => ({
      primary: 'bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 focus:ring-secondary',
      outline: 'border-2 border-border text-foreground hover:bg-muted hover:text-foreground focus:ring-primary bg-transparent',
      ghost: 'text-muted-foreground hover:text-foreground hover:bg-muted focus:ring-primary bg-transparent',
      gradient: 'bg-gradient-to-r from-primary to-green-600 text-primary-foreground hover:from-primary/90 hover:to-green-600/90 focus:ring-primary',
      default: 'bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary'
    }),
    []
  );

  const sizes = useMemo(
    () => ({
      sm: 'px-3 py-1.5 text-sm rounded-md',
      md: 'px-4 py-2 text-sm rounded-lg',
      lg: 'px-6 py-3 text-base rounded-lg',
      xl: 'px-8 py-4 text-lg rounded-lg'
    }),
    []
  );

  const classes = useMemo(() => `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`, [baseClasses, variants, variant, sizes, size, className]);

  const buttonContent = (
    <>
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {children}
    </>
  );

  if (onClick || type === 'submit') {
    return (
      <motion.button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        onClick={onClick}
        className={classes}
        whileHover={{ scale: disabled ? 1 : 1.02 }}
        whileTap={{ scale: disabled ? 1 : 0.98 }}
        {...props}
      >
        {buttonContent}
      </motion.button>
    );
  }

  return (
    <motion.div ref={ref} className={classes} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} {...props}>
      {buttonContent}
    </motion.div>
  );
});

Button.displayName = 'Button';

export const IconButton = forwardRef(({ children, variant = 'ghost', size = 'md', className = '', ...props }, ref) => {
  const sizes = {
    sm: 'w-8 h-8 rounded-lg',
    md: 'w-10 h-10 rounded-neo',
    lg: 'w-12 h-12 rounded-neo-lg'
  };

  return (
    <Button ref={ref} variant={variant} className={`${sizes[size]} p-0 ${className}`} {...props}>
      {children}
    </Button>
  );
});

IconButton.displayName = 'IconButton';

export default Button;
