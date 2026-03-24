"use client";

import { Station } from "@/models/station.model";

const STATION_CACHE_KEY = "offlineStationCache";

export type StationCache = Record<string, string>; // id -> name

export function saveStationsToCache(stations: Station[]): void {
  try {
    const existing = getStationCache();
    const updated: StationCache = { ...existing };
    for (const station of stations) {
      if (station._id) {
        updated[station._id] = station.name;
      }
    }
    localStorage.setItem(STATION_CACHE_KEY, JSON.stringify(updated));
  } catch {
    // localStorage might be unavailable
  }
}

export function getStationCache(): StationCache {
  try {
    const raw = localStorage.getItem(STATION_CACHE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as StationCache;
  } catch {
    return {};
  }
}

export function getStationNameById(id: string): string | null {
  const cache = getStationCache();
  return cache[id] ?? null;
}
