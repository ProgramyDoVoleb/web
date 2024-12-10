import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useDark = defineStore('dark', () => {
  const dark = ref(false)

  function change (value) {
    dark.value = value || !dark.value;
    // console.log('dark', dark.value);
  }

  return { dark, change }
})
