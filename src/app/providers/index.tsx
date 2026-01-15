import type { ReactNode } from "react";
import { QueryProvider } from "@/app/providers/QueryProvider";
import { SearchProvider } from "@/app/providers/SearchProvider";
import { LocationProvider } from "@/app/providers/LocationProvider";

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryProvider>
      <SearchProvider>
        <LocationProvider>{children}</LocationProvider>
      </SearchProvider>
    </QueryProvider>
  );
}
