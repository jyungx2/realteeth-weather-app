import type { ReactNode } from "react";
import { QueryProvider } from "@/app/providers/QueryProvider";
import { SearchProvider } from "@/app/providers/SearchProvider";

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryProvider>
      <SearchProvider>{children}</SearchProvider>
    </QueryProvider>
  );
}
