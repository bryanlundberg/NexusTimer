"use client";

import ButtonGoogle from "@/components/buttons/button-google/button-google";
import AccountHeader from "../account-header/account-header";

export default function AccountNotAuth() {
  return (
    <>
      <div className="max-w-md mx-auto bg-background/90 backdrop-blur-lg pt-2">
        <AccountHeader back="/settings" label="Account" />

        <div className="space-y-2">
          <ButtonGoogle />
          <p className="text-center text-xs">Authenticate to grant access</p>
        </div>
      </div>
    </>
  );
}
