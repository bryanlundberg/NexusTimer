import { Card } from "../ui/card";

interface NavContainer {
  children: React.ReactNode;
}

export function NavContainer({ children }: NavContainer) {
  return (
    <nav className="px-2 pb-2 z-10">
      <Card className="w-full gap-5 rounded-t-xl sm:mx-auto sm:w-60 bg-background">
        <ul className={`flex justify-between items-center`}>{children}</ul>
      </Card>
    </nav>
  );
}
