import { Cube } from "@/interfaces/Cube";
import { CubesSection } from "./CubesSection";
import EmptyCubes from "./EmptyCubes";
import { useCubesModalStore } from "@/store/CubesModalStore";

interface CubesContent {
  filterCubes: Cube[] | null;
}

export function CubesContent({ filterCubes }: CubesContent) {
  const { setModalOpen } = useCubesModalStore();
  return (
    <>
      {filterCubes && filterCubes.length > 0 ? (
        <CubesSection filterCubes={filterCubes} />
      ) : (
        <EmptyCubes onClick={() => setModalOpen(true)} />
      )}
    </>
  );
}
