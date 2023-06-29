self.addEventListener('install', function(event) {
    event.waitUntil(
      caches.open('my-cache').then(function(cache) {
        return cache.addAll([
          '/',
          '/index.html',
          '/admin.html'
        ]);
      })
    );
  });
  
  self.addEventListener('fetch', function(event) {
    event.respondWith(
      caches.match(event.request).then(function(response) {
        return response || fetch(event.request);
      })
    );
  });
  
  self.addEventListener('message', function(event) {
    if (event.data.type === 'locationUpdate') {
      const { latitude, longitude } = event.data;
      const message = `locationUpdate:${latitude}:${longitude}:true`;
      self.clients.matchAll().then(function(clients) {
        clients.forEach(function(client) {
          client.postMessage(message);
        });
      });
    }
  });
  