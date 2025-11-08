import { motion, useMotionValue, useSpring } from 'motion/react';
import { ReactNode, useEffect } from 'react';

interface ParallaxContainerProps {
  children: ReactNode;
  strength?: number;
}

export function ParallaxContainer({ children, strength = 10 }: ParallaxContainerProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      // Calculate normalized mouse position (-1 to 1)
      const xPct = (clientX / innerWidth - 0.5) * 2;
      const yPct = (clientY / innerHeight - 0.5) * 2;
      
      mouseX.set(xPct * strength);
      mouseY.set(yPct * strength);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY, strength]);

  return (
    <motion.div
      style={{ x, y }}
      className="relative"
    >
      {children}
    </motion.div>
  );
}
