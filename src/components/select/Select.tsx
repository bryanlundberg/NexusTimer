import useOpenClose from "@/hooks/useOpenClose";
import useSelect from "@/hooks/useSelect";
import genId from "@/lib/genId";
import { SelectContainer } from "./SelectContainer";
import { SelectToggleButton } from "./SelectToggleButton";
import { SelectOptionList } from "./SelectOptionList";
import { SelectOption } from "./SelectOption";

interface SelectProps {
  list: Item[];
  defaultLabel: string;
  className?: string;
  onChange: (selectedValue: string) => void;
}

interface Item {
  name: string;
  id: string;
}

export default function Select({
  list,
  defaultLabel,
  className,
  onChange,
}: SelectProps) {
  const { isOpen, close, toggle } = useOpenClose(false);
  const { selectedValue, handleSelect } = useSelect(defaultLabel);

  const handleOptionSelect = (item: Item) => {
    handleSelect(item.name);
    close();
    onChange(item.name);
  };

  return (
    <>
      <SelectContainer
        className={className}
        handleClickOutside={() => {
          close();
        }}
      >
        <SelectToggleButton text={selectedValue} handleClick={toggle} />
        <SelectOptionList isOpen={isOpen}>
          {list.map((item: Item) => (
            <SelectOption
              key={genId()}
              label={item.name}
              selected={selectedValue}
              onSelect={() => handleOptionSelect(item)}
            />
          ))}
        </SelectOptionList>
      </SelectContainer>
    </>
  );
}
