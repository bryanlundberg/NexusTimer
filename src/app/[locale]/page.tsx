"use client";
import HeaderTimer from "@/components/timer/HeaderTimer";
import TimerWidgets from "@/components/timer/TimerWidgets";
import SettingsMenu from "@/components/menu-settings/Menu";
import TimerContainer from "@/components/timer/TimerContainer";
import { MainTimer } from "@/components/timer/MainTimer";
import HintPanel from "@/components/timer/HintPanel";
import ScrambleModal from "@/components/timer/ScrambleModal";
import useInitializeTimer from "@/hooks/useInitializeHint";
import useForceHashSettings from "@/hooks/useForceHashSettings";
import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import exportDataToFile from "@/lib/exportDataToFile";
import { Link } from "@/i18n/routing";

export default function Home() {
  useInitializeTimer();
  useForceHashSettings();

  // Temporal code until 2nd November domain migration ends.
  const [openMigrationDialog, setOpenMigrationDialog] = useState(false);
  useEffect(() => {
    const hostname = window.location.hostname;
    if (hostname === "www.nexustimer.pro") {
      setOpenMigrationDialog(true);
    }
  }, []);

  return (
    <>
      <TimerContainer>
        <HeaderTimer />
        <MainTimer />
        <TimerWidgets />
      </TimerContainer>
      <SettingsMenu />
      <HintPanel />
      <ScrambleModal />

      {/* Temporal alert */}
      <AlertDialog
        open={openMigrationDialog}
        onOpenChange={setOpenMigrationDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Domain Migration</AlertDialogTitle>
            <AlertDialogDescription>Dear User,</AlertDialogDescription>
            <AlertDialogDescription>
              We are migrating to (nexustimer.com) domain. To ensure a smooth
              transition, please back up your data and click continue. The
              current domain (.pro) will be available until 2nd November.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button variant={"outline"} onClick={exportDataToFile}>
              Download Backup
            </Button>
            <Link href={"https://nexustimer.com/"}>
              <Button>Continue</Button>
            </Link>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
