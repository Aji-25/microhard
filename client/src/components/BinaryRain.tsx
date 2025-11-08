import { motion } from 'motion/react';
import { Ghost } from 'lucide-react';

export function BinaryRain() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Binary rain columns */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute top-0 opacity-10"
          style={{
            left: `${(i / 15) * 100}%`,
            fontFamily: "'Share Tech Mono', monospace",
          }}
          initial={{ y: -100 }}
          animate={{ y: '100vh' }}
          transition={{
            duration: 8 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: 'linear',
          }}
        >
          <div className="text-green-500/30 space-y-1">
            {[...Array(20)].map((_, j) => (
              <div key={j}>
                {Math.random() > 0.5 ? '1' : '0'}
                {Math.random() > 0.5 ? '1' : '0'}
                {Math.random() > 0.5 ? '1' : '0'}
              </div>
            ))}
          </div>
        </motion.div>
      ))}

      {/* Falling ghost icons */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={`ghost-${i}`}
          className="absolute top-0 opacity-5"
          style={{ left: `${20 + (i * 15)}%` }}
          initial={{ y: -50, rotate: 0 }}
          animate={{ 
            y: '100vh',
            rotate: 360,
          }}
          transition={{
            duration: 12 + Math.random() * 6,
            repeat: Infinity,
            delay: Math.random() * 8,
            ease: 'linear',
          }}
        >
          <Ghost className="w-6 h-6 text-purple-500" />
        </motion.div>
      ))}
    </div>
  );
}
