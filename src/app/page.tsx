"use client";

import React from 'react';
import { AuthProvider } from '../contexts/AuthContext';
import { AuthNavigator } from '../components/auth/AuthNavigator';

export default function Home() {
  const handleAuthenticated = () => {
    console.log('User authenticated successfully!');
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-white">
        <AuthNavigator onAuthenticated={handleAuthenticated} />
      </div>
    </AuthProvider>
  );
}