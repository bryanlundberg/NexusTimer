interface NavContainer {
  children: React.ReactNode;
}

export function NavContainer({ children }: NavContainer) {
  return (
    <nav>
      <ul
        className={`flex justify-between items-center w-full gap-5 h-12 rounded-t-xl sm:mx-auto sm:w-96 light:shadow-black light:bg-neutral-100 light:shadow-sm dark: bg-zinc-900`}
      >
        {children}
      </ul>
    </nav>
  );
}
