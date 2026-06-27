import { createContext } from "react";
import type { AppContextType } from "../types/types";

export const AppContext = createContext<AppContextType>({
    tripUpdates: [],
    vehiclePositions: [],
    alerts: []
});