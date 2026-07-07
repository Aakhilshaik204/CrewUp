import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const BackButton = ({ fallbackPath = '/dashboard' }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate(fallbackPath);
    }
  };

  return (
    <motion.button
      whileHover={{ x: -2 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleBack}
      className="md:hidden flex items-center gap-1 text-slate-500 hover:text-slate-800 font-medium text-sm mb-4 transition-colors bg-white px-3 py-1.5 rounded-lg shadow-sm border border-slate-100"
    >
      <ChevronLeft className="w-4 h-4" />
      Back
    </motion.button>
  );
};

export default BackButton;
