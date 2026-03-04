import { redirect } from "next/navigation";
import { getSessionId } from "@/lib/auth/cookies";
import { validateSession } from "@/lib/auth/session";
import { DashboardContent } from "@/components/dashboard/DashboardContent";

export default async function DashboardPage() {
  const sessionId = await getSessionId();
  if (!sessionId) {
    redirect("/");
  }

  const { user } = await validateSession(sessionId);
  if (!user) {
    redirect("/");
  }

  return <DashboardContent userEmail={user.email} />;
}
