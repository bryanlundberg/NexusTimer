import Button from "@/components/Button";
import Checkbox from "@/components/Checkbox";
import InputText from "@/components/InputText";

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
          <Button>+ Cube</Button>
        </div>

        <div>
          {/* table */}
          <div className="table w-full mt-4 border text-sm border-zinc-800">
            <div className="table-header-group border-b border-zinc-800 text-zinc-400 font-medium text-sm">
              <div className="table-row h-10">
                <div className="table-cell w-10 align-middle">
                  <Checkbox />
                </div>
                <div className="table-cell text-left align-middle">Cube</div>
                <div className="table-cell text-left align-middle">
                  Category
                </div>
                <div className="table-cell text-left align-middle">Solves</div>
                <div className="table-cell text-left align-middle">PB Ao5</div>
                <div className="table-cell text-left align-middle">PB Ao12</div>
                <div className="table-cell text-left align-middle">PB Ao50</div>
                <div className="table-cell text-left align-middle">
                  PB Ao100
                </div>
                <div className="table-cell text-left align-middle">
                  PB Ao1000
                </div>
              </div>
            </div>
            <div className="table-row-group h-10 border-b border-zinc-800 text-white text-sm">
              <div className="table-row ">
                <div className="table-cell w-10 align-middle">
                  <Checkbox />
                </div>
                <div className="table-cell align-middle">Gualong</div>
                <div className="table-cell align-middle">3x3</div>
                <div className="table-cell align-middle">4543</div>
                <div className="table-cell align-middle">34.32</div>
                <div className="table-cell align-middle">34.32</div>
                <div className="table-cell align-middle">34.32</div>
                <div className="table-cell align-middle">34.32</div>
                <div className="table-cell align-middle">34.32</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
