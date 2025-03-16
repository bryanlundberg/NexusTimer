import genId from "@/lib/genId";
import { useTimerStore } from "@/store/timerStore";
import { RocketIcon } from "@radix-ui/react-icons";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";

export default function HintPanel() {
  const { displayHint, selectedCube, isSolving, hint } = useTimerStore();
  const t = useTranslations("Index.HomePage");

  if (!displayHint || !selectedCube || isSolving) return null;

  return (
    <AnimatePresence>
      <div className="absolute w-full h-auto font-medium text-black bottom-0 overflow-hidden z-20">
        <motion.div
          initial={{ y: 400, opacity: 0.8 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 400, opacity: 0.8 }}
          transition={{ type: "lineal" }}
          className="bg-yellow-100 bottom-0 rounded-t-lg w-full sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-sm mx-auto h-full border"
        >
          <div className="p-2 text-2xl flex justify-between items-center">
            <div className="font-black">{t("hint")}</div>
            <RocketIcon className="text-black size-5" />
          </div>
          <div className="p-3 max-h-full overflow-auto">
            <div className="font-semibold">{t("optimal-yellow-layer")}</div>
            {hint?.cross.map((solution) => (
              <OptimalCrossLayer key={genId()} solution={solution} type="cross" />
            ))}
            {hint?.xcross.map((solution) => (
              <OptimalCrossLayer key={genId()} solution={solution} type="xcross" />
            ))}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

function OptimalCrossLayer({ solution, type, }: {
  solution: string;
  type: "cross" | "xcross";
}) {
  return (
    <div className="text-xl font-normal select-text">
      {type.charAt(0).toUpperCase()}
      {type.slice(1)} - {solution}
    </div>
  );
}
