import { useState } from "react";

export default function useSelect(initialValue: any) {
  const [selectedValue, setSelectedValue] = useState(initialValue);

  const handleSelect = (value: any) => {
    setSelectedValue(value);
  };

  return { selectedValue, handleSelect };
}
