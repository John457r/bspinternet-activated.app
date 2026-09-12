import { FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Logo } from './Logo';
import { Shield, Lock } from 'lucide-react';

interface LoginViewProps {
  username: string;
  setUsername: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  error: string | null;
  isLoading: boolean;
  onLogin: (e: FormEvent) => void;
  onLogoClick: () => void;
  logoClicks: number;
  onSwitchToAdmin: () => void;
  pendingCount: number;
}

export function LoginView({
  username,
  setUsername,
  password,
  setPassword,
  error,
  isLoading,
  onLogin,
  onLogoClick,
  logoClicks,
  onSwitchToAdmin,
  pendingCount
}: LoginViewProps) {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 font-sans relative">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-[360px] flex flex-col items-center"
      >
        <div 
          id="bsp-logo-trigger"
          onClick={onLogoClick} 
          className="cursor-pointer active:scale-95 transition-transform relative group"
          title="Click 5 times for Admin Access"
        >
          <Logo />
          {logoClicks > 0 && logoClicks < 5 && (
            <div className="absolute -top-3 right-0 bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-200 animate-pulse">
              {5 - logoClicks} clicks to Admin
            </div>
          )}
        </div>

        <form onSubmit={onLogin} className="w-full space-y-4">
          <div className="w-full">
            <input
              type="text"
              placeholder="Username"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`w-full px-4 py-3.5 border rounded-md focus:outline-none focus:border-[#0091FF] transition-colors text-gray-800 placeholder-gray-400 text-lg ${
                error ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              required
            />
            <p className="text-[11px] text-gray-400 mt-1 pl-1">
              Enter your 9-digit Internet Banking ID (e.g. 123456789)
            </p>
          </div>
          
          <div className="w-full">
            <input
              type="password"
              placeholder="Password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3.5 border border-gray-300 rounded-md focus:outline-none focus:border-[#0091FF] transition-colors text-gray-800 placeholder-gray-400 text-lg"
              required
            />
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="text-red-600 text-sm text-center font-medium px-2 py-1 bg-red-50 rounded border border-red-200"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-center pt-4">
            <button
              id="login-submit-btn"
              type="submit"
              disabled={isLoading}
              className={`
                w-[130px] py-3 bg-[#0091FF] text-white rounded-md text-lg font-medium 
                hover:bg-[#007acc] active:scale-95 transition-all cursor-pointer
                disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center
              `}
            >
              {isLoading ? (
                <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                'Login'
              )}
            </button>
          </div>
        </form>

        {/* Security badge footer */}
        <div className="mt-12 flex items-center gap-1.5 text-xs text-gray-400">
          <Lock size={12} />
          <span>256-Bit SSL Encrypted Banking Security</span>
        </div>
      </motion.div>

      {/* Direct Admin switch button for accessibility & tester convenience */}
      <div className="fixed bottom-4 right-4 z-30">
        <button
          id="quick-admin-switch-btn"
          onClick={onSwitchToAdmin}
          className="flex items-center gap-2 bg-slate-900/80 hover:bg-slate-900 text-white px-3.5 py-2 rounded-full text-xs font-medium backdrop-blur-xs shadow-lg transition-all active:scale-95 hover:shadow-xl"
          title="Access Admin Verification Portal"
        >
          <Shield size={14} className="text-blue-400" />
          <span>Admin Portal</span>
          {pendingCount > 0 && (
            <span className="bg-amber-500 text-slate-900 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
              {pendingCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
