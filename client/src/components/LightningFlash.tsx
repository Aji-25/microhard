import { motion } from 'motion/react';

export function LightningFlash() {
  return (
    <>
      {/* Red lightning flash overlay */}
      <motion.div
        className="fixed inset-0 pointer-events-none z-0"
        animate={{
          opacity: [0, 0, 0, 0.15, 0, 0.1, 0],
          background: [
            'radial-gradient(circle at 50% 0%, rgba(255, 0, 0, 0) 0%, transparent 100%)',
            'radial-gradient(circle at 50% 0%, rgba(255, 0, 0, 0) 0%, transparent 100%)',
            'radial-gradient(circle at 50% 0%, rgba(255, 0, 0, 0) 0%, transparent 100%)',
            'radial-gradient(circle at 50% 0%, rgba(255, 0, 0, 0.4) 0%, transparent 80%)',
            'radial-gradient(circle at 50% 0%, rgba(255, 0, 0, 0) 0%, transparent 100%)',
            'radial-gradient(circle at 50% 0%, rgba(255, 0, 0, 0.2) 0%, transparent 80%)',
            'radial-gradient(circle at 50% 0%, rgba(255, 0, 0, 0) 0%, transparent 100%)',
          ],
        }}
        transition={{
          duration: 0.5,
          repeat: Infinity,
          repeatDelay: 8 + Math.random() * 12,
        }}
      />

      {/* Purple lightning alternate */}
      <motion.div
        className="fixed inset-0 pointer-events-none z-0"
        animate={{
          opacity: [0, 0, 0.2, 0, 0.15, 0],
          background: [
            'radial-gradient(circle at 80% 20%, rgba(128, 0, 128, 0) 0%, transparent 100%)',
            'radial-gradient(circle at 80% 20%, rgba(128, 0, 128, 0) 0%, transparent 100%)',
            'radial-gradient(circle at 80% 20%, rgba(128, 0, 128, 0.3) 0%, transparent 70%)',
            'radial-gradient(circle at 80% 20%, rgba(128, 0, 128, 0) 0%, transparent 100%)',
            'radial-gradient(circle at 80% 20%, rgba(128, 0, 128, 0.2) 0%, transparent 70%)',
            'radial-gradient(circle at 80% 20%, rgba(128, 0, 128, 0) 0%, transparent 100%)',
          ],
        }}
        transition={{
          duration: 0.4,
          repeat: Infinity,
          repeatDelay: 15 + Math.random() * 10,
          delay: 5,
        }}
      />
    </>
  );
}
