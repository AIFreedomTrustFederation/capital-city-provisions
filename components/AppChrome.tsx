'use client';

import Navbar from './Navbar';
import Footer from './Footer';
import LeadCapture from './LeadCapture';

export default function AppChrome({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
      <LeadCapture />
    </>
  );
}
