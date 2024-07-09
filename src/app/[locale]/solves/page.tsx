"use client";
import { Button } from "@/components/button/index";
import Select from "@/components/Select";
import ModalSolve from "@/components/solves/ModalSolve";
import { OverallContainer } from "@/components/OverallContainer";
import { OverallHeader } from "@/components/OverallHeader";
import { SolveFilters } from "@/components/solves/SolveFilters";
import { Filter } from "@/components/solves/Filter";
import { ButtonsSection } from "@/components/solves/ButtonsSection";
import { SolvesArea } from "@/components/solves/SolvesArea";
import useSolvesPage from "@/hooks/useSolvesPage";
import { InputText } from "@/components/input-text/index";
import { useTimerStore } from "@/store/timerStore";
import MoveModal from "@/components/solves/MoveModal";
import ConfirmDelete from "@/components/solves/ConfirmDelete";
import { useTranslations } from "next-intl";
import {
  FolderArrowDownIcon,
  TrashIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/solid";
import SortMenu from "@/components/solves/SortMenu";
import { useRef, useState, useEffect } from "react";
import useClickOutside from "@/hooks/useClickOutside";

export default function SolvesPage() {
  const {
    handleTabClick,
    currentTab,
    handleMoveAll,
    handleTrashAll,
    handleSearch,
    displaySolves,
    isOpenMoveModal,
    setIsOpenMoveModal,
    handleGetMoveData,
    setIsOpenDeleteModal,
    handleGetDeleteData,
    isOpenDeleteModal,
  } = useSolvesPage();

  const { selectedCube, setTimerStatistics } = useTimerStore();
  const t = useTranslations("Index");
  const submenuRef = useRef<HTMLDivElement | null>(null);
  const sortButtonRef = useRef<HTMLDivElement | null>(null);

  const [isSorted, setIsSorted] = useState<boolean>(false);
  const [sortType, setSortType] = useState("");
  const [sortModal, setSortModal] = useState(false);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const sortedSolves = displaySolves ? [...displaySolves] : [];

  if (isSorted) {
    if (sortType === "NewestToOldest") sortedSolves.sort((a, b) => b.endTime - a.endTime);
    else if (sortType === "OldestToNewest") sortedSolves.sort((a, b) => a.endTime - b.endTime);
    else if (sortType === "FastestToSlowest") sortedSolves.sort((a, b) => a.time - b.time);
    else if (sortType === "slowestToFastest") sortedSolves.sort((a, b) => b.time - a.time);
    else if (sortType === "plus2") {
      sortedSolves.sort((a, b) => {
        if (a.plus2 || b.plus2) {
          return -1;
        } else if (!a.plus2 && !b.plus2) {
          return 1;
        } else {
          return 0;
        }
      });
    }
  }

  useEffect(() => {
    if (sortButtonRef.current) {
      const rect = sortButtonRef.current.getBoundingClientRect();
      setModalPosition({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX });
    }
  }, [sortModal]);

  useClickOutside(submenuRef, () => {
    setSortModal(false);
  });

  return (
    <>
      <OverallContainer>
        <OverallHeader title={t("SolvesPage.title")}>
          <Select />
        </OverallHeader>

        <SolveFilters>
          <Filter handleClick={handleTabClick} currentTab={currentTab} />
          <div className="flex gap-3 grow">
            <InputText
              className="border light:bg-neutral-50 light:border-neutral-200 light:focus:bg-white dark:bg-zinc-950 dark:border-zinc-800 dark:focus:bg-zinc-900"
              placeholder={t("SolvesPage.search-by-time")}
              onChange={(e) => {
                handleSearch(e);
              }}
              id="search"
            />
            <ButtonsSection currentTab={currentTab}>
              <Button
                onClick={() => setIsOpenMoveModal(true)}
                icon={<FolderArrowDownIcon className="w-4 h-4" />}
                label={t("Inputs.move-all")}
                disabled={
                  selectedCube && selectedCube.solves.session.length > 0
                    ? false
                    : true
                }
              />
              <div ref={sortButtonRef} className="relative">
                <Button
                  onClick={() => setSortModal((prev) => !prev)}
                  icon={<AdjustmentsHorizontalIcon className="w-4 h-4" />}
                  label={t("Inputs.move-all")}
                  disabled={
                    selectedCube && selectedCube.solves.session.length > 0
                      ? false
                      : true
                  }
                />
              </div>
              <Button
                onClick={() => setIsOpenDeleteModal(true)}
                icon={<TrashIcon className="w-4 h-4" />}
                label={t("Inputs.trash-all")}
                disabled={
                  selectedCube && selectedCube.solves.session.length > 0
                    ? false
                    : true
                }
              />
            </ButtonsSection>
          </div>
        </SolveFilters>

        <SolvesArea
          displaySolves={isSorted ? sortedSolves : displaySolves}
          currentTab={currentTab}
        />
        <ModalSolve currentTab={currentTab} />
      </OverallContainer>
      {isOpenMoveModal && (
        <MoveModal
          onCancel={() => setIsOpenMoveModal(false)}
          onConfirm={() => {
            setIsOpenMoveModal(false);
            handleMoveAll();
            setTimerStatistics();
          }}
          data={handleGetMoveData}
        />
      )}
      {isOpenDeleteModal && (
        <ConfirmDelete
          onCancel={() => setIsOpenDeleteModal(false)}
          onConfirm={() => {
            setIsOpenDeleteModal(false);
            handleTrashAll();
            setTimerStatistics();
          }}
          data={handleGetDeleteData}
        />
      )}

      {sortModal && (
        <div
          className="absolute z-50"
          style={{ top: `${modalPosition.top}px`, right : 0 }}
        >
          <SortMenu
            setSortModal={setSortModal}
            submenuRef={submenuRef}
            setIsSorted={setIsSorted}
            setSortType={setSortType}
          />
        </div>
      )}
    </>
  );
}
