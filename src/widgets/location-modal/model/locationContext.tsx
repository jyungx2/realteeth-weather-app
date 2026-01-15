import type { LocationContextValue } from "@/widgets/location-modal/model/types";
import { createContext, useContext } from "react";

// Context 생성 (초기값은 undefined 권장)
export const LocationContext = createContext<LocationContextValue | undefined>(
  undefined
);

export function useLocationModal(): LocationContextValue {
  const ctx = useContext(LocationContext);

  if (!ctx) {
    throw new Error("useLocationModal must be used within <LocationProvider>");
  }

  return ctx;
}
