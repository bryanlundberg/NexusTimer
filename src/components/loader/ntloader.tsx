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
      "Solving the cube... almost there!",
      "Twisting and turning to perfection!",
      "Aligning the pieces... one move at a time!",
      "The average cube solver rotates 50 times per solve!",
      "Sharpening our algorithms for the perfect solve!",
      "Did you know? The first Rubik's Cube was solved in 1974!",
      "Optimizing your experience one layer at a time!",
      "A world-class speedcuber can solve it in under 5 seconds!",
      "A solved Rubik's Cube has 43 quintillion possible combinations!",
      "The world record for 3x3 single solve is just over 3 seconds!",
      "It took Erno Rubik a month to solve his first cube!",
      "The term 'God's Number' refers to solving any cube in 20 moves or less!",
      "Cubing competitions started in the early 1980s!",
      "Magnets in cubes revolutionized speedcubing in the 2010s!"
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
        const remainingTime = Math.max(0, 2000 - elapsedTime);

        setTimeout(() => {
          onLoadingComplete();
        }, remainingTime + 500);
      }
    }, 200);

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
