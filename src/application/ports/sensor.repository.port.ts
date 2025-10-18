import { Sensor, SensorId } from "@/domain/entities/sensor";

export interface ISensorRepository {
  findById(id: SensorId): Promise<Sensor | null>;
  findAll(params?: { status?: string; page?: number }): Promise<Sensor[]>;
}


