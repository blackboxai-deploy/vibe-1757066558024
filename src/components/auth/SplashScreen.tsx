"use client";

import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [logoScale, setLogoScale] = useState(0.8);

  useEffect(() => {
    // Logo animation
    const scaleAnimation = setInterval(() => {
      setLogoScale(prev => prev === 0.8 ? 1.1 : 0.8);
    }, 1000);

    // Simulate app initialization
    const timer = setTimeout(() => {
      setIsLoading(false);
      setTimeout(onFinish, 500); // Small delay before navigation
    }, 3000);

    return () => {
      clearInterval(scaleAnimation);
      clearTimeout(timer);
    };
  }, [onFinish]);

  return (
    <div className="flex-1 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex items-center justify-center relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-white rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-20 w-40 h-40 bg-white rounded-full blur-3xl animate-pulse delay-2000"></div>
        <div className="absolute bottom-20 right-16 w-28 h-28 bg-white rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      {/* Logo Container */}
      <div className="flex flex-col items-center z-10">
        {/* Logo */}
        <div 
          className="mb-8 transition-transform duration-1000 ease-in-out"
          style={{ transform: `scale(${logoScale})` }}
        >
          <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-2xl">
            <span className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              E
            </span>
          </div>
        </div>

        {/* App Name */}
        <h1 className="text-4xl font-bold text-white mb-2 tracking-wide">
          Eonify
        </h1>
        
        <p className="text-white/80 text-lg mb-12 text-center px-8">
          Secure Authentication Platform
        </p>

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex flex-col items-center">
            <div className="flex space-x-2 mb-4">
              <div className="w-3 h-3 bg-white rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-white rounded-full animate-bounce delay-100"></div>
              <div className="w-3 h-3 bg-white rounded-full animate-bounce delay-200"></div>
            </div>
            <p className="text-white/60 text-sm">Initializing...</p>
          </div>
        )}
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg 
          viewBox="0 0 1440 320" 
          className="w-full h-32 fill-current text-white/5"
        >
          <path d="M0,160L48,144C96,128,192,96,288,106.7C384,117,480,171,576,186.7C672,203,768,181,864,154.7C960,128,1056,96,1152,106.7C1248,117,1344,171,1392,197.3L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>
    </div>
  );
};