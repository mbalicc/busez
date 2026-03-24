"use client";

import { WifiOff } from "lucide-react";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";

export function OfflineBanner() {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-destructive text-destructive-foreground px-4 py-3 rounded-md shadow-lg">
      <WifiOff className="w-4 h-4" />
      <span className="text-sm font-medium">
        Nisi online. Neke funkcije možda neće biti dostupne.
      </span>
    </div>
  );
}
