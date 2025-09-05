"use client";

import React, { useState, useEffect } from 'react';
import { AuthButton } from './AuthButton';
import { useAuth } from '../../contexts/AuthContext';

interface TwoFactorSetupScreenProps {
  onBack: () => void;
  onSuccess: () => void;
}

export const TwoFactorSetupScreen: React.FC<TwoFactorSetupScreenProps> = ({
  onBack,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'setup' | 'verify'>('setup');
  const [qrCode, setQrCode] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [manualKey] = useState('ABCD EFGH IJKL MNOP QRST UVWX YZ12 3456');
  const { setup2FA, verify2FA } = useAuth();

  useEffect(() => {
    initiate2FASetup();
  }, []);

  const initiate2FASetup = async () => {
    setLoading(true);
    
    try {
      const result = await setup2FA();
      
      if (result.success) {
        setQrCode(result.qrCode || '');
        setBackupCodes(result.backupCodes || []);
      } else {
        setError(result.message || 'Failed to setup 2FA');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!verificationCode.trim()) {
      setError('Verification code is required');
      return;
    }

    if (verificationCode.length !== 6) {
      setError('Please enter a valid 6-digit code');
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
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
        {step === 'setup' ? (
          <>
            {/* Icon */}
            <div className="flex justify-center mb-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
            </div>

            {/* Description */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Setup Two-Factor Authentication
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Add an extra layer of security to your account by setting up two-factor authentication.
              </p>
            </div>

            {/* Steps */}
            <div className="space-y-6 mb-8">
              {/* Step 1 */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-purple-600">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Download an authenticator app</h3>
                  <p className="text-sm text-gray-600">
                    Install Google Authenticator, Authy, or any TOTP authenticator app
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-purple-600">2</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-3">Scan QR Code or enter manual key</h3>
                  
                  {/* QR Code */}
                  <div className="bg-gray-50 rounded-2xl p-6 mb-4">
                    <div className="flex justify-center mb-4">
                      {qrCode ? (
                        <img src={qrCode} alt="QR Code" className="w-48 h-48 border rounded-lg" />
                      ) : (
                        <div className="w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                          <div className="text-center">
                            <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 16h4.01M4 8h2m2 0h2m-2 4h2m-6 4h2m2 0h2m-2-4h2m4-4h2m0 4h2" />
                            </svg>
                            <p className="text-sm text-gray-500">QR Code Loading...</p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-3">Can't scan? Enter this code manually:</p>
                      <div className="bg-white rounded-lg p-3 border">
                        <code className="text-sm font-mono text-gray-800 break-all">{manualKey}</code>
                      </div>
                      <button
                        onClick={() => copyToClipboard(manualKey)}
                        className="mt-2 text-xs text-purple-600 hover:underline"
                      >
                        Copy to clipboard
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-purple-600">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Verify setup</h3>
                  <p className="text-sm text-gray-600">
                    Enter the 6-digit code from your authenticator app to complete setup
                  </p>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
                <p className="text-sm text-red-600 text-center">{error}</p>
              </div>
            )}

            {/* Continue Button */}
            <AuthButton
              title="I've Added the Account"
              onPress={() => setStep('verify')}
              disabled={loading}
            />

            {/* Backup Codes Info */}
            {backupCodes.length > 0 && (
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-2xl">
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <div className="text-sm text-yellow-800">
                    <p className="font-medium mb-1">Save your backup codes!</p>
                    <p>These codes can be used if you lose access to your authenticator app.</p>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Icon */}
            <div className="flex justify-center mb-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>

            {/* Description */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Verify Setup
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Enter the 6-digit code from your authenticator app to complete the setup.
              </p>
            </div>

            {/* Verification Form */}
            <form onSubmit={handleVerificationSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Verification Code
                </label>
                <div className="flex justify-center">
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                      setVerificationCode(value);
                      setError('');
                    }}
                    placeholder="000000"
                    className="w-32 h-16 text-2xl text-center border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:outline-none transition-colors"
                    maxLength={6}
                  />
                </div>
                {error && (
                  <p className="text-sm text-red-600 text-center">{error}</p>
                )}
              </div>

              <AuthButton
                title="Complete Setup"
                onPress={() => handleVerificationSubmit(new Event('submit') as any)}
                loading={loading}
                disabled={loading || verificationCode.length !== 6}
              />
            </form>

            {/* Back Button */}
            <div className="mt-6 text-center">
              <button
                onClick={() => setStep('setup')}
                className="text-purple-600 font-medium hover:underline text-sm"
              >
                Back to setup instructions
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};