export default function TableHeader() {
  return (
    <>
      <div className="table-header-group mb-10 h-10 border-b border-zinc-900 text-zinc-300 bg-zinc-900 font-medium text-sm">
        <div className="table-row">
          <div className="table-cell w-20 align-middle text-center">
            Favorite
          </div>
          <div className="table-cell text-left align-middle">Cube</div>
          <div className="table-cell text-center align-middle">Category</div>
          <div className="table-cell text-center align-middle">Solves</div>
          <div className=" text-center align-middle hidden md:table-cell">
            Created At
          </div>
          <div className="text-center align-middle hidden md:table-cell">
            Status
          </div>
          <div className="table-cell text-center align-middle w-20"></div>
        </div>
      </div>
    </>
  );
}
