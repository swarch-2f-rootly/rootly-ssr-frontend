import Navbar from "@/ui/components/client/Navbar";
import PlantsDashboard from "@/ui/features/plants/PlantsDashboard";

export default function PlantsPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        <PlantsDashboard />
      </main>
    </>
  );
}
