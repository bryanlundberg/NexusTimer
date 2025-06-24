import { Switch } from "../ui/switch";
import { Controller } from "react-hook-form";

interface MenuOption {
  label: string;
  control: any;
  name: string;
  description?: string;
}

export function MenuOption({ label, control, name, description }: MenuOption) {
  return (
    <div className="ps-3 pe-3 mb-3">
      <div className="flex items-center justify-between mb-1">
        <div className="grow">{label}</div>
        <Controller
          control={control}
          render={({ field: { onChange, value } }) => (
            <Switch checked={value} onCheckedChange={onChange}/>
          )}
          name={name}
        />
      </div>
      {description && (
        <div className="text-xs text-muted-foreground">{description}</div>
      )}
    </div>
  );
}
