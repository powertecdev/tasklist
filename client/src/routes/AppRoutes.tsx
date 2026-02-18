import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import PrivateRoute from "./PrivateRoute";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import MyTasks from "../pages/MyTasks";
import AllTasks from "../pages/AllTasks";
import TeamTasks from "../pages/TeamTasks";
import EmployeeTaskView from "../pages/EmployeeTaskView";
import ManageEmployees from "../pages/ManageEmployees";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route index element={<Navigate to="/dashboard" />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="my-tasks" element={<MyTasks />} />
        <Route path="all-tasks" element={<AllTasks />} />
        <Route path="team-tasks" element={<TeamTasks />} />
        <Route path="team-tasks/:userId" element={<EmployeeTaskView />} />
        <Route path="employees" element={<PrivateRoute adminOnly><ManageEmployees /></PrivateRoute>} />
      </Route>
    </Routes>
  );
}
