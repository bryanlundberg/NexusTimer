interface PersonalContainer {
  children: React.ReactNode;
}

export function PersonalContainer({ children }: PersonalContainer) {
  return (
    <>
      <div className="flex flex-col gap-3 px-3 py-3 overflow-auto grow">
        {children}
      </div>
    </>
  );
}
