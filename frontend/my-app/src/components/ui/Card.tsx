import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
}

const variantClasses = {
  default: 'bg-white dark:bg-neutral-800 rounded-lg shadow-md',
  elevated: 'bg-white dark:bg-neutral-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow',
  outlined: 'bg-transparent border-2 border-neutral-200 dark:border-neutral-700 rounded-lg',
};

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, variant = 'default', className = '', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`
          ${variantClasses[variant]}
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ title, subtitle, children, className = '', ...props }, ref) => {
    return (
      <div ref={ref} className={`px-6 py-4 border-b border-neutral-200 dark:border-neutral-700 ${className}`} {...props}>
        {title && <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">{title}</h3>}
        {subtitle && <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">{subtitle}</p>}
        {children}
      </div>
    );
  }
);

CardHeader.displayName = 'CardHeader';

interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardBody = React.forwardRef<HTMLDivElement, CardBodyProps>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <div ref={ref} className={`px-6 py-4 ${className}`} {...props}>
        {children}
      </div>
    );
  }
);

CardBody.displayName = 'CardBody';

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`px-6 py-4 border-t border-neutral-200 dark:border-neutral-700 flex gap-3 justify-end ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardFooter.displayName = 'CardFooter';
