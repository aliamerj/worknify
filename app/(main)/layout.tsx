import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "../globals.css";
import { Providers } from "../providers";
import { NavBar } from "./components/navbar/Navbar";
import { ApiCallProvider } from "@/utils/context/api_call_context";
import Footer from "./components/footer/footer";

const rubik = Rubik({
  subsets: ["latin"],
  weight: "500",
});

export const metadata: Metadata = {
  title: "worknify",
  description: "Generated by create next app",
};

/**
 * The `RootLayout` function is a React component that serves as the layout for the root of the application.
 * It wraps the children components with providers and sets up the HTML structure.
 *
 * param children - React node representing the components to be rendered within the layout.
 * returns The rendered HTML structure with the wrapped components and providers.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <body suppressHydrationWarning={true} className={rubik.className}>
        <Providers>
          <ApiCallProvider>
            <div className="flex min-h-screen flex-col justify-between">
              <main className="mb-auto">
                <NavBar />
                {children}
              </main>
              <Footer />
            </div>
          </ApiCallProvider>
        </Providers>
      </body>
    </html>
  );
}
