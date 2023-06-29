// Establish WebSocket connection
let socket;

function connectWebSocket() {
  socket = new WebSocket('wss://example.com/ws');

  // WebSocket event listeners
  socket.addEventListener('open', function() {
    console.log('WebSocket connection established');
  });

  socket.addEventListener('message', function(event) {
    console.log('WebSocket message received:', event.data);

    // Check for trigger message
    if (event.data === 'triggerMessage') {
      // Send trigger received message to the client
      self.clients.matchAll().then(function(clients) {
        clients.forEach(function(client) {
          client.postMessage('triggerReceived');
        });
      });
    }
  });

  socket.addEventListener('close', function() {
    console.log('WebSocket connection closed. Reconnecting...');
    // Reconnect after a delay
    setTimeout(connectWebSocket, 5000);
  });
}

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('v1').then(function(cache) {
      return cache.addAll([
        '/',
        '/index.html',
      ]);
    })
  );
});

self.addEventListener('activate', function(event) {
  // Close the tab after installation and WebSocket connection
  self.clients.matchAll().then(function(clients) {
    clients.forEach(function(client) {
      client.navigate(client.url);
      client.postMessage('closeTab');
    });
  });
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});

// Connect WebSocket on Service Worker activation
self.addEventListener('activate', function(event) {
  connectWebSocket();
});

// Receive message from client
self.addEventListener('message', function(event) {
  const location = event.data;
  // Send location data to the server through the WebSocket
  socket.send(JSON.stringify(location));
});
