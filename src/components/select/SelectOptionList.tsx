import { AnimatePresence, motion } from "framer-motion";

interface SelectOptionList {
  isOpen: boolean;
  children: React.ReactNode;
}

export function SelectOptionList({ isOpen, children }: SelectOptionList) {
  return (
    <>
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ y: 0, scale: 0.9, opacity: 0.8 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ x: 0, scale: 0.9, opacity: 0 }}
            className="absolute left-0 z-10 w-full p-1 border rounded-md top-10 dark:bg-zinc-900 dark:border-zinc-700 light:bg-neutral-200 light:border-neutral-400"
          >
            {children}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
