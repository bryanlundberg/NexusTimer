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
      className=" px-3 py-1 rounded-md text-sm bg-transparent border tracking-wider border-zinc-800 shadow-sm h-8 w-[150px] lg:w-[250px]"
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
