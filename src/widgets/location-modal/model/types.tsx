import type { SelectedLocation } from "@/widgets/search-overlay/model/type";

export interface LocationContextValue {
  isModalOpen: boolean;
  selectedLocation: SelectedLocation | null;
  openModal: (location: SelectedLocation) => void;
  closeModal: () => void;
}
