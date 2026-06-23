import type { LineLayerSpecification } from "mapbox-gl";
import {
  ROUTE_SOURCE_ID,
  ROUTE_LAYER_ID,
} from "../baseConfig";

export const getRouteLineLayer = (): LineLayerSpecification => ({
  id: ROUTE_LAYER_ID,
  type: "line",
  source: ROUTE_SOURCE_ID,
  paint: {
    "line-color": "#4a5568",
    "line-width": [
      "interpolate",
      ["linear"],
      ["zoom"],
      10, 1,
      14, 2,
      18, 4,
    ],
    "line-opacity": 0.4,
  },
});

export const getRouteOutlineLayer = (): LineLayerSpecification => ({
  id: ROUTE_LAYER_ID,
  type: "line",
  source: ROUTE_SOURCE_ID,
  paint: {
    "line-color": "#00b7ff",
    "line-width": [
      "interpolate",
      ["linear"],
      ["zoom"],
      10, 3,
      14, 6,
      18, 12,
    ],
    "line-opacity": 0.15,
    "line-blur": 2,
  },
});
