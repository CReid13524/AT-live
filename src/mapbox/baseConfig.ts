/* ----------------------- Sources ------------------------ */

// Vehicles
export const VEHICLE_SOURCE_ID = 'vehicle-source-id';
export const VEHICLE_POINT_SOURCE_ID = 'vehicle-point-source-id';

// Routes
export const BUS_ROUTE_SOURCE_ID = 'bus-route-source-id';
export const FERRY_ROUTE_SOURCE_ID = 'ferry-route-source-id';
export const TRAIN_ROUTE_SOURCE_ID = 'train-route-source-id';

// Stops
export const BUS_STOP_SOURCE_ID = 'bus-stop-source-id';
export const FERRY_STOP_SOURCE_ID = 'ferry-stop-source-id';
export const TRAIN_STOP_SOURCE_ID = 'train-stop-source-id';

/* ----------------------- Layers ------------------------ */
// Priority Highest to Lowest

// Vehicles
export const VEHICLE_BUS_LAYER_ID = "vehicle-bus-layer-id";
export const VEHICLE_BUS_POINT_LAYER_ID = "vehicle-bus-point-layer-id";

// Stops
export const BUS_STOP_LAYER_ID = 'bus-stop-layer-id';
export const FERRY_STOP_LAYER_ID = 'ferry-stop-layer-id';
export const TRAIN_STOP_LAYER_ID = 'train-stop-layer-id';


// Routes
export const BUS_ROUTE_LAYER_ID = 'bus-route-layer-id';
export const FERRY_ROUTE_LAYER_ID = 'ferry-route-layer-id';
export const TRAIN_ROUTE_LAYER_ID = 'train-route-layer-id';


/* ----------------------- Constants ------------------------ */

export const CLICK_TOLERANCE = 5; // pixels
export const StopType = {
    BUS: 'bus',
    FERRY: 'ferry',
    TRAIN: 'train',
}
export type StopType = typeof StopType[keyof typeof StopType];

export const RouteType = {
    BUS: 'bus',
    FERRY: 'ferry',
    TRAIN: 'train',
}
export type RouteType = typeof RouteType[keyof typeof RouteType];
