import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";

import Home from "./pages/Home.jsx";
import JobListings from "./pages/JobListings.jsx";
import JobDetails from "./pages/JobDetails.jsx";
import Employers from "./pages/Employers.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";

import SeekerDashboard from "./pages/seeker/SeekerDashboard.jsx";

import EmployerDashboard from "./pages/employer/EmployerDashboard.jsx";
import PostJob from "./pages/employer/PostJob.jsx";
import JobApplicants from "./pages/employer/JobApplicants.jsx";

import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import SuperAdminDashboard from "./pages/superadmin/SuperAdminDashboard.jsx";

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<JobListings />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route path="/employers" element={<Employers />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Job Seeker */}
          <Route
            path="/seeker"
            element={
              <ProtectedRoute roles={["seeker"]}>
                <SeekerDashboard />
              </ProtectedRoute>
            }
          />

          {/* Employer */}
          <Route
            path="/employer"
            element={
              <ProtectedRoute roles={["employer"]}>
                <EmployerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employer/post-job"
            element={
              <ProtectedRoute roles={["employer", "admin", "superadmin"]}>
                <PostJob />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employer/jobs/:jobId/applicants"
            element={
              <ProtectedRoute roles={["employer", "admin", "superadmin"]}>
                <JobApplicants />
              </ProtectedRoute>
            }
          />

          {/* Admin */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={["admin", "superadmin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Super Admin */}
          <Route
            path="/superadmin"
            element={
              <ProtectedRoute roles={["superadmin"]}>
                <SuperAdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
