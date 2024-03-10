import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import { Rubik } from "next/font/google";
import { Metadata } from "next";
const rubik = Rubik({
  subsets: ["latin"],
  weight: "500",
});

export const metadata: Metadata = {
  title: "Open-Source Collaboration and Project Management | Worknify",
  description: "Worknify redefines the way professionals manage projects and showcase their achievements. As a personal project developed with passion and commitment, Worknify offers a comprehensive suite of tools designed to enhance productivity, collaboration, and personal branding in one open-source platform.",
};

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true} className={rubik.className}>
        {children}
      </body>
    </html>
  );
}
