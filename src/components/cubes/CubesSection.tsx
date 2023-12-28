import { Cube } from "@/interfaces/Cube";
import TableHeader from "@/components/cubes/TableHeader";
import TableRow from "@/components/cubes/TableRow";
import genId from "@/lib/genId";

interface CubesSection {
  filterCubes: Cube[];
}

export function CubesSection({ filterCubes }: CubesSection) {
  return (
    <>
      <div className="h-full overflow-auto grow">
        <div className="table w-full text-sm">
          <TableHeader />
          <div className="table-row-group h-10 text-sm">
            {filterCubes.map((cube) => (
              <TableRow key={genId()} cube={cube} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
