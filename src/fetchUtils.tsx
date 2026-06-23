import type { ApiFrame, ApiFrameResponse } from "./types";

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
    console.error("Failed to fetch data from AT API");
  }

  const data = await res.json() as ApiFrame;

  return data.response;
}

export async function fetchRouteGeoJson(): Promise<any> {
  const res = await fetch("https://services2.arcgis.com/JkPEgZJGxhSjYOo0/arcgis/rest/services/BusService/FeatureServer/2/query?outFields=*&where=1%3D1&f=geojson");

  if (!res.ok) {
    console.error("Failed to fetch route GeoJSON");
  }

  const data = await res.json();

  return data;
}
