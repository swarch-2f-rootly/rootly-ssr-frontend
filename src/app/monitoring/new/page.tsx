import Navbar from "@/ui/components/client/Navbar";
import AddPlantForm from "@/ui/features/plants/components/AddPlantForm";

export default function NewPlantPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        <AddPlantForm />
      </main>
    </>
  );
}
