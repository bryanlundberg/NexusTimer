import { auth } from "@/auth";
import AccountNotAuth from "@/components/account/account-not-auth/account-not-auth";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    return <AccountNotAuth />;
  }

  return (
    <div className="overflow-y-auto">
      <div className="max-w-md mx-auto bg-background/90 backdrop-blur-lg pt-2">
        <div className="p-2">{children}</div>
      </div>
    </div>
  );
}
