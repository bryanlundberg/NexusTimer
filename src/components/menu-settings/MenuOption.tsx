import { Switch } from "../ui/switch";
import { Controller } from "react-hook-form";

interface MenuOption {
  label: string;
  control: any;
  name: string;
}

export function MenuOption({ label, control, name }: MenuOption) {
  return (
    <div className="ps-3 pe-3 flex items-center justify-between mb-1">
      <div className="grow">{label}</div>
      <Controller
        control={control}
        render={({ field: { onChange, value } }) => (
          <Switch checked={value} onCheckedChange={onChange}/>
        )}
        name={name}
      />
    </div>
  );
}
