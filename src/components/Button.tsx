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
    "h-8 px-3 rounded-md border border-zinc-800 font-medium justify-center align-middle hover:bg-zinc-900 text-sm disabled:bg-zinc-900 " +
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
