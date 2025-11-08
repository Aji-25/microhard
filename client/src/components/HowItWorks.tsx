import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';

const steps = [
  {
    number: '01',
    title: 'Paste your code.',
    description: 'Submit your haunted codebase to the void.',
  },
  {
    number: '02',
    title: 'Summon the Reaper.',
    description: 'Let the AI spirits analyze every line.',
  },
  {
    number: '03',
    title: 'Watch the AI unleash your curses.',
    description: 'Receive haunted feedback from beyond.',
  },
];

export function HowItWorks() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  return (
    <section ref={containerRef} className="min-h-screen py-20 px-4 relative overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2
            className="text-5xl md:text-6xl mb-4 text-red-500"
            style={{ fontFamily: "'Creepster', cursive" }}
          >
            How It Works
          </h2>
          <p
            className="text-xl text-gray-400"
            style={{ fontFamily: "'Share Tech Mono', monospace" }}
          >
            Three steps to debugging from the underworld
          </p>
        </motion.div>

        <div className="space-y-32">
          {steps.map((step, idx) => {
            const stepProgress = useTransform(
              scrollYProgress,
              [idx * 0.25, (idx + 1) * 0.25],
              [0, 1]
            );
            const opacity = useTransform(stepProgress, [0, 0.5, 1], [0.3, 1, 0.3]);
            const scale = useTransform(stepProgress, [0, 0.5, 1], [0.8, 1.1, 0.8]);

            return (
              <motion.div
                key={idx}
                style={{ opacity, scale }}
                className="relative"
              >
                <div className="flex flex-col md:flex-row items-center gap-8">
                  {/* Number */}
                  <motion.div
                    className="relative flex-shrink-0"
                    whileInView={{ rotate: [0, 360] }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: idx * 0.2 }}
                  >
                    <motion.div
                      className="absolute inset-0 blur-2xl bg-gradient-to-r from-red-600 to-purple-600 rounded-full"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.6, 0.3],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        delay: idx * 0.5,
                      }}
                    />
                    <div className="relative w-32 h-32 rounded-full border-4 border-red-500/50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                      <span
                        className="text-5xl text-red-500"
                        style={{ fontFamily: "'Creepster', cursive" }}
                      >
                        {step.number}
                      </span>
                    </div>
                  </motion.div>

                  {/* Content */}
                  <div className="flex-1 text-center md:text-left">
                    <motion.h3
                      initial={{ opacity: 0, x: 30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: idx * 0.2 + 0.2 }}
                      className="text-3xl md:text-4xl mb-2 text-white"
                      style={{ fontFamily: "'Creepster', cursive" }}
                    >
                      {step.title}
                    </motion.h3>
                    <motion.p
                      initial={{ opacity: 0, x: 30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: idx * 0.2 + 0.4 }}
                      className="text-lg text-gray-400"
                      style={{ fontFamily: "'Share Tech Mono', monospace" }}
                    >
                      {step.description}
                    </motion.p>
                  </div>
                </div>

                {/* Floating code particles */}
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute text-xs text-green-500/20 pointer-events-none"
                    style={{ fontFamily: "'Share Tech Mono', monospace" }}
                    initial={{
                      x: Math.random() * 100 - 50,
                      y: Math.random() * 100 - 50,
                    }}
                    animate={{
                      y: [0, -100, 0],
                      opacity: [0, 0.5, 0],
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      delay: i * 1.5 + idx * 0.5,
                    }}
                  >
                    {['01010', 'if()', '{}', '//'][i]}
                  </motion.div>
                ))}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
