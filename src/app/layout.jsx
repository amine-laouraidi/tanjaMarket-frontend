import { Poppins, Geist } from "next/font/google";
import "@/assets/styles/main.css";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata = {};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={cn("font-sans", geist.variable, poppins.variable)}
    >
      <body className="font-sans antialiased flex flex-col min-h-screen">
        {children}
      </body>
    </html>
  );
}
