import type { Location } from "@/shared/model/location";

export interface LocationContextValue {
  isModalOpen: boolean;
  selectedLocation: Location | null;
  openModal: (location: Location) => void;
  closeModal: () => void;
}
