import React from 'react';

interface InputProps {
    type?: string;
    placeholder?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    label?: string;
    error?: string;
    required?: boolean;
    disabled?: boolean;
    className?: string;
}

const Input: React.FC<InputProps> = ({
    type = 'text',
    placeholder,
    value,
    onChange,
    label,
    error,
    required = false,
    disabled = false,
    className = '',
}) => {
    return (
        <div className={`flex flex-col space-y-1 ${className}`}>
            {label && (
                <label className="text-sm font-medium text-gray-700">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={required}
                disabled={disabled}
                className={`px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed ${
                    error ? 'border-red-500' : ''
                }`}
            />
            {error && <span className="text-sm text-red-500">{error}</span>}
        </div>
    );
};

export default Input;