import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/user";

export default async function AdminPage() {
  const user = await getCurrentUser();
  
  if (!user) {
    // Redirect to login if not authenticated
    redirect("/login");
  }

  return (
    <div style={{ padding: "2rem", backgroundColor: "#ffebee" }}>
      <h1 style={{ color: "#c62828" }}>Admin Panel</h1>
      <p>Authorized Personnel Only.</p>
      <p>User ID: {user.id}</p>
      
      <div style={{ marginTop: "2rem", padding: "1rem", border: "1px solid red" }}>
        <h3>Security Controls</h3>
        <button disabled>Delete All Users (Disabled)</button>
      </div>
    </div>
  );
}
