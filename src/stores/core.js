import { ref } from 'vue'
import { defineStore } from 'pinia'

export const api = 'https://api.programydovoleb.cz/';
export const cdn = 'https://static.programydovoleb.cz/';
export const data = 'https://data.programydovoleb.cz/';
export const today = new Date().toISOString().split('T')[0];
export const missing = 'https://static.programydovoleb.cz/missing.png';

export const useCore = defineStore('core', () => {
  const dark = ref(false);
  const tick = ref(0);
  const start = ref(new Date().getTime());
  const cache = ref(Math.floor(new Date().getTime() / 1000 / 60 / 60));

  function change (value) {
    dark.value = value || !dark.value;

    if (value === true) {
      document.querySelector('html').style.background = '#000';
    } else {
      document.querySelector('html').style.background = '#fafafa';
    }
  }

  return { dark, tick, start, cache, change }
})


