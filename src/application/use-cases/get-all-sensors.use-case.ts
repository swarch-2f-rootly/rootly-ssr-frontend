import { ISensorRepository } from "@/application/ports/sensor.repository.port";
import { Sensor } from "@/domain/entities/sensor";

export type GetAllSensorsInput = {
  status?: string;
  page?: number;
};

export class GetAllSensorsUseCase {
  constructor(private readonly sensorRepository: ISensorRepository) {}

  async execute(input: GetAllSensorsInput = {}): Promise<Sensor[]> {
    return this.sensorRepository.findAll({ status: input.status, page: input.page });
  }
}


