
import Navbar from "@/components/Navbar";
import "./globals.css";



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
      className="w-full"
      >
        <div className="w-full">
          <Navbar />
        </div>
        {children}
      </body>
    </html>
  );
}
