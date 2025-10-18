export type SensorId = string;

export type SensorStatus = "active" | "inactive" | "maintenance" | "error";

export type Coordinates = {
  latitude: number;
  longitude: number;
};

export type SensorReading = {
  id: string;
  value: number;
  unit: string;
  recordedAt: string; // ISO 8601
};

export type Sensor = {
  id: SensorId;
  name: string;
  type: string;
  status: SensorStatus;
  location: Coordinates;
  installedAt: string;
  lastSyncAt: string;
  readings?: SensorReading[];
};


