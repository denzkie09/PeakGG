import Sidebar from "@/components/layout/Sidebar";
import AuthGuard from "@/components/layout/AuthGuard";

export default function Dota2Layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div style={{ display: "flex", minHeight: "100vh", width: "100%" }}>
        <Sidebar />
        <main style={{ flex: 1, minWidth: 0, width: "100%", overflowY: "auto" }}>
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}
