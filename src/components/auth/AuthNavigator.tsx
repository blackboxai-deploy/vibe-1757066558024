"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { SplashScreen } from './SplashScreen';
import { WelcomeScreen } from './WelcomeScreen';
import { RegisterScreen } from './RegisterScreen';
import { LoginScreen } from './LoginScreen';
import { ForgotPasswordScreen } from './ForgotPasswordScreen';
import { PasswordResetScreen } from './PasswordResetScreen';
import { TwoFactorSetupScreen } from './TwoFactorSetupScreen';
import { TwoFactorVerifyScreen } from './TwoFactorVerifyScreen';

type AuthScreen = 
  | 'splash'
  | 'welcome'
  | 'register'
  | 'login'
  | 'forgotPassword'
  | 'passwordReset'
  | '2faSetup'
  | '2faVerify'
  | 'authenticated';

interface AuthNavigatorProps {
  onAuthenticated?: () => void;
}

export const AuthNavigator: React.FC<AuthNavigatorProps> = ({ onAuthenticated }) => {
  const [currentScreen, setCurrentScreen] = useState<AuthScreen>('splash');
  const [resetEmail, setResetEmail] = useState('');
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      setCurrentScreen('authenticated');
      onAuthenticated?.();
    }
  }, [isAuthenticated, isLoading, onAuthenticated]);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return (
          <SplashScreen
            onFinish={() => setCurrentScreen('welcome')}
          />
        );

      case 'welcome':
        return (
          <WelcomeScreen
            onSignUp={() => setCurrentScreen('register')}
            onSignIn={() => setCurrentScreen('login')}
          />
        );

      case 'register':
        return (
          <RegisterScreen
            onBack={() => setCurrentScreen('welcome')}
            onSuccess={() => setCurrentScreen('login')}
            onSignIn={() => setCurrentScreen('login')}
          />
        );

      case 'login':
        return (
          <LoginScreen
            onBack={() => setCurrentScreen('welcome')}
            onSignUp={() => setCurrentScreen('register')}
            onForgotPassword={() => setCurrentScreen('forgotPassword')}
            onLoginSuccess={() => {
              setCurrentScreen('authenticated');
              onAuthenticated?.();
            }}
            on2FARequired={() => setCurrentScreen('2faVerify')}
          />
        );

      case 'forgotPassword':
        return (
          <ForgotPasswordScreen
            onBack={() => setCurrentScreen('login')}
            onCodeSent={(email) => {
              setResetEmail(email);
              setCurrentScreen('passwordReset');
            }}
          />
        );

      case 'passwordReset':
        return (
          <PasswordResetScreen
            onBack={() => setCurrentScreen('forgotPassword')}
            onSuccess={() => setCurrentScreen('login')}
            email={resetEmail}
          />
        );

      case '2faSetup':
        return (
          <TwoFactorSetupScreen
            onBack={() => setCurrentScreen('login')}
            onSuccess={() => {
              setCurrentScreen('authenticated');
              onAuthenticated?.();
            }}
          />
        );

      case '2faVerify':
        return (
          <TwoFactorVerifyScreen
            onBack={() => setCurrentScreen('login')}
            onSuccess={() => {
              setCurrentScreen('authenticated');
              onAuthenticated?.();
            }}
          />
        );

      case 'authenticated':
        return (
          <div className="flex-1 bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Eonify!</h2>
                <p className="text-gray-600">You have successfully authenticated</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {renderScreen()}
    </div>
  );
};