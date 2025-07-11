import { Controller } from "react-hook-form";
import React from "react";

export default function MenuInputOption({ label, control, name, inputProps, description }: {
  label: string;
  control: any;
  name: string;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  description?: string;
}) {
  return (
    <div className="ps-3 pe-3 mb-3">
      <div className="flex items-center justify-between mb-1">
        <div className="grow">{label}</div>
        <Controller
          control={control}
          render={({ field: { onChange, value } }) => (
            <input
              type="number"
              value={value}
              onChange={(e) => {
                const newValue = e.target.value.replace(/[^0-9]/g, "");
                if (inputProps?.max !== undefined && Number(newValue) > Number(inputProps.max)) {
                  onChange(inputProps.max.toString());
                } else {
                  onChange(newValue);
                }
              }}
              className="px-2 py-1 w-20 focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-md border border-input dark:bg-input/30"
              min={0}
              {...inputProps}
            />
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
