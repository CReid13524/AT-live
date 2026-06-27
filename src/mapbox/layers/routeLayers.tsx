import type { LineLayerSpecification } from "mapbox-gl";
import {
  BUS_ROUTE_LAYER_ID,
  BUS_ROUTE_SOURCE_ID,
  FERRY_ROUTE_LAYER_ID,
  FERRY_ROUTE_SOURCE_ID,
  TRAIN_ROUTE_LAYER_ID,
  TRAIN_ROUTE_SOURCE_ID,
} from "../baseConfig";

export const getBusRouteLineLayer = (): LineLayerSpecification => ({
  id: BUS_ROUTE_LAYER_ID,
  type: "line",
  source: BUS_ROUTE_SOURCE_ID,
  paint: {
    "line-color": "#007cbf",
    "line-width": 3,
  },
});

export const getFerryRouteLineLayer = (): LineLayerSpecification => ({
  id: FERRY_ROUTE_LAYER_ID,
  type: "line",
  source: FERRY_ROUTE_SOURCE_ID,
  paint: {
    "line-color": "#ff7e5f",
    "line-width": 3,
  },
});

export const getTrainRouteLineLayer = (): LineLayerSpecification => ({
  id: TRAIN_ROUTE_LAYER_ID,
  type: "line",
  source: TRAIN_ROUTE_SOURCE_ID,
  paint: {
    "line-color": "#2ecc71",
    "line-width": 3,
  },
});
