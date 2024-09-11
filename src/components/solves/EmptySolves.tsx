import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

export default function EmptySolves({
  message,
  icon,
}: {
  message: string;
  icon: React.ReactNode;
}) {
  return (
    <>
      <Alert variant={"destructive"}>
        {icon}
        <AlertTitle className="ms-2">Heads up!</AlertTitle>
        <AlertDescription className="ms-2">{message}</AlertDescription>
      </Alert>
    </>
  );
}
