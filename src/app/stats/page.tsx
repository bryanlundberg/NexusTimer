"use client";
import { useEffect } from "react";
import translation from "@/translations/global.json";
import { useSettingsModalStore } from "@/store/SettingsModalStore";
import { Select } from "@/components/select/index";
import useSelect from "@/hooks/useSelect";
import { OverallContainer } from "@/components/OverallContainer";
import { OverallHeader } from "@/components/OverallHeader";
import { StatsContent } from "@/components/stats/StatsContent";

export default function StatsPage() {
  const { settings, lang } = useSettingsModalStore();
  const { selectedValue, handleSelect } = useSelect(
    translation.metrics["header-select"]["personal"][lang]
  );
  const options = [
    {
      name: translation.metrics["header-select"]["personal"][lang],
      id: translation.metrics["header-select"]["personal"][lang],
    },
    {
      name: translation.metrics["header-select"]["category"][lang],
      id: translation.metrics["header-select"]["category"][lang],
    },
  ];

  useEffect(() => {
    handleSelect(translation.metrics["header-select"]["personal"][lang]);
  }, [settings, lang, handleSelect]);

  return (
    <>
      <OverallContainer>
        <OverallHeader title={translation.solves["header"][lang]}>
          <Select
            defaultLabel={selectedValue}
            list={options}
            className="w-36 sm:w-56"
            onChange={(selection) => handleSelect(selection)}
          />
        </OverallHeader>
        <StatsContent selectedValue={selectedValue} />
      </OverallContainer>
    </>
  );
}
