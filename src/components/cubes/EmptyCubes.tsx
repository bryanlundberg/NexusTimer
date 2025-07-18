import Image from "next/image";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@radix-ui/react-icons";
import { useTimerStore } from "@/store/timerStore";
import React from "react";
import { motion } from "framer-motion";

interface EmptyCubesProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function EmptyCubes({ ...rest }: EmptyCubesProps) {
  const t = useTranslations("Index.CubesPage");
  const setIsOpenDrawerNewCollection = useTimerStore((state) => state.setIsOpenDrawerNewCollection);
  return (
    <>
      <div
        {...rest}
        data-testid="empty-cubes-container"
        className="flex flex-col items-center justify-center h-full overflow-auto rounded-lg grow min-h-[400px] mx-auto w-full"
      >
        <div className="flex flex-col items-center justify-center gap-4 p-6 max-w-md mx-auto">
          <div className="relative w-64 h-64 mb-4">
            <motion.div
              className="absolute inset-0 bg-primary/10 rounded-full"
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            ></motion.div>
            <motion.div
              className="absolute inset-4 bg-primary/20 rounded-full"
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.3
              }}
            ></motion.div>
            <motion.div
              className="absolute inset-0"
              animate={{ y: [0, -10, 0] }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Image
                src={"/utils/undraw_to-the-moon_w1wa.svg"}
                alt={"no-cubes-for-display"}
                width={200}
                height={200}
                draggable={false}
                className="object-contain w-full h-full"
              />
            </motion.div>
          </div>

          <h2 className="text-3xl text-center text-balance font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
            {t("no-cubes-for-display")}
          </h2>

          <p className="text-muted-foreground text-center text-balance text-lg">
            {t("no-cubes-description")}
          </p>

          <Button className="mt-4 group" size="lg" onClick={() => setIsOpenDrawerNewCollection(true)}>
            <PlusIcon className="mr-2 h-4 w-4 transition-transform group-hover:scale-125" />
            {t("new-collection")}
          </Button>
        </div>
      </div>
    </>
  );
}
