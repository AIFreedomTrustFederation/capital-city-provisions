import './globals.css';
import './premium.css';
import './home-refresh.css';
import './mobile-engagement.css';
import './mvp-polish.css';
import './mobile-simplify.css';
import './homepage-polish.css';
import './page-system-polish.css';
import './menu-polish.css';
import './mobile-stack-fix.css';
import AppChrome from '../components/AppChrome';

export const metadata = {
  title: 'Capital City Provisions',
  description: 'Premium ranch quality, modern convenience, and practical food security.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body><AppChrome>{children}</AppChrome></body>
    </html>
  );
}
