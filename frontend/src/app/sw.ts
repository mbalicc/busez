/// <reference lib="webworker" />
import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist, NetworkFirst, StaleWhileRevalidate, ExpirationPlugin } from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const API_PATHS = [
  "/stations/",
  "/routes/",
  "/agencies/",
  "/cities/",
  "/countries/",
];

const apiRuntimeCaching = API_PATHS.map((path) => ({
  matcher: ({ url }: { url: URL }) => url.pathname.startsWith(path),
  handler: new StaleWhileRevalidate({
    cacheName: `busez-api${path.replace(/\//g, "-").replace(/-$/, "")}`,
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 60 * 60 * 24, // 24 hours
      }),
    ],
  }),
}));

const serwist = new Serwist({
  precacheEntries: [{ url: "/~offline", revision: null }, ...(self.__SW_MANIFEST ?? [])],
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: false,
  runtimeCaching: [
    ...apiRuntimeCaching,
    {
      matcher: ({ request }: { request: Request }) => request.destination === "document",
      handler: new NetworkFirst({
        cacheName: "pages",
        networkTimeoutSeconds: 3,
      }),
    },
    ...defaultCache,
  ],
  fallbacks: {
    entries: [
      {
        url: "/~offline",
        matcher({ request }: { request: Request }) {
          return request.destination === "document";
        },
      },
    ],
  },
});

serwist.addEventListeners();
