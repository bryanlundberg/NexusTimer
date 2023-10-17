export default function Button({
  children,
  disabled,
  handleClick,
  className,
  ...props
}: {
  children: React.ReactNode;
  disabled?: boolean;
  handleClick: any;
  className?: string;
}) {
  const finalClassName =
    "h-8 px-3 transition duration-200 rounded-md border font-medium justify-center align-middle light:hover:bg-neutral-200 light:text-neutral-950 light:border-neutral-200 dark:hover:bg-zinc-900 dark:border-zinc-800 text-sm disabled:bg-zinc-900 " +
    className;

  return (
    <button
      disabled={disabled}
      type="button"
      className={finalClassName}
      onClick={() => handleClick()}
      {...props}
    >
      {children}
    </button>
  );
}
