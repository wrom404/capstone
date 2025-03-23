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
                <Route path="/dashboard" element={<Page />} />
                <Route path="/calendar" element={<CalendarPage />} />
                <Route path="/event" element={<EventPage />} />
                <Route path="/edit-event/:id" element={<EditEventPage />} />
                <Route path="/event/:id" element={<EventDetailPage />} />
                <Route path="/archive" element={<ArchivePage />} />
                <Route path="/schedule" element={<ScheduleEventPage />} />
                {/* <Route path="/logout" element={} /> */}
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
};

export default RoutePage;
