import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';

const Input = forwardRef(({ label, error, helperText, className = '', containerClassName = '', leftIcon, rightIcon, type = 'text', ...props }, ref) => {
  const inputClasses = `
    w-full px-4 py-3 bg-input text-foreground placeholder:text-muted-foreground
    border border-border rounded-lg
    focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring
    transition-colors duration-200
    ${leftIcon ? 'pl-10' : ''}
    ${rightIcon ? 'pr-10' : ''}
    ${error ? 'ring-2 ring-destructive border-destructive' : ''}
    ${className}
  `;

  return (
    <motion.div className={`space-y-2 ${containerClassName}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      {label && <label className="block text-sm font-medium text-foreground">{label}</label>}

      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <div className="text-muted-foreground">{leftIcon}</div>
          </div>
        )}

        <input ref={ref} type={type} className={inputClasses} {...props} />

        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <div className="text-light-textSecondary dark:text-dark-textSecondary">{rightIcon}</div>
          </div>
        )}
      </div>

      {error && (
        <motion.p className="text-sm text-red-500" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ duration: 0.2 }}>
          {error}
        </motion.p>
      )}

      {helperText && !error && <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary">{helperText}</p>}
    </motion.div>
  );
});

Input.displayName = 'Input';

export const SearchInput = forwardRef(({ onSearch, placeholder = 'Search...', ...props }, ref) => {
  const handleKeyPress = e => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(e.target.value);
    }
  };

  return (
    <Input
      ref={ref}
      type="text"
      placeholder={placeholder}
      onKeyPress={handleKeyPress}
      leftIcon={
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      }
      {...props}
    />
  );
});

SearchInput.displayName = 'SearchInput';

export default Input;
