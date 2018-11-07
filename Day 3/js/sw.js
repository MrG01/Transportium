self.addEventListener('install', function(e){
    e.waitUntil(
        caches.open('transportium-V0')
            .then(cache => {
                console.log('[Service Worker] Caching all: app shell');
                return cache.addAll([
                    'index.html',
                    'signup.html',
                    'manifest.json',
                    'css/app.css',
                    'css/bulma.min.css',
                    'images/walking-logo-clipart-1@192.png',
                    'images/walking-logo-clipart-1@512.png',
                    'js/app.js',
                    'js/sw.js',
                ]);
            }).catch(error => {
                console.log(error.message)
        })
    );
});

self.addEventListener('fetch', function(e) {
    console.log("[Service Worker] Start fetching");
    e.respondWith(
        caches.match(e.request)
            .then(function(r) {
            console.log('[Service Worker] Fetching resource: '+e.request.url);
            return r || fetch(e.request).then(function(response) {
                return caches.open('transportium-V0').then(function(cache) {
                    console.log('[Service Worker] Caching new resource: '+e.request.url);
                    cache.put(e.request, response.clone());
                    return response;
                });
            });
        })
            .catch(error => {
                console.log(error.message)
                })
    );
});