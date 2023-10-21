import useOpenClose from "@/hooks/useOpenClose";
import useSelect from "@/hooks/useSelect";
import genId from "@/lib/genId";
import { SelectContainer } from "./SelectContainer";
import { SelectToggleButton } from "./SelectToggleButton";
import { SelectOptionList } from "./SelectOptionList";
import { SelectOption } from "./SelectOption";

interface Select {
  list: Item[];
  defaultLabel: string;
}

interface Item {
  name: string;
  id: string;
}

export default function Select({ list, defaultLabel }: Select) {
  const { isOpen, close, toggle } = useOpenClose(false);
  const { selectedValue, handleSelect } = useSelect(defaultLabel);
  return (
    <>
      <SelectContainer
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
              onSelect={() => {
                handleSelect(item.name);
                close();
              }}
            />
          ))}
        </SelectOptionList>
      </SelectContainer>
    </>
  );
}
