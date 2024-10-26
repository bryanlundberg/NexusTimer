"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function syncTranslations(event: any) {
  await cookies().set("NEXT_LOCALE", event);
  revalidatePath("/settings");
}
