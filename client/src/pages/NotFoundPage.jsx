import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => (
  <div className="min-h-[80vh] flex items-center justify-center px-4 bg-slate-50">
    <div className="text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
        className="font-display font-black text-9xl gradient-text mb-4"
      >
        404
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h2 className="font-display font-bold text-2xl text-slate-900 mb-2">Crew not found</h2>
        <p className="text-slate-400 mb-8">The page you're looking for doesn't exist or was moved.</p>
        <div className="flex gap-3 justify-center">
          <Link to="/" className="btn-primary"><Home className="w-4 h-4" />Go Home</Link>
          <Link to="/feed" className="btn-secondary"><ArrowLeft className="w-4 h-4" />Browse Feed</Link>
        </div>
      </motion.div>
    </div>
  </div>
);

export default NotFoundPage;
