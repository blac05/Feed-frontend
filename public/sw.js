const CACHE_NAME = "feed-v2";
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/logo.png"
];

// ==========================================
// 1. APPLICATION SERVICE WORKER LIFECYCLE
// ==========================================

// Install Event: Open cache storage and download core UI shells
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  // Force the waiting service worker to become the active service worker immediately
  self.skipWaiting();
});

// Activate Event: Wipe obsolete previous cache spaces (e.g., feed-v1)
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  // Take control of all open client tabs immediately without waiting for page refreshes
  self.clients.claim();
});

// ==========================================
// 2. RESOURCE FETCH STRATEGIES (STALE-WHILE-REVALIDATE)
// ==========================================
self.addEventListener("fetch", (event) => {
  // Security Layer Guards: Only intercept local static GET actions; bypass write verbs and API endpoints
  if (event.request.method !== "GET") return;
  if (event.request.url.includes("/api/")) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Fire an asynchronous network fetch in the background to refresh local assets silently
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
          }
          return networkResponse;
        })
        .catch(() => cachedResponse); // If offline completely, gracefully fallback to the asset cache item

      // Instantly serve the cached match if available, otherwise yield the network completion
      return cachedResponse || fetchPromise;
    })
  );
});

// ==========================================
// 3. VAPID PUSH NOTIFICATION DISPATCHES
// ==========================================
self.addEventListener("push", (event) => {
  let pushData = {};

  try {
    // Attempt standard object parsing for native programmatic JSON structures
    pushData = event.data?.json() || {};
  } catch (error) {
    // Failover Block: Fallback to reading raw stream strings if the backend payload string wasn't structured JSON
    pushData = {
      title: "Feed",
      body: event.data ? event.data.text() : "You have a new notification"
    };
  }

  const notificationOptions = {
    body: pushData.body || "You have a new notification",
    icon: pushData.icon || "/logo.png",
    badge: "/logo.png",
    tag: pushData.tag || "feed-notification", // De-duplicates identical stacked alerts
    renotify: true, // Vibrates/wakes screen even on repeated tags
    data: { url: pushData.url || "/" },
    actions: [
      { action: "view", title: "View" },
      { action: "dismiss", title: "Dismiss" },
    ],
  };

  event.waitUntil(
    self.registration.showNotification(pushData.title || "Feed", notificationOptions)
  );
});

// ==========================================
// 4. INTERACTION & FOCUS ROUTING CHECKS
// ==========================================
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  // If the admin/moderator clicked the explicit 'Dismiss' action template, step out early
  if (event.action === "dismiss") return;

  const targetNavigationUrl = event.notification.data?.url 
    ? new URL(event.notification.data.url, self.location.origin).href 
    : self.location.origin + "/";

  event.waitUntil(
    // Scan all active system browser windows to find a matching instance of our app
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        // Optimization: If a user tab is already open on our domain, focus it and redirect it
        if (client.url.startsWith(self.location.origin) && "focus" in client) {
          client.navigate(targetNavigationUrl);
          return client.focus();
        }
      }
      // If no matching application frame was open, handle the execution by spinning up a new window
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetNavigationUrl);
      }
    })
  );
});
