// GraphQL operation types
export interface GraphQLError {
  message: string;
  locations?: Array<{
    line: number;
    column: number;
  }>;
  path?: string[];
  extensions?: Record<string, unknown>;
}

export interface GraphQLResponse<TData = unknown> {
  data?: TData;
  errors?: GraphQLError[];
}

// Analytics-specific types (from API Gateway documentation)
export interface MetricResult {
  metricName: string;
  value: number;
  unit: string;
  calculatedAt: string;
  controllerId: string;
  description?: string;
}

export interface AnalyticsReport {
  controllerId: string;
  generatedAt: string;
  dataPointsCount: number;
  metrics: MetricResult[];
}

export interface TrendDataPoint {
  timestamp: string;
  value: number;
  interval: string;
}

export interface TrendAnalysis {
  metricName: string;
  controllerId: string;
  interval: string;
  generatedAt: string;
  totalPoints: number;
  averageValue: number;
  minValue: number;
  maxValue: number;
  dataPoints: TrendDataPoint[];
}

export interface AnalyticsHealth {
  status: string;
  service: string;
  influxdb: string;
  influxdbUrl: string;
  timestamp: string;
}

// Input types for GraphQL mutations/queries
export interface AnalyticsFilterInput {
  startTime?: string;
  endTime?: string;
  limit?: number;
}

export interface MultiMetricReportInput {
  controllers: string[];
  metrics: string[];
  filters?: AnalyticsFilterInput;
}

export interface TrendAnalysisInput {
  metricName: string;
  controllerId: string;
  startTime: string;
  endTime: string;
  interval?: string;
}

// Response types for analytics queries
export interface SupportedMetricsResponse {
  getSupportedMetrics: string[];
}

export interface AnalyticsHealthResponse {
  getAnalyticsHealth: AnalyticsHealth;
}

export interface SingleMetricReportResponse {
  getSingleMetricReport: AnalyticsReport;
}

export interface MultiMetricReportResponse {
  getMultiMetricReport: {
    generatedAt: string;
    totalControllers: number;
    totalMetrics: number;
    reports: AnalyticsReport[];
  };
}

export interface TrendAnalysisResponse {
  getTrendAnalysis: TrendAnalysis;
}

// Base GraphQL entity types (aligned with API Gateway schema)
export interface Plant {
  id: string;
  name: string;
  species: string;
  description?: string;
  user_id: string;
  photo_filename?: string;
  created_at: string;
  updated_at: string;
}

export interface Device {
  id: string;
  name: string;
  description?: string;
  version?: string;
  category: 'microcontroller' | 'sensor';
  user_id?: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  profile_photo_url?: string;
  is_active: boolean;
  roles: string[];
  created_at: string;
  updated_at: string;
}

// Plant-related input types
export interface CreatePlantInput {
  name: string;
  species: string;
  description?: string;
  user_id: string;
  photo_filename?: string;
}

export interface UpdatePlantInput {
  name?: string;
  species?: string;
  description?: string;
  photo_filename?: string;
}

export interface PlantFilterInput {
  user_id?: string;
  species?: string;
  name_contains?: string;
  limit?: number;
  offset?: number;
}

// Device-related input types
export interface CreateDeviceInput {
  name: string;
  description?: string;
  version?: string;
  category: 'microcontroller' | 'sensor';
  user_id?: string;
}

export interface UpdateDeviceInput {
  name?: string;
  description?: string;
  version?: string;
  category?: 'microcontroller' | 'sensor';
}

// Plant response types
export interface PlantsResponse {
  plants: Plant[];
  total: number;
  page: number;
  limit: number;
}

export interface PlantResponse {
  plant?: Plant;
}

export interface PlantMutationResponse {
  success: boolean;
  message: string;
  plant?: Plant;
}

export interface PlantDeleteResponse {
  success: boolean;
  message: string;
}

// Device response types
export interface DevicesResponse {
  devices: Device[];
}

export interface DeviceResponse {
  device?: Device;
}

// GraphQL Mutation response types
export interface CreatePlantResponse {
  createPlant: Plant;
}

export interface UpdatePlantResponse {
  updatePlant: Plant;
}

export interface DeletePlantResponse {
  deletePlant: {
    success: boolean;
    message: string;
  };
}

export interface CreateDeviceResponse {
  createDevice: Device;
}

export interface UpdateDeviceResponse {
  updateDevice: Device;
}

export interface DeleteDeviceResponse {
  deleteDevice: {
    success: boolean;
    message: string;
  };
}

export interface AssignDeviceToPlantResponse {
  assignDeviceToPlant: {
    success: boolean;
    message: string;
  };
}

export interface RemoveDeviceFromPlantResponse {
  removeDeviceFromPlant: {
    success: boolean;
    message: string;
  };
}


