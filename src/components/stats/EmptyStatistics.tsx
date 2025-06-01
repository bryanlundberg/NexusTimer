export default function EmptyStatistics() {
  return (
    <div className="flex flex-col items-center justify-center grow">
      <h2 className="text-2xl font-bold mb-4 text-center text-balance">No Statistics Available</h2>
      <p className="text-gray-600 text-center text-balance">It looks like your solve vault is currently empty.</p>
    </div>
  );
}
