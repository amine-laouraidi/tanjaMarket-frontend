import { redirect } from "next/navigation";
import getMe from "@/lib/getMe";
import ProfileInfo from "@/components/profile/ProfileInfo";
import PasswordForm from "@/components/profile/PasswordForm";

export const metadata = {
  title: "Mon profil | TanjaMarket",
};

export default async function ProfilePage() {
  const user = await getMe();
  console.log(user);
  return (
    <div className="min-h-screen bg-muted/30">
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Mon profil</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gérez vos informations personnelles et votre mot de passe.
          </p>
        </div>

        {/* Profile info card */}
        <ProfileInfo user={user} />

        {/* Password card */}
        <PasswordForm />
      </div>
    </div>
  );
}