export default function InputText({
  placeholder,
  onChange,
}: {
  placeholder: string;
  onChange: any;
}) {
  return (
    <input
      type="text"
      className=" px-3 py-1 rounded-md text-sm bg-zinc-950 border border-zinc-800 shadow-sm h-8 w-full"
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
