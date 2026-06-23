import Map from "react-map-gl/mapbox";
import type { MapRef } from "react-map-gl/mapbox";
import { useEffect, useRef, useCallback } from "react";
import type { MapStyleType, timeOfDayType, Vehicle } from "./types";
import { addVehicleLayers, updateVehicleSource, setupVehicleEvents, removeVehicleLayers, removeVehicleSources, addVehicleSources } from "./mapbox/utils/vehicleUtils";
import { addRouteLayers, addRouteSources, removeRouteSources, setupRouteEvents, updateRouteSource } from "./mapbox/utils/routeUtils";

type MapboxManagerProps = {
  mapRef: React.RefObject<MapRef | null>;
  vehiclePositions: Vehicle[];
  mapStyle: MapStyleType;
  timeOfDay: timeOfDayType;
  poiLabelVisible: boolean;
  roadLabelVisible: boolean;
  placeLabelVisible: boolean;
  transitLabelVisible: boolean;
  routeGeoJson: GeoJSON.FeatureCollection;
}

function MapboxManager(props: MapboxManagerProps) {
  const {
    mapRef,
    vehiclePositions,
    mapStyle,
    timeOfDay,
    poiLabelVisible,
    roadLabelVisible,
    placeLabelVisible,
    transitLabelVisible,
    routeGeoJson
  } = props;

  // Cleanup const
  const cleanupVehicleEventsRef = useRef<(() => void) | undefined>(undefined);
  const cleanupRouteEventsRef = useRef<(() => void) | undefined>(undefined);
  const eventSetupRef = useRef<boolean>(false);

  /* ----------------------- Source and Layer Management ----------------------- */

  const updateSources = useCallback(() => {
    if (!mapRef.current) return;

    updateVehicleSource(mapRef, vehiclePositions);
    updateRouteSource(mapRef, routeGeoJson);

  }, [mapRef, vehiclePositions, routeGeoJson]);

  const updateSourcesRef = useRef(updateSources);


  const setupEvents = useCallback(() => {
    if (!mapRef.current) return;

    cleanupEvents();

    cleanupVehicleEventsRef.current = setupVehicleEvents(mapRef);
    cleanupRouteEventsRef.current = setupRouteEvents(mapRef)

    eventSetupRef.current = true;
  }, [mapRef]);

  const setupLayers = useCallback(() => {
    if (!mapRef.current) return;

    addVehicleLayers(mapRef);
    addRouteLayers(mapRef)
  }, [mapRef]);

  const setupSources = useCallback(() => {
    if (!mapRef.current) return;

    addVehicleSources(mapRef);
    addRouteSources(mapRef)
  }, [mapRef]);

  const cleanupEvents = useCallback(() => {
    cleanupVehicleEventsRef.current?.();
    cleanupRouteEventsRef.current?.();
    eventSetupRef.current = false;
  }, []);

  const applyMapConfig = useCallback(() => {
    if (!mapRef.current) return;

    const apply = () => {
      if (!mapRef.current) return;
      const map = mapRef.current.getMap();

      map.setConfigProperty('basemap', 'lightPreset', timeOfDay);
      map.setConfigProperty('basemap', 'showPointOfInterestLabels', poiLabelVisible);
      map.setConfigProperty('basemap', 'showRoadLabels', roadLabelVisible);
      map.setConfigProperty('basemap', 'showPlaceLabels', placeLabelVisible);
      map.setConfigProperty('basemap', 'showTransitLabels', transitLabelVisible);
    };

    if (mapRef.current.getMap().isStyleLoaded()) {
      apply();
    } else {
      mapRef.current.getMap().once('idle', apply);
    }

  }, [mapRef, timeOfDay, poiLabelVisible, placeLabelVisible, roadLabelVisible, transitLabelVisible]);

  /* ----------------------- Map Initialization and Style Load Handling ----------------------- */

  const styleLoadHandler = useCallback(() => {
    if (!mapRef.current) return;
    const map = mapRef.current.getMap();

    setupSources();
    setupLayers();

    const runAfterIdle = () => {
      updateSourcesRef.current();
      setupEvents();
      applyMapConfig();
    };

    // Ensure updates and config are applied after the style and sources finish loading
    map.once('idle', runAfterIdle);
  }, [setupSources, setupLayers, setupEvents, applyMapConfig, mapRef]);

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
      removeVehicleLayers(mapRef);
      removeRouteSources(mapRef);
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

  }, [mapStyle, timeOfDay, poiLabelVisible, placeLabelVisible, roadLabelVisible, transitLabelVisible, applyMapConfig]);

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
      mapStyle={mapStyle}
    />
  )
}

export default MapboxManager;

