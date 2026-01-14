import type { ReactNode } from "react";

interface HeaderProps {
  leftSlot?: ReactNode;
  middleSlot?: ReactNode;
  rightSlot?: ReactNode;
}

export default function Header({
  leftSlot,
  middleSlot,
  rightSlot,
}: HeaderProps) {
  if (!leftSlot && !middleSlot && !rightSlot) return null;

  return (
    <header className="sticky w-full grid grid-cols-3 items-center justify-center py-[2.2rem] z-10">
      <div className="mr-auto flex justify-center">{leftSlot}</div>
      <div className="mx-auto">{middleSlot}</div>
      <div className="ml-auto flex justify-center">{rightSlot}</div>
    </header>
  );
}
