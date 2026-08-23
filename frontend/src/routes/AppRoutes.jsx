import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Dashboard from "../pages/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import NewApplication from "../pages/applications/NewApplication";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to='/dashboard' replace />}/>
      <Route path="/signup" element={<Signup />}/>
      <Route path="/login" element={<Login />}/>
      <Route element={<ProtectedRoute />}>
        <Route
            path="/dashboard"
            element={<Dashboard />}
        />
        <Route
            path="/applications/new"
            element={<NewApplication />}
        />
      </Route>
    </Routes>
  );
}

export default AppRoutes;