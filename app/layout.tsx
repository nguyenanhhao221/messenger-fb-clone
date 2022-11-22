import { Header } from '../components/Header';
import '../styles/globals.css';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head />
      <body className="bg-black text-white">
        {/* @ts-expect-error Server Component */}
        <Header />
        {children}
      </body>
    </html>
  );
}
