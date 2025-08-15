import { Geist, Geist_Mono } from "next/font/google";



const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ backgroundImage: `url('/img/auth.png')`}}
        className={`${geistSans.variable} ${geistMono.variable} antialiase flex items-center justify-center`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
