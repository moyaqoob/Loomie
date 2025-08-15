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
    <body
      style={{
        backgroundImage: `url('/img/auth.png')`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      className={`${geistSans.variable} ${geistMono.variable} antialiase min-h-screen`}
      suppressHydrationWarning
    >
      <div className="flex min-h-screen">
        {/* Left side */}
        <div className="p-3 font-mono text-lg">loomify</div>
        <div className="flex flex-col justify-center w-1/2 p-8 text-white">
          <div className="text-4xl italic max-w-md">
            "Great ideas dont happen in isolation — lets bump into brilliance
            together."
          </div>
        </div>

        {/* Right side */}
        <div className="flex justify-center items-center w-2/3 p-8 bg-white/10 text-gray-500 ">
          {children}
        </div>
      </div>
    </body>
  );
}
