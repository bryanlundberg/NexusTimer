export default function InputText({
  placeholder,
  onChange,
  value,
  focus,
  className,
}: {
  placeholder: string;
  onChange: any;
  value?: string;
  focus?: boolean;
  className?: string;
}) {
  return (
    <input
      type="text"
      className={`appearance-none transition duration-300 w-full h-8 px-3 py-1 text-sm rounded-md shadow-sm ${className}`}
      value={value}
      placeholder={placeholder}
      autoFocus={focus}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
