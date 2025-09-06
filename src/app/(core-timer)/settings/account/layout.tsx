import { auth } from "@/auth";
import AccountNotAuth from "@/components/account/account-not-auth/account-not-auth";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return session ? <>{children}</> : <AccountNotAuth />;
}
