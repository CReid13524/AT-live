import { useEffect, useRef, useState } from "react";
import type { MapRef } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { type TripUpdate, type Vehicle, type Alert } from "./types/at-dev-types";
import { MapStyle, TimeOfDay, VEHICLE_LAYER_CONTROLS, STOP_LAYER_CONTROLS, ROUTE_LAYER_CONTROLS, type MapAppearance, type StaticFeatureCollections, type AppContextType } from "./types/types";
import { fetchCombinedFeed, fetchBusRoutes, fetchBusStops, fetchFerryRoutes, fetchFerryStops, fetchTrainRoutes, fetchTrainStops } from "./utils/fetchUtils";
import { AppContext } from "./utils/contextUtils";
import MapboxManager from "./components/mapboxManager";
import MapControl from "./components/MapControl";

export default function App() {
  const mapRef = useRef<MapRef | null>(null);
  const mapboxManagerRef = useRef<{ applyLayerControls: () => void } | null>(null);
  const [tripUpdates, setTripUpdates] = useState<TripUpdate[]>([]);
  const [vehiclePositions, setVehiclePositions] = useState<Vehicle[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const [appearance, setAppearance] = useState<MapAppearance>({
    style: MapStyle.Dark,
    timeOfDay: TimeOfDay.Day,
    labels: {
      poi: true,
      roads: true,
      places: true,
      transit: true
    }
  });

  const [staticLayers, setStaticLayers] = useState<StaticFeatureCollections>({
    busRoutes: { type: "FeatureCollection", features: [] },
    busStops: { type: "FeatureCollection", features: [] },
    ferryRoutes: { type: "FeatureCollection", features: [] },
    ferryStops: { type: "FeatureCollection", features: [] },
    trainRoutes: { type: "FeatureCollection", features: [] },
    trainStations: { type: "FeatureCollection", features: [] }
  });

  const layerControls = {
    vehicles: useRef(VEHICLE_LAYER_CONTROLS),
    stops: useRef(STOP_LAYER_CONTROLS),
    routes: useRef(ROUTE_LAYER_CONTROLS)
  };

  const fetchBusRoutesData = async () => {
    const busRoutesData = await fetchBusRoutes();
    setStaticLayers(prev => ({ ...prev, busRoutes: busRoutesData }));
  }
  const fetchBusStopsData = async () => {
    const busStopsData = await fetchBusStops();
    setStaticLayers(prev => ({ ...prev, busStops: busStopsData }));
  }
  const fetchFerryRoutesData = async () => {
    const ferryRoutesData = await fetchFerryRoutes();
    setStaticLayers(prev => ({ ...prev, ferryRoutes: ferryRoutesData }));
  }
  const fetchFerryStopsData = async () => {
    const ferryStopsData = await fetchFerryStops();
    setStaticLayers(prev => ({ ...prev, ferryStops: ferryStopsData }));
  }
  const fetchTrainRoutesData = async () => {
    const trainRoutesData = await fetchTrainRoutes();
    setStaticLayers(prev => ({ ...prev, trainRoutes: trainRoutesData }));
  }
  const fetchTrainStationsData = async () => {
    const trainStationsData = await fetchTrainStops();
    setStaticLayers(prev => ({ ...prev, trainStations: trainStationsData }));
  }

  const fetchCombinedData = async () => {
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

  const contextObject: AppContextType = {
    tripUpdates,
    vehiclePositions,
    alerts,
  };

  // Initial load + polling
  useEffect(() => {
    // Initial load
    fetchBusRoutesData();
    fetchBusStopsData();
    fetchFerryRoutesData();
    fetchFerryStopsData();
    fetchTrainRoutesData();
    fetchTrainStationsData();
    fetchCombinedData();

    // Poll combined feed every 5 seconds
    const id = setInterval(() => {
      fetchCombinedData();
    }, 5000);

    return () => clearInterval(id);
  }, []);

  return (
    <AppContext.Provider value={contextObject}>
      <div className="main-content">
        <MapControl
          appearance={appearance}
          setAppearance={setAppearance}
          layerControls={layerControls}
          layerControlRefresh={() => {
            mapboxManagerRef.current?.applyLayerControls();
          }}
        />

        <MapboxManager
          ref={mapboxManagerRef}
          mapRef={mapRef}
          appearance={appearance}
          staticLayers={staticLayers}
          layerControls={layerControls}
        />
      </div>
    </AppContext.Provider>
  );
}
