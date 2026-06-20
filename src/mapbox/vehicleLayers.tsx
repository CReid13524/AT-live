import type { CircleLayer, FillExtrusionLayer } from "mapbox-gl";
import {
  VEHICLE_SOURCE_ID,
  VEHICLE_BUS_LAYER_ID,
  VEHICLE_BUS_POINT_LAYER_ID,
  VEHICLE_POINT_SOURCE_ID,
} from "./vehicleUtils";

export const getBusFillExtrusionLayer = (): FillExtrusionLayer => ({
  id: VEHICLE_BUS_LAYER_ID,
  type: "fill-extrusion",
  source: VEHICLE_SOURCE_ID,
  paint: {
    "fill-extrusion-color": "#00b7ff",
    "fill-extrusion-height": 2,
    "fill-extrusion-base": 0
  }
});

export const getBusPointLayer = (): CircleLayer => ({
  id: VEHICLE_BUS_POINT_LAYER_ID,
  type: "circle",
  source: VEHICLE_POINT_SOURCE_ID,
  paint: {
    "circle-radius": 6,
    "circle-color": "#00b7ff",
    "circle-stroke-width": 1,
    "circle-stroke-color": "#ffffff",
    "circle-opacity": ["interpolate", ["linear"], ["zoom"], 10, 1, 16, 0],
    "circle-stroke-opacity": ["interpolate", ["linear"], ["zoom"], 10, 1, 18, 0]
  },
});

