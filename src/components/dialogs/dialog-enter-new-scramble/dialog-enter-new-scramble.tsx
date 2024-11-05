import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useTimerStore } from "@/store/timerStore";
import { useTranslations } from "next-intl";
import { useRef } from "react";

export default function DialogEnterNewScramble() {
  const t = useTranslations("Index");
  const { setCustomScramble } = useTimerStore();
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{t("HomePage.enter-custom-scramble")}</DialogTitle>
        <DialogDescription>
          This action will replace the current scramble
        </DialogDescription>
        <Input ref={inputRef} />
      </DialogHeader>
      <DialogFooter>
        <DialogClose asChild>
          <Button
            onClick={() => {
              if (inputRef.current) {
                console.log(inputRef.current.value);
                setCustomScramble(inputRef.current.value.trim());
              }
            }}
          >
            {t("Inputs.continue")}
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
}
