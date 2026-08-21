const CACHE_NAME = "okinawa-universal-v16";
const ASSETS = [
  "./?v=16",
  "index.html",
  "styles-v16.css?v=16",
  "app-v16.js?v=16",
  "manifest-v16.webmanifest",
  "icon.svg",
  "okinawa-beach.png",
  "okinawa-drive.png",
  "okinawa-american-village.png",
  "okinawa-aquarium.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      })
      .catch(() => caches.match(event.request).then((cached) => cached || caches.match("index.html")))
  );
});
