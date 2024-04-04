interface InteractiveIcon {
  icon: React.ReactNode;
  handleClick: () => void;
  animation?: boolean;
}

export function InteractiveIcon({
  icon,
  handleClick,
  animation = false,
}: InteractiveIcon) {
  return (
    <div
      onClick={handleClick}
      className={`light:text-neutral-800 light:hover:text-neutral-600 dark:text-neutral-100 dark:hover:text-neutral-200 hover:cursor-pointer duration-300 transition ${
        animation ? "hover:rotate-45" : ""
      }`}
    >
      {icon}
    </div>
  );
}
