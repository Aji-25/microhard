import { motion } from 'motion/react';
import { Zap } from 'lucide-react';

export function KeyboardHint() {
  return (
    <motion.div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 px-6 py-3 rounded-lg bg-black/60 border border-red-900/30 backdrop-blur-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: [0.4, 0.7, 0.4],
        y: 0,
      }}
      transition={{
        opacity: {
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        },
        y: {
          duration: 0.5,
        },
      }}
    >
      <div className="flex items-center gap-3">
        <motion.div
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <Zap className="w-4 h-4 text-purple-500" />
        </motion.div>
        
        <div className="flex items-center gap-2" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
          <span className="text-gray-500">Press</span>
          <kbd className="px-2 py-1 bg-black/80 border border-red-900/50 rounded text-red-400">
            Ctrl
          </kbd>
          <span className="text-gray-500">+</span>
          <kbd className="px-2 py-1 bg-black/80 border border-red-900/50 rounded text-red-400">
            Shift
          </kbd>
          <span className="text-gray-500">+</span>
          <kbd className="px-2 py-1 bg-black/80 border border-red-900/50 rounded text-red-400">
            R
          </kbd>
          <span className="text-gray-500">→ Summon instantly</span>
        </div>

        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        >
          <Zap className="w-4 h-4 text-purple-500" />
        </motion.div>
      </div>
    </motion.div>
  );
}
