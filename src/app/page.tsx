// app/page.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import WelcomeClient from "./WelcomeClient";

export default async function Page() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (accessToken) {
    redirect("/home");
  }

  return <WelcomeClient />;
}