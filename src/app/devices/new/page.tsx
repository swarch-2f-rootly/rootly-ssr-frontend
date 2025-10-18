import AddDeviceForm from "@/ui/features/devices/components/AddDeviceForm";
import Navbar from "@/ui/components/client/Navbar";

export default function NewDevicePage() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        <AddDeviceForm />
      </main>
    </>
  );
}
