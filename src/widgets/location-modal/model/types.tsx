import type { Location } from "@/shared/model/types";

export interface LocationContextValue {
  isModalOpen: boolean;
  selectedLocation: Location | null;
  openModal: (location: Location) => void;
  closeModal: () => void;
}
