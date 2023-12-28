interface ButtonContent {
  icon: React.ReactNode;
  label: string;
  minimalistic: boolean;
}

export function ButtonContent({ icon, label, minimalistic }: ButtonContent) {
  return (
    <>
      <div className="flex items-center justify-between gap-1">
        <div>{icon}</div>
        <div className={`${minimalistic ? "hidden" : "inline"}`}>{label}</div>
      </div>
    </>
  );
}
