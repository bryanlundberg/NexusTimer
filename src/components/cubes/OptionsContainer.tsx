interface OptionsContainer {
  children: React.ReactNode;
}

export function OptionsContainer({ children }: OptionsContainer) {
  return (
    <>
      <div className="flex justify-end gap-3">{children}</div>
    </>
  );
}
