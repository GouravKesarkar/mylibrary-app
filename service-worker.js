const CACHE_NAME = "mylibrary-cache-v2";
const ASSETS = [
  "index.html",
  "home.html",
  "books.html",
  "mybooks.html",
  "book-management.html",
  "approve-books.html",
  "books-with-user.html",
  "add-books.html",
  "register.html",
  "userrequest-approve.html",
  "style.css",
  "manifest.json",
  "icon/mylibrary-icon_192.png"
];


// Install event - cache assets
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// Activate event - cleanup old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((key) => key !== CACHE_NAME && caches.delete(key)))
    )
  );
  clients.claim();
});

// Fetch event - Network first, fallback to cache
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
