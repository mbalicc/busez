"use client";

import React, { useEffect, useState } from "react";
import { WifiOff, History, ArrowRight } from "lucide-react";
import { getStationNameById } from "@/hooks/useOfflineStationCache";

type HistoryPair = {
  departureId: string;
  arrivalId: string;
  departureName: string;
  arrivalName: string;
};

export default function OfflinePage() {
  const [historyPairs, setHistoryPairs] = useState<HistoryPair[]>([]);

  useEffect(() => {
    try {
      const departureIds: string[] = JSON.parse(
        localStorage.getItem("historyDepartureStationIds") ?? "[]"
      );
      const arrivalIds: string[] = JSON.parse(
        localStorage.getItem("historyArrivalStationIds") ?? "[]"
      );

      const len = Math.min(departureIds.length, arrivalIds.length);
      const pairs: HistoryPair[] = [];

      for (let i = len - 1; i >= 0; i--) {
        const dId = departureIds[i];
        const aId = arrivalIds[i];
        if (!dId || !aId) continue;
        pairs.push({
          departureId: dId,
          arrivalId: aId,
          departureName: getStationNameById(dId) ?? dId,
          arrivalName: getStationNameById(aId) ?? aId,
        });
      }

      setHistoryPairs(pairs);
    } catch {
      // localStorage unavailable
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <WifiOff className="w-24 h-24 mb-6 text-muted-foreground" />
      <h1 className="text-4xl font-bold mb-4">Nisi online</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Provjeri internet konekciju da bi nastavio/la koristiti aplikaciju.
      </p>

      {historyPairs.length > 0 && (
        <div className="w-full max-w-md mb-8">
          <div className="flex items-center gap-2 justify-center mb-4 text-muted-foreground">
            <History className="w-5 h-5" />
            <span className="text-sm font-medium">Posljednje pretrage</span>
          </div>
          <div className="flex flex-col gap-2">
            {historyPairs.map((pair, idx) => (
              <div
                key={idx}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-border bg-muted/50 text-sm"
              >
                <span className="font-medium truncate max-w-[120px]">{pair.departureName}</span>
                <ArrowRight className="w-4 h-4 flex-shrink-0 text-muted-foreground" />
                <span className="font-medium truncate max-w-[120px]">{pair.arrivalName}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => window.location.reload()}
        className="px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:opacity-90 transition-opacity"
      >
        Pokušaj ponovo
      </button>
    </div>
  );
}
