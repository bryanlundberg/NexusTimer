"use client";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

interface InputTextProps extends React.HTMLAttributes<HTMLInputElement> {
  value?: string;
  className?: string;
  onChangeCallback: (value: string) => void;
}

export default function InputText({
  value = "",
  className,
  onChangeCallback,
  onChange,
  ...rest
}: InputTextProps) {
  const [valueText, setValueText] = useState(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValueText(newValue);
    onChangeCallback(newValue);
  };

  return (
    <input
      {...rest}
      type="text"
      className={twMerge(
        "appearance-none outline-none transition duration-300 w-full h-9 px-3 text-md rounded-md shadow-sm light:hover:border-neutral-400 light:focus:border-neutral-400 dark:hover:border-zinc-500 dark:focus:border-zinc-500",
        className
      )}
      value={valueText}
      onChange={(e) => {
        handleChange(e);
      }}
      autoComplete="off"
    />
  );
}
