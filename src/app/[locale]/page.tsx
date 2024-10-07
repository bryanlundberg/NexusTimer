"use client";
import HeaderTimer from "@/components/timer/HeaderTimer";
import TimerWidgets from "@/components/timer/TimerWidgets";
import SettingsMenu from "@/components/menu-settings/Menu";
import TimerContainer from "@/components/timer/TimerContainer";
import { MainTimer } from "@/components/timer/MainTimer";
import FullscreenOption from "@/components/timer/FullscreenOption";
import HintPanel from "@/components/timer/HintPanel";
import ScrambleModal from "@/components/timer/ScrambleModal";
import useInitializeTimer from "@/hooks/useInitializeHint";
import ImportModal from "@/components/menu-settings/ImportModal";
import useForceHashSettings from "@/hooks/useForceHashSettings";
import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
      <FullscreenOption />
      <ScrambleModal />
      <ImportModal />

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
            <AlertDialogCancel>Download Backup</AlertDialogCancel>
            <AlertDialogAction>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
