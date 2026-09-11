import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import LandingNavbar from "./components/LandingNavbar.jsx";
import LandingFooter from "./components/LandingFooter.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";

// Job Portal Pages
import Home from "./pages/Home.jsx";
import JobListings from "./pages/JobListings.jsx";
import JobDetails from "./pages/JobDetails.jsx";
import Employers from "./pages/Employers.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResumeBuilder from "./pages/ResumeBuilder.jsx";
import GovtJobs from "./pages/GovtJobs.jsx";

// Landing Pages
import LandingPage from "./pages/LandingPage.jsx";
import BlogList from "./pages/BlogList.jsx";
import BlogDetail from "./pages/BlogDetail.jsx";
import WorkshopList from "./pages/WorkshopList.jsx";

// Dashboard Pages
import SeekerDashboard from "./pages/seeker/SeekerDashboard.jsx";
import EmployerDashboard from "./pages/employer/EmployerDashboard.jsx";
import PostJob from "./pages/employer/PostJob.jsx";
import JobApplicants from "./pages/employer/JobApplicants.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import SuperAdminDashboard from "./pages/superadmin/SuperAdminDashboard.jsx";
import Profile from "./pages/Profile.jsx";

/**
 * Determine if current hostname is the main landing site (agriyuvaa.com)
 * vs the job portal (job.agriyuvaa.com).
 *
 * On localhost or any other hostname, defaults to job portal UNLESS
 * ?site=landing is in the URL (for dev testing).
 */
const isLandingSite = () => {
  const hostname = window.location.hostname;
  const params = new URLSearchParams(window.location.search);

  // Explicit override for dev/testing: ?site=landing
  if (params.get("site") === "landing") return true;

  // Production: agriyuvaa.com (no subdomain prefix)
  if (hostname === "agriyuvaa.com" || hostname === "www.agriyuvaa.com") return true;

  // If deployed on Vercel with a custom domain for landing
  if (hostname.includes("agriyuvaa") && !hostname.startsWith("job.") && !hostname.includes("vercel")) return true;

  return false;
};

function App() {
  const isLanding = isLandingSite();

  // ─── Landing Site Layout ─────────────────────────────────
  if (isLanding) {
    return (
      <div className="min-h-screen flex flex-col w-full max-w-full overflow-x-hidden">
        <ScrollToTop />
        <LandingNavbar />
        <main className="flex-1 w-full max-w-full min-w-0">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<BlogList />} />
            <Route path="/blog/:slug" element={<BlogDetail />} />
            <Route path="/workshops" element={<WorkshopList />} />
            <Route path="/contact" element={<Contact />} />

            {/* Admin routes still accessible from landing site */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={<ProtectedRoute roles={["admin", "superadmin"]}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/superadmin" element={<ProtectedRoute roles={["superadmin"]}><SuperAdminDashboard /></ProtectedRoute>} />

            {/* Fallback */}
            <Route path="*" element={<LandingPage />} />
          </Routes>
        </main>
        <LandingFooter />
      </div>
    );
  }

  // ─── Job Portal Layout (existing) ────────────────────────
  return (
    <div className="min-h-screen flex flex-col w-full max-w-full overflow-x-hidden">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1 w-full max-w-full min-w-0">
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<JobListings />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route path="/govt-jobs" element={<GovtJobs />} />
          <Route path="/employers" element={<Employers />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/resume-builder" element={<ResumeBuilder />} />

          {/* Blog routes also available on job portal */}
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/:slug" element={<BlogDetail />} />

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
            path="/employer/edit-job/:id"
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

          {/* Unified Profile & Account Settings */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute roles={["seeker", "employer", "admin", "superadmin"]}>
                <Profile />
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
