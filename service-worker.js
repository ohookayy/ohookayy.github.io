const CACHE_NAME = "PWA-v1";
let urlsToCache = [
    "/",
    "/icon.png",
    "/manifest.json",
    "/nav.html",
    "/index.html",
    "/article.html",
    "/pages/home.html",
    "/pages/about.html",
    "/pages/contact.html",
    "/pages/saved.html",
    "/css/materialize.min.css",
    "/js/materialize.min.js",
    "/js/script.js",
    "/js/api.js",
    "/js/db.js",
    "/js/idb.js"
];

self.addEventListener("install",function(event){
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache){
            return cache.addAll(urlsToCache);
        })
    );
});//install cache

self.addEventListener("fetch",function(event){
    
    /*
    event.respondWith(
        caches
        .match(event.request, {cacheName: CACHE_NAME})
        .then(function(response){
            if(response){
                console.log("Service Worker: Gunakan Aset dari Cache: ",response.url);
                return response;
            }

            console.log("ServiceWorker: masih memuat aset dari server", event.request.url);
            return fetch(event.request);
            
        })//fetch from aseet
    ) changed to cache dynamic below, show avail data while send req if possible
    */
    const BASE_URL = "https://readerapi.codepolitan.com/";
    if(event.request.url.indexOf(BASE_URL) > -1) {
        //index of is used to check if request there is BASE_URL inside
        //if its req base url then go here
        event.respondWith(
            caches.open(CACHE_NAME)
            .then(function(cache){
                return fetch(event.request)
                .then(function(response){
                    cache.put(event.request.url, response.clone());
                    return response;
                })
            })
        )
    }else{
        event.respondWith(//if it request appshell it goes here
            caches.match(event.request,{ ignoreSearch: true})
            .then(function(response){
                return response || fetch(event.request);
            })
        )
    }

});

self.addEventListener("activate", function(event){
    event.waitUntil(
        caches.keys().then(function(cacheNames){
            return Promise.all(
                cacheNames.map(function(cacheName){
                    if(cacheName != CACHE_NAME){
                        console.log("ServiceWorker: cache "+cacheName+" telah dihapus.");
                        return caches.delete(cacheName);
                    }
                })
            )
        })//dell old aset cache for new one when active
    )
})