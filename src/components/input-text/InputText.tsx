import { useState } from "react";

interface InputTextProps {
  placeholder: string;
  value?: string;
  focus?: boolean;
  className?: string;
  onChange: (value: string) => void;
}

export default function InputText({
  placeholder,
  value = "",
  focus = false,
  className,
  onChange,
}: InputTextProps) {
  const [valueText, setValueText] = useState(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValueText(newValue);
    onChange(newValue);
  };

  return (
    <input
      type="text"
      className={`appearance-none outline-none transition duration-300 w-full h-9 px-3 text-md rounded-md shadow-sm ${className} light:hover:border-neutral-400 light:focus:border-neutral-400 dark:hover:border-zinc-500 dark:focus:border-zinc-500`}
      value={valueText}
      placeholder={placeholder}
      autoFocus={focus}
      onChange={handleChange}
    />
  );
}
