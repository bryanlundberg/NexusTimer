"use client"

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface NaroBaseLoaderProps {
  onLoadingComplete?: () => void;
}

export default function Ntloader({ onLoadingComplete }: NaroBaseLoaderProps) {
  const [progress, setProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState('');
  const [startTime] = useState(Date.now());

  useEffect(() => {
    const loadingMessages = [
      'Just a few more turns!',
      'Cubes getting twisted!',
      'Did you double-check your moves?',
      'Focus is the key to solving quickly!',
      'Almost at the finish line!',
      'Rotating, rotating, rotating!',
      'Every turn gets us closer!',
      'Fast hands aid optimal solving!',
      'Watch those pieces fall in place!',
      'Don\'t blink, we\'re so close!',
      'Transformation in progress!',
      'Precision with every twist!',
      'Perfect algorithms, perfect results!',
      'Less than 20 moves to glory!',
      'Here comes an amazing solve!',
      'Alignment is everything!',
      'The solution is near!',
      'Watch your speed!',
      'Practice makes perfect solving!',
      'Keep your cool, it\'s happening!',
      'Execute those algorithms smoothly!',
      'A moment of brilliance awaits you!',
      'Twist and turn your way to success!',
      'The cube is no match for you!',
      'Let each twist count!',
      'Solving magic in action!',
      'Perfection is coming your way!',
      'Steady hands, great results!',
      'Your mastery shines through!',
      'Piece by piece, it\'s coming together!'
    ];

    setCurrentMessage(loadingMessages[Math.floor(Math.random() * loadingMessages.length)]);

    const messageInterval = setInterval(() => {
      setCurrentMessage(loadingMessages[Math.floor(Math.random() * loadingMessages.length)]);
    }, 5000);

    return () => clearInterval(messageInterval);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (progress < 100) {
        setProgress(prev => {
          const increment = Math.random() * 9 + 1;
          return Math.min(prev + increment, 100);
        });
      } else if (onLoadingComplete) {
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, 1000 - elapsedTime);

        setTimeout(() => {
          onLoadingComplete();
        }, remainingTime + 10);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [progress, onLoadingComplete, startTime]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="text-3xl font-bold mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.2 }}
      >
        Nexus Timer
      </motion.div>

      <motion.div
        className="w-64 h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden"
        initial={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          className="h-full bg-black dark:bg-white rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          exit={{ width: 0 }}
          transition={{ ease: "easeInOut", duration: 0.2 }}
        />
      </motion.div>

      <motion.div
        className="mt-4 text-sm text-gray-500 dark:text-gray-400 text-center max-w-md px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.2 }}
      >
        {progress < 100 ? currentMessage : 'Ready!'}
      </motion.div>
    </motion.div>
  );
}
