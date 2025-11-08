import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';

export function GhostFlicker() {
  const [showGhost, setShowGhost] = useState(false);
  const [position, setPosition] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly show ghost every 10-20 seconds
      if (Math.random() > 0.5) {
        setPosition({
          x: 20 + Math.random() * 60,
          y: 20 + Math.random() * 60,
        });
        setShowGhost(true);
        
        setTimeout(() => {
          setShowGhost(false);
        }, 1500);
      }
    }, 10000 + Math.random() * 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {showGhost && (
        <motion.div
          className="fixed pointer-events-none z-50"
          style={{
            left: `${position.x}%`,
            top: `${position.y}%`,
          }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ 
            opacity: [0, 0.7, 0.4, 0.8, 0],
            scale: [0.5, 1, 0.9, 1.1, 0.8],
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
        >
          {/* Ghost silhouette with red eyes */}
          <div className="relative">
            <svg
              width="80"
              height="100"
              viewBox="0 0 80 100"
              className="drop-shadow-[0_0_20px_rgba(255,0,0,0.5)]"
            >
              {/* Ghost body */}
              <path
                d="M 40 10 Q 20 10 20 40 L 20 85 L 25 80 L 30 85 L 35 80 L 40 85 L 45 80 L 50 85 L 55 80 L 60 85 L 60 40 Q 60 10 40 10 Z"
                fill="rgba(255, 255, 255, 0.1)"
                stroke="rgba(255, 0, 0, 0.3)"
                strokeWidth="2"
              />
              {/* Red glowing eyes */}
              <motion.circle
                cx="30"
                cy="35"
                r="4"
                fill="#ff0000"
                animate={{
                  opacity: [1, 0.3, 1],
                }}
                transition={{
                  duration: 0.3,
                  repeat: Infinity,
                }}
              />
              <motion.circle
                cx="50"
                cy="35"
                r="4"
                fill="#ff0000"
                animate={{
                  opacity: [1, 0.3, 1],
                }}
                transition={{
                  duration: 0.3,
                  repeat: Infinity,
                }}
              />
              {/* Eye glow */}
              <motion.circle
                cx="30"
                cy="35"
                r="8"
                fill="rgba(255, 0, 0, 0.3)"
                animate={{
                  opacity: [0.3, 0, 0.3],
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: 0.3,
                  repeat: Infinity,
                }}
              />
              <motion.circle
                cx="50"
                cy="35"
                r="8"
                fill="rgba(255, 0, 0, 0.3)"
                animate={{
                  opacity: [0.3, 0, 0.3],
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: 0.3,
                  repeat: Infinity,
                }}
              />
            </svg>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
