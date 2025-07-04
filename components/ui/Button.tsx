
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary';
    size?: 'sm' | 'md';
}

export const Button = ({ children, className = '', variant = 'primary', size = 'md', ...props }: ButtonProps) => {
    const baseClasses = 'font-bold rounded-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900';
    
    const variantClasses = {
        primary: 'bg-cyan-600 hover:bg-cyan-700 text-white focus:ring-cyan-500',
        secondary: 'bg-gray-700 hover:bg-gray-600 text-gray-200 focus:ring-gray-500',
    };

    const sizeClasses = {
        sm: 'py-1 px-2 text-xs',
        md: 'py-2 px-4 text-sm',
    };

    return (
        <button
            className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};