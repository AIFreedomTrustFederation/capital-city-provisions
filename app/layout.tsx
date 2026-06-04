import './globals.css';

export const metadata = {
  title: 'Capital City Provisions',
  description: 'Premium food provisioning for families, businesses, and communities.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
