import Providers from '@/components/providers';
import React from 'react';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset } from '@/components/ui/sidebar';

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AppSidebar/>
      <SidebarInset className={"overflow-hidden"} style={{ height: "calc(100dvh - 1rem)" }}>
        <Providers loaderProvider={false}>
          {children}
        </Providers>
      </SidebarInset>
    </>
  );
}
