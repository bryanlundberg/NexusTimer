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
import { useRef, useState } from "react";
import useClickOutside from "@/hooks/useClickOutside";
import { AnimatePresence, motion } from "framer-motion";
import sortSolves, { SortMode } from "@/lib/SortSolves";
import SortModeMenu from "@/components/solves/SortModeMenu";
import SortOrderMenu from "@/components/solves/SortOrderMenu";

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
  const sortMenuRef = useRef<HTMLDivElement | null>(null);
  const sortSubMenuRef = useRef<HTMLDivElement | null>(null);

  const [sortOptions, setSortOptions] = useState<SortMode>({
    order: "Descending",
    mode: "Date",
  });
  const [sortModal, setSortModal] = useState(false);
  const [subMenuModal, setSubMenuModal] = useState(false);

  sortSolves({ displaySolves, sortMode: sortOptions });

  useClickOutside(sortSubMenuRef, () => {
    setSubMenuModal(false);
  });

  useClickOutside(sortMenuRef, () => {
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
                onClick={() => setIsOpenDeleteModal(true)}
                icon={<TrashIcon className="w-4 h-4" />}
                label={t("Inputs.trash-all")}
                disabled={
                  selectedCube && selectedCube.solves.session.length > 0
                    ? false
                    : true
                }
              />
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
              <div className="relative">
                <Button
                  onClick={() => setSortModal((prev) => !prev)}
                  icon={<AdjustmentsHorizontalIcon className="w-4 h-4" />}
                  label={"Sort by"}
                  disabled={
                    selectedCube && selectedCube.solves.session.length > 0
                      ? false
                      : true
                  }
                />
                <AnimatePresence>
                  {sortModal && (
                    <motion.div
                      initial={{ y: 0, scale: 0.9, opacity: 0.8 }}
                      animate={{ y: 0, scale: 1, opacity: 1 }}
                      exit={{ x: 0, scale: 0.9, opacity: 0 }}
                      className="absolute top-10 right-0 z-50"
                    >
                      <SortModeMenu
                        submenuRef={sortMenuRef}
                        onSelectSortMode={(e) => {
                          setSortModal(false);
                          setSubMenuModal(true);
                          setSortOptions((options) => ({
                            ...options,
                            mode: e,
                          }));
                        }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {subMenuModal && (
                    <motion.div
                      initial={{ y: 0, scale: 0.9, opacity: 0.8 }}
                      animate={{ y: 0, scale: 1, opacity: 1 }}
                      exit={{ x: 0, scale: 0.9, opacity: 0 }}
                      className="absolute top-10 right-0 z-50"
                    >
                      <SortOrderMenu
                        title={sortOptions.mode}
                        submenuRef={sortSubMenuRef}
                        onSelectSortOrder={(e) => {
                          setSubMenuModal(false);
                          setSortOptions((options) => ({
                            ...options,
                            order: e,
                          }));
                        }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </ButtonsSection>
          </div>
        </SolveFilters>

        <SolvesArea displaySolves={displaySolves} currentTab={currentTab} />
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
    </>
  );
}
