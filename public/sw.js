if(!self.define){const e=e=>{"require"!==e&&(e+=".js");let s=Promise.resolve();return r[e]||(s=new Promise((async s=>{if("document"in self){const r=document.createElement("script");r.src=e,document.head.appendChild(r),r.onload=s}else importScripts(e),s()}))),s.then((()=>{if(!r[e])throw new Error(`Module ${e} didn’t register its module`);return r[e]}))},s=(s,r)=>{Promise.all(s.map(e)).then((e=>r(1===e.length?e[0]:e)))},r={require:Promise.resolve(s)};self.define=(s,n,a)=>{r[s]||(r[s]=Promise.resolve().then((()=>{let r={};const t={uri:location.origin+s.slice(1)};return Promise.all(n.map((s=>{switch(s){case"exports":return r;case"module":return t;default:return e(s)}}))).then((e=>{const s=a(...e);return r.default||(r.default=s),r}))})))}}define("./sw.js",["./workbox-ea903bce"],(function(e){"use strict";importScripts("fallback-P6GnezzyswECI6bEfO4ww.js"),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/static/P6GnezzyswECI6bEfO4ww/_buildManifest.js",revision:"P6GnezzyswECI6bEfO4ww"},{url:"/_next/static/P6GnezzyswECI6bEfO4ww/_ssgManifest.js",revision:"P6GnezzyswECI6bEfO4ww"},{url:"/_next/static/chunks/454-4eea8db21d682d94c5fb.js",revision:"P6GnezzyswECI6bEfO4ww"},{url:"/_next/static/chunks/framework-460a2f08dc26bee579bf.js",revision:"P6GnezzyswECI6bEfO4ww"},{url:"/_next/static/chunks/main-9b89d3dad8dc6633a5e9.js",revision:"P6GnezzyswECI6bEfO4ww"},{url:"/_next/static/chunks/pages/_app-946e2d6d88e5f6b5aadd.js",revision:"P6GnezzyswECI6bEfO4ww"},{url:"/_next/static/chunks/pages/_error-7cc035aca8c55a087310.js",revision:"P6GnezzyswECI6bEfO4ww"},{url:"/_next/static/chunks/pages/_offline-847176b5f7397d391ae4.js",revision:"P6GnezzyswECI6bEfO4ww"},{url:"/_next/static/chunks/pages/index-206f1e5ee4250e9da323.js",revision:"P6GnezzyswECI6bEfO4ww"},{url:"/_next/static/chunks/polyfills-7b08e4c67f4f1b892f4b.js",revision:"P6GnezzyswECI6bEfO4ww"},{url:"/_next/static/chunks/webpack-e24fd86466b3177b00b1.js",revision:"P6GnezzyswECI6bEfO4ww"},{url:"/_next/static/css/7418497cea5a2f64bfc4.css",revision:"P6GnezzyswECI6bEfO4ww"},{url:"/_next/static/css/b3aa137da87062a546f1.css",revision:"P6GnezzyswECI6bEfO4ww"},{url:"/_next/static/media/bootstrap-icons.94eeade15e6b7fbed95b18ff32f0c112.woff",revision:"P6GnezzyswECI6bEfO4ww"},{url:"/_next/static/media/bootstrap-icons.dfd0ea122577eb61795f178e0347fa2c.woff2",revision:"P6GnezzyswECI6bEfO4ww"},{url:"/_offline",revision:"P6GnezzyswECI6bEfO4ww"},{url:"/favicon.ico",revision:"fdfc4eab5548dc75f0d2fb532053af45"},{url:"/icons/icon-192x192.png",revision:"64bea7991625b8e6bb5d2fbd30276aec"},{url:"/icons/icon-256x256.png",revision:"a800033e18cff24e360cea73141a7753"},{url:"/icons/icon-384x384.png",revision:"1c4fd86776bf2978a53531a48c452f52"},{url:"/icons/icon-512x512.png",revision:"e472ef5eeaf97a08f9316fb52d22604e"},{url:"/manifest.json",revision:"03a14f76a28c79d01c99556077e6e6fb"},{url:"/vercel.svg",revision:"4b4f1876502eb6721764637fe5c41702"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:r,state:n})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s},{handlerDidError:async({request:e})=>self.fallback(e)}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts",plugins:[{handlerDidError:async({request:e})=>self.fallback(e)},new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3,purgeOnQuotaError:!0})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[{handlerDidError:async({request:e})=>self.fallback(e)},new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800,purgeOnQuotaError:!0})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[{handlerDidError:async({request:e})=>self.fallback(e)},new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400,purgeOnQuotaError:!0})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[{handlerDidError:async({request:e})=>self.fallback(e)},new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400,purgeOnQuotaError:!0})]}),"GET"),e.registerRoute(/\.(?:mp3|mp4)$/i,new e.StaleWhileRevalidate({cacheName:"static-media-assets",plugins:[{handlerDidError:async({request:e})=>self.fallback(e)},new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400,purgeOnQuotaError:!0})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[{handlerDidError:async({request:e})=>self.fallback(e)},new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400,purgeOnQuotaError:!0})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[{handlerDidError:async({request:e})=>self.fallback(e)},new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400,purgeOnQuotaError:!0})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[{handlerDidError:async({request:e})=>self.fallback(e)},new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400,purgeOnQuotaError:!0})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[{handlerDidError:async({request:e})=>self.fallback(e)},new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400,purgeOnQuotaError:!0})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const s=e.pathname;return!s.startsWith("/api/auth/")&&!!s.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[{handlerDidError:async({request:e})=>self.fallback(e)},new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400,purgeOnQuotaError:!0})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[{handlerDidError:async({request:e})=>self.fallback(e)},new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400,purgeOnQuotaError:!0})]}),"GET")}));
