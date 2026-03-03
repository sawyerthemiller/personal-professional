const CACHE_NAME = 'millersa-img-cache-v1';

const PRECACHE_URLS = [
    'https://i.ibb.co/pjHQPJ1r/site-bg.jpg',
    'https://i.ibb.co/HTKzjyh4/IMG-1841.png',
    'https://i.ibb.co/Y4jwz8x5/frame.jpg',
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg',
    'https://upload.wikimedia.org/wikipedia/de/thumb/0/00/Windows_Vista_Logo.svg/420px-Windows_Vista_Logo.svg.png?20090607103336',
];

// On install, pre-cache all the listed images
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(PRECACHE_URLS);
        })
    );
    self.skipWaiting();
});

// On activate, clean up any old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys
                    .filter((key) => key !== CACHE_NAME)
                    .map((key) => caches.delete(key))
            );
        })
    );
    self.clients.claim();
});

// Cache-first strategy for images, passthrough for everything else
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // Only intercept image requests (by extension or from known image hosts)
    const isImage =
        /\.(jpg|jpeg|png|gif|svg|webp|ico)(\?.*)?$/i.test(url.pathname) ||
        url.hostname === 'i.ibb.co';

    if (!isImage) return; // let the browser handle non-image requests normally

    event.respondWith(
        caches.match(event.request).then((cached) => {
            if (cached) return cached;

            // Not in cache yet — fetch, cache, and return
            return fetch(event.request).then((response) => {
                if (response && response.ok) {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
                }
                return response;
            });
        })
    );
});
