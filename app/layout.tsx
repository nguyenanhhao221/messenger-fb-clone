import { Header } from "../components/Header";
import "../styles/globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <head />
      <body className="bg-black text-white">
        <Header />
        {children}
      </body>
    </html>
  );
}
