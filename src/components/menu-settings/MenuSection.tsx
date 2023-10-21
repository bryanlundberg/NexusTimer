interface MenuSection {
  children: React.ReactNode;
  icon: React.ReactNode;
  title: string;
}

export function MenuSection({ children, icon, title }: MenuSection) {
  return (
    <>
      <div className="mb-3">
        <div className="flex mb-3 font-medium text-blue-500">
          <div className="w-6 mx-3">{icon}</div>
          <div className="w-full">{title}</div>
        </div>
        {children}
      </div>
    </>
  );
}
