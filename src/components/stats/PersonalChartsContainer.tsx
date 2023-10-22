interface PersonalChartsContainer {
  children: React.ReactNode;
}

export function PersonalChartsContainer({ children }: PersonalChartsContainer) {
  return (
    <>
      <div className="flex flex-col gap-3 md:flex-row">{children}</div>
    </>
  );
}
