import { ReactNode, useEffect } from "react";
import { useLocation } from "wouter";
import { Navbar } from "./Navbar";
import { Footer } from "./Sections";
import { ContactModal } from "./ContactModal";
import { ContactModalProvider } from "./ContactModalContext";
import { useContactContent } from "@/context/CmsContext";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const contact = useContactContent();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location]);

  useEffect(() => {
    if (contact.favicon_url) {
      const existing = document.querySelector("link[rel~='icon']") as HTMLLinkElement | null;
      if (existing) {
        existing.href = contact.favicon_url;
      } else {
        const link = document.createElement("link");
        link.rel = "icon";
        link.href = contact.favicon_url;
        document.head.appendChild(link);
      }
    }
  }, [contact.favicon_url]);

  return (
    <ContactModalProvider>
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-emerald-500/20 selection:text-emerald-900 flex flex-col">
        <Navbar />
        <main className="flex-grow pt-[88px]">
          {children}
        </main>
        <Footer />
        <ContactModal />
      </div>
    </ContactModalProvider>
  );
}
