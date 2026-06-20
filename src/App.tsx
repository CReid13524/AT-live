import { useEffect, useRef, useState } from "react";
import type { MapRef } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { type TripUpdate, type Vehicle, type Alert, type MapStyleType, MapStyle, type timeOfDayType, TimeOfDay } from "./types";
import { fetchCombinedFeed } from "./fetchUtils";
import MapboxManager from "./mapboxManager";
import MapControl from "./components/MapControl";
import { FaMap } from "react-icons/fa";

export default function App() {
  const mapRef = useRef<MapRef | null>(null);
  const [tripUpdates, setTripUpdates] = useState<TripUpdate[]>([]);
  const [vehiclePositions, setVehiclePositions] = useState<Vehicle[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [stylePanelOpen, setStylePanelOpen] = useState(false);

  // Map Style Management
  const [mapStyle, setMapStyle] = useState<MapStyleType>(MapStyle.Standard);
  const [timeOfDay, setTimeOfDay] = useState<timeOfDayType>(TimeOfDay.Day);
  const [poiLabelVisible, setPOILabelVisible] = useState(true);
  const [roadLabelVisible, setRoadLabelVisible] = useState(true);
  const [placeLabelVisible, setPlaceLabelVisible] = useState(true);
  const [transitLabelVisible, setTransitLabelVisible] = useState(true);

  useEffect(() => {
    fetchData();
  }, [])

  const fetchData = async () => {
    let tripUpdates: TripUpdate[];
    let vehiclePositions: Vehicle[];
    let alerts: Alert[];

    const combinedFeed = await fetchCombinedFeed();

    if (!combinedFeed || !combinedFeed.entity) return;

    tripUpdates = combinedFeed.entity
      .map((e) => ((e as any).tripUpdate ?? (e as any).trip_update))
      .filter(Boolean) as TripUpdate[];
    vehiclePositions = combinedFeed.entity
      .map((e) => ((e as any).vehiclePosition ?? (e as any).vehicle ?? (e as any).vehicle_position))
      .filter(Boolean) as Vehicle[];
    alerts = combinedFeed.entity
      .map((e) => ((e as any).alert ?? (e as any).alerts))
      .filter(Boolean) as Alert[];

    setTripUpdates(tripUpdates);
    setVehiclePositions(vehiclePositions);
    setAlerts(alerts);

  }

  return (
    <div className="map">
      <div className="map-control">
        <button
          className="map-button"
          onClick={() => setStylePanelOpen(v => !v)}
        >
          <FaMap />
        </button>

        <MapControl
          open={stylePanelOpen}
          mapStyle={mapStyle}
          setMapStyle={setMapStyle}
          timeOfDay={timeOfDay}
          setTimeOfDay={setTimeOfDay}
          poiLabelVisible={poiLabelVisible}
          setPOILabelVisible={setPOILabelVisible}
          roadLabelVisible={roadLabelVisible}
          setRoadLabelVisible={setRoadLabelVisible}
          placeLabelVisible={placeLabelVisible}
          setPlaceLabelVisible={setPlaceLabelVisible}
          transitLabelVisible={transitLabelVisible}
          setTransitLabelVisible={setTransitLabelVisible}
        />
      </div>
      <MapboxManager
        mapRef={mapRef}
        vehiclePositions={vehiclePositions}
        mapStyle={mapStyle}
        timeOfDay={timeOfDay}
        poiLabelVisible={poiLabelVisible}
        roadLabelVisible={roadLabelVisible}
        placeLabelVisible={placeLabelVisible}
        transitLabelVisible={transitLabelVisible}
      />
    </div>
  );
}
