import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout() {
  return (
    <div className="flex h-screen bg-slate-950 text-white overflow-hidden">

      <Sidebar />

      <div className="flex flex-col flex-1">

        <Navbar />

        <main
  className="
  flex-1
  overflow-y-auto
  bg-gradient-to-br
  from-slate-950
  via-slate-900
  to-slate-950
  p-8
"
>
  <Outlet />
</main>

        <Footer />

      </div>

    </div>
  );
}