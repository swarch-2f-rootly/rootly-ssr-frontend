import ProfileDashboard from "@/ui/features/profile/ProfileDashboard";
import Navbar from "@/ui/components/client/Navbar";

export default function ProfilePage() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        <ProfileDashboard />
      </main>
    </>
  );
}