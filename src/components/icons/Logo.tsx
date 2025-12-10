import { cn } from "@/lib/utils";

export const Logo = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn("w-6 h-6", className)}
  >
    {/* Houseboat Roof - Curved thatched style */}
    <path d="M4 11h16a1 1 0 0 0 1-1c0-2.5-2-4-5-4H8c-3 0-5 1.5-5 4a1 1 0 0 0 1 1Z" />
    {/* Boat Hull */}
    <path d="M3 13h18v2a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-2Z" />
    {/* Windows */}
    <path d="M8 11v2" />
    <path d="M12 11v2" />
    <path d="M16 11v2" />
    {/* Water Waves */}
    <path d="M2 21c3 0 5 1 9 1s6-1 9-1" />
  </svg>
);
