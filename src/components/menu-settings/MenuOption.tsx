import Toggle from "@/components/headless/Toggle";

interface MenuOption {
  label: string;
  setting: any;
}

export function MenuOption({ label, setting }: MenuOption) {
  return (
    <div className="flex justify-between mb-1">
      <div className="ms-12">{label}</div>
      <div className="me-6">
        <Toggle setting={setting} />
      </div>
    </div>
  );
}
