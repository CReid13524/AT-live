import type { MapRef } from 'react-map-gl/mapbox';
import { getBusStopLayer, getFerryStopLayer, getTrainStopLayer } from '../layers/stopLayers';
import { GeoJSONSource, Popup } from 'mapbox-gl';
import type { MapMouseEvent } from 'react-map-gl/mapbox-legacy';
import {
  CLICK_TOLERANCE,
  BUS_STOP_LAYER_ID,
  FERRY_STOP_LAYER_ID,
  TRAIN_STOP_LAYER_ID,
  BUS_STOP_SOURCE_ID,
  FERRY_STOP_SOURCE_ID,
  TRAIN_STOP_SOURCE_ID,
  VEHICLE_BUS_POINT_LAYER_ID,
} from '../baseConfig';

export function collectBusStopFeatures(stops: GeoJSON.Feature[]): GeoJSON.Feature[] {
  return stops.map((stop) => {
    return {
      ...stop,
      properties: {
        ...stop.properties,
      }
    }
  });
}

export function collectFerryStopFeatures(stops: GeoJSON.Feature[]): GeoJSON.Feature[] {
  return stops.map((stop) => {
    return {
      ...stop,
      properties: {
        ...stop.properties,
      }
    }
  });
}

export function collectTrainStopFeatures(stops: GeoJSON.Feature[]): GeoJSON.Feature[] {
  return stops.map((stop) => {
    return {
      ...stop,
      properties: {
        ...stop.properties,
      }
    }
  });
}

/* ----------------------- Load Sources ----------------------- */

export function updateStopSource(
  mapRef: React.RefObject<MapRef | null>,
  busStops: GeoJSON.FeatureCollection | null,
  ferryStops: GeoJSON.FeatureCollection | null,
  trainStops: GeoJSON.FeatureCollection | null
) {
  if (!mapRef.current) return;

  const busStopFeatures = collectBusStopFeatures(busStops?.features || []);
  const ferryStopFeatures = collectFerryStopFeatures(ferryStops?.features || []);
  const trainStopFeatures = collectTrainStopFeatures(trainStops?.features || []);

  const busStopGeojson: GeoJSON.FeatureCollection = {
    type: 'FeatureCollection',
    features: busStopFeatures,
  };

  const ferryStopGeojson: GeoJSON.FeatureCollection = {
    type: 'FeatureCollection',
    features: ferryStopFeatures,
  };

  const trainStopGeojson: GeoJSON.FeatureCollection = {
    type: 'FeatureCollection',
    features: trainStopFeatures,
  };

  const stopSource = mapRef.current.getMap().getSource(BUS_STOP_SOURCE_ID) as GeoJSONSource;
  stopSource?.setData(busStopGeojson);

  const ferryStopSource = mapRef.current.getMap().getSource(FERRY_STOP_SOURCE_ID) as GeoJSONSource;
  ferryStopSource?.setData(ferryStopGeojson);

  const trainStopSource = mapRef.current.getMap().getSource(TRAIN_STOP_SOURCE_ID) as GeoJSONSource;
  trainStopSource?.setData(trainStopGeojson);
}

/* ---------------- Cleanup Layers and Sources ---------------- */

export function removeStopLayers(mapRef: React.RefObject<MapRef | null>) {
  if (!mapRef.current) return;

  const map = mapRef.current.getMap();

  [BUS_STOP_LAYER_ID, FERRY_STOP_LAYER_ID, TRAIN_STOP_LAYER_ID].forEach((layerId) => {
    if (map.getLayer(layerId)) {
      map.removeLayer(layerId);
    }
  });
}

export function removeStopSources(mapRef: React.RefObject<MapRef | null>) {
  if (!mapRef.current) return;

  const map = mapRef.current.getMap();

  [BUS_STOP_SOURCE_ID, FERRY_STOP_SOURCE_ID, TRAIN_STOP_SOURCE_ID].forEach((sourceId) => {
    if (map.getSource(sourceId)) {
      map.removeSource(sourceId);
    }
  });
}

/* ----------------- Setup Layers and Sources ----------------- */

export function addStopSources(mapRef: React.RefObject<MapRef | null>) {
  if (!mapRef.current) return;

  const map = mapRef.current.getMap();

  [BUS_STOP_SOURCE_ID, FERRY_STOP_SOURCE_ID, TRAIN_STOP_SOURCE_ID].forEach((sourceId) => {
    if (!map.getSource(sourceId)) {
      map.addSource(sourceId, {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [],
        },
      });
    }
  });
}

export function addStopLayers(mapRef: React.RefObject<MapRef | null>) {
  if (!mapRef.current) return;

  getStopLayers().forEach((layer) => {
    if (!mapRef.current) return;

    if (!mapRef.current.getMap().getLayer(layer.id)) {
      mapRef.current.getMap().addLayer(layer,VEHICLE_BUS_POINT_LAYER_ID);
    }
  });
}

/* ----------------- Setup Events ----------------- */

export function setupStopEvents(mapRef: React.RefObject<MapRef | null>) {
  if (!mapRef.current) return;

  const map = mapRef.current.getMap();

  const onClick = (e: MapMouseEvent) => {

    const features = map.queryRenderedFeatures(e.point,
      {
        layers: [BUS_STOP_LAYER_ID, FERRY_STOP_LAYER_ID, TRAIN_STOP_LAYER_ID],
      }
    ).filter((f) => f.properties?.ROUTEPATTERN);

    if (features.length > 0) {
      const feature = features[0];
      const popupContent = `
        <div>
          ${Object.entries(feature.properties || {}).map(([key, value]) => `
            <div><strong>${key}:</strong> ${value}</div>
          `).join('')}
        </div>
      `;

      new Popup()
        .setLngLat(e.lngLat)
        .setHTML(popupContent)
        .addTo(map);
    }
  }

  map.on('click', [BUS_STOP_LAYER_ID, FERRY_STOP_LAYER_ID, TRAIN_STOP_LAYER_ID], onClick);

  return () => {
    map.off('click', [BUS_STOP_LAYER_ID, FERRY_STOP_LAYER_ID, TRAIN_STOP_LAYER_ID], onClick);
  }
}

/* -------------------------------------------------------------------------- */
/*                               HELPERS                                      */
/* -------------------------------------------------------------------------- */

const getStopLayers = () => {
  return [
    getBusStopLayer(),
    getFerryStopLayer(),
    getTrainStopLayer()
  ];
}

