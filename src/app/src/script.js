import { useCore } from '@/stores/core';
import MainHeader from '@/components/header/do.vue';
import MainFooter from '@/components/footer/do.vue';

export default {
	name: 'app',
    data: function () {
      return {
        core: useCore(),
        pt: 20,
        elHeader: null
      }
    },
    components: {
      MainHeader,
      MainFooter
    },
    computed: {

    },
    methods: {
      checkHeaderHeight: function () {
        this.pt = this.elHeader.getBoundingClientRect().height;
        if (this.pt > 100) this.pt = 100;
      }
    },
    mounted: function () {
			if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
				this.core.change(true);
			}
      this.elHeader = document.querySelector('header');

      setInterval(() => this.checkHeaderHeight(), 100);
    }
};
