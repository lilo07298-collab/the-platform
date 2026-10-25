const CACHE_NAME = "pinc-admin-v1";
const ASSETS = [
  "/admin/index.html",
  "/admin/manifest.json",
  "/media/logo.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then((c) => c.addAll(ASSETS)));
});
self.addEventListener("fetch", (e) => {
  e.respondWith(caches.match(e.request).then((r) => r || fetch(e.request)));
});
