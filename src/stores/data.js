import { ref, nextTick, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import { api, useCore } from '@/stores/core'

export const useData = defineStore('store', () => {
  const json = ref([]);
  const pdv = ref([]);
  const activity = ref(1);

  const core = useCore();

  const pdv2 = computed((state) => {
    return (request, delay) => {
        var lookup = pdv.value.find(x => x.request === request);

        // console.log(request, 1, !!lookup)

        if (lookup) {
            return lookup.response;
        } else {
            activity.value++; 

            var o = {
                request,
                response: ref(null),
                // activity
            }
    
            pdv.value.push(o);

            o.promise = new Promise((resolve, reject) => {

                // console.log(request, 2, o)

                setTimeout(() => {
                    axios.get(api + request + '?c=' + core.cache).then((response) => {
                        o.response.value = response.data;
                        activity.value++; 
    
                        // console.log(request, 3, o)
    
                        resolve();
                    });
                }, delay || 0);
            }).then((resolver, rejected) => {
                if (rejected) {
                    return undefined;
                } else {

                    lookup = pdv.value.find(s => s.request === request);

                    // console.log(request, 4, lookup)

                    return lookup.response.value;
                }
            });
        }
    }
  })

  const json2 = computed((state) => {
    return (request) => {
        var lookup = pdv.value.find(x => x.request === request);

        // console.log(request, 1, !!lookup)

        if (lookup) {
            return lookup.response;
        } else {
            activity.value++; 

            // nextTick(() => {

                new Promise((resolve, reject) => {
                    var o = {
                        request,
                        response: ref(null),
                        activity
                    }
            
                    pdv.value.push(o);
    
                    // console.log(request, 2, o)
    
                    // setTimeout(() => {
                        axios.get(request).then((response) => {
                            o.response.value = response.data;
                            activity.value++; 
        
                            // console.log(request, 3, o)
        
                            resolve();
                        });
                    // }, 100);
                }).then((resolver, rejected) => {
                    if (rejected) {
                        return undefined;
                    } else {
    
                        lookup = pdv.value.find(s => s.request === request);
    
                        // console.log(request, 4, lookup)
    
                        return lookup.response.value;
                    }
                });
            // });
        }
    }
  })

  const pdv3 = computed((state) => {
    return (request) => {
        if (pdv.value.find(x => x.request === request)) {
            return pdv.value.find(x => x.request === request).response;
        }

        var o = {
            request,
            response: ref(null)
        }

        pdv.value.push(o);

        axios.get(api + request + '?c=' + core.cache).then((response) => {
            o.response.value = response.data;
            activity.value++; 
            nextTick();
        });
        
        return o.response;
    }
  });
  
  function getPDV (request) {

    if (pdv.value.find(x => x.request === request)) {
        return pdv.value.find(x => x.request === request).response
    } else {
        var o = {
            request,
            response: null
        }

        pdv.value.push(o);

        axios.get(api + request + '?c=' + core.cache).then((response) => {
            o.response = response.data;
            activity.value++;
            
        });

        return o.response;
    }
  }

  function getJSON (request) {
    if (json.value.find(x => x.request === request)) {
        return json.value.find(x => x.request === request).response
    } else {
        var o = {
            request,
            response: null
        }

        json.value.push(o);

        axios.get(request).then((response) => {
            o.response = response.data;
            activity.value++;
        });

        return o.response;
    }
  }

  const getters = {pdv: pdv2, json: json2};

  return { getters, pdv, pdv2, json, getPDV, activity}
})