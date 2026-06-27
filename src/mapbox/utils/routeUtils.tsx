import type { MapRef } from 'react-map-gl/mapbox';
import {
  getBusRouteLineLayer,
  getFerryRouteLineLayer,
  getTrainRouteLineLayer,
} from '../layers/routeLayers';
import { GeoJSONSource, Popup } from 'mapbox-gl';
import type { MapMouseEvent } from 'react-map-gl/mapbox-legacy';
import {
  CLICK_TOLERANCE,
  BUS_ROUTE_LAYER_ID,
  BUS_ROUTE_SOURCE_ID,
  FERRY_ROUTE_LAYER_ID,
  FERRY_ROUTE_SOURCE_ID,
  TRAIN_ROUTE_LAYER_ID,
  TRAIN_ROUTE_SOURCE_ID,
  TRAIN_STOP_LAYER_ID,
} from '../baseConfig';

export function collectBusRouteFeatures(routes: GeoJSON.Feature[]): GeoJSON.Feature[] {
  return routes.map((route) => {
    return {
      ...route,
      properties: {
        ...route.properties,
      }
    }
  });
}

export function collectFerryRouteFeatures(routes: GeoJSON.Feature[]): GeoJSON.Feature[] {
  return routes.map((route) => {
    return {
      ...route,
      properties: {
        ...route.properties,
      }
    }
  });
}

export function collectTrainRouteFeatures(routes: GeoJSON.Feature[]): GeoJSON.Feature[] {
  return routes.map((route) => {
    return {
      ...route,
      properties: {
        ...route.properties,
      }
    }
  });
}

/* ----------------------- Load Sources ----------------------- */

export function updateRouteSource(
  mapRef: React.RefObject<MapRef | null>,
  busRoutes: GeoJSON.FeatureCollection | null,
  ferryRoutes: GeoJSON.FeatureCollection | null,
  trainRoutes: GeoJSON.FeatureCollection | null
) {
  if (!mapRef.current) return;

  const busRouteFeatures = collectBusRouteFeatures(busRoutes?.features || []);
  const ferryRouteFeatures = collectFerryRouteFeatures(ferryRoutes?.features || []);
  const trainRouteFeatures = collectTrainRouteFeatures(trainRoutes?.features || []);

  const busRouteGeojson: GeoJSON.FeatureCollection = {
    type: 'FeatureCollection',
    features: busRouteFeatures,
  };

  const ferryRouteGeojson: GeoJSON.FeatureCollection = {
    type: 'FeatureCollection',
    features: ferryRouteFeatures,
  };

  const trainRouteGeojson: GeoJSON.FeatureCollection = {
    type: 'FeatureCollection',
    features: trainRouteFeatures,
  };

  const busRouteSource = mapRef.current.getMap().getSource(BUS_ROUTE_SOURCE_ID) as GeoJSONSource;
  busRouteSource?.setData(busRouteGeojson);

  const ferryRouteSource = mapRef.current.getMap().getSource(FERRY_ROUTE_SOURCE_ID) as GeoJSONSource;
  ferryRouteSource?.setData(ferryRouteGeojson);

  const trainRouteSource = mapRef.current.getMap().getSource(TRAIN_ROUTE_SOURCE_ID) as GeoJSONSource;
  trainRouteSource?.setData(trainRouteGeojson);
}

/* ---------------- Cleanup Layers and Sources ---------------- */

export function removeRouteLayers(mapRef: React.RefObject<MapRef | null>) {
  if (!mapRef.current) return;

  const map = mapRef.current.getMap();

  [BUS_ROUTE_LAYER_ID, FERRY_ROUTE_LAYER_ID, TRAIN_ROUTE_LAYER_ID].forEach((layerId) => {
    if (map.getLayer(layerId)) {
      map.removeLayer(layerId);
    }
  });
}

export function removeRouteSources(mapRef: React.RefObject<MapRef | null>) {
  if (!mapRef.current) return;

  const map = mapRef.current.getMap();

  [BUS_ROUTE_SOURCE_ID, FERRY_ROUTE_SOURCE_ID, TRAIN_ROUTE_SOURCE_ID].forEach((sourceId) => {
    if (map.getSource(sourceId)) {
      map.removeSource(sourceId);
    }
  });
}

/* ----------------- Setup Layers and Sources ----------------- */

export function addRouteSources(mapRef: React.RefObject<MapRef | null>) {
  if (!mapRef.current) return;

  const map = mapRef.current.getMap();

  [BUS_ROUTE_SOURCE_ID, FERRY_ROUTE_SOURCE_ID, TRAIN_ROUTE_SOURCE_ID].forEach((sourceId) => {
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

export function addRouteLayers(mapRef: React.RefObject<MapRef | null>) {
  if (!mapRef.current) return;

  getRouteLayers().forEach((layer) => {
    if (!mapRef.current) return;

    if (!mapRef.current.getMap().getLayer(layer.id)) {
      mapRef.current.getMap().addLayer(layer,TRAIN_STOP_LAYER_ID);
    }
  });
}

/* ----------------- Setup Events ----------------- */

export function setupRouteEvents(mapRef: React.RefObject<MapRef | null>) {
  if (!mapRef.current) return;

  const map = mapRef.current.getMap();

  const onClick = (e: MapMouseEvent) => {

    const features = map.queryRenderedFeatures(
      [
        [e.point.x - CLICK_TOLERANCE, e.point.y - CLICK_TOLERANCE],
        [e.point.x + CLICK_TOLERANCE, e.point.y + CLICK_TOLERANCE],
      ],
      {
        layers: [BUS_ROUTE_LAYER_ID, FERRY_ROUTE_LAYER_ID, TRAIN_ROUTE_LAYER_ID],
      }
    ).filter((f) => f.properties?.ROUTEPATTERN);

    if (features.length > 0) {
      const feature = features[0];
      let popupContent = '';

      if (features.length > 1) {
        popupContent = `
          <div>
            <strong>${features.length} routes:</strong>
            <ul>
              ${features.map((f) => `
                <li>
                  ${Object.entries(f.properties || {}).map(([key, value]) => `
                    <div><strong>${key}:</strong> ${value}</div>
                  `).join('')}
                </li>
              `).join('')}
            </ul>
          </div>
        `;

      } else {

        popupContent = `
          <div>
            ${Object.entries(feature.properties || {}).map(([key, value]) => `
              <div><strong>${key}:</strong> ${value}</div>
            `).join('')}
          </div>
        `;
      }

      new Popup()
        .setLngLat(e.lngLat)
        .setHTML(popupContent)
        .addTo(map);
    }
  }

  [BUS_ROUTE_LAYER_ID, FERRY_ROUTE_LAYER_ID, TRAIN_ROUTE_LAYER_ID].forEach((layerId) => {
    map.on('click', layerId, onClick);
  });

  return () => {
    [BUS_ROUTE_LAYER_ID, FERRY_ROUTE_LAYER_ID, TRAIN_ROUTE_LAYER_ID].forEach((layerId) => {
      map.off('click', layerId, onClick);
    });
  }
}

/* -------------------------------------------------------------------------- */
/*                               HELPERS                                      */
/* -------------------------------------------------------------------------- */

const getRouteLayers = () => {
  return [
    getBusRouteLineLayer(),
    getFerryRouteLineLayer(),
    getTrainRouteLineLayer(),
  ];
}

