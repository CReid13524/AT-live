import { useEffect, useRef, useState } from "react";
import Map from "react-map-gl";
import type { MapRef } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import type { TripUpdate, VehiclePosition, Alert } from "./types";
import { fetchCombinedFeed } from "./fetchUtils";
import MapboxManager from "./mapboxManager";

export default function App() {
  const mapRef = useRef<MapRef | null>(null);
  const [tripUpdates, setTripUpdates] = useState<TripUpdate[]>([]);
  const [vehiclePositions, setVehiclePositions] = useState<VehiclePosition[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    fetchData();
  }, [])

  const fetchData = async () => {
    let tripUpdates: TripUpdate[];
    let vehiclePositions: VehiclePosition[];
    let alerts: Alert[];

    const combinedFeed = await fetchCombinedFeed();

    if (!combinedFeed || !combinedFeed.entity) return;

    tripUpdates = combinedFeed.entity
      .map((e) => ((e as any).tripUpdate ?? (e as any).trip_update))
      .filter(Boolean) as TripUpdate[];
    vehiclePositions = combinedFeed.entity
      .map((e) => ((e as any).vehiclePosition ?? (e as any).vehicle ?? (e as any).vehicle_position))
      .filter(Boolean) as VehiclePosition[];
    alerts = combinedFeed.entity
      .map((e) => ((e as any).alert ?? (e as any).alerts))
      .filter(Boolean) as Alert[];

    setTripUpdates(tripUpdates);
    setVehiclePositions(vehiclePositions);
    setAlerts(alerts);
  }

  return (
    <div className="map">
      <MapboxManager mapRef={mapRef} />
    </div>
  );
}
