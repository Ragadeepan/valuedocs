import React from 'react';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

export default function PageLoader() {
  return (
    <div className="fixed inset-0 bg-bg-dark flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-6">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="relative"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center shadow-glow-lg">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div className="absolute inset-0 rounded-2xl border-2 border-transparent border-t-primary-400 animate-spin" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <p className="text-white font-bold text-xl font-display">ValueDocs</p>
          <motion.div className="flex gap-1 justify-center mt-3">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-primary-500"
                animate={{ y: [-4, 4, -4] }}
                transition={{ duration: 0.8, delay: i * 0.15, repeat: Infinity }}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
