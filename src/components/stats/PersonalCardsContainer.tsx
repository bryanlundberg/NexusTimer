interface PersonalCardsContainer {
  children: React.ReactNode;
}

export function PersonalCardsContainer({ children }: PersonalCardsContainer) {
  return (
    <>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {children}
      </div>
    </>
  );
}
