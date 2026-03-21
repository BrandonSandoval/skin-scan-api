import React from 'react';

type BadgeVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'neutral';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

const variantClasses: Record<BadgeVariant, string> = {
  primary: 'bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-200 border border-primary-200 dark:border-primary-800',
  secondary: 'bg-secondary-100 dark:bg-secondary-900/30 text-secondary-800 dark:text-secondary-200 border border-secondary-200 dark:border-secondary-800',
  danger: 'bg-danger-100 dark:bg-danger-900/30 text-danger-800 dark:text-danger-200 border border-danger-200 dark:border-danger-800',
  success: 'bg-success-100 dark:bg-success-900/30 text-success-800 dark:text-success-200 border border-success-200 dark:border-success-800',
  warning: 'bg-warning-100 dark:bg-warning-900/30 text-warning-800 dark:text-warning-200 border border-warning-200 dark:border-warning-800',
  neutral: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700',
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs font-semibold rounded',
  md: 'px-3 py-1 text-sm font-semibold rounded-md',
  lg: 'px-4 py-1.5 text-base font-semibold rounded-md',
};

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'primary', size = 'md', icon, className = '', children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={`
          inline-flex items-center gap-1.5
          ${variantClasses[variant]}
          ${sizeClasses[size]}
          ${className}
        `}
        {...props}
      >
        {icon}
        <span>{children}</span>
      </span>
    );
  }
);

Badge.displayName = 'Badge';
