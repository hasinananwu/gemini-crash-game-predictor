
import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
}

const CardComponent = ({ children, className = '' }: CardProps) => {
    return (
        <div className={`bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg shadow-lg ${className}`}>
            {children}
        </div>
    );
};

const Title = ({ children, className = '' }: CardProps) => {
    return <h2 className={`p-4 text-lg font-bold text-gray-200 border-b border-gray-700 ${className}`}>{children}</h2>;
};

const Body = ({ children, className = '' }: CardProps) => {
    return <div className={`p-4 ${className}`}>{children}</div>;
};

export const Card = Object.assign(CardComponent, { Title, Body });
