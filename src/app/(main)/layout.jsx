import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import getMe from "@/lib/getMe";
import { GlobalProvider } from "@/context/GlobalContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";
import { authFetch } from "@/lib/authFetch";

export default async function MainLayout({ children }) {
  const user = await getMe();

  let savedCount = 0;
  if (user) {
    const savedStatusRes = await authFetch(`/saved/count`);
    const { count } = await savedStatusRes.json();
    savedCount = count;
  }

  return (
    <GlobalProvider user={user} initialSavedCount={savedCount}>
      <Navbar />
      <TooltipProvider>
        <main className="flex-grow">{children}</main>
      </TooltipProvider>
      <Toaster richColors position="bottom-right" />
      <Footer />
    </GlobalProvider>
  );
}
