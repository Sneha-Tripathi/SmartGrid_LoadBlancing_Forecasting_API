import Sidebar from "./Sidebar";
import DashboardNavbar from "./DashboardNavbar";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#050816] text-white flex">

      {/* Sidebar */}

      <Sidebar />

      {/* Main */}

      <div className="flex-1 flex flex-col">

        <DashboardNavbar />

        <main className="flex-1 p-8 lg:p-10 overflow-y-auto">

          {children}

        </main>

      </div>

    </div>
  );
}