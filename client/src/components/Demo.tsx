import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Terminal, Skull, Code, Zap, Ghost } from 'lucide-react';
import { Textarea } from './ui/textarea';
import { ParallaxContainer } from './ParallaxContainer';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { reviewCode, fixCode, ReviewResponse } from '../services/api';

const codeTemplates: Record<string, { code: string; extension: string }> = {
  javascript: {
    code: `function calculateTotal(items) {
  let total = 0;
  for (let i = 0; i <= items.length; i++) {
    total += items[i].price;
  }
  return total;
}

while(true) {
  console.log("Processing...");
}`,
    extension: 'js',
  },
  python: {
    code: `def calculate_total(items):
    total = 0
    for i in range(len(items) + 1):
        total += items[i]['price']
    return total

while True:
    print("Processing...")`,
    extension: 'py',
  },
  cpp: {
    code: `#include <iostream>
using namespace std;

int calculateTotal(int items[], int size) {
    int total = 0;
    for (int i = 0; i <= size; i++) {
        total += items[i];
    }
    return total;
}

int main() {
    while(true) {
        cout << "Processing..." << endl;
    }
    return 0;
}`,
    extension: 'cpp',
  },
  java: {
    code: `public class Calculator {
    public static int calculateTotal(int[] items) {
        int total = 0;
        for (int i = 0; i <= items.length; i++) {
            total += items[i];
        }
        return total;
    }
    
    public static void main(String[] args) {
        while(true) {
            System.out.println("Processing...");
        }
    }
}`,
    extension: 'java',
  },
  typescript: {
    code: `interface Item {
  price: number;
}

function calculateTotal(items: Item[]): number {
  let total = 0;
  for (let i = 0; i <= items.length; i++) {
    total += items[i].price;
  }
  return total;
}

while(true) {
  console.log("Processing...");
}`,
    extension: 'ts',
  },
  rust: {
    code: `fn calculate_total(items: &[i32]) -> i32 {
    let mut total = 0;
    for i in 0..=items.len() {
        total += items[i];
    }
    total
}

fn main() {
    loop {
        println!("Processing...");
    }
}`,
    extension: 'rs',
  },
};


interface DemoProps {
  onErrorIntensityChange?: (intensity: number) => void;
}

export function Demo({ onErrorIntensityChange }: DemoProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
  const [curseLevel, setCurseLevel] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [code, setCode] = useState(codeTemplates.javascript.code);
  const [showGhosts, setShowGhosts] = useState(false);
  const [reviewData, setReviewData] = useState<ReviewResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isFixing, setIsFixing] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Update error intensity based on curse level
  useEffect(() => {
    if (onErrorIntensityChange) {
      onErrorIntensityChange(curseLevel);
    }
  }, [curseLevel, onErrorIntensityChange]);

  useEffect(() => {
    // Initialize audio context on user interaction
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    return () => {
      audioContextRef.current?.close();
    };
  }, []);

  const playScreamSound = () => {
    if (!audioContextRef.current) return;
    
    const context = audioContextRef.current;
    
    // Create a creepy scream-like sound using oscillators
    const screamDuration = 0.8;
    
    // Main oscillator - creates the base scream
    const oscillator1 = context.createOscillator();
    const gainNode1 = context.createGain();
    
    oscillator1.type = 'sawtooth';
    oscillator1.frequency.setValueAtTime(800, context.currentTime);
    oscillator1.frequency.exponentialRampToValueAtTime(200, context.currentTime + screamDuration);
    
    gainNode1.gain.setValueAtTime(0.3, context.currentTime);
    gainNode1.gain.exponentialRampToValueAtTime(0.01, context.currentTime + screamDuration);
    
    oscillator1.connect(gainNode1);
    gainNode1.connect(context.destination);
    
    // Second oscillator for depth
    const oscillator2 = context.createOscillator();
    const gainNode2 = context.createGain();
    
    oscillator2.type = 'square';
    oscillator2.frequency.setValueAtTime(600, context.currentTime);
    oscillator2.frequency.exponentialRampToValueAtTime(150, context.currentTime + screamDuration);
    
    gainNode2.gain.setValueAtTime(0.2, context.currentTime);
    gainNode2.gain.exponentialRampToValueAtTime(0.01, context.currentTime + screamDuration);
    
    oscillator2.connect(gainNode2);
    gainNode2.connect(context.destination);
    
    oscillator1.start(context.currentTime);
    oscillator2.start(context.currentTime);
    oscillator1.stop(context.currentTime + screamDuration);
    oscillator2.stop(context.currentTime + screamDuration);
  };

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    setCode(codeTemplates[language].code);
    setShowResponse(false);
  };

  const summonReaper = async () => {
    if (!code.trim()) return;
    
    setIsAnalyzing(true);
    setShowResponse(false);
    setReviewData(null);
    setCurseLevel(0);
    setShowGhosts(true);
    setError(null);

    // Play scream sound
    playScreamSound();

    // Flash effect with shake
    const flash = document.createElement('div');
    flash.className = 'fixed inset-0 bg-red-600 pointer-events-none z-50';
    flash.style.opacity = '0';
    document.body.appendChild(flash);
    
    // Add screen shake
    document.body.style.animation = 'shake 0.5s';
    
    setTimeout(() => {
      flash.style.transition = 'opacity 0.1s';
      flash.style.opacity = '0.4';
      setTimeout(() => {
        flash.style.opacity = '0';
        setTimeout(() => {
          flash.remove();
          document.body.style.animation = '';
        }, 100);
      }, 150);
    }, 300);

    // Animate curse level while API call is in progress
    let level = 0;
    const interval = setInterval(() => {
      level += 5;
      setCurseLevel(Math.min(level, 90)); // Don't go to 100 until API responds
    }, 50);

    try {
      // Call the real API
      const result = await reviewCode(code, selectedLanguage);
      
      // Stop the progress animation
      clearInterval(interval);
      
      // Set the actual curse level from the response
      setCurseLevel(result.curseLevel);
      setReviewData(result);
      
      // Show response after a brief delay
      setTimeout(() => {
        setIsAnalyzing(false);
        setShowResponse(true);
        setShowGhosts(false);
      }, 300);
      
    } catch (err) {
      clearInterval(interval);
      setCurseLevel(0);
      
      // Extract error message
      let errorMessage = 'Failed to review code';
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      }
      
      console.error('❌ Review error:', err);
      console.error('Error details:', {
        message: errorMessage,
        type: typeof err,
        err
      });
      
      setError(errorMessage);
      setIsAnalyzing(false);
      setShowResponse(true);
      setShowGhosts(false);
    }
  };

  const handleAutoFix = async () => {
    if (!code.trim() || !reviewData) return;
    
    setIsFixing(true);
    setError(null);

    try {
      const result = await fixCode(code, selectedLanguage);
      setCode(result.fixedCode);
      setReviewData(null);
      setShowResponse(false);
      setCurseLevel(0);
      // Optionally re-run review on fixed code
      setTimeout(() => {
        summonReaper();
      }, 500);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fix code';
      setError(errorMessage);
    } finally {
      setIsFixing(false);
    }
  };

  return (
    <section id="demo-section" className="min-h-screen py-20 px-4 relative">
      {/* Floating ghosts during analysis */}
      <AnimatePresence>
        {showGhosts && (
          <>
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  x: Math.random() * window.innerWidth,
                  y: window.innerHeight + 100,
                  opacity: 0,
                  rotate: 0,
                }}
                animate={{ 
                  y: -200,
                  opacity: [0, 0.7, 0.7, 0],
                  rotate: 360,
                  x: Math.random() * window.innerWidth,
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 3,
                  delay: i * 0.2,
                  ease: 'easeInOut',
                }}
                className="fixed pointer-events-none z-40"
              >
                <Ghost className="w-12 h-12 text-purple-500/70" />
              </motion.div>
            ))}
          </>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.h2
            className="text-5xl md:text-6xl mb-4 text-red-500"
            style={{ fontFamily: "'Creepster', cursive" }}
            animate={{
              textShadow: [
                '0 0 20px rgba(255,0,0,0.5)',
                '0 0 40px rgba(255,0,0,0.8), 0 0 60px rgba(128,0,128,0.5)',
                '0 0 20px rgba(255,0,0,0.5)',
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          >
            Interactive Demo
          </motion.h2>
          <p
            className="text-xl text-gray-400"
            style={{ fontFamily: "'Share Tech Mono', monospace" }}
          >
            Watch the AI unleash your code's darkest secrets
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 items-stretch">
          {/* Code Editor */}
          <ParallaxContainer strength={5}>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex flex-col"
              animate={isAnalyzing ? { 
                boxShadow: [
                  '0 0 20px rgba(255,0,0,0.3), 0 0 0 1px rgba(255,0,0,0.2)',
                  '0 0 40px rgba(255,0,0,0.6), 0 0 0 2px rgba(255,0,0,0.4)',
                  '0 0 20px rgba(255,0,0,0.3), 0 0 0 1px rgba(255,0,0,0.2)',
                ]
              } : {
                boxShadow: '0 0 15px rgba(255,0,0,0.1), 0 0 0 1px rgba(255,0,0,0.15)',
              }}
              style={{ borderRadius: '0.5rem' }}
            >
              <div className="bg-black/50 border-2 border-red-900/50 rounded-lg overflow-hidden backdrop-blur-sm flex flex-col h-full min-h-[600px] relative">
                {/* Animated scanline effect */}
                {isAnalyzing && (
                  <motion.div
                    className="absolute inset-0 pointer-events-none z-10"
                    style={{
                      background: 'linear-gradient(to bottom, transparent 0%, rgba(255,0,0,0.1) 50%, transparent 100%)',
                      height: '100px',
                    }}
                    animate={{
                      y: [-100, 700],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  />
                )}
                
                {/* Header with language selector */}
                <div className="bg-red-950/30 px-4 py-2 flex items-center justify-between border-b border-red-900/50">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-2">
                      <motion.div 
                        className="w-3 h-3 rounded-full bg-red-500/50"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      <motion.div 
                        className="w-3 h-3 rounded-full bg-yellow-500/50"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                      />
                      <motion.div 
                        className="w-3 h-3 rounded-full bg-green-500/50"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
                      />
                    </div>
                    <span
                      className="text-sm text-gray-400 ml-2"
                      style={{ fontFamily: "'Share Tech Mono', monospace" }}
                    >
                      cursed_code.{codeTemplates[selectedLanguage].extension}
                    </span>
                  </div>
                  
                  {/* Language Selector */}
                  <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
                    <SelectTrigger className="w-[150px] h-8 bg-black/50 border-red-900/50 text-gray-300 hover:border-red-500/50 transition-colors">
                      <Code className="w-3 h-3 mr-1 flex-shrink-0" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black/95 border-red-900/50 text-gray-300">
                      <SelectItem value="javascript" className="text-gray-300">JavaScript</SelectItem>
                      <SelectItem value="typescript" className="text-gray-300">TypeScript</SelectItem>
                      <SelectItem value="python" className="text-gray-300">Python</SelectItem>
                      <SelectItem value="cpp" className="text-gray-300">C++</SelectItem>
                      <SelectItem value="java" className="text-gray-300">Java</SelectItem>
                      <SelectItem value="rust" className="text-gray-300">Rust</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Editable Code Area */}
                <div className="p-4 flex-1 flex flex-col relative">
                  <Textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="flex-1 bg-transparent border-none text-green-400 resize-none focus-visible:ring-0 focus-visible:ring-offset-0 overflow-auto"
                    style={{ fontFamily: "'Share Tech Mono', monospace" }}
                    placeholder="Paste your cursed code here..."
                    spellCheck={false}
                  />
                  {/* Cursor blink effect */}
                  <motion.div
                    className="absolute bottom-6 left-6 w-2 h-4 bg-green-400"
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                </div>
              </div>
            </motion.div>
          </ParallaxContainer>

          {/* Response Terminal */}
          <ParallaxContainer strength={5}>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex flex-col"
              animate={showResponse ? { 
                boxShadow: [
                  '0 0 20px rgba(128,0,128,0.3), 0 0 0 1px rgba(128,0,128,0.2)',
                  '0 0 40px rgba(128,0,128,0.6), 0 0 0 2px rgba(128,0,128,0.4)',
                  '0 0 20px rgba(128,0,128,0.3), 0 0 0 1px rgba(128,0,128,0.2)',
                ]
              } : {
                boxShadow: '0 0 15px rgba(128,0,128,0.1), 0 0 0 1px rgba(128,0,128,0.15)',
              }}
              style={{ borderRadius: '0.5rem' }}
            >
              <div className="bg-black/50 border-2 border-purple-900/50 rounded-lg overflow-hidden backdrop-blur-sm flex flex-col h-full min-h-[600px] relative">
                {/* Lightning effects during analysis */}
                {isAnalyzing && (
                  <>
                    <motion.div
                      className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent"
                      animate={{
                        opacity: [0, 1, 0],
                        scaleX: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 0.3,
                        repeat: Infinity,
                        repeatDelay: 1,
                      }}
                    />
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute pointer-events-none"
                        initial={{ opacity: 0 }}
                        animate={{
                          opacity: [0, 1, 0],
                          x: [Math.random() * 400, Math.random() * 400],
                          y: [Math.random() * 500, Math.random() * 500],
                        }}
                        transition={{
                          duration: 0.2,
                          repeat: Infinity,
                          repeatDelay: 2 + i,
                          delay: i * 0.5,
                        }}
                      >
                        <Zap className="w-6 h-6 text-purple-400" />
                      </motion.div>
                    ))}
                  </>
                )}
                
                <div className="bg-purple-950/30 px-4 py-2 flex items-center gap-2 border-b border-purple-900/50">
                  <Terminal className="w-4 h-4 text-purple-400" />
                  <span
                    className="text-sm text-gray-400"
                    style={{ fontFamily: "'Share Tech Mono', monospace" }}
                  >
                    reaper_output.terminal
                  </span>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div className="flex-1 flex items-center justify-center min-h-0 overflow-auto">
                    <AnimatePresence mode="wait">
                      {!isAnalyzing && !showResponse && (
                        <motion.div
                          key="idle"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="text-center"
                        >
                          <motion.div
                            animate={{ 
                              rotate: [0, 10, -10, 0],
                              scale: [1, 1.1, 1],
                            }}
                            transition={{ 
                              duration: 3,
                              repeat: Infinity,
                            }}
                          >
                            <Skull className="w-16 h-16 text-purple-500/30 mx-auto mb-4" />
                          </motion.div>
                          <p
                            className="text-purple-500/50"
                            style={{ fontFamily: "'Share Tech Mono', monospace" }}
                          >
                            Awaiting your cursed code...
                          </p>
                        </motion.div>
                      )}

                      {isAnalyzing && (
                        <motion.div
                          key="analyzing"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="w-full"
                        >
                          <motion.div
                            animate={{
                              rotate: 360,
                              scale: [1, 1.1, 1],
                            }}
                            transition={{
                              rotate: {
                                duration: 2,
                                repeat: Infinity,
                                ease: 'linear',
                              },
                              scale: {
                                duration: 1,
                                repeat: Infinity,
                              },
                            }}
                            className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-6"
                          />
                          <p
                            className="text-center text-purple-400 mb-4"
                            style={{ fontFamily: "'Share Tech Mono', monospace" }}
                          >
                            <motion.span
                              animate={{ opacity: [1, 0.3, 1] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            >
                              Summoning the spirits...
                            </motion.span>
                          </p>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm text-gray-500">
                              <span style={{ fontFamily: "'Share Tech Mono', monospace" }}>
                                Curse Level
                              </span>
                              <motion.span 
                                style={{ fontFamily: "'Share Tech Mono', monospace" }}
                                animate={{ 
                                  color: curseLevel > 75 ? '#ef4444' : curseLevel > 50 ? '#eab308' : '#22c55e'
                                }}
                              >
                                {curseLevel}%
                              </motion.span>
                            </div>
                            <motion.div
                              animate={curseLevel > 50 ? {
                                scale: [1, 1.02, 1],
                              } : {}}
                              transition={{
                                duration: 0.8,
                                repeat: curseLevel > 50 ? Infinity : 0,
                                ease: 'easeInOut',
                              }}
                            >
                              <Progress
                                value={curseLevel}
                                className="h-2 bg-gray-800"
                              />
                            </motion.div>
                          </div>
                        </motion.div>
                      )}

                      {showResponse && reviewData && (
                        <motion.div
                          key="response"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="w-full space-y-4 overflow-auto"
                        >
                          {/* Verdict Banner */}
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-4 bg-red-950/40 border-2 border-red-500/50 rounded-lg"
                          >
                            <p className="text-red-400 text-lg font-bold mb-2" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
                              💀 Verdict
                            </p>
                            <p className="text-red-300" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
                              {reviewData.verdict}
                            </p>
                          </motion.div>

                          {/* Curse Level Display */}
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-400" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
                                Curse Level
                              </span>
                              <motion.span
                                className="font-bold"
                                style={{ 
                                  fontFamily: "'Share Tech Mono', monospace",
                                  color: curseLevel > 75 ? '#ef4444' : curseLevel > 50 ? '#eab308' : '#22c55e'
                                }}
                                animate={{ 
                                  scale: curseLevel > 75 ? [1, 1.1, 1] : 1
                                }}
                                transition={{ duration: 0.5, repeat: curseLevel > 75 ? Infinity : 0 }}
                              >
                                {curseLevel}%
                              </motion.span>
                            </div>
                            <Progress
                              value={curseLevel}
                              className="h-3 bg-gray-800"
                            />
                          </div>

                          {/* Errors */}
                          {reviewData.errors.length > 0 && (
                            <motion.div
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="space-y-2"
                            >
                              <p className="text-red-500 font-bold text-sm" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
                                🔴 Errors ({reviewData.errors.length})
                              </p>
                              {reviewData.errors.map((err, idx) => (
                                <motion.div
                                  key={idx}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: idx * 0.1 }}
                                  className="border-l-2 border-red-500 pl-3 py-2 bg-red-950/20 rounded"
                                >
                                  <p className="text-red-400 text-xs" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
                                    Line {err.line}: {err.message}
                                  </p>
                                </motion.div>
                              ))}
                            </motion.div>
                          )}

                          {/* Warnings */}
                          {reviewData.warnings.length > 0 && (
                            <motion.div
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="space-y-2"
                            >
                              <p className="text-yellow-500 font-bold text-sm" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
                                ⚠️ Warnings ({reviewData.warnings.length})
                              </p>
                              {reviewData.warnings.map((warn, idx) => (
                                <motion.div
                                  key={idx}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: idx * 0.1 }}
                                  className="border-l-2 border-yellow-500 pl-3 py-2 bg-yellow-950/20 rounded"
                                >
                                  <p className="text-yellow-400 text-xs" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
                                    Line {warn.line}: {warn.message}
                                  </p>
                                </motion.div>
                              ))}
                            </motion.div>
                          )}

                          {/* Suggestions */}
                          {reviewData.suggestions.length > 0 && (
                            <motion.div
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="space-y-2"
                            >
                              <p className="text-purple-500 font-bold text-sm" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
                                💡 Suggestions ({reviewData.suggestions.length})
                              </p>
                              {reviewData.suggestions.map((sugg, idx) => (
                                <motion.div
                                  key={idx}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: idx * 0.1 }}
                                  className="border-l-2 border-purple-500 pl-3 py-2 bg-purple-950/20 rounded"
                                >
                                  <p className="text-purple-400 text-xs" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
                                    Line {sugg.line}: {sugg.fix}
                                  </p>
                                </motion.div>
                              ))}
                            </motion.div>
                          )}

                          {/* No issues found */}
                          {reviewData.errors.length === 0 && reviewData.warnings.length === 0 && reviewData.suggestions.length === 0 && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="p-4 bg-green-950/30 border border-green-500/50 rounded-lg text-center"
                            >
                              <p className="text-green-400" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
                                ✨ The code is clean! No curses detected.
                              </p>
                            </motion.div>
                          )}
                        </motion.div>
                      )}

                      {showResponse && error && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-4 p-4 bg-red-950/30 border-2 border-red-500/50 rounded-lg"
                        >
                          <p className="text-red-400 font-bold mb-2 text-sm" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
                            💀 Error
                          </p>
                          <p className="text-red-300 text-sm" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
                            {error}
                          </p>
                          <p className="text-red-400/70 text-xs mt-2" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
                            Check the browser console for more details.
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="space-y-3 mt-6">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        id="summon-btn"
                        onClick={summonReaper}
                        disabled={isAnalyzing || !code.trim()}
                        className="w-full bg-gradient-to-r from-purple-600 to-red-600 hover:from-purple-700 hover:to-red-700 border-2 border-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
                        style={{ fontFamily: "'Share Tech Mono', monospace" }}
                      >
                        {/* Animated gradient on hover */}
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
                        <span className="relative z-10">
                          {isAnalyzing ? 'Summoning...' : 'Summon the Reaper'}
                        </span>
                      </Button>
                    </motion.div>

                    {showResponse && reviewData && (reviewData.errors.length > 0 || reviewData.warnings.length > 0) && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          onClick={handleAutoFix}
                          disabled={isFixing || !code.trim()}
                          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 border-2 border-green-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{ fontFamily: "'Share Tech Mono', monospace" }}
                        >
                          {isFixing ? 'Exorcising...' : '✨ Auto-Exorcise (Fix Code)'}
                        </Button>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </ParallaxContainer>
        </div>
      </div>

      {/* Add shake keyframes to global styles */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
      `}</style>
    </section>
  );
}