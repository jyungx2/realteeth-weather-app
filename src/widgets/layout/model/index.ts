import type { ReactNode } from "react";

export interface LayoutProps {
  background?: string;
  children: ReactNode;
  leftSlot?: ReactNode;
  middleSlot?: ReactNode;
  rightSlot?: ReactNode;
  mainCN?: string;
}
