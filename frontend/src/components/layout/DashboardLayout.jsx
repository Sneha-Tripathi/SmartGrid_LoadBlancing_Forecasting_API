import Sidebar from "./Sidebar";
import DashboardNavbar from "./DashboardNavbar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#050816]">

      {/* Sidebar */}

      <Sidebar />

      {/* Main Content */}

      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Navbar */}

        <DashboardNavbar />

        {/* Page Content */}

        <main className="flex-1 overflow-y-auto p-8">

          <div className="max-w-[1700px] mx-auto">

            {children}

          </div>

        </main>

      </div>

    </div>
  );
}