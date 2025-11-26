// Natura Demo - Custom Hooks for Animations and Interactions

import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Animated counter hook - smoothly animates numbers
 */
export function useAnimatedCounter(
  targetValue: number,
  duration: number = 1500,
  startOnMount: boolean = true
): { value: number; start: () => void; isAnimating: boolean } {
  const [value, setValue] = useState(startOnMount ? 0 : targetValue);
  const [isAnimating, setIsAnimating] = useState(false);
  const startTimeRef = useRef<number | null>(null);
  const animationRef = useRef<number | null>(null);
  const animateRef = useRef<((timestamp: number) => void) | null>(null);

  const animate = useCallback((timestamp: number) => {
    if (!startTimeRef.current) {
      startTimeRef.current = timestamp;
    }

    const progress = Math.min((timestamp - startTimeRef.current) / duration, 1);
    // Easing function: easeOutExpo
    const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
    setValue(Math.floor(eased * targetValue));

    if (progress < 1) {
      animationRef.current = requestAnimationFrame((ts) => animateRef.current?.(ts));
    } else {
      setValue(targetValue);
      setIsAnimating(false);
    }
  }, [targetValue, duration]);

  // Keep the ref updated with the latest callback
  useEffect(() => {
    animateRef.current = animate;
  }, [animate]);

  const start = useCallback(() => {
    setValue(0);
    startTimeRef.current = null;
    setIsAnimating(true);
    animationRef.current = requestAnimationFrame((ts) => animateRef.current?.(ts));
  }, []);

  useEffect(() => {
    if (startOnMount) {
      start(); // eslint-disable-line react-hooks/set-state-in-effect -- Starting animation on mount is intentional
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [startOnMount, start]);

  return { value, start, isAnimating };
}

/**
 * Intersection observer hook for triggering animations on scroll
 */
export function useInView(
  options: IntersectionObserverInit = { threshold: 0.1 }
): { ref: React.RefObject<HTMLDivElement | null>; inView: boolean } {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer.unobserve(element);
      }
    }, options);

    observer.observe(element);
    return () => observer.disconnect();
  }, [options]);

  return { ref, inView };
}

/**
 * Staggered animation delay calculator
 */
export function useStaggeredDelay(index: number, baseDelay: number = 100): number {
  return index * baseDelay;
}

/**
 * Hover state with debounce
 */
export function useHoverState(delay: number = 150): {
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
} {
  const [isHovered, setIsHovered] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const onMouseEnter = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsHovered(true);
  }, []);

  const onMouseLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => setIsHovered(false), delay);
  }, [delay]);

  return { isHovered, onMouseEnter, onMouseLeave };
}

/**
 * Animated list hook - staggers children animations
 */
export function useAnimatedList<T>(
  items: T[],
  staggerDelay: number = 50
): { visibleItems: T[]; isComplete: boolean } {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    if (visibleCount < items.length) {
      const timeout = setTimeout(() => {
        setVisibleCount((c) => c + 1);
      }, staggerDelay);
      return () => clearTimeout(timeout);
    }
  }, [visibleCount, items.length, staggerDelay]);

  useEffect(() => {
    setVisibleCount(0); // eslint-disable-line react-hooks/set-state-in-effect -- Reset on items change is intentional
  }, [items]);

  return {
    visibleItems: items.slice(0, visibleCount),
    isComplete: visibleCount >= items.length,
  };
}

/**
 * Typewriter effect hook
 */
export function useTypewriter(
  text: string,
  speed: number = 30,
  startOnMount: boolean = true
): { displayText: string; isComplete: boolean; start: () => void } {
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const indexRef = useRef(0);

  const start = useCallback(() => {
    setDisplayText('');
    setIsComplete(false);
    indexRef.current = 0;
  }, []);

  useEffect(() => {
    if (!startOnMount && displayText === '') return;

    if (indexRef.current < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(text.slice(0, indexRef.current + 1));
        indexRef.current++;
      }, speed);
      return () => clearTimeout(timeout);
    } else {
      setIsComplete(true); // eslint-disable-line react-hooks/set-state-in-effect -- Completion logic is intentional
    }
  }, [displayText, text, speed, startOnMount]);

  return { displayText, isComplete, start };
}

/**
 * Pulse animation trigger
 */
export function usePulse(interval: number = 3000): boolean {
  const [isPulsing, setIsPulsing] = useState(false);

  useEffect(() => {
    const trigger = () => {
      setIsPulsing(true);
      setTimeout(() => setIsPulsing(false), 600);
    };

    const intervalId = setInterval(trigger, interval);
    return () => clearInterval(intervalId);
  }, [interval]);

  return isPulsing;
}
