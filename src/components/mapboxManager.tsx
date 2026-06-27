import Map from "react-map-gl/mapbox";
import type { MapRef } from "react-map-gl/mapbox";
import { useEffect, useRef, useCallback, forwardRef, useImperativeHandle, useContext } from "react";
import type { LayerControls, MapAppearance, StaticFeatureCollections } from "../types/types";
import {
  addVehicleLayers,
  updateVehicleSource,
  setupVehicleEvents,
  removeVehicleLayers,
  removeVehicleSources,
  addVehicleSources
} from "../mapbox/utils/vehicleUtils";
import {
  addRouteLayers,
  addRouteSources,
  removeRouteLayers,
  removeRouteSources,
  setupRouteEvents,
  updateRouteSource
} from "../mapbox/utils/routeUtils";
import {
  addStopLayers,
  addStopSources,
  removeStopLayers,
  removeStopSources,
  setupStopEvents,
  updateStopSource
} from "../mapbox/utils/stopUtils";
import { VEHICLE_LAYER_ID_BY_CONTROL, STOP_LAYER_ID_BY_CONTROL, ROUTE_LAYER_ID_BY_CONTROL } from "../mapbox/utils/utils";
import { AppContext } from "../utils/contextUtils";

type MapboxManagerProps = {
  mapRef: React.RefObject<MapRef | null>;
  appearance: MapAppearance;
  staticLayers: StaticFeatureCollections;
  layerControls: LayerControls;
}

const MapboxManager = forwardRef<any, MapboxManagerProps>((props, ref) => {
  const {
    mapRef,
    appearance,
    staticLayers,
    layerControls: {
      vehicles: vehicleLayerControls,
      stops: stopLayerControls,
      routes: routeLayerControls
    }
  } = props;

  // Cleanup const
  const cleanupVehicleEventsRef = useRef<(() => void) | undefined>(undefined);
  const cleanupRouteEventsRef = useRef<(() => void) | undefined>(undefined);
  const cleanupStopEventsRef = useRef<(() => void) | undefined>(undefined);
  const eventSetupRef = useRef<boolean>(false);

  const {
    vehiclePositions,
  } = useContext(AppContext);

  /* ----------------------- Source and Layer Management ----------------------- */

  const updateSources = useCallback(() => {
    if (!mapRef.current) return;

    updateVehicleSource(mapRef, vehiclePositions);
    updateRouteSource(mapRef, staticLayers.busRoutes, staticLayers.ferryRoutes, staticLayers.trainRoutes);
    updateStopSource(mapRef, staticLayers.busStops, staticLayers.ferryStops, staticLayers.trainStations);

  }, [mapRef, vehiclePositions, staticLayers]);

  const updateSourcesRef = useRef(updateSources);


  const setupEvents = useCallback(() => {
    if (!mapRef.current) return;

    cleanupEvents();

    cleanupVehicleEventsRef.current = setupVehicleEvents(mapRef);
    cleanupRouteEventsRef.current = setupRouteEvents(mapRef);
    cleanupStopEventsRef.current = setupStopEvents(mapRef);

    eventSetupRef.current = true;
  }, [mapRef]);

  const setupLayers = useCallback(() => {
    if (!mapRef.current) return;

    // Priority order
    addVehicleLayers(mapRef);
    addStopLayers(mapRef);
    addRouteLayers(mapRef);

  }, [mapRef]);

  const setupSources = useCallback(() => {
    if (!mapRef.current) return;

    addVehicleSources(mapRef);
    addRouteSources(mapRef);
    addStopSources(mapRef);

  }, [mapRef]);

  const cleanupEvents = useCallback(() => {
    cleanupVehicleEventsRef.current?.();
    cleanupRouteEventsRef.current?.();
    cleanupStopEventsRef.current?.();

    eventSetupRef.current = false;
  }, []);

  const applyLayerControls = useCallback(() => {
    if (!mapRef.current) return;
    const map = mapRef.current.getMap();

    // Apply vehicle layer controls
    if (vehicleLayerControls?.current) {
      Object.entries(vehicleLayerControls.current).forEach(([controlId, isVisible]) => {
        VEHICLE_LAYER_ID_BY_CONTROL[controlId as keyof typeof VEHICLE_LAYER_ID_BY_CONTROL]?.forEach((layerId) => {
          if (map.getLayer(layerId)) {
            map.setLayoutProperty(layerId, 'visibility', isVisible ? 'visible' : 'none');
          }
        });
      });
    }

    // Apply stop layer controls
    if (stopLayerControls?.current) {
      Object.entries(stopLayerControls.current).forEach(([controlId, isVisible]) => {
        STOP_LAYER_ID_BY_CONTROL[controlId as keyof typeof STOP_LAYER_ID_BY_CONTROL]?.forEach((layerId) => {
          if (map.getLayer(layerId)) {
            map.setLayoutProperty(layerId, 'visibility', isVisible ? 'visible' : 'none');
          }
        });
      });
    }

    // Apply route layer controls
    if (routeLayerControls?.current) {
      Object.entries(routeLayerControls.current).forEach(([controlId, isVisible]) => {
        ROUTE_LAYER_ID_BY_CONTROL[controlId as keyof typeof ROUTE_LAYER_ID_BY_CONTROL]?.forEach((layerId) => {
          if (map.getLayer(layerId)) {
            map.setLayoutProperty(layerId, 'visibility', isVisible ? 'visible' : 'none');
          }
        });
      });
    }
  }, [mapRef, vehicleLayerControls, stopLayerControls, routeLayerControls]);

  const applyMapConfig = useCallback(() => {
    if (!mapRef.current) return;

    const apply = () => {
      if (!mapRef.current) return;
      const map = mapRef.current.getMap();

      map.setConfigProperty('basemap', 'lightPreset', appearance.timeOfDay);
      map.setConfigProperty('basemap', 'showPointOfInterestLabels', appearance.labels.poi);
      map.setConfigProperty('basemap', 'showRoadLabels', appearance.labels.roads);
      map.setConfigProperty('basemap', 'showPlaceLabels', appearance.labels.places);
      map.setConfigProperty('basemap', 'showTransitLabels', appearance.labels.transit);
    };

    if (mapRef.current.getMap().isStyleLoaded()) {
      apply();
    } else {
      mapRef.current.getMap().once('idle', apply);
    }

  }, [mapRef, appearance]);
  /* ----------------------- Map Initialization and Style Load Handling ----------------------- */

  const styleLoadHandler = useCallback(() => {
    if (!mapRef.current) return;
    const map = mapRef.current.getMap();

    setupSources();
    setupLayers();

    const runAfterIdle = () => {
      updateSourcesRef.current();
      setupEvents();
      applyLayerControls();
      applyMapConfig();
    };

    // Ensure updates and config are applied after the style and sources finish loading
    map.once('idle', runAfterIdle);
  }, [setupSources, setupLayers, setupEvents, applyMapConfig, applyLayerControls, mapRef]);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current.getMap();

    if (map.isStyleLoaded()) {
      styleLoadHandler();
    } else {
      map.once('idle', styleLoadHandler);
    }

    map.off('style.load', styleLoadHandler);
    map.on('style.load', styleLoadHandler);

    return () => {
      map.off('style.load', styleLoadHandler);

      cleanupEvents();

      removeVehicleLayers(mapRef)
      removeVehicleSources(mapRef);
      removeRouteLayers(mapRef);
      removeRouteSources(mapRef);
      removeStopLayers(mapRef);
      removeStopSources(mapRef);
    }
  }, [mapRef, styleLoadHandler]);

  /* ----------------------- State Updates ----------------------- */

  useEffect(() => {
    updateSources();
    updateSourcesRef.current = updateSources;
  }, [updateSources]);


  useEffect(() => { // Update map styles
    if (!mapRef.current) return;

    applyMapConfig();

  }, [mapRef, appearance, applyMapConfig]);

  useEffect(() => { // Apply layer controls
    applyLayerControls();
  }, [applyLayerControls]);

  /* --------------------------- Imperative Handle ----------------------- */

  useImperativeHandle(ref, () => ({
    applyLayerControls,
  }), [applyLayerControls]);

/* ----------------------- Render Map Component ----------------------- */

  return (
    <Map
      ref={mapRef}
      mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
      initialViewState={{
        longitude: 174.7633,
        latitude: -36.8485,
        zoom: 11,
      }}
      onLoad={() => {
        styleLoadHandler();
      }}
      mapStyle={appearance.style}
    />
  )
})

export default MapboxManager;

