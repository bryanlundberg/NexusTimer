import { useSettingsModalStore } from "@/store/SettingsModalStore";

export default function ThemeSelect() {
  const { settings, setSettings } = useSettingsModalStore();
  const variation = [
    {
      bg: "bg-neutral-100",
      text: "text-white",
      name: "Light",
      key: "light",
    },
    {
      bg: "bg-zinc-950",
      text: "text-white",
      name: "Dark",
      key: "dark",
    },
    {
      bg: "bg-gradient-to-b from-gray-950 to-gray-700",
      text: "text-white",
      name: "Gray",
      key: "graygray",
    },
    {
      bg: "bg-gradient-to-b from-cyan-500 to-violet-400",
      text: "text-white",
      name: "Cyan",
      key: "cyanviolet",
    },
    {
      bg: "bg-gradient-to-b from-amber-500 to-pink-400",
      text: "text-white",
      name: "Amber",
      key: "amberpink",
    },
    {
      bg: "bg-gradient-to-b from-red-500 to-blue-500",
      text: "text-white",
      name: "Red",
      key: "redblue",
    },
    {
      bg: "bg-gradient-to-b from-pink-200 to-neutral-200",
      text: "text-white",
      name: "Pink",
      key: "pinkneutral",
    },
    {
      bg: "bg-gradient-to-b from-green-400 to-amber-300",
      text: "text-white",
      name: "Green",
      key: "greenamber",
    },
  ];

  const selectedKey = settings.theme[0].bg;
  console.log(selectedKey);

  return (
    <div className="grid grid-cols-4 gap-3 ms-10 me-10">
      {variation.map((item) => (
        <div key={item.key}>
          <div className="flex flex-col items-center justify-center">
            <div
              className={`cursor-pointer w-full h-24 rounded-md border border-black ${
                item.bg
              } ${item.key === selectedKey ? "outline outline-blue-600" : ""}`}
            ></div>
            <div className="text-xs font-medium">{item.name}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
