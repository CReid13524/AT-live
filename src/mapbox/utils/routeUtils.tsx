import type { MapRef } from 'react-map-gl/mapbox';
import { getRouteLineLayer, getRouteOutlineLayer } from '../layers/routeLayers';
import { GeoJSONSource, Popup } from 'mapbox-gl';
import type { MapMouseEvent } from 'react-map-gl/mapbox-legacy';
import { ROUTE_SOURCE_ID, CLICK_TOLERANCE, ROUTE_LAYER_ID } from '../baseConfig';

export function collectRouteFeatures(routes: GeoJSON.Feature[]): GeoJSON.Feature[] {
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

export function updateRouteSource(mapRef: React.RefObject<MapRef | null>, routes: GeoJSON.FeatureCollection) {
  if (!mapRef.current) return;

  const routeFeatures = collectRouteFeatures(routes.features);

  const routeGeojson: GeoJSON.FeatureCollection = {
    type: 'FeatureCollection',
    features: routeFeatures,
  };

  const routeSource = mapRef.current.getMap().getSource(ROUTE_SOURCE_ID) as GeoJSONSource;
  routeSource?.setData(routeGeojson);
}

/* ---------------- Cleanup Layers and Sources ---------------- */

export function removeRouteLayers(mapRef: React.RefObject<MapRef | null>) {
  if (!mapRef.current) return;

  const map = mapRef.current.getMap();

  [ROUTE_LAYER_ID].forEach((layerId) => {
    if (map.getLayer(layerId)) {
      map.removeLayer(layerId);
    }
  });
}

export function removeRouteSources(mapRef: React.RefObject<MapRef | null>) {
  if (!mapRef.current) return;

  const map = mapRef.current.getMap();

  [ROUTE_SOURCE_ID].forEach((sourceId) => {
    if (map.getSource(sourceId)) {
      map.removeSource(sourceId);
    }
  });
}

/* ----------------- Setup Layers and Sources ----------------- */

export function addRouteSources(mapRef: React.RefObject<MapRef | null>) {
  if (!mapRef.current) return;

  const map = mapRef.current.getMap();

  if (!map.getSource(ROUTE_SOURCE_ID)) {
    map.addSource(ROUTE_SOURCE_ID, {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [],
      },
    });
  }
}

export function addRouteLayers(mapRef: React.RefObject<MapRef | null>) {
  if (!mapRef.current) return;

  getRouteLayers().forEach((layer) => {
    if (!mapRef.current) return;

    if (!mapRef.current.getMap().getLayer(layer.id)) {
      mapRef.current.getMap().addLayer(layer);
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
        layers: [ROUTE_LAYER_ID],
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
                <li>${f.properties?.ROUTENAME || 'Unnamed'}</li>
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

  map.on('click', ROUTE_LAYER_ID, onClick);

  return () => {
    map.off('click', ROUTE_LAYER_ID, onClick);
  }
}

/* -------------------------------------------------------------------------- */
/*                               HELPERS                                      */
/* -------------------------------------------------------------------------- */

const getRouteLayers = () => {
  return [
    getRouteLineLayer(),
    getRouteOutlineLayer()
  ];
}

