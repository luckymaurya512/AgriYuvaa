// AgriYuvaa Web Push Service Worker
self.addEventListener("push", (event) => {
  let data = {
    title: "🌾 AgriYuvaa Job Alert",
    body: "A new agriculture job opportunity has just been posted!",
    icon: "/logo.png",
    badge: "/logo.png",
    data: { url: "/jobs" },
  };

  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: data.icon || "/logo.png",
    badge: data.badge || "/logo.png",
    vibrate: [100, 50, 100],
    data: data.data || { url: "/jobs" },
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || "/jobs";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
      for (let client of windowClients) {
        if (client.url.includes(targetUrl) && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
