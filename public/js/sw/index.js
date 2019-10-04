const current_static_cache = "witter-10"

self.addEventListener('install', function(event) {
  var urlsToCache = [
    '/',
    'js/main.js',
    'css/main.css',
    'imgs/icon.png',
    //'https://fonts.gstatic.com/s/roboto/v15/2UX7WLTfW2W8TclTUvlFyQ.woff',
    //'https://fonts.gstatic.com/s/roboto/v15/d-6IYplOFocCacKzxwXSOD8E0i7KZn-EPnyo3HZu7kw.woff',
    "imgs/dr-evil.gif"
  ];

  event.waitUntil(
    // TODO: open a cache named 'wittr-static-v1'
    // Add cache the urls from urlsToCache
    
    caches.open(current_static_cache).then((cache) => {
      
      return cache.addAll(urlsToCache)
    }).catch((err) => {
      console.log("Error...",err)
    })
  );
});

self.addEventListener('fetch', function(event) {
  // Leave this blank for now.
  // We'll get to this in the next task.
  event.respondWith(caches.open(current_static_cache).then((cache) => {
    return cache.match(event.request).then((resp) => {
      
      if(resp){
        return resp
      }else{
        return fetch(event.request).then((resp) => {
          
          if(resp.status == 404){
            return new Response("No.....")
          }else{
            cache.put(event.request , resp.clone())
            return resp;
          }
        }).catch((err) => {
          return new Response("No.....")

        })
      }
    })
  }))
});

self.addEventListener("activate" , (event) => {
  console.log("Activate Start");
  event.waitUntil(  caches.keys().then((cacheName) => {
    return Promise.all(cacheName.filter((cache) => {
      return cache.includes("witter-") && cache != current_static_cache
    }).map((cache) => {
       return  caches.delete(cache)
    }))
  } ))
})