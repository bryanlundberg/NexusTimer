interface InteractiveIcon {
  icon: React.ReactNode;
  handleClick: () => void;
}

export function InteractiveIcon({ icon, handleClick }: InteractiveIcon) {
  return (
    <div
      onClick={handleClick}
      className="light:text-neutral-800 light:hover:text-neutral-600 dark:text-netral-100 dark:hover:text-neutral-200 hover:cursor-pointer hover:rotate-45 duration-300 transition"
    >
      {icon}
    </div>
  );
}
