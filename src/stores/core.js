import { ref } from 'vue'
import { defineStore } from 'pinia'

export const api = 'https://api.programydovoleb.cz/';
export const cdn = 'https://static.programydovoleb.cz/';
export const data = 'https://data.programydovoleb.cz/';
export const today = new Date().toISOString().split('T')[0];
export const yesterday = new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0];
export const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0];
export const missing = 'https://static.programydovoleb.cz/missing.png';

export function dayAfterDiffFrom(today, diff) {
    return new Date(new Date(today).setDate(new Date().getDate() - diff)).toISOString().split('T')[0];
} 

export const useCore = defineStore('core', () => {
  const isBanned = ref(false);
  const dark = ref(false);
  const tick = ref(0);
  const start = ref(new Date().getTime());
  const cache = ref(Math.floor(new Date().getTime() / 1000 / 5));

  function change (value) {
    dark.value = value || !dark.value;

    if (value === true) {
      document.querySelector('html').style.background = '#000';
    } else {
      document.querySelector('html').style.background = '#fafafa';
    }
  }

  function ban (value) {
    isBanned.value = value || true;
  }

  return { dark, tick, start, cache, change, ban, isBanned }
})


