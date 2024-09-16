import { useTranslations } from "next-intl";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

export default function AlertEmptySolves({
  message,
  icon,
}: {
  message: string;
  icon: React.ReactNode;
}) {
  const t = useTranslations("Index");
  return (
    <>
      <Alert variant={"destructive"}>
        {icon}
        <AlertTitle className="ms-2">{t("SolvesPage.alert.title")}</AlertTitle>
        <AlertDescription className="ms-2">{message}</AlertDescription>
      </Alert>
    </>
  );
}
