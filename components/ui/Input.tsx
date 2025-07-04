
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = ({ className = '', ...props }: InputProps) => {
    const baseClasses = 'w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-200';
    return (
        <input
            className={`${baseClasses} ${className}`}
            {...props}
        />
    );
};
