import React from 'react';

interface SwitchProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label: string;
    id: string;
}

export const Switch = ({ checked, onChange, label, id }: SwitchProps) => {
    const handleToggle = () => {
        onChange(!checked);
    }
    
    return (
        <div className="flex items-center">
            <label 
                htmlFor={id} 
                onClick={handleToggle}
                className="text-sm font-medium text-gray-300 mr-3 select-none cursor-pointer"
            >
                {label}
            </label>
            <button
                type="button"
                id={id}
                role="switch"
                aria-checked={checked}
                onClick={handleToggle}
                className={`${
                    checked ? 'bg-cyan-600' : 'bg-gray-600'
                } relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900 cursor-pointer`}
            >
                <span
                    aria-hidden="true"
                    className={`${
                        checked ? 'translate-x-5' : 'translate-x-0'
                    } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                />
            </button>
        </div>
    );
};