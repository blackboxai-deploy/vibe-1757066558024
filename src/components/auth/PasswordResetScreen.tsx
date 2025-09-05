"use client";

import React, { useState } from 'react';
import { AuthButton } from './AuthButton';
import { AuthInput } from './AuthInput';
import { useAuth } from '../../contexts/AuthContext';

interface PasswordResetScreenProps {
  onBack: () => void;
  onSuccess: () => void;
  email: string;
}

export const PasswordResetScreen: React.FC<PasswordResetScreenProps> = ({
  onBack,
  onSuccess,
  email,
}) => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'code' | 'password'>('code');
  const [formData, setFormData] = useState({
    code: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [resendLoading, setResendLoading] = useState(false);
  const { resetPassword, forgotPassword } = useAuth();

  const validatePasswordStrength = (password: string) => {
    const hasLowerCase = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLongEnough = password.length >= 8;

    return {
      hasLowerCase,
      hasUpperCase,
      hasNumbers,
      hasSpecialChar,
      isLongEnough,
      isStrong: hasLowerCase && hasUpperCase && hasNumbers && hasSpecialChar && isLongEnough,
    };
  };

  const passwordStrength = formData.newPassword ? validatePasswordStrength(formData.newPassword) : null;

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.code.trim()) {
      setErrors({ code: 'Verification code is required' });
      return;
    }

    if (formData.code.length !== 6) {
      setErrors({ code: 'Please enter a valid 6-digit code' });
      return;
    }

    setErrors({});
    setStep('password');
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};

    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const result = await resetPassword(formData.code, formData.newPassword);
      
      if (result.success) {
        onSuccess();
      } else {
        setErrors({ general: result.message || 'Password reset failed' });
      }
    } catch (error) {
      setErrors({ general: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setResendLoading(true);
    
    try {
      const result = await forgotPassword(email);
      if (result.success) {
        setErrors({ success: 'New code sent to your email' });
      } else {
        setErrors({ general: result.message || 'Failed to resend code' });
      }
    } catch (error) {
      setErrors({ general: 'Network error. Please try again.' });
    } finally {
      setResendLoading(false);
    }
  };

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
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
          {step === 'code' ? 'Enter Code' : 'New Password'}
        </h1>
        
        <div className="w-10" />
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-8">
        {step === 'code' ? (
          <>
            {/* Icon */}
            <div className="flex justify-center mb-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>

            {/* Description */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Check Your Email
              </h2>
              <p className="text-gray-600 leading-relaxed mb-2">
                We sent a 6-digit verification code to:
              </p>
              <p className="font-medium text-gray-900">{email}</p>
            </div>

            {/* Code Form */}
            <form onSubmit={handleCodeSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Verification Code
                </label>
                <div className="flex justify-center">
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                      updateField('code', value);
                    }}
                    placeholder="000000"
                    className="w-32 h-16 text-2xl text-center border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:outline-none transition-colors"
                    maxLength={6}
                  />
                </div>
                {errors.code && (
                  <p className="text-sm text-red-600 text-center">{errors.code}</p>
                )}
              </div>

              {/* Success Message */}
              {errors.success && (
                <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
                  <p className="text-sm text-green-600 text-center">{errors.success}</p>
                </div>
              )}

              {/* Error Message */}
              {errors.general && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
                  <p className="text-sm text-red-600 text-center">{errors.general}</p>
                </div>
              )}

              <AuthButton
                title="Verify Code"
                onPress={() => handleCodeSubmit(new Event('submit') as any)}
                disabled={formData.code.length !== 6}
              />
            </form>

            {/* Resend Code */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600 mb-4">
                Didn&apos;t receive the code?
              </p>
              <button
                onClick={handleResendCode}
                disabled={resendLoading}
                className="text-purple-600 font-medium hover:underline text-sm disabled:opacity-50"
              >
                {resendLoading ? 'Sending...' : 'Resend Code'}
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Icon */}
            <div className="flex justify-center mb-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>

            {/* Description */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Create New Password
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Your new password must be different from your previous password.
              </p>
            </div>

            {/* Password Form */}
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              {/* New Password */}
              <div>
                <AuthInput
                  label="New Password"
                  placeholder="Create a strong password"
                  value={formData.newPassword}
                  onChangeText={(value) => updateField('newPassword', value)}
                  secureTextEntry={true}
                  error={errors.newPassword}
                />
                
                {/* Password Strength Indicator */}
                {formData.newPassword && passwordStrength && (
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            passwordStrength.isStrong
                              ? 'bg-green-500 w-full'
                              : formData.newPassword.length > 4
                              ? 'bg-yellow-500 w-2/3'
                              : 'bg-red-500 w-1/3'
                          }`}
                        />
                      </div>
                      <span
                        className={`text-xs font-medium ${
                          passwordStrength.isStrong
                            ? 'text-green-600'
                            : formData.newPassword.length > 4
                            ? 'text-yellow-600'
                            : 'text-red-600'
                        }`}
                      >
                        {passwordStrength.isStrong
                          ? 'Strong'
                          : formData.newPassword.length > 4
                          ? 'Medium'
                          : 'Weak'}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <AuthInput
                label="Confirm Password"
                placeholder="Confirm your new password"
                value={formData.confirmPassword}
                onChangeText={(value) => updateField('confirmPassword', value)}
                secureTextEntry={true}
                error={errors.confirmPassword}
              />

              {/* Error Message */}
              {errors.general && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
                  <p className="text-sm text-red-600 text-center">{errors.general}</p>
                </div>
              )}

              <AuthButton
                title="Reset Password"
                onPress={() => handlePasswordSubmit(new Event('submit') as any)}
                loading={loading}
                disabled={loading}
              />
            </form>
          </>
        )}
      </div>
    </div>
  );
};