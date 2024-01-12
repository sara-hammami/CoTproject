const CACHE_NAME = 'my-pwa-cache-v1-work';
const cacheUrls = [
    '/',
    '/index.html',
    '/code.html',
    '/login.html',
    '/dashboard.html',
    '/about.html',
    '/signup.html',
    '/newpassword.html',
    '/detect.html',
    '/sendmail.html',
    '/styles/welcome.css',
    '/styles/signup.css',
    '/styles/code.css',
    '/styles/login.css',
    '/styles/dashboard.css',
    '/styles/about.css',
    '/styles/newpassword.css',
    '/styles/detect.css',
    '/styles/sendmail.css',
    '/js/welcome.js',
    '/js/signup.js',
    '/js/code.js',
    '/js/login.js',
    '/js/dashboard.js',
    '/js/newpassword.js',
    '/js/detect.js',
    '/js/sendmail.js',
    '/app.js',
    '/logo.png',
    '/assets/logo2.png',
    '/assets/welcome.png',
    '/assets/vide.png',
    '/assets/route.png',
    '/assets/registred.png',
    '/assets/plein.png',
    '/assets/pourcentage.png',
    '/assets/person.png',
    '/assets/person2.png',
    '/assets/newpass.png',
    '/assets/new_pass.png',
    '/assets/new_pass.jpg',
    '/assets/moy.png',
    '/assets/map.png',
    '/assets/logo-192.png',
    '/assets/logo-512.png',
    '/assets/login.png',
    '/assets/login.jpg',
    '/assets/location.png',
    '/assets/level.png',
    '/assets/level.jpg',
    '/assets/email.png',
    '/assets/code.png',
    '/assets/class.jpg',
    // Add other assets and resources you want to cache
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(cacheUrls).catch((error) => {
                console.error('Failed to cache some resources during installation:', error);
            });
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request).catch((error) => {
                console.error('Error fetching resource:', error);
            });
        })
    );
});
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            );
        })
    );
});
