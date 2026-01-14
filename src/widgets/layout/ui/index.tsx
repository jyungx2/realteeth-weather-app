import Header from "@/shared/ui/header";
import type { LayoutProps } from "@/widgets/layout/model";

export default function Layout({
  background,
  children,
  leftSlot,
  middleSlot,
  rightSlot,
  mainCN,
}: LayoutProps) {
  return (
    <div className={`min-h-screen ${background} px-[2.4rem]`}>
      <Header
        leftSlot={leftSlot}
        middleSlot={middleSlot}
        rightSlot={rightSlot}
      />
      {/* 콘텐츠 영역 */}
      <main className={`flex flex-col flex-1 overflow-y-auto ${mainCN}`}>
        {children}
      </main>
    </div>
  );
}
