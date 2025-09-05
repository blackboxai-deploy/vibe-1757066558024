"use client";

import React, { useState } from 'react';
import { AuthButton } from './AuthButton';
import { useAuth } from '../../contexts/AuthContext';

interface TwoFactorVerifyScreenProps {
  onBack: () => void;
  onSuccess: () => void;
  userEmail?: string;
}

export const TwoFactorVerifyScreen: React.FC<TwoFactorVerifyScreenProps> = ({
  onBack,
  onSuccess,
  userEmail,
}) => {
  const [loading, setLoading] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [useBackupCode, setUseBackupCode] = useState(false);
  const { verify2FA } = useAuth();

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!verificationCode.trim()) {
      setError('Verification code is required');
      return;
    }

    const expectedLength = useBackupCode ? 8 : 6;
    if (verificationCode.length !== expectedLength) {
      setError(`Please enter a valid ${expectedLength}-digit ${useBackupCode ? 'backup' : 'verification'} code`);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await verify2FA(verificationCode);
      
      if (result.success) {
        onSuccess();
      } else {
        setError(result.message || '2FA verification failed');
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
        
        <h1 className="text-xl font-semibold text-gray-900">
          Two-Factor Authentication
        </h1>
        
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
            Enter Authentication Code
          </h2>
          <p className="text-gray-600 leading-relaxed mb-2">
            {useBackupCode 
              ? 'Enter one of your 8-digit backup codes'
              : 'Enter the 6-digit code from your authenticator app'
            }
          </p>
          {userEmail && (
            <p className="text-sm text-gray-500">for {userEmail}</p>
          )}
        </div>

        {/* Verification Form */}
        <form onSubmit={handleVerificationSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {useBackupCode ? 'Backup Code' : 'Verification Code'}
            </label>
            <div className="flex justify-center">
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => {
                  const value = useBackupCode 
                    ? e.target.value.replace(/\D/g, '').slice(0, 8)
                    : e.target.value.replace(/\D/g, '').slice(0, 6);
                  setVerificationCode(value);
                  setError('');
                }}
                placeholder={useBackupCode ? '00000000' : '000000'}
                className="w-40 h-16 text-2xl text-center border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:outline-none transition-colors"
                maxLength={useBackupCode ? 8 : 6}
              />
            </div>
            {error && (
              <p className="text-sm text-red-600 text-center">{error}</p>
            )}
          </div>

          <AuthButton
            title="Verify"
            onPress={() => handleVerificationSubmit(new Event('submit') as any)}
            loading={loading}
            disabled={loading || verificationCode.length !== (useBackupCode ? 8 : 6)}
          />
        </form>

        {/* Alternative Options */}
        <div className="mt-8 space-y-4">
          {/* Switch between regular code and backup code */}
          <div className="text-center">
            <button
              onClick={() => {
                setUseBackupCode(!useBackupCode);
                setVerificationCode('');
                setError('');
              }}
              className="text-purple-600 font-medium hover:underline text-sm"
            >
              {useBackupCode 
                ? 'Use authenticator app instead'
                : 'Use backup code instead'
              }
            </button>
          </div>

          {/* Help Text */}
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-2">
              Having trouble accessing your authenticator app?
            </p>
            <button
              onClick={onBack}
              className="text-xs text-gray-400 hover:text-gray-600"
            >
              Sign in with a different account
            </button>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-2xl">
          <div className="flex items-start space-x-3">
            <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Security tip</p>
              <p>
                Never share your authentication codes with anyone. We will never ask for these codes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};