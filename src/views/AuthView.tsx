import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { validatePassword } from '../utils';
import '../styles/Auth.css';

interface AuthViewProps {
  onSuccess?: () => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ onSuccess }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      let success = false;

      if (mode === 'register') {
        // Validate password
        const validation = validatePassword(password);
        if (!validation.valid) {
          setError(validation.error || 'Invalid password');
          setIsLoading(false);
          return;
        }

        // Check if passwords match
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          setIsLoading(false);
          return;
        }

        success = register(password);
        if (!success) {
          setError('Registration failed. Account may already exist.');
        }
      } else {
        success = login(password);
        if (!success) {
          setError('Invalid password');
        }
      }

      if (success) {
        setPassword('');
        setConfirmPassword('');
        onSuccess?.();
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setPassword('');
    setConfirmPassword('');
    setError('');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>🛡️ Personal Safe Vault</h1>
          <p>Secure Your Most Important Items</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <h2>{mode === 'login' ? 'Login' : 'Create Account'}</h2>

          {error && <div className="auth-error">{error}</div>}

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              disabled={isLoading}
              required
            />
          </div>

          {mode === 'register' && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                disabled={isLoading}
                required
              />
            </div>
          )}

          <button type="submit" className="auth-button" disabled={isLoading}>
            {isLoading ? 'Processing...' : mode === 'login' ? 'Login' : 'Create Account'}
          </button>
        </form>

        <div className="auth-toggle">
          <p>
            {mode === 'login' ? "Don't have an account? " : 'Already registered? '}
            <button type="button" onClick={toggleMode} className="toggle-button">
              {mode === 'login' ? 'Register' : 'Login'}
            </button>
          </p>
        </div>

        <div className="auth-info">
          <p>ℹ️ {mode === 'register' ? 'Create your personal account with a password.' : 'Enter your password to access your memories.'}</p>
        </div>
      </div>
    </div>
  );
};
