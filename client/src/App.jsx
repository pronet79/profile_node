import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';
import ProtectedRoute from './components/admin/ProtectedRoute.jsx';
import Analytics from './components/Analytics.jsx';
import Loader from './components/Loader.jsx';
import Home from './pages/Home.jsx';
import { Privacy, Terms, PaymentPolicy } from './pages/Legal.jsx';
import NotFound from './pages/NotFound.jsx';

// Code-split heavier / less-frequently-hit routes
const ProjectsPage = lazy(() => import('./pages/ProjectsPage.jsx'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail.jsx'));
const Blog = lazy(() => import('./pages/Blog.jsx'));
const BlogPost = lazy(() => import('./pages/BlogPost.jsx'));

// Admin (all lazy — never loaded for public visitors)
const Login = lazy(() => import('./pages/admin/Login.jsx'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard.jsx'));
const AdminProjects = lazy(() => import('./pages/admin/Projects.jsx'));
const AdminFeedback = lazy(() => import('./pages/admin/Feedback.jsx'));
const AdminMessages = lazy(() => import('./pages/admin/Messages.jsx'));
const AdminDonations = lazy(() => import('./pages/admin/Donations.jsx'));
const AdminAnalytics = lazy(() => import('./pages/admin/Analytics.jsx'));
const AdminExperience = lazy(() => import('./pages/admin/Experience.jsx'));
const AdminServices = lazy(() => import('./pages/admin/Services.jsx'));
const AdminSkills = lazy(() => import('./pages/admin/Skills.jsx'));
const AdminBlog = lazy(() => import('./pages/admin/BlogAdmin.jsx'));
const AdminSettings = lazy(() => import('./pages/admin/Settings.jsx'));

export default function App() {
  return (
    <Suspense fallback={<div className="grid min-h-screen place-items-center"><Loader /></div>}>
      <Analytics />
      <Routes>
        {/* Public */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/payment-policy" element={<PaymentPolicy />} />
        </Route>

        {/* Admin login (unprotected) */}
        <Route path="/admin/login" element={<Login />} />

        {/* Admin (protected) */}
        <Route
          path="/admin"
          element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}
        >
          <Route index element={<Dashboard />} />
          <Route path="projects" element={<AdminProjects />} />
          <Route path="feedback" element={<AdminFeedback />} />
          <Route path="messages" element={<AdminMessages />} />
          <Route path="donations" element={<AdminDonations />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="experience" element={<AdminExperience />} />
          <Route path="services" element={<AdminServices />} />
          <Route path="skills" element={<AdminSkills />} />
          <Route path="blog" element={<AdminBlog />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        <Route path="*" element={<PublicLayout />}>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
