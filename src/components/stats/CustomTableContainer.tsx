interface CustomTableContainer {
  children: React.ReactNode;
}

export function CustomTableContainer({ children }: CustomTableContainer) {
  return (
    <>
      <div className="w-full text-sm rounded-md">{children}</div>
    </>
  );
}
