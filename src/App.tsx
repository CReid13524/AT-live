import { useEffect, useRef, useState } from "react";
import Map from "react-map-gl";
import type { MapRef } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import type { TripUpdate, VehiclePosition, Alert, Entity } from "./types";
import { fetchCombinedFeed } from "./fetchUtils";

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
    console.log("Combined Feed:", combinedFeed);

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

    console.log("Trip Updates:", tripUpdates, "Vehicle Positions:", vehiclePositions, "Alerts:", alerts);
  }

  return (
    <div className="map">
      <Map
        ref={mapRef}
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
        initialViewState={{
          longitude: 174.7633,
          latitude: -36.8485,
          zoom: 11,
        }}
        mapStyle="mapbox://styles/mapbox/dark-v11"
      />
    </div>
  );
}
