// app/auth/signup/page.tsx
'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

export default function SignUp() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // First, create the user via API
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      console.log('Response status:', res.status);
      
      const data = await res.json();
      console.log('Response data:', data);

      if (!res.ok) {
        setError(data.error || `Signup failed with status ${res.status}`);
        setLoading(false);
        return;
      }

      // If user was created successfully, try to sign in
      const signInRes = await signIn('credentials', {
        username,
        password,
        redirect: false,
      });

      console.log('Sign in result:', signInRes);

      if (signInRes?.error) {
        setError('Error signing in after signup');
        setLoading(false);
        return;
      }

      // Redirect to dashboard on successful signup and sign in
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Signup error:', error);
      setError(error.message || 'An error occurred during signup');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8 px-4">
      <div className="max-w-sm w-full space-y-6">
        <div>
          <h2 className="mt-6 text-center text-2xl font-bold text-gray-900">
            Create your account
          </h2>
        </div>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-sm" role="alert">
            <span className="block">{error}</span>
          </div>
        )}
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="username" className="text-sm">Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 py-2 px-3 text-sm"
                disabled={loading}
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-sm">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 py-2 px-3 text-sm"
                disabled={loading}
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword" className="text-sm">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="current-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 py-2 px-3 text-sm"
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              className="w-full py-2 text-sm"
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Sign up'}
            </Button>
          </div>
        </form>
        <div className="text-center text-xs text-gray-500">
          <p>
            Already have an account?{' '}
            <Link href="/auth/signin" className="font-medium text-indigo-600 hover:text-indigo-500">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}