interface ButtonContent {
  icon: React.ReactNode;
  label: string;
}

export function ButtonContent({ icon, label }: ButtonContent) {
  return (
    <>
      <div className="flex items-center justify-between gap-1">
        <div>{icon}</div>
        <div>{label}</div>
      </div>
    </>
  );
}
