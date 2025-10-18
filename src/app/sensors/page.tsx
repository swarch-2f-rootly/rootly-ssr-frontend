import { ApiSensorRepository } from "@/infrastructure/repositories/sensor.repository";
import { GetAllSensorsUseCase } from "@/application/use-cases/get-all-sensors.use-case";

export const dynamic = "force-dynamic"; // evitar cache en desarrollo

export default async function SensorsPage({
  searchParams,
}: {
  searchParams?: { status?: string; page?: string };
}) {
  const repo = new ApiSensorRepository();
  const useCase = new GetAllSensorsUseCase(repo);
  const sensors = await useCase.execute({
    status: searchParams?.status,
    page: searchParams?.page ? Number(searchParams.page) : undefined,
  });

  return (
    <main className="px-6 py-8">
      <h1 className="text-2xl font-semibold mb-4">Sensores</h1>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sensors.map((s) => (
          <li key={s.id} className="rounded-xl border bg-white/60 backdrop-blur p-4 shadow-sm dark:bg-black/30">
            <div className="text-sm text-gray-500">{s.type}</div>
            <div className="text-lg font-medium">{s.name}</div>
            <div className="text-xs mt-1">Estado: {s.status}</div>
          </li>
        ))}
      </ul>
    </main>
  );
}


