"use client";

import React, { createContext, useContext } from 'react';
import Ntloader from './ntloader';
import useInitialLoader from "@/store/InitialLoader";
import { AnimatePresence } from "framer-motion";

interface LoaderContextType {
  hasShownLoader: boolean;
  setHasShownLoader: (value: boolean) => void;
}

const LoaderContext = createContext<LoaderContextType | undefined>(undefined);

export function useLoaderContext() {
  const context = useContext(LoaderContext);
  if (context === undefined) {
    throw new Error('useLoaderContext must be used within a LoaderProvider');
  }
  return context;
}

export function LoaderProvider({ children }: { children: React.ReactNode }) {
  const { hasShownLoader, setHasShownLoader, showLoader, setShowLoader } = useInitialLoader();

  const handleLoadingComplete = () => {
    setShowLoader(false);
    setHasShownLoader(true);
  };

  return (

      <LoaderContext.Provider value={{ hasShownLoader, setHasShownLoader }}>
        <AnimatePresence mode="wait">
        {showLoader ? <Ntloader key="loader" onLoadingComplete={handleLoadingComplete}/> : children}
        </AnimatePresence>
      </LoaderContext.Provider>

  );
}
