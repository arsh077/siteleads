import React from 'react';
import { Component } from '@/components/ui/animated-characters-login-page';
import { User } from '../types';

interface LoginScreenProps {
  onLoginSuccess: (user: User) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  return <Component onLoginSuccess={onLoginSuccess} />;
};

export default LoginScreen;
