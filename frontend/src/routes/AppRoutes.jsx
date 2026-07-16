import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Dashboard from "../pages/Dashboard";
import Monitoring from "../pages/Monitoring";
import Analytics from "../pages/Analytics";
import Reports from "../pages/Reports";
import Alerts from "../pages/Alerts";
import Settings from "../pages/Settings";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import NotFound from "../pages/NotFound";

export default function AppRoutes() {
  return (
    <Routes>

      <Route path="/" element={<Home />} />

      <Route path="/dashboard" element={<Dashboard />} />

      <Route path="/monitoring" element={<Monitoring />} />

      <Route path="/analytics" element={<Analytics />} />

      <Route path="/reports" element={<Reports />} />

      <Route path="/alerts" element={<Alerts />} />

      <Route path="/settings" element={<Settings />} />

      <Route path="/login" element={<Login />} />

      <Route path="/signup" element={<Signup />} />

      <Route path="*" element={<NotFound />} />

    </Routes>
  );
}