"use client";

import ButtonGoogle from "@/components/buttons/button-google/button-google";
import AccountHeader from "../account-header/account-header";

export default function AccountNotAuth() {
  return (
    <>
      <div className="mx-auto w-fit mt-5 text-center">
        <AccountHeader back="/" label="Account" />

        <ButtonGoogle />

        <div className="text-xs mt-3">Please, authenticate first.</div>
      </div>
    </>
  );
}
