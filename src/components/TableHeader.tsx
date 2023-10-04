import { useSettingsModalStore } from "@/store/SettingsModalStore";
import translation from "@/translations/global.json";

export default function TableHeader() {
  const { settings } = useSettingsModalStore();
  return (
    <>
      <div className="table-header-group mb-10 h-10 border-b border-zinc-900 text-zinc-300 bg-zinc-900 font-medium text-sm">
        <div className="table-row">
          <div className="table-cell w-20 align-middle text-center">
            {translation.cubes.table["favorite"][settings.locale[0].lang]}
          </div>
          <div className="table-cell text-left align-middle">
            {translation.cubes.table["cube"][settings.locale[0].lang]}
          </div>
          <div className="table-cell text-center align-middle">
            {translation.cubes.table["category"][settings.locale[0].lang]}
          </div>
          <div className="table-cell text-center align-middle">
            {translation.cubes.table["solves"][settings.locale[0].lang]}
          </div>
          <div className=" text-center align-middle hidden md:table-cell">
            {translation.cubes.table["created-at"][settings.locale[0].lang]}
          </div>
          <div className="text-center align-middle hidden md:table-cell">
            {translation.cubes.table["status"][settings.locale[0].lang]}
          </div>
          <div className="table-cell text-center align-middle w-10 sm:w-20"></div>
        </div>
      </div>
    </>
  );
}
