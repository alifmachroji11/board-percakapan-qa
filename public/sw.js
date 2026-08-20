// Service worker minimal — cuma buat nerima & nampilin web push.

self.addEventListener('push', (event) => {
  let data = { title: 'Obrolin', body: 'Ada kabar baru buat kamu.', url: '/app' }
  try {
    if (event.data) data = { ...data, ...event.data.json() }
  } catch {
    // biarin fallback di atas kalau payload-nya bukan JSON
  }

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/favicon.svg',
      badge: '/favicon.svg',
      data: { url: data.url },
    }),
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const url = event.notification.data?.url ?? '/app'

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if (client.url.includes(new URL(url, self.location.origin).pathname) && 'focus' in client) {
          return client.focus()
        }
      }
      return self.clients.openWindow(url)
    }),
  )
})
