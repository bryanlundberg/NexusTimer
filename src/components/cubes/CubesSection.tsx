import { Cube } from "@/interfaces/Cube";
import TableHeader from "@/components/cubes/TableHeader";
import TableRow from "@/components/cubes/TableRow";

interface CubesSectionProps {
  filterCubes: Cube[];
}

export function CubesSection({ filterCubes }: CubesSectionProps) {
  return (
    <>
      <div className="h-full overflow-auto grow">
        <div className="table w-full text-sm">
          <TableHeader />
          <div className="table-row-group h-10 text-sm">
            {filterCubes.map((cube) => (
              <TableRow key={cube.id} cube={cube} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
