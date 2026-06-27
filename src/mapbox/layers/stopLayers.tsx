import type { CircleLayerSpecification } from "mapbox-gl";
import {
  BUS_STOP_SOURCE_ID,
  BUS_STOP_LAYER_ID,
  FERRY_STOP_SOURCE_ID,
  FERRY_STOP_LAYER_ID,
  TRAIN_STOP_SOURCE_ID,
  TRAIN_STOP_LAYER_ID,
} from "../baseConfig";

export const getBusStopLayer = (): CircleLayerSpecification => ({
  id: BUS_STOP_LAYER_ID,
  type: "circle",
  source: BUS_STOP_SOURCE_ID,
  paint: {
    "circle-radius": 3,
    "circle-color": "#005481",
    "circle-stroke-width": 1,
    "circle-stroke-color": "#fff",
  },
});

export const getFerryStopLayer = (): CircleLayerSpecification => ({
  id: FERRY_STOP_LAYER_ID,
  type: "circle",
  source: FERRY_STOP_SOURCE_ID,
  paint: {
    "circle-radius": 6,
    "circle-color": "#ff7e5f",
    "circle-stroke-width": 1,
    "circle-stroke-color": "#fff",
  },
});

export const getTrainStopLayer = (): CircleLayerSpecification => ({
  id: TRAIN_STOP_LAYER_ID,
  type: "circle",
  source: TRAIN_STOP_SOURCE_ID,
  paint: {
    "circle-radius": 6,
    "circle-color": "#2ecc71",
    "circle-stroke-width": 1,
    "circle-stroke-color": "#fff",
  },
});
