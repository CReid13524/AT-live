export type ApiFrame = {
status?: string;
  response?: ApiFrameResponse;
  error?: string;
}

export type ApiFrameResponse = {
  header?: FeedHeader;
  entity?: Entity[];
}

export type Entity = TripUpdate | VehiclePosition | Alert;

export type TripUpdate = {
  id?: string;
  is_deleted?: boolean;
  trip_update?: {
    trip?: Trip;
    vehicle?: VehichleDescription;
    stop_time_update?: StopTimeUpdate[];
    timestamp?: number;
    delay?: number;
  }
}

export type VehiclePosition = {
  id?: string;
  is_deleted?: boolean;
  vehicle?: Vehicle;
}

export type Alert = {
  id?: string;
  is_deleted?: boolean;
  alert?: {
    active_period?: TimeRange[];
    informed_entity?: EntitySelector;
    cause?: Cause;
    effect?: Effect;
    url?: TranslatedString;
    header_text?: TranslatedString;
    description_text?: TranslatedString;
  }
}

export type Vehicle = {
  trip?: Trip;
  vehicle?: VehichleDescription;
  position?: Position;
  timestamp?: number;
  congestion_level?: CongestionLevel;
  occupancy_status?: OccupancyStatus;
}

export type FeedHeader = {
  gtfs_realtime_version?: string;
  incrementality?: number;
  timestamp?: number;
}

export type Trip = {
  trip_id?: string;
  route_id?: string;
  direction_id?: number;
  start_time?: string;
  start_date?: string;
  schedule_relationship?: Trip_ScheduleRelationship;
}

export type VehichleDescription = {
  id?: string;
  label?: string;
  license_plate?: string;
}

export type StopTimeUpdate = {
  stop_sequence?: number;
  stop_id?: string;
  arrival?: StopTimeEvent;
  departure?: StopTimeEvent;
  schedule_relationship?: Stop_ScheduleRelationship;
}

export type StopTimeEvent = {
  delay?: number;
  time?: number;
  uncertainty?: number;
}

export type Position = {
  latitude?: number;
  longitude?: number;
  bearing?: string;
  odometer?: number;
  speed?: number;
}

export type TranslatedString = {
  translation?: Translation;
}

export type Translation = {
  text?: string;
  language?: string;
}

export type TimeRange = {
  start?: number;
  end?: number;
}

export type EntitySelector = {
  agency_id?: string;
  route_id?: string;
  route_type?: number;
  trip?: Trip;
  stop_id?: string;
}

export type Stop_ScheduleRelationship = 0 | 1 | 2;

export type CongestionLevel = 0 | 1 | 2 | 3 | 4;

export type OccupancyStatus = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type Trip_ScheduleRelationship = 0 | 1 | 2;

export type Effect = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type Cause = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

