import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './components/ui/button';
import { Github } from 'lucide-react';
import { Hero } from './components/Hero';
import { Demo } from './components/Demo';
import { HowItWorks } from './components/HowItWorks';
import { FogBackground } from './components/FogBackground';
import { BinaryRain } from './components/BinaryRain';
import { LightningFlash } from './components/LightningFlash';
import { GhostFlicker } from './components/GhostFlicker';
import { AudioControls } from './components/AudioControls';
import { getGitHubTokenFromURL, storeGitHubToken, initiateGitHubOAuth, getStoredGitHubToken } from './services/api';

export default function App() {
  const [errorIntensity, setErrorIntensity] = useState(0);
  const [hasGitHubToken, setHasGitHubToken] = useState(false);

  useEffect(() => {
    // Handle GitHub OAuth callback
    const token = getGitHubTokenFromURL();
    if (token) {
      storeGitHubToken(token);
      setHasGitHubToken(true);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    // Check for existing GitHub token
    const checkToken = () => {
      const existingToken = getStoredGitHubToken();
      setHasGitHubToken(!!existingToken);
    };
    
    checkToken();
    // Check periodically in case token is added from OAuth callback
    const interval = setInterval(checkToken, 1000);

    // Keyboard shortcut Ctrl + Shift + R
    const handleKeyboard = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'R') {
        e.preventDefault();
        document.getElementById('demo-section')?.scrollIntoView({ behavior: 'smooth' });
        // Trigger the reaper
        const summonBtn = document.getElementById('summon-btn');
        if (summonBtn) {
          summonBtn.click();
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyboard);
    return () => {
      window.removeEventListener('keydown', handleKeyboard);
      clearInterval(interval);
    };
  }, []);

  const handleGitHubAuth = () => {
    initiateGitHubOAuth();
  };

  return (
    <div className="relative bg-[#0A0A0A] text-white overflow-x-hidden min-h-screen">
      {/* GitHub Button - Sticky Top Right - Always Visible */}
      <motion.div
        className="fixed top-4 right-4 z-50"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <Button
          onClick={handleGitHubAuth}
          className="relative group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 backdrop-blur-sm text-white px-5 py-2.5 text-sm border-2 border-blue-400/50 overflow-hidden flex items-center gap-2 shadow-xl transition-all hover:scale-105"
          style={{ 
            fontFamily: "'Share Tech Mono', monospace",
            boxShadow: '0 4px 15px rgba(59, 130, 246, 0.5), 0 0 20px rgba(147, 51, 234, 0.3)'
          }}
        >
          {/* Animated glow effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{
              x: ['-100%', '200%'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 1,
            }}
          />
          <Github className="w-5 h-5 relative z-10" />
          <span className="relative z-10 whitespace-nowrap font-semibold">
            {hasGitHubToken ? 'GitHub ✓' : 'Connect GitHub'}
          </span>
        </Button>
      </motion.div>

      <FogBackground errorIntensity={errorIntensity} />
      <BinaryRain />
      <LightningFlash />
      <GhostFlicker />
      <AudioControls />
      
      <div className="relative z-10">
        <Hero />
        <Demo onErrorIntensityChange={setErrorIntensity} />
        <HowItWorks />
      </div>
    </div>
  );
}