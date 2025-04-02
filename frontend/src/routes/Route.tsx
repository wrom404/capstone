import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Fix import
import LoginPage from "../pages/LoginPage";
import Page from "../pages/Page";
import Layout from "../components/Layout";
import CalendarPage from "@/pages/CalendarEventPage";
import EventPage from "@/pages/EventPage";
import ArchivePage from "@/pages/ArchivePage";
import ScheduleEventPage from "@/pages/ScheduleEventPage";
import EventDetailPage from "@/pages/EventDetailPage";
import EditEventPage from "@/pages/EditEventPage";
import PageNotFound from "@/pages/PageNotFound";
import LogOut from "@/pages/LogOut";
import AdminPrivateRoute from "./AdminPrivateRoute";
import ProtectedRoute from "./ProtectedRoute";
import Signup from "@/pages/Signup";

const RoutePage = () => {
  return (
    <Router>
      <Routes>
        {/* Public Route (Login Page - No Layout) */}
        <Route path="/login" element={<LoginPage />} />

        {/* Private Routes (Wrapped with Layout) */}
        <Route
          path="/*"
          element={
            <Layout>
              <Routes>
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Page />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/calendar"
                  element={
                    <ProtectedRoute>
                      <CalendarPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/event"
                  element={
                    <ProtectedRoute>
                      <EventPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/create-user"
                  element={
                    <AdminPrivateRoute role="admin">
                      <Signup />
                    </AdminPrivateRoute>
                  }
                />
                <Route
                  path="/edit-event/:id"
                  element={
                    <ProtectedRoute>
                      <EditEventPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/event/:id"
                  element={
                    <ProtectedRoute>
                      <EventDetailPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="/archive" element={<ArchivePage />} />
                <Route
                  path="/schedule"
                  element={
                    <AdminPrivateRoute role="admin">
                      <ScheduleEventPage />
                    </AdminPrivateRoute>
                  }
                />
                <Route path="/logout" element={<LogOut />} />
                <Route path="*" element={<PageNotFound />} />
                <Route
                  path="/unauthorized"
                  element={
                    <div className="min-h-screen h-screen flex justify-center items-center text-gray-800 bg-white text-2xl">
                      Unauthorized User
                    </div>
                  }
                />
                {/* Don't add 404 inside Layout */}
              </Routes>
            </Layout>
          }
        />

        {/* Catch-All 404 Page (Standalone) */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Router>
  );
};

export default RoutePage;
