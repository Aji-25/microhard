import { motion } from 'motion/react';

interface FogBackgroundProps {
  errorIntensity?: number; // 0-100, controls fog thickness
}

export function FogBackground({ errorIntensity = 0 }: FogBackgroundProps) {
  const baseFogOpacity = 0.3;
  const errorFogOpacity = 0.3 + (errorIntensity / 100) * 0.4; // 0.3 to 0.7

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Animated fog layers */}
      <motion.div
        className="absolute inset-0"
        animate={{
          opacity: errorFogOpacity,
          background: [
            'radial-gradient(circle at 20% 50%, rgba(139, 0, 0, 0.15) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 50%, rgba(139, 0, 0, 0.15) 0%, transparent 50%)',
            'radial-gradient(circle at 50% 80%, rgba(139, 0, 0, 0.15) 0%, transparent 50%)',
            'radial-gradient(circle at 20% 50%, rgba(139, 0, 0, 0.15) 0%, transparent 50%)',
          ],
        }}
        transition={{
          opacity: { duration: 1 },
          background: {
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          },
        }}
      />
      
      {/* Error-based additional fog */}
      {errorIntensity > 50 && (
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{
            opacity: (errorIntensity - 50) / 100,
          }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="absolute inset-0"
            animate={{
              background: [
                'radial-gradient(circle at 50% 50%, rgba(139, 0, 0, 0.3) 0%, transparent 70%)',
                'radial-gradient(circle at 30% 70%, rgba(139, 0, 0, 0.3) 0%, transparent 70%)',
                'radial-gradient(circle at 70% 30%, rgba(139, 0, 0, 0.3) 0%, transparent 70%)',
                'radial-gradient(circle at 50% 50%, rgba(139, 0, 0, 0.3) 0%, transparent 70%)',
              ],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        </motion.div>
      )}
      
      <motion.div
        className="absolute inset-0 opacity-20"
        animate={{
          background: [
            'radial-gradient(circle at 70% 30%, rgba(128, 0, 128, 0.2) 0%, transparent 60%)',
            'radial-gradient(circle at 30% 70%, rgba(128, 0, 128, 0.2) 0%, transparent 60%)',
            'radial-gradient(circle at 60% 60%, rgba(128, 0, 128, 0.2) 0%, transparent 60%)',
            'radial-gradient(circle at 70% 30%, rgba(128, 0, 128, 0.2) 0%, transparent 60%)',
          ],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Floating particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-red-500/20 rounded-full"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          animate={{
            y: [
              Math.random() * window.innerHeight,
              Math.random() * window.innerHeight,
              Math.random() * window.innerHeight,
            ],
            x: [
              Math.random() * window.innerWidth,
              Math.random() * window.innerWidth,
              Math.random() * window.innerWidth,
            ],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 10 + Math.random() * 20,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
}