import Toggle from "../headless/Toggle";

interface MenuOption {
  label: string;
  status: boolean;
  read: string;
  id: string;
}

export function MenuOption({ label, status, read, id }: MenuOption) {
  return (
    <div className="flex justify-between mb-1">
      <div className="ms-12">{label}</div>
      <div className="me-6">
        <Toggle status={status} read={read} id={id} />
      </div>
    </div>
  );
}
