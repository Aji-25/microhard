import { motion } from 'motion/react';
import { Volume2, VolumeX, Music } from 'lucide-react';
import { useState } from 'react';

export function AudioControls() {
  const [ambientEnabled, setAmbientEnabled] = useState(false);
  const [cleanCodeDetected, setCleanCodeDetected] = useState(false);

  // Mock toggle - in a real app this would control actual audio
  const toggleAmbient = () => {
    setAmbientEnabled(!ambientEnabled);
  };

  // This would be triggered by parent when clean code is detected
  // For now, just a visual indicator
  return (
    <div className="fixed bottom-6 right-6 z-50 flex gap-3">
      {/* Ambient sound toggle */}
      <motion.button
        onClick={toggleAmbient}
        className="relative group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          className="absolute inset-0 rounded-full blur-xl"
          animate={{
            background: ambientEnabled
              ? 'radial-gradient(circle, rgba(139, 0, 0, 0.5) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(75, 85, 99, 0.3) 0%, transparent 70%)',
          }}
        />
        <div className="relative w-12 h-12 rounded-full bg-black/80 border-2 border-red-900/50 backdrop-blur-sm flex items-center justify-center">
          {ambientEnabled ? (
            <Volume2 className="w-5 h-5 text-red-500" />
          ) : (
            <VolumeX className="w-5 h-5 text-gray-500" />
          )}
        </div>
        
        {/* Tooltip */}
        <motion.div
          className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-black/90 border border-red-900/50 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
          style={{ fontFamily: "'Share Tech Mono', monospace" }}
        >
          <span className="text-xs text-gray-400">
            {ambientEnabled ? 'Ambient: ON' : 'Ambient: OFF'}
          </span>
        </motion.div>
      </motion.button>

      {/* Clean code chime indicator */}
      <motion.div
        className="relative"
        animate={cleanCodeDetected ? {
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5],
        } : {}}
        transition={{
          duration: 2,
          repeat: cleanCodeDetected ? Infinity : 0,
        }}
      >
        <motion.div
          className="absolute inset-0 rounded-full blur-xl"
          animate={{
            background: cleanCodeDetected
              ? 'radial-gradient(circle, rgba(34, 197, 94, 0.5) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(75, 85, 99, 0.1) 0%, transparent 70%)',
          }}
        />
        <div className="relative w-12 h-12 rounded-full bg-black/80 border-2 border-purple-900/50 backdrop-blur-sm flex items-center justify-center">
          <Music className={`w-5 h-5 ${cleanCodeDetected ? 'text-green-500' : 'text-gray-700'}`} />
        </div>
      </motion.div>
    </div>
  );
}
