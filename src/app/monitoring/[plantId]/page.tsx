import PlantDetailPage from "@/ui/features/plantDetail/PlantDetailPage";
import Navbar from "@/ui/components/client/Navbar";

export default function PlantDetailRoute() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        <PlantDetailPage />
      </main>
    </>
  );
}
