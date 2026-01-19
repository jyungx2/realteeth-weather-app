import type { Location } from "@/shared/model/location";
import { LocationContext } from "@/widgets/location-modal/model/locationContext";

import { useState, useCallback, useMemo, type ReactNode } from "react";

export function LocationProvider({ children }: { children: ReactNode }) {
  // UI 상태
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 데이터 전달 수단
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null,
  );

  // UI 제어 함수
  const openModal = useCallback((location: Location) => {
    setSelectedLocation(location);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedLocation(null), 300);
  }, []);

  const value = useMemo(
    () => ({ selectedLocation, isModalOpen, openModal, closeModal }),
    [selectedLocation, isModalOpen, openModal, closeModal],
  );

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
}
