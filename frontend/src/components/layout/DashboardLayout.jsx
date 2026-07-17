import Sidebar from "./Sidebar";
import DashboardNavbar from "./DashboardNavbar";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen flex bg-[#050816] text-white">

      <Sidebar />

      <div className="flex-1 flex flex-col">

        <DashboardNavbar />

        <main className="p-8">
          {children}
        </main>

      </div>

    </div>
  );
}