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
