"use client";

import React, { useState } from 'react';
import { AuthButton } from './AuthButton';
import { AuthInput } from './AuthInput';
import { useAuth } from '../../contexts/AuthContext';

interface ForgotPasswordScreenProps {
  onBack: () => void;
  onCodeSent: (email: string) => void;
}

export const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({
  onBack,
  onCodeSent,
}) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { forgotPassword } = useAuth();

  const validateEmail = (email: string) => {
    return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await forgotPassword(email);
      
      if (result.success) {
        setSuccess('Password reset code sent to your email');
        setTimeout(() => {
          onCodeSent(email);
        }, 2000);
      } else {
        setError(result.message || 'Failed to send reset code');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-100">
        <button
          onClick={onBack}
          className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
        >
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <h1 className="text-xl font-semibold text-gray-900">Forgot Password</h1>
        
        <div className="w-10" />
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-8">
        {/* Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </div>

        {/* Description */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Reset Your Password
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Enter your email address and we&apos;ll send you a verification code to reset your password.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <AuthInput
            label="Email Address"
            placeholder="Enter your email address"
            value={email}
            onChangeText={(value) => {
              setEmail(value);
              setError('');
              setSuccess('');
            }}
            keyboardType="email-address"
            autoComplete="email"
            error={error}
          />

          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-green-600">{success}</p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <AuthButton
            title="Send Reset Code"
            onPress={() => handleSubmit(new Event('submit') as any)}
            loading={loading}
            disabled={loading || !!success}
          />
        </form>

        {/* Help Text */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 mb-4">
            Didn&apos;t receive the code? Check your spam folder or try again.
          </p>
          
          <button
            onClick={onBack}
            className="text-purple-600 font-medium hover:underline text-sm"
          >
            Back to Sign In
          </button>
        </div>
      </div>
    </div>
  );
};