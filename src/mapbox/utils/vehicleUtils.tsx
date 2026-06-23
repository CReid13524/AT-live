import type { MapRef } from 'react-map-gl/mapbox';
import { getBusFillExtrusionLayer, getBusPointLayer } from '../layers/vehicleLayers';
import type { Vehicle } from '../../types';
import { GeoJSONSource, Popup } from 'mapbox-gl';
import { destination } from "@turf/turf";
import type { MapMouseEvent } from 'react-map-gl/mapbox-legacy';
import { VEHICLE_SOURCE_ID, VEHICLE_POINT_SOURCE_ID, VEHICLE_BUS_LAYER_ID, VEHICLE_BUS_POINT_LAYER_ID } from '../baseConfig';

export function collectBusFeatures(vehiclePositions: Vehicle[]): GeoJSON.Feature[] {
  return vehiclePositions
    .filter(v => v.position && v.position.latitude && v.position.longitude)
    .map((v) => {
      return {
        type: 'Feature',
        geometry: createBusPolygon(
          v.position.longitude,
          v.position.latitude,
          parseFloat(v.position.bearing) || 0
        ),
        properties: {
          id: v.vehicle.id,
          trip: v.trip,
          speed: v.position.speed,
          bearing: v.position.bearing,
          congestion_level: v.congestion_level,
          occupancy_status: v.occupancy_status,
          timestamp: v.timestamp,
        }
      }
    });
}

export function collectBusPointFeatures(vehiclePositions: Vehicle[]): GeoJSON.Feature[] {
  return vehiclePositions
    .filter(v => v.position && v.position.latitude && v.position.longitude)
    .map((v) => {
      return {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [
            v.position.longitude,
            v.position.latitude,
          ],
        },
        properties: {
          id: v.vehicle.id,
          trip: v.trip,
          speed: v.position.speed,
          bearing: v.position.bearing,
          congestion_level: v.congestion_level,
          occupancy_status: v.occupancy_status,
          timestamp: v.timestamp,
        }
      }
    });
}

/* ----------------------- Load Sources ----------------------- */

export function updateVehicleSource(mapRef: React.RefObject<MapRef | null>, vehiclePositions: Vehicle[]) {
  if (!mapRef.current) return;

  const busFeatures = collectBusFeatures(vehiclePositions);
  const busPointFeatures = collectBusPointFeatures(vehiclePositions);

  const busGeojson: GeoJSON.FeatureCollection = {
    type: 'FeatureCollection',
    features: busFeatures,
  };
  const busPointGeojson: GeoJSON.FeatureCollection = {
    type: 'FeatureCollection',
    features: busPointFeatures,
  };

  const busSource = mapRef.current.getMap().getSource(VEHICLE_SOURCE_ID) as GeoJSONSource;
  busSource?.setData(busGeojson);

  const busPointSource = mapRef.current.getMap().getSource(VEHICLE_POINT_SOURCE_ID) as GeoJSONSource;
  busPointSource?.setData(busPointGeojson);
}

/* ---------------- Cleanup Layers and Sources ---------------- */

export function removeVehicleLayers(mapRef: React.RefObject<MapRef | null>) {
  if (!mapRef.current) return;

  const map = mapRef.current.getMap();

  [VEHICLE_BUS_LAYER_ID, VEHICLE_BUS_POINT_LAYER_ID].forEach((layerId) => {
    if (map.getLayer(layerId)) {
      map.removeLayer(layerId);
    }
  });
}

export function removeVehicleSources(mapRef: React.RefObject<MapRef | null>) {
  if (!mapRef.current) return;

  const map = mapRef.current.getMap();

  [VEHICLE_SOURCE_ID, VEHICLE_POINT_SOURCE_ID].forEach((sourceId) => {
    if (map.getSource(sourceId)) {
      map.removeSource(sourceId);
    }
  });
}

/* ----------------- Setup Layers and Sources ----------------- */

export function addVehicleSources(mapRef: React.RefObject<MapRef | null>) {
  if (!mapRef.current) return;

  const map = mapRef.current.getMap();

  if (!map.getSource(VEHICLE_SOURCE_ID)) {
    map.addSource(VEHICLE_SOURCE_ID, {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [],
      },
    });
  }
  if (!map.getSource(VEHICLE_POINT_SOURCE_ID)) {
    map.addSource(VEHICLE_POINT_SOURCE_ID, {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [],
      },
    });
  }
}

export function addVehicleLayers(mapRef: React.RefObject<MapRef | null>) {
  if (!mapRef.current) return;

  getBusLayers().forEach((layer) => {
    if (!mapRef.current) return;

    if (!mapRef.current.getMap().getLayer(layer.id)) {
      mapRef.current.getMap().addLayer(layer);
    }
  });
}

/* ----------------- Setup Events ----------------- */

export function setupVehicleEvents(mapRef: React.RefObject<MapRef | null>) {
  if (!mapRef.current) return;

  const map = mapRef.current.getMap();

  const onClick = (e: MapMouseEvent) => {
    const features = map.queryRenderedFeatures(e.point, {
      layers: [VEHICLE_BUS_POINT_LAYER_ID],
    });

    if (features.length > 0) {
      const feature = features[0];

      const popupContent = `
      <div>
        <strong>Vehicle ID:</strong> ${feature.properties?.id || 'N/A'}<br/>
        <strong>Trip ID:</strong> ${feature.properties?.trip?.trip_id || 'N/A'}<br/>
        <strong>Speed:</strong> ${feature.properties?.speed || 'N/A'} km/h<br/>
        <strong>Bearing:</strong> ${feature.properties?.bearing || 'N/A'}°<br/>
        <strong>Congestion Level:</strong> ${feature.properties?.congestion_level || 'N/A'}<br/>
        <strong>Occupancy Status:</strong> ${feature.properties?.occupancy_status || 'N/A'}<br/>
        <strong>Last Updated:</strong> ${feature.properties?.timestamp ? new Date(feature.properties.timestamp * 1000).toLocaleString() : 'N/A'}
      </div>
    `;

      new Popup()
        .setLngLat(e.lngLat)
        .setHTML(popupContent)
        .addTo(map);
    }
  }

  map.on('click', VEHICLE_BUS_POINT_LAYER_ID, onClick);

  return () => {
    map.off('click', VEHICLE_BUS_POINT_LAYER_ID, onClick);
  }
}

/* -------------------------------------------------------------------------- */
/*                               HELPERS                                      */
/* -------------------------------------------------------------------------- */

const getBusLayers = () => {
  return [
    getBusFillExtrusionLayer(),
    getBusPointLayer(),
  ];
}

function createBusPolygon(
  lng: number,
  lat: number,
  bearing: number
) {
  const center = [lng, lat] as [number, number];

  const halfLength = 4; // 8m bus
  const halfWidth = 0.75;  // 1.5m bus

  const front = destination(center, halfLength, bearing, {
    units: "meters",
  });

  const rear = destination(center, halfLength, bearing + 180, {
    units: "meters",
  });

  const frontLeft = destination(
    front,
    halfWidth,
    bearing - 90,
    { units: "meters" }
  );

  const frontRight = destination(
    front,
    halfWidth,
    bearing + 90,
    { units: "meters" }
  );

  const rearLeft = destination(
    rear,
    halfWidth,
    bearing - 90,
    { units: "meters" }
  );

  const rearRight = destination(
    rear,
    halfWidth,
    bearing + 90,
    { units: "meters" }
  );

  return {
    type: "Polygon",
    coordinates: [[
      frontLeft.geometry.coordinates,
      frontRight.geometry.coordinates,
      rearRight.geometry.coordinates,
      rearLeft.geometry.coordinates,
      frontLeft.geometry.coordinates,
    ]]
  } as GeoJSON.Polygon;
}
