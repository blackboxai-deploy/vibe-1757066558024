"use client";

import React from 'react';
import { AuthButton } from './AuthButton';

interface WelcomeScreenProps {
  onSignUp: () => void;
  onSignIn: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onSignUp, onSignIn }) => {
  return (
    <div className="flex-1 bg-gradient-to-br from-purple-50 to-blue-50 flex flex-col">
      {/* Header */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 pt-16">
        {/* Logo */}
        <div className="mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl flex items-center justify-center shadow-xl">
            <span className="text-3xl font-bold text-white">E</span>
          </div>
        </div>

        {/* Welcome Text */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4 text-center">
          Welcome to Eonify
        </h1>
        
        <p className="text-lg text-gray-600 text-center mb-12 leading-relaxed px-4">
          Your secure gateway to seamless authentication and account management
        </p>

        {/* Features */}
        <div className="space-y-4 mb-12 w-full max-w-sm">
          <div className="flex items-center space-x-4 bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-sm">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Secure & Private</h3>
              <p className="text-sm text-gray-600">Bank-level encryption</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-sm">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Two-Factor Auth</h3>
              <p className="text-sm text-gray-600">Extra layer of security</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-sm">
            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Lightning Fast</h3>
              <p className="text-sm text-gray-600">Instant authentication</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-8 pb-12 space-y-4">
        <AuthButton
          title="Create Account"
          onPress={onSignUp}
          variant="primary"
        />
        
        <AuthButton
          title="Sign In"
          onPress={onSignIn}
          variant="secondary"
        />
        
        <p className="text-center text-sm text-gray-500 mt-6 px-4">
          By continuing, you agree to our{' '}
          <span className="text-purple-600 font-medium">Terms of Service</span>
          {' '}and{' '}
          <span className="text-purple-600 font-medium">Privacy Policy</span>
        </p>
      </div>
    </div>
  );
};