import LocationModal from "@/widgets/location-modal/ui/location-modal";
import { useLocationModal } from "@/widgets/location-modal/model/locationContext";

export function LocationLayer() {
  const { isModalOpen } = useLocationModal();

  if (!isModalOpen) return null;
  return <LocationModal />;
}
