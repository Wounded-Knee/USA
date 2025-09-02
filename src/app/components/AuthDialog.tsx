'use client'

import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import BaseModal from './BaseModal';

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export default function AuthDialog({ isOpen, onClose, initialMode = 'login' }: AuthDialogProps) {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    loginIdentifier: '', // For login: can be either username or email
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register, loginWithGoogle } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'register') {
        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match');
        }

        // Validate password strength
        if (formData.password.length < 6) {
          throw new Error('Password must be at least 6 characters long');
        }

        await register({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName
        });
      } else {
        await login(formData.loginIdentifier, formData.password);
      }

      onClose();
      setFormData({
        username: '',
        email: '',
        loginIdentifier: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: ''
      });
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
    } catch (error: any) {
      setError('Google OAuth is not available. Please use email/password authentication.');
      setLoading(false);
    }
  };



  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Welcome to Whitepine"
      size="md"
      showCloseButton={true}
    >
      <div className="text-[var(--color-text-secondary)] mb-6">
        Sign in or create your account to start participating
      </div>

      {/* Form */}
          {/* Google OAuth Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full bg-[var(--color-surface)] border-2 border-[var(--color-border)] text-[var(--color-text)] py-3 px-4 rounded-lg hover:bg-[var(--color-background)] transition-colors flex items-center justify-center space-x-3 mb-6"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--color-border)]" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[var(--color-surface)] text-[var(--color-text-muted)]">or</span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-[var(--color-error-light)] border border-[var(--color-error)] text-[var(--color-error)] rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Mode Tabs */}
          <div className="flex mb-6 bg-[var(--color-background)] rounded-lg p-1">
            <button
              onClick={() => {
                setMode('login');
                setError('');
                setFormData({
                  username: '',
                  email: '',
                  loginIdentifier: '',
                  password: '',
                  confirmPassword: '',
                  firstName: '',
                  lastName: ''
                });
              }}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                mode === 'login' 
                  ? 'bg-[var(--color-surface)] text-[var(--color-primary)] shadow-sm' 
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setMode('register');
                setError('');
                setFormData({
                  username: '',
                  email: '',
                  loginIdentifier: '',
                  password: '',
                  confirmPassword: '',
                  firstName: '',
                  lastName: ''
                });
              }}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                mode === 'register' 
                  ? 'bg-[var(--color-surface)] text-[var(--color-primary)] shadow-sm' 
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
              }`}
            >
              Create Account
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Register-only fields */}
            {mode === 'register' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-[var(--color-text)] mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required={mode === 'register'}
                      className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-background)] text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:ring-2 focus:ring-[var(--color-focus-ring)] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-[var(--color-text)] mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required={mode === 'register'}
                      className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-background)] text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:ring-2 focus:ring-[var(--color-focus-ring)] focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-[var(--color-text)] mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    required={mode === 'register'}
                    className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-background)] text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:ring-2 focus:ring-[var(--color-focus-ring)] focus:border-transparent"
                  />
                </div>
              </>
            )}

            {/* Email field for register, Login Identifier for login */}
            <div>
              <label htmlFor={mode === 'login' ? 'loginIdentifier' : 'email'} className="block text-sm font-medium text-[var(--color-text)] mb-1">
                {mode === 'login' ? 'Username or Email' : 'Email'}
              </label>
              <input
                type={mode === 'login' ? 'text' : 'email'}
                id={mode === 'login' ? 'loginIdentifier' : 'email'}
                name={mode === 'login' ? 'loginIdentifier' : 'email'}
                value={mode === 'login' ? formData.loginIdentifier : formData.email}
                onChange={handleInputChange}
                required
                placeholder={mode === 'login' ? 'Enter your username or email' : 'Enter your email'}
                className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-background)] text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:ring-2 focus:ring-[var(--color-focus-ring)] focus:border-transparent"
              />
            </div>

            {/* Password field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[var(--color-text)] mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-background)] text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:ring-2 focus:ring-[var(--color-focus-ring)] focus:border-transparent"
              />
            </div>

            {/* Confirm Password field (register only) */}
            {mode === 'register' && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-[var(--color-text)] mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required={mode === 'register'}
                  className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-background)] text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:ring-2 focus:ring-[var(--color-focus-ring)] focus:border-transparent"
                />
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-[var(--color-text-on-primary)] py-3 px-4 rounded-lg hover:from-[var(--color-primary-hover)] hover:to-[var(--color-secondary-hover)] transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {mode === 'login' ? 'Signing In...' : 'Creating Account...'}
                </div>
              ) : (
                mode === 'login' ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          {/* Terms and Privacy (register only) */}
          {mode === 'register' && (
            <div className="mt-4 text-xs text-[var(--color-text-muted)] text-center">
              By creating an account, you agree to our{' '}
              <a href="#" className="text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]">Privacy Policy</a>
            </div>
          )}
        </BaseModal>
  );
}
