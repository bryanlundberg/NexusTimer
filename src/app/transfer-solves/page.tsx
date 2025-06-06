"use client";
import FadeIn from "@/components/fade-in/fade-in";
import Navigation from "@/components/navigation/navigation";
import ButtonNavbar from "@/components/navigation/buttons/button-navbar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";
import { useTimerStore } from "@/store/timerStore";
import { useEffect, useMemo, useState } from "react";
import useRemoveGridHeight from "@/hooks/useRemoveGridHeight";
import { VirtualizedGrid } from "@mierak/react-virtualized-grid";
import { Card } from "@/components/ui/card";
import formatTime from "@/lib/formatTime";
import formatDate from "@/lib/formatDate";
import { toast } from "sonner";
import { useQueryState } from "nuqs";
import { STATES } from "@/constants/states";
import { sort } from "fast-sort";
import { saveBatchCubes } from "@/db/dbOperations";

export default function TransferSolvesPage() {
  const { cubes, setCubes } = useTimerStore();
  const [sourceCollection, setSourceCollection] = useQueryState(STATES.TRANSFER_SOLVES_PAGE.SOURCE_COLLECTION.KEY, { defaultValue: STATES.TRANSFER_SOLVES_PAGE.SOURCE_COLLECTION.DEFAULT_VALUE });
  const [destinationCollection, setDestinationCollection] = useQueryState(STATES.TRANSFER_SOLVES_PAGE.DESTINATION_COLLECTION.KEY, { defaultValue: STATES.TRANSFER_SOLVES_PAGE.DESTINATION_COLLECTION.DEFAULT_VALUE });
  const [selectedSolves, setSelectedSolves] = useState<string[]>([]);
  const [isTransferring, setIsTransferring] = useState<boolean>(false);
  useRemoveGridHeight(sourceCollection);

  const displaySolves = useMemo(() => {
    return sort(cubes?.find(cube => cube.id === sourceCollection)?.solves.session || []).desc((solve) => solve.endTime);
  }, [sourceCollection, cubes]);

  const handleToggleAll = (type: "select" | "deselect") => {
    if (type === "select") setSelectedSolves(displaySolves.map(solve => solve.id));
    if (type === "deselect") setSelectedSolves([]);
  };

  const handleTransfer = async () => {
    if (!sourceCollection || !destinationCollection || sourceCollection === destinationCollection || isTransferring || selectedSolves.length === 0) return;
    if (!cubes) throw new Error("Cubes data is not available");
    setIsTransferring(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const sourceCube = cubes.find(cube => cube.id === sourceCollection);
      const destinationCube = cubes.find(cube => cube.id === destinationCollection);

      if (sourceCube && destinationCube) {
        const remainingSolves = sourceCube.solves.session.filter(solve => !selectedSolves.includes(solve.id));
        destinationCube.solves.session.push(...sourceCube.solves.session.filter(solve => selectedSolves.includes(solve.id)));

        const updatedSourceCube = {
          ...sourceCube,
          solves: { ...sourceCube.solves, session: remainingSolves }
        };

        const updatedDestinationCube = {
          ...destinationCube,
          solves: { ...destinationCube.solves, session: destinationCube.solves.session }
        };

        setCubes(cubes.map(cube =>
          cube.id === sourceCollection ? updatedSourceCube :
            cube.id === destinationCollection ? updatedDestinationCube :
              cube
        ));

        await saveBatchCubes([updatedSourceCube, updatedDestinationCube]);

        toast(`Successfully transferred ${selectedSolves.length} solves from ${sourceCube.name} to ${destinationCube.name}`);
        setSelectedSolves([]);
      }
    } catch (error) {
      console.error("Error transferring solves:", error);
      toast.error("Failed to transfer solves. Please try again.");
    } finally {
      setIsTransferring(false);
    }
  };

  useEffect(() => {
    if (!cubes || cubes.length === 0) {
      setSourceCollection(null);
      setDestinationCollection(null);
      return;
    }

    if (sourceCollection && !cubes.some(cube => cube.id === sourceCollection)) setSourceCollection(null);
    if (destinationCollection && !cubes.some(cube => cube.id === destinationCollection)) setDestinationCollection(null);
  }, [sourceCollection, destinationCollection, cubes, setSourceCollection, setDestinationCollection]);

  return (
    <FadeIn className="flex flex-col grow overflow-auto">
      <div className="max-w-7xl mx-auto px-2 pt-2 flex flex-col w-full min-h-full">
        <Navigation showMenu={false}>
          <div className={"flex gap-2 items-center"}>
            <ButtonNavbar/>
            <div className={"flex flex-col gap-1 grow md:flex-row"}>
              <Select
                value={sourceCollection} onValueChange={(value) => {
                setSourceCollection(value);
                setDestinationCollection("");
              }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Collection Origin"/>
                </SelectTrigger>
                <SelectContent>
                  {cubes?.map((cube) => (
                    <SelectItem key={cube.id} value={cube.id}>
                      {cube.name} ({cube.category})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className={"flex items-center justify-center"}>
                <ArrowRightIcon className={"size-4 rotate-90 md:rotate-0"}/>
              </div>
              <Select value={destinationCollection} onValueChange={setDestinationCollection}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Collection Destination"/>
                </SelectTrigger>
                <SelectContent>
                  {cubes?.filter((cube) => cube.id !== sourceCollection).map((cube) => (
                    <SelectItem key={cube.id} value={cube.id}>
                      {cube.name} ({cube.category})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

            </div>

            <Button
              onClick={handleTransfer}
              disabled={!sourceCollection || !destinationCollection || sourceCollection === destinationCollection || isTransferring || selectedSolves.length === 0}
            >
              {isTransferring ? "Transferring..." : "Transfer"}
            </Button>
          </div>
        </Navigation>

        {displaySolves.length > 0 ? (
          <>
            <div className={"flex justify-between items-center mt-2 mb-4"}>
              <div>Solves: ({selectedSolves.length} selected)</div>
              <div className={"flex gap-2"}>
                <Button
                  variant={selectedSolves.length === displaySolves.length ? "default" : "outline"}
                  onClick={() => handleToggleAll("select")}
                >Select All</Button>
                <Button variant={"outline"} onClick={() => handleToggleAll("deselect")}>Deselect All</Button>
              </div>
            </div>

            <VirtualizedGrid
              itemCount={displaySolves.length}
              rowHeight={80}
              cellWidth={140}
              gridGap={10}
              className="pb-52 ps-1 pe-1 pt-1 container"
            >
              {(index) => (
                <Card
                  onClick={() => {
                    const solveId = displaySolves[index].id;
                    setSelectedSolves((prev) => {
                      if (prev.includes(solveId)) {
                        return prev.filter((id) => id !== solveId);
                      } else {
                        return [...prev, solveId];
                      }
                    });
                  }}
                  className={
                    `relative grow flex items-center justify-center w-auto font-medium text-center transition duration-200 rounded-md cursor-pointer h-full bg-secondary text-secondary-foreground hover:opacity-70 ${selectedSolves.find((solve) => solve === displaySolves[index].id) ? "ring ring-blue-600" : ""}`
                  }
                >
                  <div className="tracking-wider pt-2">
                <span className="text-md">
                  {formatTime(displaySolves[index].time).split(".")[0]}
                </span>
                    <span className="text-sm">
                  .{formatTime(displaySolves[index].time).split(".")[1]}
                </span>
                  </div>
                  <div className="absolute z-20 text-xs top-1 left-1">
                    {formatDate(displaySolves[index].endTime).slice(0, 5)}
                  </div>
                </Card>
              )}
            </VirtualizedGrid>

          </>
        ) : (
          <div className="flex flex-col items-center justify-center grow mt-10">
            <h2 className="text-2xl font-bold mb-4 text-center text-balance">No solves available</h2>
            <p className="text-gray-600 text-center text-balance">Your solve vault is currently empty.</p>
          </div>
        )}
      </div>
    </FadeIn>
  );
}
