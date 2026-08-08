import { api } from '@/stores/core'
import { useRoute } from 'vue-router'
import axios from 'axios'

var page_visited = 0;
var page_last = "xxx";
// var route

export function ga (payloadOriginal) {

  var route = {path: location.pathname, query: location.href.includes('?') ? location.href.split('?')[1].split('#')[0] : null}; // useRoute();

  // console.log(route, payloadOriginal); 

  var payload = null;

  if (typeof payloadOriginal === "undefined") {
    payload = {
      title: 'Programy do voleb',
      path: (route || {path: '/'}).path
    }
    document.title = 'Programy do voleb';
  } else if (typeof payloadOriginal === "string") {
    payload = {
      title: payloadOriginal,
      path: (route || {path: '/'}).path
    }
    document.title = payload.title + ' - Programy do voleb';
  } else {
    payload = payloadOriginal
    document.title = payload.title + ' - Programy do voleb';
  }

  // console.log(page_last, payload.path, route); 

  if (page_last != payload.path) {

    page_last = payload.path;
    page_visited++;

    var query = route.query || JSON.stringify(payload.query || (route ? route.query : '{}'));

    if (query === '{}') query = null;

    axios.post(api + 'tracker/page?c=' + (new Date().getTime()), {
      n: page_visited,
      t: payload.title,
      p: payload.path,
      q: query,
      d: window.location.hostname
    }).catch(function (err) {
      console.log(err.toJSON());
    });
  }
};

export function ge (payload) {

  axios.post(api + 'tracker/event?c=' + (new Date().getTime()), {
    p: window.location.pathname,
    e: payload.event,
    v: payload.value,
    d: window.location.hostname
  }).catch(function (err) {
    console.log(err.toJSON());
  });
};

