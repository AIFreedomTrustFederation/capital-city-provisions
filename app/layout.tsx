import './globals.css';
import './premium.css';
import './home-refresh.css';
import './mobile-engagement.css';
import './mvp-polish.css';
import './mobile-simplify.css';
import './homepage-polish.css';
import './page-system-polish.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LeadCapture from '../components/LeadCapture';

export const metadata = {
  title: 'Capital City Provisions',
  description: 'Premium ranch quality, modern convenience, and practical food security.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body><Navbar />{children}<Footer /><LeadCapture /></body>
    </html>
  );
}