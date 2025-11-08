import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Skull } from 'lucide-react';

export function Hero() {
  const scrollToDemo = () => {
    document.getElementById('demo-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      {/* Glitch effect overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          opacity: [0, 0.1, 0, 0.05, 0],
        }}
        transition={{
          duration: 0.2,
          repeat: Infinity,
          repeatDelay: 3,
        }}
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,0,0,0.1) 0px, transparent 2px, transparent 4px, rgba(255,0,0,0.1) 6px)',
        }}
      />

      <div className="relative z-10 text-center max-w-5xl mx-auto">
        {/* Skull icon with glow */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="flex justify-center mb-8"
        >
          <div className="relative">
            <motion.div
              className="absolute inset-0 blur-2xl bg-red-600/50 rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            />
            <Skull className="w-20 h-20 text-red-500 relative z-10" />
          </div>
        </motion.div>

        {/* Glitchy headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-6 relative"
          style={{ fontFamily: "'Creepster', cursive" }}
        >
          <span className="block text-6xl md:text-8xl text-red-500 relative">
            <motion.span
              className="inline-block"
              animate={{
                textShadow: [
                  '0 0 10px rgba(255,0,0,0.5)',
                  '0 0 20px rgba(255,0,0,0.8), 0 0 30px rgba(128,0,128,0.5)',
                  '0 0 10px rgba(255,0,0,0.5)',
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            >
              Code Reaper
            </motion.span>
            
            {/* Glitch effect */}
            <motion.span
              className="absolute inset-0 text-purple-500"
              animate={{
                x: [-2, 2, -2],
                opacity: [0, 0.7, 0],
              }}
              transition={{
                duration: 0.3,
                repeat: Infinity,
                repeatDelay: 5,
              }}
            >
              Code Reaper
            </motion.span>
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-xl md:text-2xl mb-4 text-gray-400"
          style={{ fontFamily: "'Share Tech Mono', monospace" }}
        >
          Where Your Bugs Come to Die.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-lg md:text-xl mb-12 text-purple-400/80"
          style={{ fontFamily: "'Share Tech Mono', monospace" }}
        >
          An AI-powered haunted code reviewer built with Google Gemini.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="relative flex items-center justify-center"
        >
          {/* Main Button - Centered */}
          <Button
            onClick={scrollToDemo}
            className="relative group bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700 text-white px-8 py-6 text-lg border-2 border-red-500/50 overflow-hidden"
            style={{ fontFamily: "'Share Tech Mono', monospace" }}
          >
            {/* Glow effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-red-400/20 to-purple-400/20"
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 1,
              }}
            />
            <span className="relative z-10">Summon the Reaper →</span>
          </Button>
        </motion.div>

        {/* Cursor hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mt-8 text-sm text-gray-600"
          style={{ fontFamily: "'Share Tech Mono', monospace" }}
        >
          Press Ctrl + Shift + R to summon instantly
        </motion.p>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        animate={{
          y: [0, 10, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
      >
        <div className="w-6 h-10 border-2 border-red-500/50 rounded-full flex justify-center pt-2">
          <motion.div
            className="w-1 h-2 bg-red-500 rounded-full"
            animate={{
              y: [0, 12, 0],
              opacity: [1, 0, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          />
        </div>
      </motion.div>
    </section>
  );
}
