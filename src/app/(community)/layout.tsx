"use client";
import Providers from '@/components/providers';
import React from 'react';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset } from '@/components/ui/sidebar';
import FloatButton from '@/components/people/FloatButton';
import { useCompareUsersStore } from '@/store/CompareUsers';

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const users = useCompareUsersStore(state => state.users);
  return (
    <>
      <AppSidebar/>
      <SidebarInset className={"overflow-hidden"} style={{ height: "calc(100dvh - 1rem)" }}>
        <Providers loaderProvider={false}>
          {children}
          {users.length > 0 && <FloatButton/>}
        </Providers>
      </SidebarInset>
    </>
  );
}
