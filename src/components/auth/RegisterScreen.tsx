"use client";

import React, { useState } from 'react';
import { AuthButton } from './AuthButton';
import { AuthInput } from './AuthInput';
import { useAuth } from '../../contexts/AuthContext';

interface RegisterScreenProps {
  onBack: () => void;
  onSuccess: () => void;
  onSignIn: () => void;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({
  onBack,
  onSuccess,
  onSignIn,
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { register: registerUser } = useAuth();

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

  const passwordStrength = formData.password ? validatePasswordStrength(formData.password) : null;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'Please accept the terms and conditions';
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setLoading(true);

    try {
      const result = await registerUser(formData.fullName, formData.email, formData.password);
      
      if (result.success) {
        onSuccess();
      } else {
        setErrors({ general: result.message || 'Registration failed' });
      }
    } catch (error) {
      setErrors({ general: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: keyof typeof formData, value: string | boolean) => {
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
        
        <h1 className="text-xl font-semibold text-gray-900">Create Account</h1>
        
        <div className="w-10" />
      </div>

       {/* Form */}
      <div className="flex-1 px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name */}
          <AuthInput
            label="Full Name"
            placeholder="Enter your full name"
            value={formData.fullName}
            onChangeText={(value) => updateField('fullName', value)}
            error={errors.fullName}
          />

          {/* Email */}
          <AuthInput
            label="Email Address"
            placeholder="Enter your email"
            value={formData.email}
            onChangeText={(value) => updateField('email', value)}
            keyboardType="email-address"
            autoComplete="email"
            error={errors.email}
          />

          {/* Password */}
          <div>
            <AuthInput
              label="Password"
              placeholder="Create a strong password"
              value={formData.password}
              onChangeText={(value) => updateField('password', value)}
              secureTextEntry={true}
              error={errors.password}
            />
            
            {/* Password Strength Indicator */}
            {formData.password && passwordStrength && (
              <div className="mt-3 space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        passwordStrength.isStrong
                          ? 'bg-green-500 w-full'
                          : formData.password.length > 4
                          ? 'bg-yellow-500 w-2/3'
                          : 'bg-red-500 w-1/3'
                      }`}
                    />
                  </div>
                  <span
                    className={`text-xs font-medium ${
                      passwordStrength.isStrong
                        ? 'text-green-600'
                        : formData.password.length > 4
                        ? 'text-yellow-600'
                        : 'text-red-600'
                    }`}
                  >
                    {passwordStrength.isStrong
                      ? 'Strong'
                      : formData.password.length > 4
                      ? 'Medium'
                      : 'Weak'}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className={`flex items-center space-x-1 ${passwordStrength.hasLowerCase ? 'text-green-600' : 'text-gray-400'}`}>
                    <span>{passwordStrength.hasLowerCase ? '✓' : '○'}</span>
                    <span>Lowercase</span>
                  </div>
                  <div className={`flex items-center space-x-1 ${passwordStrength.hasUpperCase ? 'text-green-600' : 'text-gray-400'}`}>
                    <span>{passwordStrength.hasUpperCase ? '✓' : '○'}</span>
                    <span>Uppercase</span>
                  </div>
                  <div className={`flex items-center space-x-1 ${passwordStrength.hasNumbers ? 'text-green-600' : 'text-gray-400'}`}>
                    <span>{passwordStrength.hasNumbers ? '✓' : '○'}</span>
                    <span>Number</span>
                  </div>
                  <div className={`flex items-center space-x-1 ${passwordStrength.hasSpecialChar ? 'text-green-600' : 'text-gray-400'}`}>
                    <span>{passwordStrength.hasSpecialChar ? '✓' : '○'}</span>
                    <span>Symbol</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <AuthInput
            label="Confirm Password"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChangeText={(value) => updateField('confirmPassword', value)}
            secureTextEntry={true}
            error={errors.confirmPassword}
          />

          {/* Terms and Conditions */}
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              checked={formData.acceptTerms}
              onChange={(e) => updateField('acceptTerms', e.target.checked)}
              className="mt-1 w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
            />
            <div className="text-sm text-gray-600 leading-relaxed">
              I agree to the{' '}
              <button type="button" className="text-purple-600 font-medium hover:underline">
                Terms of Service
              </button>
              {' '}and{' '}
              <button type="button" className="text-purple-600 font-medium hover:underline">
                Privacy Policy
              </button>
            </div>
          </div>

          {errors.acceptTerms && (
            <p className="text-sm text-red-600">{errors.acceptTerms}</p>
          )}

          {/* Error Message */}
          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
              <p className="text-sm text-red-600 text-center">{errors.general}</p>
            </div>
          )}

          {/* Submit Button */}
          <AuthButton
            title="Create Account"
            onPress={() => handleSubmit(new Event('submit') as any)}
            loading={loading}
            disabled={loading}
          />
        </form>

        {/* Sign In Link */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <button
              onClick={onSignIn}
              className="text-purple-600 font-semibold hover:underline"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};