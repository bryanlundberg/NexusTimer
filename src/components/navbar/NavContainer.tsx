import { Card } from "../ui/card";

interface NavContainer {
  children: React.ReactNode;
}

export function NavContainer({ children }: NavContainer) {
  return (
    <nav className="p-2">
      <Card className="w-full gap-5 rounded-t-xl sm:mx-auto sm:w-96 bg-background">
        <ul className={`flex justify-between items-center `}>{children}</ul>
      </Card>
    </nav>
  );
}
