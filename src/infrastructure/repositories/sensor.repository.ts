import { ISensorRepository } from "@/application/ports/sensor.repository.port";
import { Sensor } from "@/domain/entities/sensor";
import { createApiClient } from "@/infrastructure/api/client";

export class ApiSensorRepository implements ISensorRepository {
  private api = createApiClient();

  async findAll(params?: { status?: string; page?: number }): Promise<Sensor[]> {
    const search = new URLSearchParams();
    if (params?.status) search.set("status", params.status);
    if (params?.page) search.set("page", String(params.page));
    return await this.api.get<Sensor[]>(`/sensors${search.size ? `?${search.toString()}` : ""}`);
  }

  async findById(id: string): Promise<Sensor | null> {
    try {
      return await this.api.get<Sensor>(`/sensors/${id}`);
    } catch {
      return null;
    }
  }
}


