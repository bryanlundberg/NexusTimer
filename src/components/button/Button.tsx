import { twMerge } from "tailwind-merge";

interface Button extends React.HTMLAttributes<HTMLButtonElement> {
  className?: string;
  icon?: React.ReactNode;
  label: string;
  minimalistic?: boolean;
  disabled?: boolean;
}

export default function Button({
  className,
  icon,
  label,
  disabled = false,
  minimalistic = true,
  ...props
}: Button) {
  return (
    <button
      {...props}
      type="button"
      className={twMerge(
        `min-h-9 px-3 transition duration-200 rounded-md border font-medium justify-center align-middle light:hover:bg-neutral-200 light:hover:border-neutral-400 light:text-neutral-950 light:border-neutral-200 dark:hover:bg-zinc-700 dark:hover:border-zinc-500 dark:border-zinc-800 text-md disabled:bg-zinc-900 dark:disabled:border-zinc-500 dark:disabled:bg-zinc-700 light:disabled:bg-neutral-200 light:disabled:border-neutral-300 disabled:cursor-normal`,
        className
      )}
      disabled={disabled}
    >
      <div className="flex items-center justify-between gap-1">
        {icon}
        <div className={`${minimalistic ? "hidden" : "inline"}`}>{label}</div>
      </div>
    </button>
  );
}
