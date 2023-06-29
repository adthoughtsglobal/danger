self.addEventListener('install', function(event) {
    event.waitUntil(
      caches.open('my-cache').then(function(cache) {
        return cache.addAll([
          '/',
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
    if (event.data === 'triggerMessage') {
      // Connect to the WebSocket
      const socket = new WebSocket('wss://moo.adthoughtsglobal.repl.co');
  
      socket.addEventListener('open', function() {
        console.log('WebSocket connection established');
        socket.send('Hello from service worker');
      });
  
      socket.addEventListener('message', function(event) {
        console.log('WebSocket message received:', event.data);
        // Process the received message here
      });
  
      socket.addEventListener('close', function() {
        console.log('WebSocket connection closed');
      });
    }
  });
  