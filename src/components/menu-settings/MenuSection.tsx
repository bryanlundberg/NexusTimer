interface MenuSection {
  children: React.ReactNode;
  icon: React.ReactNode;
  title: string;
}

export function MenuSection({ children, icon, title }: MenuSection) {
  return (
    <>
      <div className="mb-3">
        <div className="flex items-center gap-2 mx-3 mb-3 font-semibold sticky top-0 bg-background border-b pb-2 mt-10">
          {icon}
          <div className="w-full">
            <span className="text-lg">{title}</span>
          </div>
        </div>
        {children}
      </div>
    </>
  );
}
