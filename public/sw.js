// Service Worker for PWA Web Push Notifications
const CACHE_NAME = 'scoly-v2';

// Install event
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(clients.claim());
});

// Push event - receive push notifications
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push received:', event);

  let data = {
    title: 'Scoly',
    body: 'Nouvelle notification',
    icon: '/favicon.svg',
    badge: '/favicon.svg',
    tag: 'scoly-notification',
    data: {}
  };

  if (event.data) {
    try {
      const payload = event.data.json();
      data = {
        title: payload.title || data.title,
        body: payload.body || payload.message || data.body,
        icon: payload.icon || data.icon,
        badge: payload.badge || data.badge,
        tag: payload.tag || data.tag,
        data: payload.data || {}
      };
    } catch (e) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: data.icon,
    badge: data.badge,
    tag: data.tag,
    data: data.data,
    vibrate: [200, 100, 200],
    requireInteraction: true,
    actions: data.data?.requires_confirmation ? [
      { action: 'confirm', title: "Oui, c'est moi" },
      { action: 'block', title: 'Bloquer' }
    ] : []
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification click:', event.action);
  event.notification.close();

  const notificationData = event.notification.data || {};
  let targetUrl = '/';

  // Handle security confirmation actions
  if (event.action === 'confirm' || event.action === 'block') {
    targetUrl = '/?notification_action=' + event.action + 
                '&session_id=' + (notificationData.session_id || '') +
                '&notification_id=' + (notificationData.notification_id || '');
  } else if (notificationData.url) {
    targetUrl = notificationData.url;
  } else if (notificationData.order_id) {
    targetUrl = '/account';
  }

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            client.navigate(targetUrl);
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(targetUrl);
        }
      })
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('[Service Worker] Sync event:', event.tag);
});
