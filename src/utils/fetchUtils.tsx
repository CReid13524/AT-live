import type { ApiFrame, ApiFrameResponse } from "../types/at-dev-types";
import type { StaticFeatureCollections } from "../types/types";

const AT_AUTH_HEADER = {
  "Ocp-Apim-Subscription-Key": import.meta.env.VITE_AT_PUBLIC_TRANSPORT_DEV_KEY
}
export async function fetchCombinedFeed(): Promise<ApiFrameResponse> {
  const res = await fetch("https://api.at.govt.nz/realtime/legacy/", {
    headers: {
      ...AT_AUTH_HEADER
    }
  })

  if (!res.ok) {
    console.error("Failed to fetchfetchCombinedFeed");
  }

  const data = await res.json() as ApiFrame;
  const response = data.response as ApiFrameResponse;

  return response;
}

export async function fetchBusRoutes(): Promise<StaticFeatureCollections['busRoutes']> {
  const res = await fetch("https://services2.arcgis.com/JkPEgZJGxhSjYOo0/arcgis/rest/services/BusService/FeatureServer/2/query?outFields=*&where=1%3D1&f=geojson");

  if (!res.ok) {
    console.error("Failed to fetchfetchBusRoutesGeoJson");
  }

  const data = await res.json();

  return data;
}

export async function fetchBusStops(): Promise<StaticFeatureCollections['busStops']> {
  const BASE_URL =
    "https://services2.arcgis.com/JkPEgZJGxhSjYOo0/arcgis/rest/services/BusService/FeatureServer/0/query";

  const CHUNK_SIZE = 200;

  // Fetch all object IDs
  const idsRes = await fetch(
    `${BASE_URL}?where=1=1&returnIdsOnly=true&f=json`
  );

  if (!idsRes.ok) {
    throw new Error("Failed to fetch bus stop object IDs");
  }

  const { objectIds } = await idsRes.json();

  if (!objectIds || objectIds.length === 0) {
    return {
      type: "FeatureCollection",
      features: [],
    };
  }

  // Fetch each chunk in parallel
  const chunkPromises: Promise<GeoJSON.FeatureCollection>[] = [];

  for (let i = 0; i < objectIds.length; i += CHUNK_SIZE) {
    const ids = objectIds.slice(i, i + CHUNK_SIZE).join("%2C");

    const url =
      `${BASE_URL}?` +
      `where=1%3D1` +
      `&objectIds=${ids}` +
      `&outFields=*` +
      `&f=geojson`;

    chunkPromises.push(
      fetch(url).then(async (res) => {
        if (!res.ok) {
          throw new Error(`Failed fetching chunk ${i / CHUNK_SIZE}`);
        }

        return res.json();
      })
    );
  }

  const collections = await Promise.all(chunkPromises);

  return {
    type: "FeatureCollection",
    features: collections.flatMap((c) => c.features) as GeoJSON.Feature<GeoJSON.Point, any>[],
  };
}

export async function fetchFerryRoutes(): Promise<StaticFeatureCollections['ferryRoutes']> {
  const res = await fetch("https://services2.arcgis.com/JkPEgZJGxhSjYOo0/arcgis/rest/services/FerryService/FeatureServer/1/query?outFields=*&where=1%3D1&f=geojson");

  if (!res.ok) {
    console.error("Failed to fetchfetchFerryRoutes");
  }

  const data = await res.json();

  return data;
}

export async function fetchFerryStops(): Promise<StaticFeatureCollections['ferryStops']> {
  const res = await fetch("https://services2.arcgis.com/JkPEgZJGxhSjYOo0/arcgis/rest/services/FerryService/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson");

  if (!res.ok) {
    console.error("Failed to fetchfetchFerryStops");
  }

  const data = await res.json();

  return data;
}

export async function fetchTrainRoutes(): Promise<StaticFeatureCollections['trainRoutes']> {
  const res = await fetch("https://services2.arcgis.com/JkPEgZJGxhSjYOo0/arcgis/rest/services/TrainService/FeatureServer/1/query?outFields=*&where=1%3D1&f=geojson");

  if (!res.ok) {
    console.error("Failed to fetchfetchTrainRoutes");
  }

  const data = await res.json();

  return data;
}

export async function fetchTrainStops(): Promise<StaticFeatureCollections['trainStations']> {
  const res = await fetch("https://services2.arcgis.com/JkPEgZJGxhSjYOo0/arcgis/rest/services/TrainService/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson");

  if (!res.ok) {
    console.error("Failed to fetchfetchTrainStations");
  }

  const data = await res.json();

  return data;
}
