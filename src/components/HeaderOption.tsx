export default function HeaderOption({
  icon,
  handleClick,
}: {
  icon: React.ReactNode;
  handleClick: () => void;
}) {
  return (
    <div
      onClick={handleClick}
      className="w-6 h-6 text-netral-50 hover:text-neutral-200 hover:cursor-pointer"
    >
      {icon}
    </div>
  );
}
