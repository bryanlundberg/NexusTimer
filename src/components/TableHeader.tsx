export default function TableHeader() {
  return (
    <>
      <div className="table-header-group mb-10 h-10 border-b border-zinc-800 text-zinc-400 font-medium text-sm">
        <div className="table-row bg-zinc-900">
          <div className="table-cell w-20 align-middle text-center">
            Favorite
          </div>
          <div className="table-cell text-left align-middle">Cube</div>
          <div className="table-cell text-center align-middle">Category</div>
          <div className="table-cell text-center align-middle">Solves</div>
          <div className="table-cell text-center align-middle">Best Time</div>
          <div className="table-cell text-center align-middle">Created At</div>
          <div className="table-cell text-center align-middle">Status</div>
          <div className="table-cell text-center align-middle w-20"></div>
        </div>
      </div>
    </>
  );
}
