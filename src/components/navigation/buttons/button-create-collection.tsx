import { Drawer, DrawerTrigger } from "@/components/ui/drawer";
import DrawerCreateCollection from "@/components/drawners/drawner-create-collection/drawner-create-collection";
import { PlusIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useTimerStore } from "@/store/timerStore";

export default function ButtonCreateCollection() {
  const isOpenDrawerNewCollection = useTimerStore(
    (state) => state.isOpenDrawerNewCollection
  );
  const setIsOpenDrawerNewCollection = useTimerStore(
    (state) => state.setIsOpenDrawerNewCollection
  );
  const t = useTranslations("Index");
  return (
    <>
      <Drawer
        open={isOpenDrawerNewCollection}
        onOpenChange={setIsOpenDrawerNewCollection}
      >
        <DrawerTrigger asChild>
          <Button className="p-2" data-testid="create-collection-button">
            <PlusIcon className="size-4" strokeWidth={5} />{" "}
            <span className="hidden sm:inline">
              {t("CubesPage.new-collection")}
            </span>
          </Button>
        </DrawerTrigger>
        <DrawerCreateCollection
          closeDrawer={() => setIsOpenDrawerNewCollection(false)}
        />
      </Drawer>
    </>
  );
}
