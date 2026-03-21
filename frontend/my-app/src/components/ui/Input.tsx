import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, icon, className = '', ...props }, ref) => {
    const hasError = !!error;

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            {label}
            {props.required && <span className="text-danger-600 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">{icon}</div>}
          <input
            ref={ref}
            className={`
              w-full px-3 py-2 rounded-lg
              border-2 transition-colors
              ${icon ? 'pl-10' : ''}
              ${
                hasError
                  ? 'border-danger-500 focus:border-danger-600 focus:ring-danger-100 dark:focus:ring-danger-900/30'
                  : 'border-neutral-200 dark:border-neutral-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-900/30'
              }
              dark:bg-neutral-800 dark:text-white
              placeholder-neutral-400 dark:placeholder-neutral-500
              disabled:bg-neutral-100 dark:disabled:bg-neutral-900 disabled:cursor-not-allowed disabled:opacity-50
              focus:outline-none
              ${className}
            `}
            aria-invalid={hasError}
            {...props}
          />
        </div>
        {error && <p className="mt-1 text-sm text-danger-600 dark:text-danger-400">{error}</p>}
        {helperText && !error && <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
