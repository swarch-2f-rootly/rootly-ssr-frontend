import DevicesDashboard from "@/ui/features/devices/DevicesDashboard";
import Navbar from "@/ui/components/client/Navbar";

export default function DevicesPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        <DevicesDashboard />
      </main>
    </>
  );
}