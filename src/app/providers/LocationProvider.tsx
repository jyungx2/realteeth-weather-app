import type { Location } from "@/shared/model/types";
import { LocationContext } from "@/widgets/location-modal/model/locationContext";

import { useState, type ReactNode } from "react";

export function LocationProvider({ children }: { children: ReactNode }) {
  // UI 상태
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 데이터 전달 수단
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null,
  );

  // UI 제어 함수
  const openModal = (location: Location) => {
    setSelectedLocation(location); // 데이터 전달
    setIsModalOpen(true); // 모달 열기
  };

  const closeModal = () => {
    setIsModalOpen(false); // 모달 닫기
    setTimeout(() => setSelectedLocation(null), 300); // 정리
  };

  return (
    <LocationContext.Provider
      value={{ selectedLocation, isModalOpen, openModal, closeModal }}
    >
      {children}
    </LocationContext.Provider>
  );
}
