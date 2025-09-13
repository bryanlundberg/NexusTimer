import { Solve } from "@/interfaces/Solve";
import { useTimerStore } from "@/store/timerStore";
import { useDialogSolve } from "@/store/DialogSolve";
import formatTime from "@/lib/formatTime";
import { toast } from "sonner";
import { useNXData } from '@/hooks/useNXData';

type CaseOfUse = "last-solve" | "modal-solve" | "solves-area";

export const useSolveActions = () => {
  const { getCubeById, updateSolve } = useNXData();
  const selectedCube = useTimerStore(store => store.selectedCube);
  const setSelectedCube = useTimerStore(store => store.setSelectedCube);
  const lastSolve = useTimerStore(store => store.lastSolve);
  const setLastSolve = useTimerStore(store => store.setLastSolve);
  const dialog = useDialogSolve();

  const handleUndoSolve = async (solve: Solve) => {
    if (solve && selectedCube) {
      await updateSolve({
        solveId: solve.id,
        selectedCube: selectedCube,
        type: "UNDO",
        deletedSolve: solve
      });

      toast("", {
        description: "Restored last deleted Solve",
        duration: 1000
      });

      const lastCube = await getCubeById(selectedCube.id);
      if (lastCube) {
        setSelectedCube({ ...lastCube });
      }
    }
  };

  const handleDeleteSolve = async (solve: Solve, caseOfUse?: CaseOfUse, onDeleteCallback?: () => void) => {
    if (solve && selectedCube) {
      await updateSolve({
        solveId: solve.id,
        selectedCube: selectedCube,
        type: "DELETE"
      });

      if (caseOfUse === "last-solve") {
        if (lastSolve?.id === dialog.solve?.id) {
          dialog.handleSetSolveInDialog({ solve: null });
        }
        setLastSolve(null);
      }

      if (caseOfUse === "modal-solve") {
        if (lastSolve?.id === dialog.solve?.id) {
          setLastSolve(null);
        }
        dialog.handleSetSolveInDialog({ solve: null });
      }

      const lastCube = await getCubeById(selectedCube.id);
      if (lastCube) {
        setSelectedCube({ ...lastCube });
      }

      toast("", {
        description: "Deleted solve",
        duration: 2000,
        action: {
          label: 'Undo',
          onClick: () => handleUndoSolve(solve)
        }
      });

      if (onDeleteCallback) {
        onDeleteCallback();
      }
    }
  };

  const handlePenaltyPlus2 = async (solve: Solve, caseOfUse?: CaseOfUse) => {
    if (solve && selectedCube) {
      await updateSolve({
        solveId: solve.id,
        selectedCube: selectedCube,
        type: "+2"
      });

      const lastCube = await getCubeById(selectedCube.id);
      if (lastCube) {
        setSelectedCube({ ...lastCube });
      }

      if (lastCube && (caseOfUse === "last-solve" || caseOfUse === "modal-solve")) {
        const solvesGlobal = [
          ...lastCube.solves.session,
          ...lastCube.solves.all
        ];

        const updatedSolve = solvesGlobal.find((i) => i.id === solve.id);

        if (updatedSolve && lastSolve && updatedSolve.id === lastSolve.id) {
          dialog.handleSetSolveInDialog({ solve: { ...updatedSolve } });
          setLastSolve({ ...updatedSolve });
        } else if (updatedSolve && caseOfUse === "modal-solve") {
          dialog.handleSetSolveInDialog({ solve: { ...updatedSolve } });
        } else if (updatedSolve && caseOfUse === "last-solve") {
          setLastSolve({ ...updatedSolve });
        }
      }

      toast("", {
        description: "Penalty status updated.",
        duration: 1000
      });
    }
  };

  const handleDNF = async (solve: Solve, caseOfUse?: CaseOfUse) => {
    if (solve && selectedCube) {
      await updateSolve({
        solveId: solve.id,
        selectedCube: selectedCube,
        type: "DNF"
      });

      const lastCube = await getCubeById(selectedCube.id);
      if (lastCube) {
        setSelectedCube({ ...lastCube });
      }

      if (lastCube && (caseOfUse === "last-solve" || caseOfUse === "modal-solve")) {
        const solvesGlobal = [
          ...lastCube.solves.session,
          ...lastCube.solves.all
        ];

        const updatedSolve = solvesGlobal.find((i) => i.id === solve.id);

        if (updatedSolve && lastSolve && updatedSolve.id === lastSolve.id) {
          dialog.handleSetSolveInDialog({ solve: { ...updatedSolve } });
          setLastSolve({ ...updatedSolve });
        } else if (updatedSolve && caseOfUse === "modal-solve") {
          dialog.handleSetSolveInDialog({ solve: { ...updatedSolve } });
        } else if (updatedSolve && caseOfUse === "last-solve") {
          setLastSolve({ ...updatedSolve });
        }
      }

      toast("", {
        description: "DNF status updated.",
        duration: 500
      });
    }
  };

  const handleBookmarkSolve = async (solve: Solve, caseOfUse?: CaseOfUse) => {
    if (solve && selectedCube) {
      await updateSolve({
        solveId: solve.id,
        selectedCube: selectedCube,
        type: "BOOKMARK"
      });

      const lastCube = await getCubeById(selectedCube.id);
      if (lastCube) {
        setSelectedCube({ ...lastCube });
      }

      if (lastCube && (caseOfUse === "last-solve" || caseOfUse === "modal-solve")) {
        const solvesGlobal = [
          ...lastCube.solves.session,
          ...lastCube.solves.all
        ];

        const updatedSolve = solvesGlobal.find((i) => i.id === solve.id);

        if (updatedSolve && lastSolve && updatedSolve.id === lastSolve.id) {
          dialog.handleSetSolveInDialog({ solve: { ...updatedSolve } });
          setLastSolve({ ...updatedSolve });
        } else if (updatedSolve && caseOfUse === "modal-solve") {
          dialog.handleSetSolveInDialog({ solve: { ...updatedSolve } });
        } else if (updatedSolve && caseOfUse === "last-solve") {
          setLastSolve({ ...updatedSolve });
        }
      }

      toast("", {
        description: "Bookmark status updated.",
        duration: 500
      });
    }
  };

  const handleClipboardSolve = (solve: Solve, customMessage?: { title?: string, description?: string }) => {
    if ("clipboard" in navigator && solve) {
      navigator.clipboard.writeText(
        `${formatTime(solve.time)} - ${solve.scramble}`
      );
    }

    toast(customMessage?.title || "", {
      description: customMessage?.description || "Copied to clipboard",
      duration: 1000
    });
  };

  const handleMoveToHistory = async (solve: Solve, caseOfUse?: CaseOfUse) => {
    if (solve && selectedCube) {
      await updateSolve({
        solveId: solve.id,
        selectedCube: selectedCube,
        type: "MOVE_TO_HISTORY"
      });

      if (caseOfUse === "last-solve") {
        if (lastSolve?.id === dialog.solve?.id) {
          dialog.handleSetSolveInDialog({ solve: null });
        }
        setLastSolve(null);
      }

      if (caseOfUse === "modal-solve") {
        if (lastSolve?.id === dialog.solve?.id) {
          setLastSolve(null);
        }
        dialog.handleSetSolveInDialog({ solve: null });
      }

      const lastCube = await getCubeById(selectedCube.id);
      if (lastCube) {
        setSelectedCube({ ...lastCube });
      }

      toast("", {
        description: "Solve moved to history",
        duration: 1000
      });
    }
  };

  return {
    handleDeleteSolve,
    handlePenaltyPlus2,
    handleDNF,
    handleBookmarkSolve,
    handleClipboardSolve,
    handleUndoSolve,
    handleMoveToHistory
  };
};
