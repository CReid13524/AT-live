import type { Alert, TripUpdate, Vehicle } from './at-dev-types';
import type { BusStop, BusRoute, FerryStop, FerryRoute, TrainStop, TrainRoute } from './at-gis-types';

export interface MapAppearance {
  style: MapStyleType;
  timeOfDay: TimeOfDayType;
  labels: {
      poi: boolean;
      roads: boolean;
      places: boolean;
      transit: boolean;
  };
}

export interface StaticFeatureCollections {
  busRoutes: GeoJSON.FeatureCollection<GeoJSON.LineString, BusRoute>;
  busStops: GeoJSON.FeatureCollection<GeoJSON.Point, BusStop>;
  ferryRoutes: GeoJSON.FeatureCollection<GeoJSON.LineString, FerryRoute>;
  ferryStops: GeoJSON.FeatureCollection<GeoJSON.Point, FerryStop>;
  trainRoutes: GeoJSON.FeatureCollection<GeoJSON.LineString, TrainRoute>;
  trainStations: GeoJSON.FeatureCollection<GeoJSON.Point, TrainStop>;
}

export interface LayerControls {
  vehicles: React.RefObject<LayerFilter>;
  stops: React.RefObject<LayerFilter>;
  routes: React.RefObject<LayerFilter>;
}

export type AppContextType = {
  tripUpdates: TripUpdate[];
  vehiclePositions: Vehicle[];
  alerts: Alert[];
};

export const MapStyle = {
  Standard: "mapbox://styles/mapbox/standard",
  Light: "mapbox://styles/mapbox/light-v11",
  Dark: "mapbox://styles/mapbox/dark-v11",
  Satellite: "mapbox://styles/mapbox/satellite-streets-v12",
  NavLight: "mapbox://styles/mapbox/navigation-day-v1",
  NavDark: "mapbox://styles/mapbox/navigation-night-v1",
};

export const TimeOfDay = {
  Day: 'day',
  Dusk: 'dusk',
  Night: 'night'
};



export type LayerFilter = {
  [layerId: string]: boolean;
};

export const VEHICLE_LAYER_CONTROLS: LayerFilter = {
  Vehicle: true,
}

export const STOP_LAYER_CONTROLS = {
  Bus: true,
  Ferry: true,
  Train: true
}

export const ROUTE_LAYER_CONTROLS: LayerFilter = {
  Bus: true,
  Ferry: true,
  Train: true
}

export type TimeOfDayType = (typeof TimeOfDay)[keyof typeof TimeOfDay];

export type MapStyleType = (typeof MapStyle)[keyof typeof MapStyle];
