export default function InputText({
  placeholder,
  onChange,
  value,
}: {
  placeholder: string;
  onChange: any;
  value?: string;
}) {
  return (
    <input
      type="text"
      className=" px-3 py-1 rounded-md text-sm bg-zinc-950 border border-zinc-800 shadow-sm h-8 w-full"
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
