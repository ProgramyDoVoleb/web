import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useNotifications = defineStore('notifications', () => {
  const list = ref([]);
  const tick = ref(0);

  function add (msg, color) {
    var o = {
      msg,
      color: 'var(--' + (color || 'blue') + ')',
      added: new Date(),
      active: true
    }

    list.value.push(o);

    tick.value++;

    if (color) {
      update(o, msg, color);
    }

    return o;
  }

  function update (o, msg, color) {
    o.msg = msg;
    o.color = 'var(--' + (color || 'blue') + ')';
    o.updated = new Date();

    tick.value++;

    if (color) {
      countdown (o);
    }
  }

  function countdown (o, delay) {
    setTimeout(() => {
      o.active = false;
      tick.value++;
    }, delay || 2500);
  }

  return { list, add, update, tick }
})