export default function ToggleSolvesButton({
  children,
  handleClick,
  active,
  ...props
}: {
  children: React.ReactNode;
  handleClick: any;
  active: boolean;
}) {
  return (
    <>
      <button
        onClick={() => handleClick()}
        type="button"
        className={`w-full appearance-none rounded-md ${
          active ? "bg-zinc-950" : "bg-transparent"
        }`}
        {...props}
      >
        {children}
      </button>
    </>
  );
}
