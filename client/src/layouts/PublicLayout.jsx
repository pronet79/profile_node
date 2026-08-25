import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import ScrollProgress from '../components/ScrollProgress.jsx';
import CustomCursor from '../components/CustomCursor.jsx';

export default function PublicLayout() {
  return (
    <div className="relative min-h-screen">
      {/* Read progress + accent cursor (both self-disable on touch / reduced-motion) */}
      <ScrollProgress />
      <CustomCursor />
      {/* Subtle background grid + accent glow */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-grid-dark bg-[size:44px_44px] opacity-40" />
      <div className="pointer-events-none fixed left-1/2 top-0 -z-10 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-accent/10 blur-[140px]" />
      <Navbar />
      <main><Outlet /></main>
      <Footer />
    </div>
  );
}
