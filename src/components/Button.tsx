export default function Button({
  children,
  disabled,
  handleClick,
  ...props
}: {
  children: React.ReactNode;
  disabled: boolean;
  handleClick: any;
}) {
  return (
    <button
      disabled={disabled}
      type="button"
      className="h-8 px-3 py-1 rounded-md border border-zinc-800 font-medium justify-center align-middle hover:bg-zinc-900 text-sm disabled:bg-zinc-900"
      onClick={() => handleClick()}
      {...props}
    >
      {children}
    </button>
  );
}
