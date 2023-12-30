import { SolveTab } from "@/interfaces/types/SolveTabs";

interface ButtonsSection {
  children: React.ReactNode;
  currentTab: SolveTab;
}

export function ButtonsSection({ children, currentTab }: ButtonsSection) {
  if (currentTab === "All") return null;
  return (
    <>
      <div className="flex justify-end gap-2 h-9">{children}</div>
    </>
  );
}
