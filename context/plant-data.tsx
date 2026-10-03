import { PropsWithChildren, createContext, useContext, useState } from "react";

export type SensorReading = {
  healthy: number;
  needsCare: number;
  critical: number;
  overallHealth: number;
  soilMoisture: number;
  soilPh: number;
  temperature: number;
  recentAlerts: number;
  updatedAt: Date | null;
  connected: boolean;
  mode: "manual" | "iot";
};

const defaultReading: SensorReading = {
  healthy: 0,
  needsCare: 0,
  critical: 0,
  overallHealth: 0,
  soilMoisture: 0,
  soilPh: 0,
  temperature: 0,
  recentAlerts: 0,
  updatedAt: null,
  connected: false,
  mode: "manual",
};

const PlantDataContext = createContext<SensorReading>(defaultReading);

export function PlantDataProvider({ children }: PropsWithChildren) {
  const [reading] = useState(defaultReading);
  return <PlantDataContext.Provider value={reading}>{children}</PlantDataContext.Provider>;
}

export function usePlantData() {
  return useContext(PlantDataContext);
}
