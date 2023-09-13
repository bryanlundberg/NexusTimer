export default function TableHeader() {
  return (
    <>
      <div className="table-header-group h-10 border-b border-zinc-800 text-zinc-400 font-medium text-sm">
        <div className="table-row bg-zinc-900">
          <div className="table-cell w-10 align-middle"></div>
          <div className="table-cell text-left align-middle">Cube</div>
          <div className="table-cell text-center align-middle">Category</div>
          <div className="table-cell text-center align-middle">Solves</div>
          <div className="table-cell text-center align-middle">PB Ao3</div>
          <div className="table-cell text-center align-middle">PB Ao5</div>
          <div className="table-cell text-center align-middle">PB Ao12</div>
          <div className="table-cell text-center align-middle">PB Ao50</div>
          <div className="table-cell text-center align-middle">PB Ao100</div>
          <div className="table-cell text-center align-middle">PB Ao1000</div>
        </div>
      </div>
    </>
  );
}
