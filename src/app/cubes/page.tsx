"use client";
import Button from "@/components/Button";
import Checkbox from "@/components/Checkbox";
import InputText from "@/components/InputText";
import TableRow from "@/components/TableRow";

export default function CubesPage() {
  return (
    <>
      <div className="w-full md:w-10/12 mx-auto">
        {/* Header */}

        <h1 className="text-4xl font-bold mt-5">Welcome back!</h1>
        <p className="text-lg text-gray-400">
          Here&rsquo;s a list of your cubes!
        </p>

        {/* Filters table */}
        <div className="mt-8"></div>

        <div className="flex align-middle gap-3">
          {/* Options */}
          <InputText />
          <Button disabled={false}>+ Cube</Button>
          <Button disabled={true}>- Delete</Button>
        </div>

        <div>
          {/* table */}
          <div className="table w-full mt-4 border text-sm border-zinc-800">
            <div className="table-header-group h-10 border-b border-zinc-800 text-zinc-400 font-medium text-sm">
              <div className="table-row bg-zinc-900">
                <div className="table-cell w-10 align-middle"></div>
                <div className="table-cell text-left align-middle">Cube</div>
                <div className="table-cell text-center align-middle">
                  Category
                </div>
                <div className="table-cell text-center align-middle">
                  Solves
                </div>
                <div className="table-cell text-center align-middle">
                  PB Ao3
                </div>
                <div className="table-cell text-center align-middle">
                  PB Ao5
                </div>
                <div className="table-cell text-center align-middle">
                  PB Ao12
                </div>
                <div className="table-cell text-center align-middle">
                  PB Ao50
                </div>
                <div className="table-cell text-center align-middle">
                  PB Ao100
                </div>
                <div className="table-cell text-center align-middle">
                  PB Ao1000
                </div>
              </div>
            </div>
            <div className="table-row-group h-10 border-b border-zinc-800 text-white text-sm">
              <TableRow
                cube="Gualong"
                category="2x2"
                best={2.33}
                ao3={2.33}
                ao5={2.33}
                ao12={2.33}
                ao50={2.33}
                ao100={2.33}
                ao1000={2.33}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
