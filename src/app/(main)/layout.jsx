import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import getMe from "@/lib/getMe";
import { UserProvider } from "@/context/user-context";

export default async function MainLayout({ children }) {
  const user = await getMe();

  return (
    <UserProvider user={user}>
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </UserProvider>
  );
}