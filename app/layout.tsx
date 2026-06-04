import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export const metadata = {
  title: 'Capital City Provisions',
  description: 'Premium ranch quality, modern convenience, and practical food security.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body><Navbar />{children}<Footer /></body>
    </html>
  );
}