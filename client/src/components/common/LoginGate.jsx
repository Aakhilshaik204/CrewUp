import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { X, LogIn, UserPlus, Zap } from 'lucide-react';

/**
 * LoginGate — shown when a non-logged-in user tries to do something that requires auth.
 * Usage: <LoginGate isOpen={show} onClose={() => setShow(false)} action="join this activity" />
 */
const LoginGate = ({ isOpen, onClose, action = 'continue' }) => (
  <AnimatePresence>
    {isOpen && (
      <>
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
        />

        {/* Modal */}
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="w-full max-w-sm pointer-events-auto"
          >
            <div className="card p-8 text-center shadow-card-xl relative">
              {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Icon */}
            <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glow">
              <Zap className="w-7 h-7 text-white fill-white" />
            </div>

            <h2 className="font-display font-bold text-xl text-slate-900 mb-2">Sign in to {action}</h2>
            <p className="text-slate-500 text-sm mb-6">
              Join CrewUp to find teammates, create activities, and connect with students on your campus.
            </p>

            <div className="space-y-3">
              <Link
                to="/sign-in"
                className="btn-primary w-full py-3 text-sm justify-center"
                onClick={onClose}
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </Link>
              <Link
                to="/sign-up"
                className="btn-secondary w-full py-3 text-sm justify-center"
                onClick={onClose}
              >
                <UserPlus className="w-4 h-4" />
                Create Account
              </Link>
            </div>
          </div>
        </motion.div>
        </div>
      </>
    )}
  </AnimatePresence>
);

export default LoginGate;
