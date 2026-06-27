export interface BusStop {
  OBJECTID: number;
  STOPID: string;
  STOPCODE?: number;
  STOPNAME?: string;
  STOPDESC?: string;
  LOCATIONTYPE?: string;
  STOPLAT?: number;
  STOPLON?: number;
  PARENTSTATION?: string;
  MODE?: string;
}

export interface BusRoute {
  OBJECTID: number;
  ROUTEPATTERN?: string;
  AGENCYNAME?: string;
  ROUTENAME?: string;
  ROUTENUMBER?: string;
  MODE?: string;
  Shape__Length?: number;
}

export interface FerryStop {
  OBJECTID: number;
  STOPID: string;
  STOPCODE?: number;
  STOPNAME?: string;
  STOPDESC?: string;
  LOCATIONTYPE?: string;
  STOPLAT?: number;
  STOPLON?: number;
  PARENTSTATION?: string;
  MODE?: string;
}

export interface FerryRoute {
  OBJECTID: number;
  ROUTEPATTERN?: string;
  AGENCYNAME?: string;
  ROUTENAME?: string;
  ROUTENUMBER?: string;
  MODE?: string;
  Shape__Length?: number;
}

export interface TrainStop {
  OBJECTID: number;
  STOPID: string;
  STOPCODE?: number;
  STOPNAME?: string;
  STOPDESC?: string;
  LOCATIONTYPE?: string;
  STOPLAT?: number;
  STOPLON?: number;
  PARENTSTATION?: string;
  MODE?: string;
}

export interface TrainRoute {
  OBJECTID: number;
  ROUTEPATTERN?: string;
  AGENCYNAME?: string;
  ROUTENAME?: string;
  ROUTENUMBER?: string;
  MODE?: string;
  Shape__Length?: number;
}
