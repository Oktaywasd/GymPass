import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  className = '', 
  hover = false,
  padding = 'md',
  shadow = 'sm',
  rounded = 'lg',
  border = true,
  onClick,
  ...props 
}) => {
  
  const paddings = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8'
  };
  
  const shadows = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl'
  };
  
  const roundeds = {
    none: '',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    full: 'rounded-full'
  };
  
  const baseClasses = `
    bg-white 
    ${border ? 'border border-gray-200' : ''}
    ${shadows[shadow]}
    ${roundeds[rounded]}
    ${paddings[padding]}
    ${onClick ? 'cursor-pointer' : ''}
    ${className}
  `.trim();
  
  const cardVariants = {
    initial: { scale: 1, y: 0 },
    hover: hover ? { 
      scale: 1.02, 
      y: -2,
      boxShadow: "0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
    } : {},
    tap: onClick ? { scale: 0.98 } : {}
  };
  
  const MotionCard = motion.div;
  
  return (
    <MotionCard
      className={baseClasses}
      variants={cardVariants}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      onClick={onClick}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {children}
    </MotionCard>
  );
};

// Alt bileşenler
Card.Header = ({ children, className = '' }) => (
  <div className={`border-b border-gray-200 pb-4 mb-4 ${className}`}>
    {children}
  </div>
);

Card.Body = ({ children, className = '' }) => (
  <div className={className}>
    {children}
  </div>
);

Card.Footer = ({ children, className = '' }) => (
  <div className={`border-t border-gray-200 pt-4 mt-4 ${className}`}>
    {children}
  </div>
);

Card.Title = ({ children, className = '' }) => (
  <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>
    {children}
  </h3>
);

Card.Subtitle = ({ children, className = '' }) => (
  <p className={`text-sm text-gray-600 ${className}`}>
    {children}
  </p>
);

Card.Description = ({ children, className = '' }) => (
  <p className={`text-gray-700 ${className}`}>
    {children}
  </p>
);

export default Card;