import { forwardRef, useState } from 'react';
import { motion } from 'framer-motion';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const Input = forwardRef(({
  label,
  type = 'text',
  placeholder,
  error,
  helperText,
  disabled = false,
  required = false,
  icon,
  iconPosition = 'left',
  fullWidth = true,
  size = 'md',
  variant = 'default',
  multiline = false,
  rows = 3,
  className = '',
  ...props
}, ref) => {
  
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  const inputType = type === 'password' && showPassword ? 'text' : type;
  
  const baseClasses = 'block w-full rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    default: `
      border-gray-300 
      focus:border-primary-500 
      focus:ring-primary-500
      ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
    `,
    filled: `
      border-transparent 
      bg-gray-100 
      focus:bg-white 
      focus:border-primary-500 
      focus:ring-primary-500
      ${error ? 'bg-red-50 border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
    `
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base'
  };
  
  const inputClasses = `
    ${baseClasses}
    ${variants[variant]}
    ${sizes[size]}
    ${icon ? (iconPosition === 'left' ? 'pl-10' : 'pr-10') : ''}
    ${type === 'password' ? 'pr-10' : ''}
    ${!fullWidth ? 'w-auto' : ''}
    ${className}
  `.trim();

  const containerVariants = {
    initial: { scale: 1 },
    focus: { scale: 1.01 }
  };

  return (
    <motion.div 
      className={`${fullWidth ? 'w-full' : 'w-auto'}`}
      variants={containerVariants}
      initial="initial"
      animate={isFocused ? "focus" : "initial"}
    >
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && iconPosition === 'left' && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-400 text-sm">{icon}</span>
          </div>
        )}
        
        {multiline ? (
          <textarea
            ref={ref}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            rows={rows}
            className={inputClasses}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />
        ) : (
          <input
            ref={ref}
            type={inputType}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            className={inputClasses}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />
        )}
        
        {type === 'password' && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            ) : (
              <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            )}
          </button>
        )}
        
        {icon && iconPosition === 'right' && type !== 'password' && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-gray-400 text-sm">{icon}</span>
          </div>
        )}
      </div>
      
      {error && (
        <motion.p 
          className="mt-1 text-sm text-red-600"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {error}
        </motion.p>
      )}
      
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">
          {helperText}
        </p>
      )}
    </motion.div>
  );
});

Input.displayName = 'Input';

export default Input;