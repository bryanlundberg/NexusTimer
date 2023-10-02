"use client";
import ArrowLeft from "@/icons/ArrowLeft";
import Toggle from "@/components/headless/Toggle";
import Language from "@/icons/Language";
import CpuChip from "@/icons/CpuChip";
import BellAlert from "@/icons/BellAlert";
import Clock from "@/icons/Clock";
import { useSettingsModalStore } from "@/store/SettingsModalStore";
import genId from "@/lib/genId";

export default function SettingsMenu() {
  const { setSettingsOpen, settings } = useSettingsModalStore();

  return (
    <>
      <div className="transition bg-neutral-50 text-zinc-800 grow w-full sm:w-96 flex flex-col gap-3 min-h-full max-h-full z-10 overflow-auto absolute">
        <div className="flex items-center my-3">
          <div
            onClick={() => setSettingsOpen(false)}
            className="flex items-center ms-3 cursor-pointer"
          >
            <ArrowLeft />
          </div>
          <div className="flex-1 text-center font-medium text-2xl">
            Settings
          </div>
        </div>

        <Section icon={<Language />} title="Locale">
          <div className="flex justify-between">
            <div className="ms-12">Language</div>
            <div className="me-6">
              <select>
                <option value="en">English</option>
                <option value="es">Español</option>
              </select>
            </div>
          </div>
        </Section>
        <Section icon={<Clock />} title={"Timer"}>
          {settings.timer.map((item) => (
            <Option
              key={genId()}
              status={item.status}
              label={item.desc}
              read={item.desc}
              id={item.id}
            />
          ))}
        </Section>

        <Section icon={<CpuChip />} title={"Features"}>
          {settings.features.map((item) => (
            <Option
              key={genId()}
              status={item.status}
              label={item.desc}
              read={item.desc}
              id={item.id}
            />
          ))}
        </Section>

        <Section icon={<BellAlert />} title={"Alerts"}>
          {settings.alerts.map((item) => (
            <Option
              key={genId()}
              status={item.status}
              label={item.desc}
              read={item.desc}
              id={item.id}
            />
          ))}
        </Section>
      </div>
    </>
  );
}

function Section({
  children,
  icon,
  title,
}: {
  children: React.ReactNode;
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="mb-3">
      <div className="text-blue-500 mb-3 flex font-medium">
        <div className="w-6 mx-3">{icon}</div>
        <div className="w-full">{title}</div>
      </div>
      {children}
    </div>
  );
}

function Option({
  label,
  status,
  read,
  id,
}: {
  label: string;
  status: boolean;
  read?: string;
  id: number;
}) {
  return (
    <div className="flex justify-between mb-1">
      <div className="ms-12">{label}</div>
      <div className="me-6">
        <Toggle status={status} read={read} id={id} />
      </div>
    </div>
  );
}
