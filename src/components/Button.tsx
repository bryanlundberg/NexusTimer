export default function Button({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="button"
      className="h-8 px-3 py-1 rounded-md border border-zinc-800 font-medium justify-center align-middle hover:bg-zinc-900 text-sm"
    >
      {children}
    </button>
  );
}
