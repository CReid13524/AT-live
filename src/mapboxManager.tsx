import Map from "react-map-gl";
import type { MapRef } from "react-map-gl";

type MapboxManagerProps = {
  mapRef: React.RefObject<MapRef>;
}

function MapboxManager(props: MapboxManagerProps) {
  const { mapRef } = props;

  return (
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
  )
}

export default MapboxManager;

