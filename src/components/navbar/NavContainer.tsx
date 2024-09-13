import { Card } from "../ui/card";

interface NavContainer {
  children: React.ReactNode;
}

export function NavContainer({ children }: NavContainer) {
  return (
    <nav className="p-2 z-50">
      <Card className="w-full gap-5 rounded-t-xl sm:mx-auto sm:w-60 bg-background">
        <ul className={`flex justify-between items-center`}>{children}</ul>
      </Card>
    </nav>
  );
}
