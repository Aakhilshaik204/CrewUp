import React from 'react';
import { motion } from 'framer-motion';

const SkeletonCard = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm overflow-hidden relative"
    >
      <div className="animate-pulse flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-slate-200 rounded-2xl" />
            <div className="flex flex-col gap-2">
              <div className="w-24 h-4 bg-slate-200 rounded-full" />
              <div className="w-16 h-3 bg-slate-100 rounded-full" />
            </div>
          </div>
          <div className="w-20 h-8 bg-slate-100 rounded-full" />
        </div>

        {/* Content */}
        <div className="w-3/4 h-6 bg-slate-200 rounded-full mt-2" />
        <div className="w-1/2 h-4 bg-slate-100 rounded-full" />

        {/* Footer info blocks */}
        <div className="flex items-center gap-3 mt-4">
          <div className="flex-1 h-12 bg-slate-50 rounded-2xl" />
          <div className="flex-1 h-12 bg-slate-50 rounded-2xl" />
          <div className="flex-1 h-12 bg-slate-50 rounded-2xl" />
        </div>
      </div>
    </motion.div>
  );
};

export default SkeletonCard;
