"use client";

import React from 'react';

interface AuthButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'social';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

export const AuthButton: React.FC<AuthButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  icon,
  className = '',
}) => {
  const baseClasses = "w-full py-4 px-6 rounded-2xl font-semibold text-center transition-all duration-300 flex items-center justify-center space-x-2 transform hover:scale-[1.02] active:scale-[0.98]";
  
  const variantClasses = {
    primary: "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg hover:shadow-xl",
    secondary: "bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200",
    social: "bg-white text-gray-800 border border-gray-200 hover:bg-gray-50 shadow-sm",
  };

  const disabledClasses = disabled || loading ? "opacity-50 cursor-not-allowed transform-none" : "cursor-pointer";

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${disabledClasses} ${className}`}
      onClick={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          <span>Loading...</span>
        </div>
      ) : (
        <>
          {icon && <span className="w-5 h-5">{icon}</span>}
          <span>{title}</span>
        </>
      )}
    </button>
  );
};